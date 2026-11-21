# MCV-OS — Phase 2 starter

This is the first working web application foundation for MCV-OS:
- Public landing page
- Sign up, login and forgot-password request
- Restaurant workspace onboarding
- Owner dashboard shell
- Supabase connection

## Important
This is Phase 2 foundation, not the complete restaurant management system. Orders, billing, menu, inventory, reports, staff management and Android app are future modules.

## Configure Supabase
1. In Supabase Dashboard, open Project Settings → API.
2. Copy the Project URL.
3. Copy the publishable/anon key (never use the service_role/secret key in a browser app).
4. Create `.env.local` from `.env.example` and fill in both values.

## Supabase Auth settings
In Authentication → URL Configuration:
- Site URL: your deployed app URL (during local development use `http://localhost:3000`)
- Add Redirect URL: `http://localhost:3000/**`
- After deployment add your Vercel URL and its wildcard redirect.

For email confirmation, configure the Supabase email template redirect to use the app's auth callback URL if needed. Test signup and confirmation before inviting real users.

## Run locally
Requires Node.js LTS and npm:
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy without VS Code
You can upload this ZIP to a GitHub repository using GitHub's website, then import that repository into Vercel. Add the two environment variables in Vercel Project Settings → Environment Variables, then deploy.

## Database prerequisite
Run the MCV-OS Phase 1 SQL in a fresh Supabase development project first. The onboarding page calls:
`create_restaurant_workspace(p_org_name, p_location_name, p_city)`

## Security notes
- Never expose Supabase service-role or secret keys in frontend environment variables.
- Enable email verification for real accounts.
- Review RLS policies and test with two separate users before production.
- This starter uses Supabase browser auth. For a production launch, add server-side session handling, rate limiting, robust password recovery flow, monitoring and policy review.


## Phase 4 — Restaurant onboarding
The onboarding flow is a two-step wizard:
1. Restaurant/business identity
2. First outlet name and optional city

It checks that the visitor is signed in, detects an existing active workspace, and calls the Phase 1 `create_restaurant_workspace` RPC. On success it sends the owner to the dashboard.

The RPC is expected to exist from the Phase 1 SQL migration. Test with a new Supabase auth user. If email confirmation is enabled, confirm the email and log in before onboarding.
