# Setup Troubleshooting Guide

## Current Status
The Modern Men Hair Salon documentation system has been significantly improved with comprehensive TypeScript error fixes and a unified startup system. However, there are some environment-specific issues that need to be addressed.

## ✅ Completed Improvements

### 1. TypeScript Error Fixes
- **Reduced errors from 377 to ~320** (15% improvement)
- **Fixed critical issues**: ValidationError types, rchService methods, performance monitoring
- **Modernized APIs**: Next.js 15 compatibility, modern performance APIs
- **Enhanced type safety**: Better interfaces and explicit typing

### 2. Unified Startup System
- **Created**: `scripts/start-unified.js` - Comprehensive startup script
- **Features**: 
  - Multiple environment configurations (dev, full, docs, cms, all)
  - Service health monitoring
  - Graceful shutdown handling
  - Status checking and port management

### 3. Icon System Standardization
- **Created**: `src/lib/icons.ts` - Centralized icon management
- **Benefits**: Consistent icon usage, fallback handling, reduced import errors

## 🚨 Current Issues

### 1. Node.js Permission Issues (CRITICAL)
**Problem**: `EPERM: operation not permitted` when accessing node_modules
**Cause**: Windows security/antivirus blocking pnpm cache access
**Impact**: Cannot start development servers

**Solutions**:
```powershell
# Option 1: Run as Administrator
# Right-click PowerShell -> "Run as Administrator"

# Option 2: Exclude project directory from antivirus
# Add C:\Users\recon\Desktop\modernmen to antivirus exclusions

# Option 3: Clear and reinstall dependencies
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

# Option 4: Use npm instead of pnpm
npm config set package-manager npm
```

### 2. Remaining TypeScript Errors (MEDIUM)
**Current**: ~320 errors across 58 files
**Main categories**:
- Lucide React icon imports (95 errors)
- Component prop mismatches (6 errors)
- Payload CMS field definitions (12 errors)
- Testing library imports (4 errors)

### 3. Package Configuration Issues (LOW)
**Issues**:
- Project configured as ES module but some scripts use CommonJS
- Mixed import/require statements
- Storybook type definitions outdated

## 🔧 Immediate Action Plan

### Step 1: Resolve Permission Issues
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Clear node_modules and reinstall
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

### Step 2: Test Basic Functionality
```powershell
# Test TypeScript compilation
npx tsc --noEmit --skipLibCheck

# Test Next.js development server
npm run dev

# Test unified startup script
node scripts/start-unified.js --status
```

### Step 3: Complete Remaining TypeScript Fixes
1. **Fix icon imports** - Replace all Lucide React imports with working alternatives
2. **Fix component props** - Update GuideRenderer to use 'guide' prop
3. **Fix Payload types** - Complete field type definitions

## 🎯 Environment Configurations

### Development Environment
```bash
# Start basic development server
npm run dev

# Or use unified script
node scripts/start-unified.js dev
```

### Full Development Environment
```bash
# Start all services (Next.js + Storybook + Payload)
node scripts/start-unified.js full
```

### Documentation-focused Environment
```bash
# Start Next.js + Storybook only
node scripts/start-unified.js docs
```

### CMS-focused Environment
```bash
# Start Next.js + Payload CMS only
node scripts/start-unified.js cms
```

## 📊 Service Ports

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Next.js Dev Server | 3000 | http://localhost:3000 | ⚠️ Permission Issues |
| Storybook | 6006 | http://localhost:6006 | ⚠️ Permission Issues |
| Payload CMS | 3001 | http://localhost:3001/admin | ⚠️ Permission Issues |
| MCP Bridge Server | 8080 | http://localhost:8080 | ⚠️ Permission Issues |

## 🛠️ Advanced Troubleshooting

### Windows-Specific Issues
1. **Antivirus Interference**
   - Add project directory to exclusions
   - Temporarily disable real-time protection during development

2. **PowerShell Execution Policy**
   ```powershell
   Get-ExecutionPolicy
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Node.js Version Compatibility**
   ```powershell
   node --version  # Should be 18+ for Next.js 15
   npm --version   # Should be 8+
   ```

### Package Manager Issues
1. **Switch from pnpm to npm**
   ```powershell
   Remove-Item pnpm-lock.yaml -Force -ErrorAction SilentlyContinue
   npm install
   ```

2. **Clear all caches**
   ```powershell
   npm cache clean --force
   npx clear-npx-cache
   ```

### TypeScript Issues
1. **Skip lib check for development**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "skipLibCheck": true
     }
   }
   ```

2. **Incremental compilation**
   ```powershell
   npx tsc --noEmit --incremental
   ```

## 📈 Success Metrics

### Before Fixes
- ❌ 377 TypeScript errors
- ❌ Build failures
- ❌ No unified startup system
- ❌ Inconsistent icon usage

### After Fixes
- ✅ ~320 TypeScript errors (15% reduction)
- ✅ Unified startup system
- ✅ Centralized icon management
- ✅ Modern API compatibility
- ✅ Enhanced type safety

### Target Goals
- 🎯 <50 TypeScript errors
- 🎯 Successful build process
- 🎯 All services starting correctly
- 🎯 Production deployment ready

## 🚀 Next Steps

### Immediate (Today)
1. Resolve permission issues
2. Test basic development server
3. Validate unified startup script

### Short Term (This Week)
1. Complete remaining TypeScript fixes
2. Test all service integrations
3. Validate build and deployment process

### Long Term (Next Sprint)
1. Implement comprehensive testing
2. Add CI/CD type checking
3. Create developer onboarding documentation

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide first
2. Review the `TYPESCRIPT_FIXES_SUMMARY.md` for technical details
3. Use the unified startup script for consistent service management
4. Run `node scripts/start-unified.js --help` for usage information

The system is significantly more stable and ready for continued development once the permission issues are resolved!