-- Run this once in Supabase SQL Editor.
-- Adds the missing link between a login (app_users) and their HR record
-- (employees), which the new "My Attendance" feature needs to know whose
-- attendance to show/mark.

alter table app_users
  add column if not exists employee_id uuid references employees(id) on delete set null;

-- Optional but recommended: speeds up "my attendance" lookups per employee.
create index if not exists idx_attendance_employee_date
  on attendance (employee_id, date);

create index if not exists idx_app_users_employee_id
  on app_users (employee_id);

-- After running this, go to Settings/Users in the app and set "Link to
-- Employee" for each staff member so their My Attendance page works.
