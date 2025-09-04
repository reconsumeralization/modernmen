#!/usr/bin/env node

/**
 * Modular Deployment Verification Script
 * Verifies that all packages are properly configured and ready for deployment
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class ModularDeploymentVerifier {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..')
    this.packages = [
      'frontend',
      'backend',
      'auth',
      'db',
      'utils',
      'infra',
      'tests'
    ]
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    }

    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`)
  }

  async run() {
    this.log('🚀 Starting Modular Deployment Verification', 'info')
    this.log('=' .repeat(60), 'info')

    const results = {
      packageStructure: await this.verifyPackageStructure(),
      packageJsonFiles: await this.verifyPackageJsonFiles(),
      typescriptConfigs: await this.verifyTypeScriptConfigs(),
      dependencies: await this.verifyDependencies(),
      buildScripts: await this.verifyBuildScripts(),
      turboConfig: await this.verifyTurboConfig(),
      workspaceSetup: await this.verifyWorkspaceSetup()
    }

    this.log('=' .repeat(60), 'info')
    this.displayResults(results)
    this.generateReport(results)
  }

  async verifyPackageStructure() {
    this.log('📦 Verifying package structure...', 'info')

    const issues = []

    for (const pkg of this.packages) {
      const packagePath = path.join(this.rootDir, 'packages', pkg)

      if (!fs.existsSync(packagePath)) {
        issues.push(`Missing package directory: ${pkg}`)
        continue
      }

      // Check for required files
      const requiredFiles = ['package.json', 'src']
      for (const file of requiredFiles) {
        const filePath = path.join(packagePath, file)
        if (!fs.existsSync(filePath)) {
          issues.push(`Missing ${file} in package ${pkg}`)
        }
      }
    }

    return {
      name: 'Package Structure',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyPackageJsonFiles() {
    this.log('📄 Verifying package.json files...', 'info')

    const issues = []

    for (const pkg of this.packages) {
      const packageJsonPath = path.join(this.rootDir, 'packages', pkg, 'package.json')

      if (!fs.existsSync(packageJsonPath)) {
        issues.push(`Missing package.json for ${pkg}`)
        continue
      }

      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        // Check for required fields
        const requiredFields = ['name', 'version', 'scripts']
        for (const field of requiredFields) {
          if (!packageJson[field]) {
            issues.push(`Missing ${field} in ${pkg}/package.json`)
          }
        }

        // Check for build script
        if (!packageJson.scripts?.build) {
          issues.push(`Missing build script in ${pkg}/package.json`)
        }

      } catch (error) {
        issues.push(`Invalid JSON in ${pkg}/package.json: ${error.message}`)
      }
    }

    return {
      name: 'Package.json Files',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyTypeScriptConfigs() {
    this.log('🔷 Verifying TypeScript configurations...', 'info')

    const issues = []

    for (const pkg of this.packages) {
      if (pkg === 'infra' || pkg === 'tests') continue // Skip non-TypeScript packages

      const tsconfigPath = path.join(this.rootDir, 'packages', pkg, 'tsconfig.json')

      if (!fs.existsSync(tsconfigPath)) {
        issues.push(`Missing tsconfig.json for ${pkg}`)
        continue
      }

      try {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))

        // Check for required compiler options
        const requiredOptions = ['target', 'module', 'outDir', 'strict']
        for (const option of requiredOptions) {
          if (!tsconfig.compilerOptions?.[option]) {
            issues.push(`Missing ${option} in ${pkg}/tsconfig.json`)
          }
        }

      } catch (error) {
        issues.push(`Invalid JSON in ${pkg}/tsconfig.json: ${error.message}`)
      }
    }

    return {
      name: 'TypeScript Configs',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyDependencies() {
    this.log('📦 Verifying package dependencies...', 'info')

    const issues = []

    try {
      // Check if all workspaces can be installed
      execSync('npm install --dry-run', {
        cwd: this.rootDir,
        stdio: 'pipe'
      })
    } catch (error) {
      issues.push(`Dependency resolution failed: ${error.message}`)
    }

    return {
      name: 'Dependencies',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyBuildScripts() {
    this.log('🏗️ Verifying build scripts...', 'info')

    const issues = []

    for (const pkg of this.packages) {
      const packageJsonPath = path.join(this.rootDir, 'packages', pkg, 'package.json')

      if (!fs.existsSync(packageJsonPath)) continue

      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        if (!packageJson.scripts?.build) {
          issues.push(`Missing build script in ${pkg}`)
        }

        if (!packageJson.scripts?.test && pkg !== 'infra') {
          issues.push(`Missing test script in ${pkg}`)
        }

      } catch (error) {
        issues.push(`Error reading ${pkg}/package.json`)
      }
    }

    return {
      name: 'Build Scripts',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyTurboConfig() {
    this.log('⚡ Verifying Turbo configuration...', 'info')

    const issues = []

    const turboConfigPath = path.join(this.rootDir, 'turbo.json')

    if (!fs.existsSync(turboConfigPath)) {
      issues.push('Missing turbo.json')
      return { name: 'Turbo Config', status: 'FAIL', issues }
    }

    try {
      const turboConfig = JSON.parse(fs.readFileSync(turboConfigPath, 'utf8'))

      // Check for required pipeline
      if (!turboConfig.pipeline) {
        issues.push('Missing pipeline configuration in turbo.json')
      }

      if (!turboConfig.pipeline.build) {
        issues.push('Missing build pipeline in turbo.json')
      }

    } catch (error) {
      issues.push(`Invalid JSON in turbo.json: ${error.message}`)
    }

    return {
      name: 'Turbo Config',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  async verifyWorkspaceSetup() {
    this.log('🔗 Verifying workspace setup...', 'info')

    const issues = []

    const rootPackageJsonPath = path.join(this.rootDir, 'package.json')

    if (!fs.existsSync(rootPackageJsonPath)) {
      issues.push('Missing root package.json')
      return { name: 'Workspace Setup', status: 'FAIL', issues }
    }

    try {
      const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'))

      if (!rootPackageJson.workspaces) {
        issues.push('Missing workspaces configuration in root package.json')
      }

      if (!rootPackageJson.workspaces.includes('packages/*')) {
        issues.push('Workspaces not configured to include packages/*')
      }

    } catch (error) {
      issues.push(`Invalid JSON in root package.json: ${error.message}`)
    }

    return {
      name: 'Workspace Setup',
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues
    }
  }

  displayResults(results) {
    this.log('📊 VERIFICATION RESULTS', 'info')
    this.log('-'.repeat(40), 'info')

    let totalIssues = 0

    for (const [key, result] of Object.entries(results)) {
      const statusColor = result.status === 'PASS' ? 'success' : 'error'
      this.log(`${result.name}: ${result.status}`, statusColor)

      if (result.issues.length > 0) {
        totalIssues += result.issues.length
        result.issues.forEach(issue => {
          this.log(`  ❌ ${issue}`, 'error')
        })
      }

      this.log('')
    }

    this.log(`Total Issues Found: ${totalIssues}`, totalIssues === 0 ? 'success' : 'error')

    if (totalIssues === 0) {
      this.log('🎉 All checks passed! Ready for deployment.', 'success')
    } else {
      this.log('⚠️ Issues found that need to be resolved before deployment.', 'warning')
    }
  }

  generateReport(results) {
    const reportPath = path.join(this.rootDir, 'MODULAR_DEPLOYMENT_REPORT.md')

    let report = '# 🚀 Modular Deployment Verification Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`

    report += '## 📊 Summary\n\n'

    let totalIssues = 0
    for (const [key, result] of Object.entries(results)) {
      report += `- **${result.name}**: ${result.status}\n`
      if (result.issues.length > 0) {
        totalIssues += result.issues.length
        result.issues.forEach(issue => {
          report += `  - ❌ ${issue}\n`
        })
      }
    }

    report += `\n**Total Issues**: ${totalIssues}\n\n`

    if (totalIssues === 0) {
      report += '## ✅ Status: READY FOR DEPLOYMENT\n\n'
      report += 'All verification checks have passed. The modular architecture is properly configured and ready for deployment.\n\n'
    } else {
      report += '## ⚠️ Status: ISSUES FOUND\n\n'
      report += 'The following issues need to be resolved before deployment:\n\n'
    }

    report += '## 🔧 Recommendations\n\n'

    if (totalIssues === 0) {
      report += '### Deployment Ready ✅\n\n'
      report += '```bash\n'
      report += '# Deploy to Vercel\n'
      report += 'npm run deploy:vercel\n\n'
      report += '# Or deploy specific packages\n'
      report += 'npm run deploy:vercel -- --filter=frontend\n'
      report += '```\n\n'
    } else {
      report += '### Fix Required Issues\n\n'
      report += '1. Review and fix all issues listed above\n'
      report += '2. Re-run verification: `node scripts/verify-modular-deployment.js`\n'
      report += '3. Ensure all packages build successfully\n'
      report += '4. Test deployment in staging environment first\n\n'
    }

    fs.writeFileSync(reportPath, report)
    this.log(`📄 Report generated: ${reportPath}`, 'success')
  }
}

// Run the verification
const verifier = new ModularDeploymentVerifier()
verifier.run().catch(error => {
  console.error('❌ Verification failed:', error)
  process.exit(1)
})
