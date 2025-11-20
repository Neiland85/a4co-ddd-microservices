# Temp File Symlink Attack Mitigation

## Overview

This document describes the comprehensive security mitigations implemented for the "tmp — arbitrary temp file write via symlink (Low)" vulnerability.

## Vulnerability Description

**Tactics**: Initial Access / Persistence (local)
**Vector**: API that creates temp dir using dir without validating symlinks; attacker controls dir and points to /etc or path with SUID.
**Impact**: Arbitrary file write if permissions allow; combined cases may enable RCE.
**Detection**: Creation of files in unexpected locations, unusual use of mktemp/tmp.
**Mitigation**: Use fs.mkdtemp() secure, validate symlinks, run with lower privilege.

## Implemented Components

### 1. TempFileValidator

Validates temporary file paths and detects symlink attacks:

```typescript
import { TempFileValidator } from '@a4co/shared-utils/security/validators/temp-file.validator';

// Validate a temp file path
const result = TempFileValidator.validateTempPath('/tmp/user-upload.txt', {
  allowedTempDirs: ['/tmp', '/var/tmp'],
  allowSymlinks: false
});

if (!result.isValid) {
  console.log('Blocked:', result.issues);
}
```

**Features:**

- Path validation against allowed temp directories
- Symlink detection and blocking
- Parent directory validation
- Suspicious pattern detection

### 2. TempFileProtector

Middleware for protecting temp file operations:

```typescript
import { TempFileProtector } from '@a4co/shared-utils/security/middleware/temp-file-protector';

const protector = new TempFileProtector({
  allowedTempDirs: ['/tmp', '/var/tmp'],
  allowSymlinks: false
});

// Protect file operations
if (protector.protect('write', '/tmp/user-file.txt')) {
  // Safe to proceed
  fs.writeFileSync('/tmp/user-file.txt', data);
}

// Create protected temp directory
const tempDir = await protector.createProtectedTempDir('app-');

// Create protected temp file
const tempFile = await protector.createProtectedTempFile('upload-', '.txt');
```

**Features:**

- Operation protection with validation
- Secure temp directory/file creation using fs.mkdtemp()
- Statistics tracking
- Automatic cleanup

### 3. SafeTempFileManager

High-level utilities for secure temp file management:

```typescript
import { SafeTempFileManager } from '@a4co/shared-utils/security/utils/safe-temp-file-manager';

const manager = new SafeTempFileManager();

// Create safe temp directory
const tempDir = await manager.createTempDir({ prefix: 'upload-' });

// Create safe temp file
const tempFile = await manager.createTempFile({
  prefix: 'data-',
  suffix: '.json',
  autoCleanup: true
});

// Safe read/write operations
await manager.writeTempFile(tempFile, JSON.stringify(data));
const readData = await manager.readTempFile(tempFile);

// Cleanup all temp files
await manager.cleanup();
```

**Features:**

- Automatic cleanup on process exit
- Size limits enforcement
- Secure random file names
- Statistics and monitoring

## ESLint Rules

Custom ESLint rules to detect insecure temp file usage:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['temp-file-security'],
  rules: {
    'temp-file-security/no-insecure-temp-file-creation': 'error',
    'temp-file-security/no-symlink-temp-operations': 'error'
  }
};
```

**Rules:**

- `no-insecure-temp-file-creation`: Detects insecure temp file creation patterns
- `no-symlink-temp-operations`: Detects operations on potentially symlinked temp files

## Usage Examples

### Basic File Upload with Temp Storage

```typescript
import { SafeTempFileManager } from '@a4co/shared-utils/security/utils/safe-temp-file-manager';

class FileUploadService {
  private tempManager = new SafeTempFileManager();

  async handleUpload(file: Buffer, filename: string): Promise<string> {
    // Create secure temp file
    const tempFile = await this.tempManager.createTempFile({
      prefix: 'upload-',
      suffix: path.extname(filename)
    });

    // Write file securely
    await this.tempManager.writeTempFile(tempFile, file, {
      maxSize: 10 * 1024 * 1024 // 10MB limit
    });

    // Process file (scan for malware, validate content, etc.)
    const processedPath = await this.processFile(tempFile);

    // Cleanup temp file
    await this.tempManager.removeTempPath(tempFile);

    return processedPath;
  }
}
```

### API with Temp Directory Creation

```typescript
import { TempFileProtector } from '@a4co/shared-utils/security/middleware/temp-file-protector';

class DataProcessingAPI {
  private protector = new TempFileProtector();

  async processData(data: any): Promise<any> {
    // Create protected temp directory
    const workDir = await this.protector.createProtectedTempDir('process-');

    try {
      // Create temp files for processing
      const inputFile = path.join(workDir, 'input.json');
      const outputFile = path.join(workDir, 'output.json');

      // Validate operations
      if (!this.protector.protect('write', inputFile)) {
        throw new Error('Temp file operation blocked');
      }

      // Process data
      fs.writeFileSync(inputFile, JSON.stringify(data));
      const result = await this.runProcessing(inputFile, outputFile);

      return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } finally {
      // Cleanup
      fs.rmdirSync(workDir, { recursive: true });
    }
  }
}
```

## Security Benefits

1. **Symlink Attack Prevention**: Blocks operations on symlinked files and directories
2. **Path Validation**: Ensures all temp operations are within allowed directories
3. **Secure Creation**: Uses fs.mkdtemp() for unpredictable directory names
4. **Automatic Cleanup**: Prevents temp file accumulation and information leakage
5. **Size Limits**: Prevents resource exhaustion attacks
6. **Audit Trail**: Comprehensive logging of all temp file operations

## Testing

Run the security tests:

```bash
npm test -- temp-file-security.test.ts
```

Tests cover:

- Path validation scenarios
- Symlink detection and blocking
- Secure temp file/directory creation
- Size limit enforcement
- Cleanup functionality
- Integration between components

## Configuration

Configure the security components:

```typescript
const config = {
  allowedTempDirs: ['/tmp', '/var/tmp', '/dev/shm'],
  maxTempFileSize: 100 * 1024 * 1024, // 100MB
  allowSymlinks: false,
  validateParentDirs: true
};
```

## Best Practices

1. **Always use the SafeTempFileManager** for temp file operations
2. **Validate all temp paths** before operations
3. **Enable auto-cleanup** to prevent resource leaks
4. **Set appropriate size limits** based on use case
5. **Run with minimal privileges** when possible
6. **Monitor temp file operations** for anomalies
7. **Use ESLint rules** to catch insecure patterns in code

## Migration Guide

Replace insecure temp file operations:

```typescript
// ❌ Insecure
const tempDir = '/tmp/my-app-data';
fs.mkdirSync(tempDir);
fs.writeFileSync(path.join(tempDir, 'data.txt'), data);

// ✅ Secure
const manager = new SafeTempFileManager();
const tempFile = await manager.createTempFile({ prefix: 'data-' });
await manager.writeTempFile(tempFile, data);
```

This mitigation framework provides comprehensive protection against temp file symlink attacks while maintaining usability and performance.
