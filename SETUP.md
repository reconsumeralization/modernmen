# Modern Men Hair Salon - Quick Setup Guide

## ⚡ QUICK START (5 minutes)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow prompts
4. Restart your command prompt/terminal

### Step 2: Verify Installation
```bash
node --version
npm --version
```

### Step 3: Install Dependencies
```bash
cd C:\modernmen
npm install
```

### Step 4: Run Locally
```bash
npm run dev
```
Visit: http://localhost:3000

### Step 5: Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🎯 What's Built

✅ **Complete Website**
- Hero section with their actual salon photo
- Mission statement and client info
- Service listings with modern design
- Real contact info (Regina, SK)
- Simple booking form with validation

✅ **Correct Information**
- Phone: (306) 522-4111
- Text: (306) 541-5511  
- Email: info@modernmen.ca
- Address: #4 - 425 Victoria Ave East, Regina, SK
- Hours: Monday-Saturday (closed Sundays)

✅ **Tech Stack**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel deployment ready

## 🚀 Deployment Options

### Option A: Connect to GitHub (Recommended)
1. Create GitHub repository
2. Push code: `git add . && git commit -m "Initial commit" && git push`
3. Go to vercel.com
4. Import repository
5. Deploy automatically

### Option B: Direct Deploy
```bash
vercel --prod
```

## 📱 Features Included

- **Mobile Responsive**: Perfect on all devices
- **Fast Loading**: Optimized images and code
- **SEO Ready**: Meta tags and structured content
- **Booking System**: Contact form with email simulation
- **Professional Design**: Matches salon's premium brand

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  'salon-dark': '#1a1a1a',
  'salon-gold': '#d4af37',
}
```

### Update Content
- `app/components/Services.tsx` - Service pricing
- `app/components/About.tsx` - Mission statement
- `app/components/Hours.tsx` - Contact info

### Add Real Email
Update `app/api/bookings/route.ts` with SendGrid/SMTP

## 🔧 Troubleshooting

**Node.js not found?**
- Download from nodejs.org
- Restart terminal after install

**Build errors?**
- Check all files saved
- Run `npm install` again

**Deploy issues?**
- Ensure `npm run build` works locally
- Check Vercel dashboard for errors

## 📞 Contact

Need help? Contact the development team!
