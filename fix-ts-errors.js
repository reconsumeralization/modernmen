#!/usr/bin/env node

/**
 * TypeScript Error Triage and Fix Script
 * Automatically fixes common TypeScript errors that block deployment
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Starting TypeScript Error Triage...\n')

// Common error patterns and their fixes
const FIXES = [
  {
    pattern: /Cannot find module '@payloadcms\/ui'/,
    fix: (content) => content.replace(
      /import { Card, Heading, Text, Button, Select } from '@payloadcms\/ui'/g,
      "import { Button, Select } from '@payloadcms/ui'\nimport { Card } from '@/components/ui/card'"
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

      for (const fix of FIXES) {
        if (fix.pattern.test(error.message)) {
          console.log(`🔧 Fixing: ${error.file} - ${error.message}`)
          const newContent = fix.fix(content)
          if (newContent !== content) {
            fs.writeFileSync(error.file, newContent)
            modified = true
            fixedCount++
            break
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

// Run the triage
const initialResult = runTypeScriptCheck()
if (initialResult.success) {
  console.log('✅ No TypeScript errors found!')
  process.exit(0)
}

const errors = parseTypeScriptErrors(initialResult.output)
console.log(`📋 Found ${errors.length} TypeScript issues\n`)

const fixedCount = applyFixes(errors)

console.log('\n' + '='.repeat(60))
console.log('📊 TYPESCRIPT ERROR TRIAGE REPORT')
console.log('='.repeat(60))
console.log(`Total Errors: ${errors.filter(e => e.type === 'error').length}`)
console.log(`Auto-fixed: ${fixedCount}`)
console.log(`Remaining: ${errors.filter(e => e.type === 'error').length - fixedCount}`)

if (fixedCount > 0) {
  console.log('\n🔄 Running final TypeScript check...')
  const finalResult = runTypeScriptCheck()
  if (finalResult.success) {
    console.log('🎉 TypeScript errors resolved!')
  }
}

console.log('\n✅ TypeScript error triage completed!');
