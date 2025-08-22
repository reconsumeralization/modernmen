# 🚀 Complete Supabase Setup Guide for Modern Men Hair Salon

## 📋 **Current Status: Environment Variables Need Real Values**

The authentication system is failing because your `.env.local` file contains placeholder values. Here's exactly what you need to do:

---

## **Step 1: Create Supabase Project (5 minutes)**

### **1.1 Sign Up/Login to Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create account or sign in
3. Click "New Project"

### **1.2 Configure New Project**
```
Project Name: modern-men-salon
Database Password: [Create a strong password]
Region: [Choose closest to your location]
Pricing Plan: Free (for now)
```

### **1.3 Wait for Project Creation**
- Wait 2-3 minutes for database initialization
- Copy your project details from the dashboard

---

## **Step 2: Get Your Connection Details (3 minutes)**

### **2.1 Find Project Settings**
1. In Supabase Dashboard → Your Project → Settings
2. Go to "API" section

### **2.2 Copy Required Values**
You need these exact values:

**Project URL:**
```
https://your-project-id.supabase.co
```
*(Found under "Project Settings" → "API" → "Project URL")*

**Service Role Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Found under "Project Settings" → "API" → "service_role" key)*

**Project Reference:**
```
your-project-id
```
*(Found in the URL: `https://supabase.com/dashboard/project/your-project-id`)*

---

## **Step 3: Update Your Environment File (2 minutes)**

### **3.1 Open .env.local**
Your file currently has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### **3.2 Replace with Real Values**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjkyNDY0ODAwLCJleHAiOjIwMDgwMjA4MDB9.CRYPTOGRAPHIC_SIGNATURE
```

### **3.3 Restart Development Server**
```bash
# Stop your current server (Ctrl+C)
# Restart it
npm run dev
```

---

## **Step 4: Create Database Tables (5 minutes)**

### **4.1 Run Database Migration**
```bash
# This creates all the auth tables
npx supabase db reset
```

### **4.2 Verify Tables Created**
In Supabase Dashboard:
1. Go to "Table Editor"
2. You should see these tables:
   - `users` (for user accounts)
   - `accounts` (for OAuth providers)
   - `sessions` (for user sessions)
   - `verification_tokens` (for email verification)

---

## **Step 5: Test Authentication (2 minutes)**

### **5.1 Verify Server is Running**
```bash
curl -s "http://localhost:3000/api/healthcheck"
# Should return: {"status":"ok",...}
```

### **5.2 Test Auth Pages**
```bash
curl -s -I "http://localhost:3000/auth/signin"
# Should return: HTTP/1.1 200 OK
```

### **5.3 Visit in Browser**
- Go to `http://localhost:3000/auth/signin`
- Page should load without errors
- You can test registration and login

---

## **Step 6: Configure Additional Features (Optional)**

### **6.1 Email Service (for password reset)**
```bash
# In Supabase Dashboard → Authentication → Settings
# Configure SMTP settings or use built-in email service
```

### **6.2 OAuth Providers (for social login)**
```bash
# Add Google/GitHub OAuth in Authentication → Providers
# Update .env.local with client IDs
```

### **6.3 Row Level Security (RLS)**
```sql
-- Enable RLS on tables for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
```

---

## **🔍 Troubleshooting**

### **Common Issues:**

**"Missing required environment variable"**
- ✅ Double-check `.env.local` values
- ✅ Restart development server after changes
- ✅ Ensure no placeholder values remain

**"Database connection failed"**
- ✅ Verify Supabase project is active
- ✅ Check service role key is correct
- ✅ Ensure database is initialized

**"Auth pages still return 500"**
- ✅ Clear browser cache
- ✅ Check browser console for errors
- ✅ Verify all environment variables are set

### **Quick Debug Commands:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test database connection
curl -s "http://localhost:3000/api/healthcheck"

# Check auth providers endpoint
curl -s "http://localhost:3000/api/auth/providers"
```

---

## **🎯 Expected Results After Setup**

### **✅ Working Features:**
- User registration with email/password
- User login with credentials
- Password reset functionality
- Session management
- Protected routes
- Admin panel access

### **✅ Database Structure:**
- Users table with authentication data
- Sessions for user state management
- Email verification tokens
- Password reset tokens

### **✅ Security Features:**
- Encrypted password storage
- JWT token-based authentication
- CSRF protection
- Rate limiting on auth endpoints
- Secure session management

---

## **📞 Need Help?**

If you encounter issues:

1. **Check the error messages** in terminal/browser console
2. **Verify all environment variables** are correctly set
3. **Ensure Supabase project** is active and accessible
4. **Test API endpoints** with curl commands above

**Once this is complete, your entire authentication system will be fully functional and ready for the next development phase!** 🚀

---

**Ready to set up your Supabase project?** The authentication system is ready - we just need the real database connection details.
