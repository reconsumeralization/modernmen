# Google Analytics 4 Setup Guide

This guide provides comprehensive instructions for setting up Google Analytics 4 (GA4) tracking for the Modern Men hair salon application.

## Prerequisites

1. **Google Account**: Access to Google Analytics and Google Tag Manager
2. **Website Property**: Your domain should be accessible for verification
3. **Basic Technical Knowledge**: Understanding of web development and environment variables

## Step 1: Create GA4 Property

### 1.1 Access Google Analytics
1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Property"

### 1.2 Create New Property
1. **Property Name**: "Modern Men Hair Salon"
2. **Time Zone**: Select your local time zone
3. **Currency**: USD (or your local currency)
4. **Property Type**: Web
5. **Website URL**: `https://yourdomain.com` (use localhost for development)
6. **Stream Name**: "Modern Men Website"

### 1.3 Get Tracking ID
After creating the property:
1. Go to "Admin" → "Property" → "Data Streams"
2. Click on your web stream
3. Copy the "Measurement ID" (starts with "G-XXXXXXXXXX")

## Step 2: Environment Configuration

### 2.1 Development Setup
Create or update your `.env.local` file:

```bash
# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 2.2 Production Setup
For production deployment, add the same variable to your hosting platform:
- **Vercel**: Add to Environment Variables in dashboard
- **Netlify**: Add to Build environment variables
- **Other**: Follow your hosting provider's documentation

## Step 3: Implementation Features

### ✅ **Implemented Tracking Features**

#### Page View Tracking
- **Automatic**: Tracks all page views with path and title
- **Custom Parameters**: Includes timestamp, referrer, and user agent

#### E-commerce Tracking
- **Purchase Events**: Complete booking transactions
- **Product Interactions**: Service selection and barber choices
- **Revenue Tracking**: Total booking value and currency

#### User Engagement
- **Scroll Depth**: Tracks 25%, 50%, 75%, 90%, 100% scroll milestones
- **Time on Page**: Measures user engagement duration
- **Button Clicks**: Tracks CTA interactions and conversions
- **Form Interactions**: Monitors booking funnel progression

#### Conversion Funnel
- **Booking Steps**: Tracks progression through 6-step booking process
- **Drop-off Analysis**: Identifies where users abandon the booking flow
- **Conversion Attribution**: Links marketing campaigns to bookings

#### Custom Events
- **Service Interactions**: Tracks service views and selections
- **Barber Interactions**: Monitors barber profile views and selections
- **Payment Events**: Tracks payment initiation, success, and failures
- **Error Tracking**: Captures form errors and API failures

## Step 4: Custom Dimensions & Metrics

### 4.1 Recommended Custom Dimensions
Set these up in GA4 for enhanced reporting:

```
Custom Dimensions:
- Service Type (service_id)
- Barber Selected (barber_id)
- Booking Step (step_number)
- Payment Method (payment_type)
- Customer Type (new_returning)
- Device Category (mobile_desktop)
- Traffic Source (organic_paid)
```

### 4.2 Key Metrics to Track
- **Conversion Rate**: Bookings started → completed
- **Average Order Value**: Total revenue ÷ number of bookings
- **Customer Acquisition Cost**: Marketing spend ÷ new customers
- **Customer Lifetime Value**: Average revenue per customer
- **Booking Funnel Drop-off**: Where users abandon the process

## Step 5: Advanced Features

### 5.1 Enhanced E-commerce
```javascript
// Tracks complete booking transaction
gtag('event', 'purchase', {
  transaction_id: 'booking-123',
  value: 85.00,
  currency: 'USD',
  items: [{
    item_id: 'executive-package',
    item_name: 'Executive Package',
    item_category: 'Premium Service',
    price: 85.00,
    quantity: 1
  }]
})
```

### 5.2 Custom Event Tracking
```javascript
// Track booking funnel progression
gtag('event', 'booking_step_completed', {
  step_number: 3,
  step_name: 'datetime_selection',
  service_id: 'executive-package',
  barber_id: 'mike-johnson'
})
```

### 5.3 User Properties
```javascript
// Set user properties for segmentation
gtag('set', 'user_properties', {
  user_type: 'returning',
  membership_status: 'vip',
  preferred_barber: 'mike-johnson',
  total_bookings: 15,
  lifetime_value: 1275.00
})
```

## Step 6: Google Tag Manager (Optional)

For advanced tracking and marketing tags:

### 6.1 Create GTM Container
1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Create new account: "Modern Men Hair Salon"
3. Container type: Web
4. Add GTM code to your website

### 6.2 Configure GA4 Tag
1. **Tag Type**: Google Analytics GA4 Configuration
2. **Measurement ID**: Your GA4 tracking ID
3. **Trigger**: All Pages

### 6.3 Custom Triggers
- **Booking Started**: Fires when user clicks "Book Now"
- **Service Selected**: Fires on service selection
- **Payment Completed**: Fires on successful payment
- **Form Errors**: Fires on form validation errors

## Step 7: Testing & Validation

### 7.1 Debug Mode
Enable debug mode during development:
```bash
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
# Debug mode is automatically enabled in development
```

### 7.2 Real-time Reports
1. Go to GA4 → "Reports" → "Realtime"
2. Perform actions on your site
3. Verify events appear in real-time

### 7.3 Debug Console
1. Open browser developer tools
2. Check Console for GA4 debug messages
3. Verify events are firing correctly

## Step 8: Key Reports & Insights

### 8.1 Essential Reports
- **Acquisition**: How users find your site
- **Engagement**: User behavior and interaction
- **Monetization**: Revenue and booking performance
- **Conversions**: Booking funnel and completion rates

### 8.2 Custom Reports
Create reports for:
- **Booking Funnel Analysis**: Step-by-step conversion tracking
- **Service Performance**: Which services convert best
- **Barber Performance**: Which barbers are most popular
- **Time-based Analysis**: Peak booking hours and days
- **Customer Segmentation**: New vs. returning customer behavior

## Step 9: Privacy & Compliance

### 9.1 GDPR Compliance
- **Cookie Consent**: Implement cookie consent banner
- **Data Retention**: Set appropriate data retention periods
- **User Rights**: Support right to erasure and data portability

### 9.2 Analytics Opt-out
```javascript
// Respect user's privacy preferences
if (window.gtag && userConsentsToAnalytics) {
  // Enable tracking
} else {
  // Disable tracking
}
```

## Step 10: Monitoring & Maintenance

### 10.1 Regular Checks
- **Weekly**: Review top-performing content and campaigns
- **Monthly**: Analyze booking funnel performance
- **Quarterly**: Review customer acquisition costs and lifetime value

### 10.2 Alert Setup
Configure alerts for:
- **Traffic Drops**: Significant decrease in website traffic
- **Conversion Changes**: Changes in booking completion rates
- **Error Spikes**: Increase in JavaScript errors or failed payments

## Troubleshooting

### Common Issues
1. **Events Not Tracking**: Check measurement ID and implementation
2. **Data Discrepancy**: Compare GA4 with internal database
3. **Attribution Issues**: Verify UTM parameters and referral tracking

### Support Resources
- **GA4 Documentation**: [developers.google.com/analytics](https://developers.google.com/analytics)
- **GA4 Help Center**: [support.google.com/analytics](https://support.google.com/analytics)
- **GTM Documentation**: [developers.google.com/tag-manager](https://developers.google.com/tag-manager)

## Success Metrics

Track these KPIs for business success:

### Primary Metrics
- **Monthly Recurring Revenue**: Consistent booking revenue
- **Customer Acquisition Cost**: Marketing efficiency
- **Customer Lifetime Value**: Long-term customer value
- **Booking Conversion Rate**: Website effectiveness

### Secondary Metrics
- **Average Order Value**: Upselling effectiveness
- **Repeat Booking Rate**: Customer loyalty
- **Time to Book**: User experience efficiency
- **Mobile Conversion Rate**: Mobile optimization success

This comprehensive GA4 setup will provide deep insights into your customers' behavior, optimize your booking funnel, and drive business growth for Modern Men Hair Salon.
