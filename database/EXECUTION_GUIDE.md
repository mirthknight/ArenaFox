# Database Migration & Setup Guide

This guide explains how to apply the database schema and set up the initial admin user.

## 1. Database Schema (Code)

The database schema is defined in `database/schema.sql`. This file includes:
-   `user_accounts` table
-   `user_profiles` table
-   Row Level Security (RLS) policies
-   Enum types

### Execution
Since this project uses the Supabase Client (Anon Key), we cannot execute DDL (schema changes) directly from the client script for security reasons.

**Option A: Supabase Dashboard (Recommended)**
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Copy the contents of `database/schema.sql`.
4.  Paste them into the editor and click **Run**.

**Option B: Supabase CLI**
If you have the Supabase CLI installed and logged in:
```bash
supabase db push
```

## 2. Admin User Setup (Execution)

We have created a script to register the super admin user.

### Script Details
-   **File**: `scripts/create-admin.js`
-   **Inputs** (from environment or `.env`):
    - `SUPER_ADMIN_EMAIL`
    - `SUPER_ADMIN_PASSWORD`

### Execution
1. Copy `.env.example` to `.env` and fill in your Supabase keys plus the admin email/password (do not commit this file).
2. Run the following command in your terminal:

```bash
node scripts/create-admin.js
```

### Post-Execution Note
If your Supabase project sends email confirmations (default), you must verify the admin email before you can log in. Alternatively, go to **Authentication > Users** in the Supabase Dashboard and manually verify the user.
