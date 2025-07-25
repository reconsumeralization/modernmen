# Modern Men - Testing Guide for New Features

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   # Windows
   install-enhancements.bat
   
   # Mac/Linux
   chmod +x install-enhancements.sh
   ./install-enhancements.sh
   ```

2. **Update Environment Variables**
   Add to your `.env.local`:
   ```env
   JWT_SECRET=your-very-secure-secret-key-here
   ```

3. **Update Database**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Testing Enhanced Booking System

### 1. Real-Time Availability Checker
- Navigate to `/book-enhanced`
- Select a service (e.g., "Classic Haircut")
- Choose a stylist or "No Preference"
- Watch the calendar update with available time slots
- Try different dates to see availability changes

### 2. Multi-Step Booking Process
- Fill in personal information (Step 1)
- Select service and staff (Step 2)
- Choose date and time from available slots (Step 3)
- Add any special notes
- Submit booking and see confirmation

### 3. API Testing
Test the availability endpoint directly:
```bash
# Get available slots for a specific date
curl "http://localhost:3000/api/availability?date=2025-07-30&staffId=staff1&serviceId=service1"
```

## 🔐 Testing Customer Portal

### 1. Customer Registration
- Navigate to `/portal/login`
- Click "Don't have an account? Sign up"
- Fill in registration form:
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Phone: (306) 555-0123
  - Password: Test123!
- Submit and verify account creation

### 2. Customer Login
- Navigate to `/portal/login`
- Enter credentials:
  - Email: john@example.com
  - Password: Test123!
- Submit and verify redirect to dashboard

### 3. Customer Dashboard Features
Test each tab:

**My Bookings Tab:**
- View upcoming appointments
- Check booking status
- Click "Book New Appointment" button

**Profile Tab:**
- View personal information
- Test "Edit Profile" button (placeholder for now)

**Loyalty Points Tab:**
- View points balance (starts at 0)
- Check earning/redemption information

**Service History Tab:**
- View past appointments (empty for new accounts)

### 4. Authentication Flow
- Test logout functionality
- Verify protected routes redirect to login
- Check token persistence across page refreshes

## 📱 Mobile Testing

1. **Responsive Design**
   - Test on various screen sizes
   - Check mobile menu functionality
   - Verify touch interactions work properly

2. **Mobile Booking Flow**
   - Complete booking on mobile device
   - Test calendar swipe gestures
   - Verify form inputs are mobile-friendly

## 🔍 Edge Cases to Test

1. **Booking Conflicts**
   - Try to book overlapping appointments
   - Test break time restrictions
   - Verify past date blocking

2. **Authentication Edge Cases**
   - Wrong password attempts
   - Duplicate email registration
   - Token expiration handling

3. **Form Validation**
   - Empty required fields
   - Invalid email formats
   - Mismatched passwords
   - Phone number formats

## 🐛 Common Issues & Solutions

### Issue: "Unauthorized" error in customer portal
**Solution:** Clear localStorage and login again

### Issue: No available time slots showing
**Solution:** Check staff working hours in database

### Issue: Booking fails with 500 error
**Solution:** Ensure database schema is updated with `npm run db:push`

### Issue: Customer login fails
**Solution:** Verify JWT_SECRET is set in .env.local

## 📊 Performance Testing

1. **Load Time Analysis**
   - Measure initial page load
   - Check time to interactive
   - Monitor API response times

2. **Concurrent Users**
   - Test multiple bookings simultaneously
   - Verify availability updates in real-time
   - Check for race conditions

## ✅ Testing Checklist

- [ ] Enhanced booking form loads correctly
- [ ] Real-time availability shows accurate slots
- [ ] Booking submission creates database entry
- [ ] Customer registration works
- [ ] Customer login generates JWT token
- [ ] Dashboard displays user data
- [ ] Logout clears session
- [ ] Mobile responsiveness
- [ ] Error messages display correctly
- [ ] Loading states appear during async operations
- [ ] Navigation updates show new links
- [ ] Protected routes redirect properly

## 🎯 Next Steps After Testing

1. **Production Deployment**
   - Set secure JWT_SECRET
   - Configure production database
   - Enable HTTPS
   - Set up monitoring

2. **Feature Completion**
   - Implement email notifications
   - Add SMS reminders
   - Complete payment integration
   - Enable review system

Happy testing! 🚀