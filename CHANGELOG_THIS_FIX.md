# Fixes & additions in this pass

## 1. Critical bug: ~20 menu pages were unreachable
`app/page.js` only ever rendered `components/ERPViews.jsx` (now moved to
`components/views/ERPViewsSales.jsx`). Seven other files
(`ERPViewsAdmin/Advanced/Pro/System/Enterprise/Tools`, plus a corrupted
duplicate `ERPViewsCore.jsx  jsx`) contained real, working pages —
AI Dashboard, Quotations, Refund Statement, Customer Statement, Recurring
Invoices, Expense Approval, Notifications, Profitability, Profile,
SuperAdmin, Settings, Contract/Offer, Credit Limits, Supplier Statement,
Multi-Branch, AI Pricing, Investors — but were never imported anywhere, so
every one of those menu items showed "Page Under Development".

Fixed by rewriting `components/ERPViews.jsx` into a router that maps every
`page` id to the component that actually implements it. See the comment
block at the top of that file for the full page → component map.

## 2. Create Invoice was a placeholder
The `create` page literally said "Invoice creation form should be rendered
here. Please check if the CreateInvoice component is properly imported."
Built a full form in `components/views/ERPViewsMisc.jsx` wired to your
existing `invForm` / `handleCreateInvoice` state and logic (customer or
corporate, flight/hotel/visa/package fields, passengers, live pricing
totals, payment methods including Credit/Tabby/Tamara/Credit Balance).

## 3. My Attendance didn't exist
No fetch, no handlers, no UI — despite the `attendance` table already
existing in Supabase and translation strings already present. Added:
- `attendance` fetch into app state (`hooks/useERPState.js`)
- Check-in / check-out, leave request, and history UI
  (`components/views/ERPViewsMisc.jsx`)
- **Needs a migration**: see `MIGRATION_employee_id.sql` — attendance is
  tracked per `employees` row, but nothing linked a login (`app_users`) to
  an employee record. Run that SQL once, then set the link per user from
  the new Users page (see #5).

## 4. Credit Limits page was silently broken
It read `data.creditLimits`, an array that was never fetched from
Supabase — always empty. The Enterprise module's implementation
(`ERPViewsEnterprise.jsx`) correctly uses `data.customers` with an
over-limit warning and inline editing, and is now the one that's routed to.

## 5. User management was a dead end
The `users` page just said "managed through SuperAdmin", and SuperAdmin's
`users` page said the same thing back — a loop, with no real UI on either
side, even though `handleAddEditUser` / `handleEditUser` / `handleDeleteUser`
already existed and worked. Also `app_users` was never fetched into app
state, so even a working UI would've shown nothing.

Fixed:
- `app_users` now fetched into `data.appUsers`
- Real Users page: add/edit/delete, permission checkboxes, and (new) a
  dropdown to link a user to an employee record for attendance
- Bug fix: the temp password shown to the admin when creating a user did
  not match the one actually saved to the database (client generated one
  string, the API route generated a different one). Now consistent.

## 6. Cleanup
- Removed the corrupted filename `ERPViewsCore.jsx  jsx` and both now-dead
  Core files (their working parts were carried into `ERPViewsMisc.jsx`).
- Every `.js`/`.jsx` file in the project has been syntax-checked (esbuild).

## What I could NOT verify
I don't have network access to run `npm install` / `next build` in this
environment, and you only sent the schema for the first 9 tables
(`app_users` → `employees`, alphabetically). Tables referenced in code but
not in what you sent — `invoices`, `settings`, `portals`, `expenses`,
`vendors`, `payroll`, `tenants`, `investors`, `packages`, `services`,
`staff_mistakes`, `logos`, `investments` — were not checked column-by-column
against your real schema. If you paste the rest of the schema (or export
it the same way), I'll do a second pass specifically on those.

## Suggested next round (tell me which to prioritize)
- Wire real notifications (currently likely front-end only — worth
  checking against a `notifications` table if you have one)
- Dashboard charts (revenue trend, top routes) instead of just numbers
- Role-based route guards (client-side menu hides items, but pages
  themselves don't re-check permissions before rendering sensitive data)
- PDF/print polish for invoices, contracts, and salary slips
