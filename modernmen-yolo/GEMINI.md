# Project: ModernMen YOLO

## Project Overview

This is a comprehensive hair salon management system built with a modern web stack. The project is a monorepo containing a Next.js frontend, a Payload CMS backend, and various other packages. The system is designed to provide a seamless experience for customers, staff, and administrators.

**Key Technologies:**

*   **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI, React Hook Form, TanStack React Query, Stripe
*   **Backend (CMS):** Payload CMS, Node.js, MongoDB, Express
*   **Database:** Supabase (PostgreSQL)
*   **Deployment:** Vercel

## Building and Running

### Prerequisites

*   Node.js 18+
*   npm or yarn
*   Supabase account and project
*   Stripe account
*   SendGrid account
*   Twilio account

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/modernmen-yolo.git
    cd modernmen-yolo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and configure the following environment variables:

    ```env
    # Application
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # Stripe
    STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
    STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

    # SendGrid
    SENDGRID_API_KEY=SG.your_sendgrid_api_key
    SENDGRID_FROM_EMAIL=noreply@modernmen.com

    # Twilio
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=+1234567890

    # ModernMen CMS
    ModernMen_SECRET=your_ModernMen_secret_key
    DATABASE_URL=mongodb://localhost:27017/modernmen-cms
    ```

4.  **Database Setup:**
    ```bash
    # Push database schema to Supabase
    npm run db:push

    # Generate TypeScript types
    npm run db:generate
    ```

### Running the Application

*   **Start the frontend development server:**
    ```bash
    npm run dev
    ```

*   **Start the CMS development server:**
    ```bash
    npm run cms:dev
    ```

### Building for Production

*   **Build the frontend:**
    ```bash
    npm run build
    ```

*   **Build the CMS:**
    ```bash
    npm run cms:build
    ```

### Testing

*   **Run unit tests:**
    ```bash
    npm run test
    ```

*   **Run tests in watch mode:**
    ```bash
    npm run test:watch
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint and Prettier for code linting and formatting. Run `npm run lint` to check for issues and `npm run lint:fix` to automatically fix them.
*   **Type Checking:** The project uses TypeScript. Run `npm run type-check` to check for type errors.
*   **Branching:** Create a new branch for each feature or bug fix.
*   **Commits:** Follow the conventional commit format.
*   **Pull Requests:** Open a pull request to merge changes into the main branch.
