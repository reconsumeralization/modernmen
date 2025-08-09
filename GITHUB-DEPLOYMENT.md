# GitHub Deployment Instructions

## 🚀 Pushing to GitHub

### For Windows Users

1. **Run the automated script:**
   ```bash
   push-to-github.bat
   ```

   This will:
   - Clean up unnecessary files
   - Add all files to Git
   - Create a commit
   - Push to GitHub

### Manual Process

1. **Check current status:**
   ```bash
   git status
   ```

2. **Add all files:**
   ```bash
   git add -A
   ```

3. **Create commit:**
   ```bash
   git commit -m "Your descriptive commit message"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin master
   ```

## 📝 Pre-Push Checklist

- [ ] Remove sensitive data from code
- [ ] Update .env.example with latest variables
- [ ] Test the application locally
- [ ] Update documentation if needed
- [ ] Check that .gitignore is working properly
- [ ] Remove any temporary or build files

## 🔧 Troubleshooting

### "Git is not recognized"
- Install Git from https://git-scm.com/
- Restart your terminal after installation

### "Permission denied"
- Check your GitHub credentials
- Ensure you have write access to the repository
- Try using a personal access token

### "Updates were rejected"
Pull the latest changes first:
```bash
git pull origin master --rebase
```

### Large files error
Check for large files:
```bash
git ls-files -s | sort -n -k 2 | tail -10
```

Remove them if necessary:
```bash
git rm --cached path/to/large/file
```

## 🌐 After Pushing

1. **Check GitHub:**
   - Visit https://github.com/reconsumeralization/modernmen
   - Verify all files are uploaded
   - Check that sensitive files are NOT included

2. **Set up GitHub Pages (optional):**
   - Go to Settings > Pages
   - Select source branch
   - Configure custom domain if needed

3. **Configure GitHub Actions (optional):**
   - Add workflows for CI/CD
   - Set up automated testing
   - Configure deployment pipelines

4. **Update Repository Settings:**
   - Add description
   - Add topics (nextjs, typescript, salon, etc.)
   - Configure branch protection
   - Set up webhooks if needed

## 🔐 Security Reminders

**Never commit:**
- .env.local files
- Real API keys
- Database passwords
- JWT secrets
- Customer data
- Payment information

**Always use:**
- Environment variables for secrets
- .gitignore for sensitive files
- Separate development/production configs

## 📦 Deployment Platforms

After pushing to GitHub, deploy to:

### Vercel (Recommended)
1. Import from GitHub
2. Configure environment variables
3. Deploy

### Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

### Railway
1. Create new project
2. Deploy from GitHub
3. Add PostgreSQL database
4. Configure variables

### Heroku
1. Create new app
2. Connect GitHub
3. Add Heroku Postgres
4. Set config vars

## 🎉 Success!

Once pushed, your repository will be available at:
https://github.com/reconsumeralization/modernmen

Share, star, and contribute!