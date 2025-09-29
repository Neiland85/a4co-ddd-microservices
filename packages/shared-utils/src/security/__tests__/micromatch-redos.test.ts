import { MicromatchPatternValidator } from '../validators/micromatch-pattern.validator';
import { MicromatchReDoSProtector } from '../middleware/micromatch-redos-protector';
import { SafeMicromatch, safeMatch, safeIsMatch } from '../utils/safe-micromatch';

/**
 * Comprehensive test suite for Micromatch ReDoS security components
 */

describe('Micromatch ReDoS Security Framework', () => {
  describe('MicromatchPatternValidator', () => {
    describe('validatePattern', () => {
      it('should validate safe patterns', () => {
        const result = MicromatchPatternValidator.validatePattern('*.js');
        expect(result.isValid).toBe(true);
        expect(result.riskLevel).toBe('low');
        expect(result.complexity).toBeLessThan(50);
      });

      it('should detect high-risk patterns', () => {
        const result = MicromatchPatternValidator.validatePattern('**/*/**/*/**/*');
        expect(result.isValid).toBe(false);
        expect(result.riskLevel).toBe('high');
        expect(result.complexity).toBeGreaterThan(50);
        expect(result.issues).toContain('Excessive wildcard usage may cause performance issues');
      });

      it('should detect critical patterns', () => {
        const result = MicromatchPatternValidator.validatePattern('{a,b,c,d,e,f,g,h,i,j}*'.repeat(10));
        expect(result.riskLevel).toBe('critical');
        expect(result.issues).toContain('Pattern complexity exceeds critical threshold');
      });

      it('should handle invalid input', () => {
        const result = MicromatchPatternValidator.validatePattern('');
        expect(result.isValid).toBe(false);
        expect(result.riskLevel).toBe('critical');
        expect(result.issues).toContain('Pattern must be a non-empty string');
      });
    });

    describe('validatePatterns', () => {
      it('should validate multiple patterns', () => {
        const patterns = ['*.js', '**/*', 'file-{1..100}.txt'];
        const results = MicromatchPatternValidator.validatePatterns(patterns);

        expect(results).toHaveLength(3);
        expect(results[0].isValid).toBe(true);
        expect(results[1].isValid).toBe(false); // **/* is risky
        expect(results[2].isValid).toBe(false); // brace expansion is risky
      });
    });

    describe('sanitizePattern', () => {
      it('should sanitize excessive wildcards', () => {
        const sanitized = MicromatchPatternValidator.sanitizePattern('***file***');
        expect(sanitized).toBe('**file**');
      });

      it('should limit brace expansions', () => {
        const pattern = '{a,b,c,d,e,f,g,h,i,j,k,l}';
        const sanitized = MicromatchPatternValidator.sanitizePattern(pattern);
        expect(sanitized.length).toBeLessThan(pattern.length);
      });
    });
  });

  describe('MicromatchReDoSProtector', () => {
    let protector: MicromatchReDoSProtector;

    beforeEach(() => {
      protector = new MicromatchReDoSProtector();
    });

    describe('safeMatch', () => {
      it('should execute safe operations successfully', async () => {
        const result = await protector.safeMatch(
          () => ['file.js', 'file.ts'],
          ['*.js'],
          { context: 'test' }
        );

        expect(result.success).toBe(true);
        expect(result.result).toEqual(['file.js']);
        expect(result.executionTime).toBeGreaterThan(0);
      });

      it('should timeout on dangerous patterns', async () => {
        // Create a pattern that could cause issues
        const dangerousPattern = '**/*'.repeat(100);

        const result = await protector.safeMatch(
          () => {
            // Simulate a slow operation
            return new Promise(resolve => setTimeout(() => resolve([]), 2000));
          },
          [dangerousPattern],
          { timeout: 100, context: 'test' }
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain('timed out');
      });

      it('should reject critical risk patterns', async () => {
        const result = await protector.safeMatch(
          () => [],
          ['{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}'],
          { context: 'test' }
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain('critical ReDoS risk');
      });
    });

    describe('circuit breaker', () => {
      it('should open circuit after multiple failures', async () => {
        // Force multiple failures
        for (let i = 0; i < 6; i++) {
          await protector.safeMatch(
            () => { throw new Error('test failure'); },
            ['*.js'],
            { context: 'test' }
          );
        }

        const result = await protector.safeMatch(
          () => [],
          ['*.js'],
          { context: 'test' }
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain('Circuit breaker is open');
      });

      it('should reset circuit breaker after success in half-open state', async () => {
        // Force circuit breaker to open
        for (let i = 0; i < 6; i++) {
          await protector.safeMatch(
            () => { throw new Error('test failure'); },
            ['*.js'],
            { context: 'test' }
          );
        }

        // Wait for half-open state (simulate time passing)
        protector.resetCircuitBreaker();

        const result = await protector.safeMatch(
          () => ['success'],
          ['*.js'],
          { context: 'test' }
        );

        expect(result.success).toBe(true);
      });
    });

    describe('statistics', () => {
      it('should track operation statistics', async () => {
        await protector.safeMatch(() => ['file.js'], ['*.js'], { context: 'test' });
        await protector.safeMatch(() => { throw new Error('fail'); }, ['*.js'], { context: 'test' });

        const stats = protector.getStats();

        expect(stats.totalOperations).toBe(2);
        expect(stats.errorOperations).toBe(1);
        expect(stats.failureRate).toBe(0.5);
      });
    });
  });

  describe('SafeMicromatch', () => {
    let safeMicromatch: SafeMicromatch;

    beforeEach(() => {
      safeMicromatch = new SafeMicromatch();
    });

    describe('match', () => {
      it('should safely match patterns', async () => {
        const result = await safeMicromatch.match(
          ['file.js', 'file.ts', 'file.txt'],
          ['*.js', '*.ts']
        );

        expect(result).toEqual(['file.js', 'file.ts']);
      });

      it('should handle dangerous patterns safely', async () => {
        const result = await safeMicromatch.match(
          ['file.js'],
          ['**/*'.repeat(50)] // Dangerous pattern
        );

        // Should return empty array on failure
        expect(result).toEqual([]);
      });
    });

    describe('isMatch', () => {
      it('should safely check matches', async () => {
        const result = await safeMicromatch.isMatch('file.js', '*.js');
        expect(result).toBe(true);

        const noMatch = await safeMicromatch.isMatch('file.txt', '*.js');
        expect(noMatch).toBe(false);
      });
    });

    describe('factory functions', () => {
      it('should provide factory functions', async () => {
        const result = await safeMatch(['file.js'], ['*.js']);
        expect(result).toEqual(['file.js']);

        const isMatchResult = await safeIsMatch('file.js', '*.js');
        expect(isMatchResult).toBe(true);
      });
    });

    describe('validation methods', () => {
      it('should validate patterns', () => {
        const validations = safeMicromatch.validatePatterns(['*.js', '**/*']);
        expect(validations[0].isValid).toBe(true);
        expect(validations[1].isValid).toBe(false);
      });

      it('should sanitize patterns', () => {
        const sanitized = safeMicromatch.sanitizePattern('***file***');
        expect(sanitized).toBe('**file**');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex real-world scenarios', async () => {
      const safe = new SafeMicromatch();

      // Test with various pattern types
      const files = [
        'src/index.js',
        'src/components/Button.tsx',
        'src/utils/helpers.ts',
        'tests/unit/Button.test.ts',
        'README.md'
      ];

      const patterns = [
        'src/**/*.js',      // Safe
        'src/**/*.{ts,tsx}', // Moderate risk
        '**/*.{js,ts,tsx}',  // Higher risk
      ];

      const result = await safe.match(files, patterns);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should provide statistics after operations', async () => {
      const safe = new SafeMicromatch();

      await safe.match(['file.js'], ['*.js']);
      await safe.isMatch('file.js', '*.js');

      const stats = safe.getStats();
      expect(stats.totalOperations).toBe(2);
      expect(stats.averageExecutionTime).toBeGreaterThan(0);
    });
  });
});