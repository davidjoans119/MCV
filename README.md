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


## Phase 5 — Owner dashboard
- Responsive owner dashboard layout with sidebar navigation
- Loads signed-in user's active organization membership
- Loads organization name and its registered outlets from Supabase
- Supports selecting an outlet when multiple outlets exist
- Shows honest placeholders for sales/orders/team metrics until those modules are connected
- Includes navigation to POS, orders, menu, inventory, staff, reports and settings

The dashboard expects `organization_members(user_id, organization_id, status)`, `organizations(id, name)`, and `locations(id, organization_id, name, city, created_at)` as used by the existing Phase 1/4 project code. Verify RLS permits the signed-in member to read their own membership and organization/location records.


## Phase 6 — Menu, POS and order management
1. Run `supabase/migrations/0002_phase6_pos_orders.sql` in Supabase SQL Editor.
2. Deploy the updated Next.js project.
3. Sign in and open Menu. Add menu categories/items and prices.
4. Open POS. Select an outlet, add items, choose order type and payment method, then create the order.
5. Open Orders to review the latest 100 orders and update preparation status.

The SQL creates menu categories/items, restaurant orders and order-item snapshot tables; enables RLS; and adds the `create_restaurant_order` RPC so order creation and line items are committed together. Payment is recorded as a method/status only; this does not process a UPI/card transaction or integrate a payment gateway.

Before production use, test the policies with two different restaurant accounts and review staff role restrictions. Current policies allow any active organization member to manage menu data and update order statuses; role-based permissions are a later hardening step.


## Phase 7 — Kitchen Display System
- New `/kitchen` kitchen board
- Displays active tickets grouped into New, Preparing and Ready columns
- Shows order number, order type, creation time, item quantities and kitchen notes
- Advances tickets: placed → preparing → ready → completed
- Refreshes every 10 seconds and includes a manual refresh button
- Uses the existing Phase 6 `restaurant_orders` and `restaurant_order_items` tables

No additional SQL migration is required for this basic KDS. The signed-in member must be allowed to read order items and update orders under the Phase 6 RLS policies. This is periodic refresh, not realtime push. For production, add role-based kitchen access and realtime subscriptions.
