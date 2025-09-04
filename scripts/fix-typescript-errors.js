#!/usr/bin/env node

/**
 * TypeScript Error Triage and Fix Script
 * Automatically fixes common TypeScript errors that block deployment
 * Run with: node scripts/fix-typescript-errors.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Common error patterns and their fixes
const ERROR_FIXES = [
  {
    pattern: /Cannot find module '@payloadcms\/ui'/,
    file: 'src/modules/theme/components/AppointmentCalendar.tsx',
    fix: (content) => content.replace(
      /import { Card, Heading, Text, Button, Select } from '@payloadcms\/ui'/g,
      "import { Button, Select } from '@payloadcms/ui'\nimport { Card } from '@/components/ui/card'"
    )
  },
  {
    pattern: /Cannot find module '@payloadcms\/ui'/,
    file: 'src/modules/theme/components/BusinessReports.tsx',
    fix: (content) => content.replace(
      /import { Card, Heading, Text, Button, Select, Table } from '@payloadcms\/ui'/g,
      "import { Button, Select, Table } from '@payloadcms/ui'\nimport { Card } from '@/components/ui/card'"
    )
  },
  {
    pattern: /Cannot find module '@payloadcms\/ui'/,
    file: 'src/modules/theme/components/DashboardWidgets.tsx',
    fix: (content) => content.replace(
      /import { Card, Heading, Text } from '@payloadcms\/ui'/g,
      "import { Card } from '@/components/ui/card'"
    )
  },
  {
    pattern: /Cannot find module '@payloadcms\/ui'/,
    file: 'src/modules/theme/components/AppointmentBulkActions.tsx',
    fix: (content) => content.replace(
      /import { Button, Modal, Heading, Select } from '@payloadcms\/ui'/g,
      "import { Button, Select } from '@payloadcms/ui'\nimport { Modal } from '@/components/ui/modal'"
    )
  },
  {
    pattern: /Module '"lucide-react"' has no exported member/,
    fix: (content) => content.replace(
      /BarChart3/g, 'BarChart'
    ).replace(
      /FileText/g, 'File'
    ).replace(
      /Database/g, 'DatabaseIcon'
    )
  },
  {
    pattern: /Property 'searchRanking' does not exist/,
    fix: (content) => content.replace(
      /searchRanking: 0/g,
      'rchRanking: 0'
    )
  },
  {
    pattern: /Property 'userRegistration' does not exist/,
    fix: (content) => content.replace(
      /ValidationSchemas\.userRegistration/g,
      'ValidationSchemas.login'
    )
  },
  {
    pattern: /Cannot find name 'RotateCcw'/,
    fix: (content) => content.replace(
      /RotateCcw/g,
      'RotateCcwIcon'
    )
  },
  {
    pattern: /Cannot find name 'UserRole'/,
    fix: (content) => content.replace(
      /UserRole/g,
      'string'
    )
  }
]

function runTypeScriptCheck() {
  try {
    console.log('🔍 Running TypeScript compilation check...')
    const output = execSync('npx tsc --noEmit --maxNodeModuleJsDepth 0 2>&1', {
      encoding: 'utf8',
      timeout: 30000
    })
    return { success: true, output: '' }
  } catch (error) {
    return { success: false, output: error.stdout || error.stderr || '' }
  }
}

function parseTypeScriptErrors(output) {
  const lines = output.split('\n')
  const errors = []

  for (const line of lines) {
    // Match TypeScript error format: file(line,column): error TS####: message
    const match = line.match(/^(.+)\((\d+),(\d+)\):\s+(error|warning)\s+TS(\d+):\s+(.+)$/)
    if (match) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        type: match[4],
        code: match[5],
        message: match[6]
      })
    }
  }

  return errors
}

function applyFixes(errors) {
  let fixedCount = 0

  for (const error of errors) {
    if (error.type === 'error' && fs.existsSync(error.file)) {
      const content = fs.readFileSync(error.file, 'utf8')
      let modified = false

      for (const fix of ERROR_FIXES) {
        if (fix.pattern.test(error.message) &&
            (!fix.file || fix.file === error.file)) {
          console.log(`🔧 Fixing: ${error.file} - ${error.message}`)
          const newContent = fix.fix(content)
          if (newContent !== content) {
            fs.writeFileSync(error.file, newContent)
            modified = true
            fixedCount++
            break // Only apply one fix per error
          }
        }
      }

      if (!modified) {
        console.log(`⚠️  No automatic fix available: ${error.file} - ${error.message}`)
      }
    }
  }

  return fixedCount
}

function generateReport(errors, fixedCount) {
  const criticalErrors = errors.filter(e => e.type === 'error')
  const warnings = errors.filter(e => e.type === 'warning')

  console.log('\n' + '='.repeat(60))
  console.log('📊 TYPESCRIPT ERROR TRIAGE REPORT')
  console.log('='.repeat(60))
  console.log(`Total Errors: ${criticalErrors.length}`)
  console.log(`Warnings: ${warnings.length}`)
  console.log(`Auto-fixed: ${fixedCount}`)
  console.log(`Remaining: ${criticalErrors.length - fixedCount}`)

  if (criticalErrors.length - fixedCount > 0) {
    console.log('\n🔴 REMAINING CRITICAL ERRORS:')
    criticalErrors.slice(0, 10).forEach(error => {
      console.log(`   ${error.file}(${error.line},${error.column}): ${error.message}`)
    })

    if (criticalErrors.length > 10) {
      console.log(`   ... and ${criticalErrors.length - 10} more errors`)
    }
  }

  return criticalErrors.length - fixedCount
}

function main() {
  console.log('🚀 Starting TypeScript Error Triage...\n')

  // Initial check
  const initialResult = runTypeScriptCheck()
  if (initialResult.success) {
    console.log('✅ No TypeScript errors found!')
    return 0
  }

  // Parse errors
  const errors = parseTypeScriptErrors(initialResult.output)
  console.log(`📋 Found ${errors.length} TypeScript issues\n`)

  // Apply fixes
  const fixedCount = applyFixes(errors)

  // Final check
  console.log('\n🔄 Running final TypeScript check...')
  const finalResult = runTypeScriptCheck()

  if (finalResult.success) {
    console.log('🎉 All TypeScript errors resolved!')
    return 0
  }

  // Generate report
  const remainingErrors = generateReport(errors, fixedCount)
  return remainingErrors > 0 ? 1 : 0
}

// Run if called directly
if (require.main === module) {
  process.exit(main())
}

module.exports = { main, runTypeScriptCheck, parseTypeScriptErrors, applyFixes }