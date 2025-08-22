# 🚀 Manual Vercel Deployment Guide

## Option 1: GitHub Integration (Recommended)

### Step 1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com)
2. Upload your project files to the repository
3. Make sure all files except `.env.local` are included

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. Click "Deploy"

## Option 2: Drag & Drop Deployment

### Step 1: Prepare Project Folder
1. Open your project folder: `C:\Users\recon\Desktop\modernmen`
2. Delete these folders if they exist:
   - `node_modules`
   - `.next`
   - `.vercel`
3. Keep all source files and `package.json`

### Step 2: Upload to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Choose "Upload Folder"
4. Drag and drop your project folder
5. Configure settings:
   - Framework: Next.js (should auto-detect)
   - Root Directory: `./` 
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables (see PRODUCTION_ENV_GUIDE.md)
7. Click "Deploy"

## ⚡ Quick Deployment Checklist

- [ ] Project builds locally (`npm run build`)
- [ ] All source files ready
- [ ] Environment variables prepared
- [ ] Vercel account created
- [ ] Production database setup (if needed)

## 🔧 If You Have Node.js Installed

Run this command in your project folder:
```bash
npx vercel --prod
```

This will:
1. Install Vercel CLI temporarily
2. Deploy your project
3. Guide you through setup

## 📞 Need Help?

- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)