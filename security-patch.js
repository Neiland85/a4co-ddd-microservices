#!/usr/bin/env node

/**
 * Security Patch Script
 * Automatically fixes CVE-2025-29927 and other critical vulnerabilities
 * across all Next.js applications in the monorepo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Security vulnerability definitions
const vulnerabilities = {
  'next': {
    vulnerable: ['<=14.2.24', '15.0.0-15.2.2'],
    secure: '^15.4.0',
    cve: 'CVE-2025-29927',
    severity: 'CRITICAL',
    description: 'Next.js Middleware Authorization Bypass'
  },
  'next-auth': {
    vulnerable: ['<4.10.3', '<3.29.10'],
    secure: '^4.24.10',
    cve: 'Multiple CVEs',
    severity: 'CRITICAL',
    description: 'NextAuth.js Security Vulnerabilities'
  },
  'nodemailer': {
    vulnerable: ['<6.9.14'],
    secure: '^6.9.16',
    cve: 'CVE-2024-xxxxx',
    severity: 'HIGH',
    description: 'Command Injection and ReDoS vulnerabilities'
  }
};

// Package patterns to update
const packagePatterns = {
  'next': /^(14\.[0-2]\.\d+|15\.[0-2]\.\d+|latest)$/,
  'next-auth': /^(latest|[0-3]\.\d+\.\d+|4\.[0-9]\.\d+)$/,
  'nodemailer': /^(latest|[0-5]\.\d+\.\d+|6\.[0-8]\.\d+)$/
};

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let color = colors.white;
  let prefix = 'INFO';

  switch (level) {
    case 'error':
      color = colors.red;
      prefix = 'ERROR';
      break;
    case 'warn':
      color = colors.yellow;
      prefix = 'WARN';
      break;
    case 'success':
      color = colors.green;
      prefix = 'SUCCESS';
      break;
    case 'info':
      color = colors.blue;
      prefix = 'INFO';
      break;
    case 'security':
      color = colors.magenta;
      prefix = 'SECURITY';
      break;
  }

  console.log(`${color}${colors.bold}[${prefix}]${colors.reset} ${color}${message}${colors.reset}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function findPackageJsonFiles(dir) {
  const packageFiles = [];
  
  function searchDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          searchDirectory(itemPath);
        } else if (item === 'package.json') {
          packageFiles.push(itemPath);
        }
      }
    } catch (error) {
      log('warn', `Cannot access directory: ${currentDir}`);
    }
  }
  
  searchDirectory(dir);
  return packageFiles;
}

function isVulnerableVersion(packageName, version) {
  const pattern = packagePatterns[packageName];
  if (!pattern) return false;
  
  // Check if version matches vulnerable patterns
  return pattern.test(version);
}

function analyzePackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    const vulnerablePackages = [];
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
    
    for (const [name, version] of Object.entries(dependencies)) {
      if (vulnerabilities[name] && isVulnerableVersion(name, version)) {
        vulnerablePackages.push({
          name,
          currentVersion: version,
          secureVersion: vulnerabilities[name].secure,
          cve: vulnerabilities[name].cve,
          severity: vulnerabilities[name].severity,
          description: vulnerabilities[name].description
        });
      }
    }
    
    return {
      filePath,
      package: pkg,
      vulnerablePackages
    };
  } catch (error) {
    log('error', `Failed to analyze ${filePath}: ${error.message}`);
    return null;
  }
}

function patchPackageJson(analysis) {
  if (analysis.vulnerablePackages.length === 0) {
    return false;
  }

  const pkg = analysis.package;
  let hasChanges = false;

  for (const vuln of analysis.vulnerablePackages) {
    // Update in dependencies
    if (pkg.dependencies && pkg.dependencies[vuln.name]) {
      log('security', `Updating ${vuln.name} from ${vuln.currentVersion} to ${vuln.secureVersion} in dependencies`);
      pkg.dependencies[vuln.name] = vuln.secureVersion;
      hasChanges = true;
    }
    
    // Update in devDependencies
    if (pkg.devDependencies && pkg.devDependencies[vuln.name]) {
      log('security', `Updating ${vuln.name} from ${vuln.currentVersion} to ${vuln.secureVersion} in devDependencies`);
      pkg.devDependencies[vuln.name] = vuln.secureVersion;
      hasChanges = true;
    }
  }

  if (hasChanges) {
    try {
      fs.writeFileSync(analysis.filePath, JSON.stringify(pkg, null, 2) + '\n');
      log('success', `Patched ${analysis.filePath}`);
      return true;
    } catch (error) {
      log('error', `Failed to write ${analysis.filePath}: ${error.message}`);
      return false;
    }
  }

  return false;
}

function generateSecurityReport(allAnalyses) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPackages: allAnalyses.length,
      vulnerablePackages: 0,
      criticalVulnerabilities: 0,
      highVulnerabilities: 0,
      patchedFiles: 0
    },
    vulnerabilities: [],
    patchedFiles: []
  };

  allAnalyses.forEach(analysis => {
    if (analysis && analysis.vulnerablePackages.length > 0) {
      report.summary.vulnerablePackages++;
      
      analysis.vulnerablePackages.forEach(vuln => {
        if (vuln.severity === 'CRITICAL') {
          report.summary.criticalVulnerabilities++;
        } else if (vuln.severity === 'HIGH') {
          report.summary.highVulnerabilities++;
        }
        
        report.vulnerabilities.push({
          file: analysis.filePath,
          package: vuln.name,
          currentVersion: vuln.currentVersion,
          secureVersion: vuln.secureVersion,
          cve: vuln.cve,
          severity: vuln.severity,
          description: vuln.description
        });
      });
    }
  });

  return report;
}

function createSecurityMiddleware() {
  const middlewareContent = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware - CVE-2025-29927 Protection
 * Blocks x-middleware-subrequest header to prevent authorization bypass
 */
export function middleware(request: NextRequest) {
  // Block CVE-2025-29927 exploit attempts
  if (request.headers.get('x-middleware-subrequest')) {
    console.warn('🚨 SECURITY: Blocked CVE-2025-29927 exploit attempt from:', 
      request.ip || 'unknown');
    
    // Log security event
    console.error('🚨 SECURITY EVENT:', {
      type: 'CVE-2025-29927_BLOCKED',
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      timestamp: new Date().toISOString()
    });
    
    return new NextResponse('Security violation detected', { status: 403 });
  }

  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;

  return middlewareContent;
}

function deploySecurityMiddleware(projectDirs) {
  const middlewareContent = createSecurityMiddleware();
  
  projectDirs.forEach(dir => {
    try {
      // Check if it's a Next.js project (has next in package.json)
      const packageJsonPath = path.join(dir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (pkg.dependencies?.next || pkg.devDependencies?.next) {
          const middlewarePath = path.join(dir, 'middleware.ts');
          
          // Only create if doesn't exist
          if (!fs.existsSync(middlewarePath)) {
            fs.writeFileSync(middlewarePath, middlewareContent);
            log('success', `Created security middleware: ${middlewarePath}`);
          } else {
            log('info', `Middleware already exists: ${middlewarePath}`);
          }
        }
      }
    } catch (error) {
      log('warn', `Failed to deploy middleware to ${dir}: ${error.message}`);
    }
  });
}

function installUpdatedPackages() {
  log('info', 'Installing updated packages...');
  
  try {
    // Install packages using pnpm (preferred) or npm
    const hasLockfile = fs.existsSync('pnpm-lock.yaml');
    const command = hasLockfile ? 'pnpm install' : 'npm install';
    
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log('success', 'Successfully installed updated packages');
  } catch (error) {
    log('error', `Failed to install packages: ${error.message}`);
    log('warn', 'Please run package installation manually');
  }
}

function main() {
  console.log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                    SECURITY PATCH TOOL                      ║
║              CVE-2025-29927 & Critical Fixes                ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const startTime = Date.now();
  
  log('info', 'Starting security vulnerability scan...');
  
  // Find all package.json files
  const packageFiles = findPackageJsonFiles(process.cwd());
  log('info', `Found ${packageFiles.length} package.json files`);
  
  // Analyze each package.json
  const allAnalyses = packageFiles.map(file => analyzePackageJson(file));
  const validAnalyses = allAnalyses.filter(analysis => analysis !== null);
  
  // Generate security report
  const report = generateSecurityReport(validAnalyses);
  
  // Display vulnerability summary
  console.log(`\n${colors.bold}${colors.red}🔒 SECURITY VULNERABILITY SUMMARY${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Critical vulnerabilities: ${report.summary.criticalVulnerabilities}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  High vulnerabilities: ${report.summary.highVulnerabilities}${colors.reset}`);
  console.log(`${colors.blue}📦 Total packages scanned: ${report.summary.totalPackages}${colors.reset}`);
  
  if (report.vulnerabilities.length > 0) {
    console.log(`\n${colors.bold}${colors.red}🚨 VULNERABLE PACKAGES FOUND:${colors.reset}`);
    report.vulnerabilities.forEach(vuln => {
      console.log(`  ${colors.red}●${colors.reset} ${vuln.package}@${vuln.currentVersion} → ${colors.green}${vuln.secureVersion}${colors.reset}`);
      console.log(`    ${colors.yellow}${vuln.cve}${colors.reset} (${vuln.severity}): ${vuln.description}`);
      console.log(`    File: ${colors.cyan}${vuln.file}${colors.reset}\n`);
    });
    
    // Apply patches
    log('security', 'Applying security patches...');
    let patchedCount = 0;
    
    validAnalyses.forEach(analysis => {
      if (patchPackageJson(analysis)) {
        patchedCount++;
      }
    });
    
    log('success', `Patched ${patchedCount} files`);
    
    // Deploy security middleware
    const projectDirs = [...new Set(packageFiles.map(file => path.dirname(file)))];
    log('info', 'Deploying security middleware...');
    deploySecurityMiddleware(projectDirs);
    
    // Install updated packages
    installUpdatedPackages();
    
    // Save security report
    const reportPath = 'security-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log('success', `Security report saved to ${reportPath}`);
    
  } else {
    log('success', 'No vulnerabilities found! All packages are secure.');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n${colors.bold}${colors.green}✅ Security patch completed in ${duration}s${colors.reset}`);
  
  // Display next steps
  console.log(`\n${colors.bold}${colors.cyan}📋 NEXT STEPS:${colors.reset}`);
  console.log(`1. Review the changes in your package.json files`);
  console.log(`2. Test your applications with the updated packages`);
  console.log(`3. Deploy the security middleware to production`);
  console.log(`4. Monitor your applications for any issues`);
  console.log(`5. Set up automated security scanning in your CI/CD pipeline`);
  
  if (report.summary.criticalVulnerabilities > 0 || report.summary.highVulnerabilities > 0) {
    console.log(`\n${colors.bold}${colors.red}⚠️  IMPORTANT: Deploy these fixes immediately to production!${colors.reset}`);
    process.exit(1);
  }
}

// Run the security patch
if (require.main === module) {
  main();
}

module.exports = {
  findPackageJsonFiles,
  analyzePackageJson,
  patchPackageJson,
  generateSecurityReport,
  createSecurityMiddleware,
  deploySecurityMiddleware
};