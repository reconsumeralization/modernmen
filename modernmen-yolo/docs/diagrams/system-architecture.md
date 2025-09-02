# 🏗️ SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MODERN MEN HAIR SALON                               │
│                            SYSTEM ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │   NEXT.JS APP   │
                                    │   (Frontend)    │
                                    └─────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
            ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
            │   CUSTOMER    │      │   STAFF/ADMIN │      │  DEVELOPER   │
            │   PORTAL      │      │   DASHBOARD   │      │   TOOLS       │
            └───────────────┘      └───────────────┘      └───────────────┘
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
            ┌───────────────┐                             ┌───────────────┐
            │   ModernMen     │                             │   SUPABASE    │
            │     CMS       │                             │   DATABASE    │
            │ (Collections) │◄────────────────────────────►│   (Auth)     │
            └───────────────┘                             └───────────────┘
                    │                                             │
                    └──────────────────────┼──────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
            ┌───────────────┐                             ┌───────────────┐
            │   STRIPE      │                             │   SENDGRID    │
            │  PAYMENTS     │                             │   EMAILS      │
            └───────────────┘                             └───────────────┘

LEGEND: ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
        │   FRONTEND    │    │   BACKEND     │    │   EXTERNAL    │
        └───────────────┘    └───────────────┘    └───────────────┘
```

## 📋 Architecture Components

### 🎨 Frontend Layer (Next.js 15 + React 18)
- **Customer Portal**: Public booking interface
- **Staff Dashboard**: Employee management tools
- **Admin Dashboard**: White-label CMS interface
- **Developer Tools**: Component library and utilities

### 🗄️ Backend Layer (ModernMen CMS + Supabase)
- **ModernMen CMS**: Content management and API
- **Supabase**: Real-time database and authentication
- **PostgreSQL**: Primary data storage
- **Redis**: Caching and session management

### 🔌 Integration Layer (External Services)
- **Stripe**: Payment processing
- **SendGrid**: Email communications
- **Twilio**: SMS notifications (planned)
- **Google Calendar**: Appointment sync (planned)

## 🔄 Data Flow Architecture

```
Frontend (React) → API Routes (Next.js) → ModernMen CMS → Supabase → PostgreSQL
      ↑                                                            ↓
      └────────────────── Real-time Updates ───────────────────────┘
```

## 🛡️ Security Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Client      │    │   API Routes  │    │   Database    │
│   (JWT)       │───►│   (Auth)      │───►│   (RLS)       │
│   Tokens      │    │   Middleware  │    │   Policies    │
└───────────────┘    └───────────────┘    └───────────────┘
```

## 📊 Performance Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   CDN         │    │   ISR/SSG     │    │   Database    │
│   (Assets)    │    │   (Caching)   │    │   (Indexes)   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## 🚀 Deployment Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Vercel      │    │   Supabase    │    │   ModernMen     │
│   (Frontend)  │    │   (Database)  │    │   (CMS)       │
└───────────────┘    └───────────────┘    └───────────────┘
```
