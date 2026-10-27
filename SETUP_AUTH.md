# FraudLens — real business login and workspace

1. Create a Supabase project at https://supabase.com/dashboard.
2. In **SQL Editor**, run `supabase_setup.sql` once. This creates the business profile, supplier and scan tables with row-level security, plus an automatic business profile creation trigger.
3. In **Authentication → Providers → Email**, enable email/password and **Confirm email**. In **Authentication → URL Configuration**, set **Site URL** to `http://localhost:5173` and add `http://localhost:5173/**` as an allowed redirect. Configure a production URL before deployment.
4. In **Project Settings → API** (or **Connect**), copy the project URL and **publishable / anon key**. Never use a service-role or secret key in the browser.
5. Copy `.env.example` to `.env.local`, replace placeholders, and restart the dev server.
6. Run `npm.cmd install` and `npm.cmd run dev` in VS Code PowerShell.
7. Register with a real email address, confirm via the email link, then log in. The business dashboard should show your name and business. Supplier records are private to your account; the demo remains accessible separately.
8. Test using two different registered users: each should see only their own suppliers and saved scans.

**Current limitations:** Invoice scanning is still a **simulated scenario**, not real PDF extraction or fraud detection. Demo data is not written to the database. Registered accounts start with empty suppliers/scans. Payment plans are preference only; no charges. Some dashboard example metrics may still be illustrative and must not be interpreted as real security analytics. Production requires further security testing, rate limiting, email deliverability setup, data retention/privacy policies, and secure document processing. Do not upload actual banking documents until these controls are implemented and tested.
