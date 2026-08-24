-- Run this once in Supabase SQL Editor (in addition to MIGRATION_employee_id.sql
-- from the previous round, if you haven't already).

-- Employees: complete HR profile fields
alter table employees
  add column if not exists iqama_expiry date,
  add column if not exists nationality text,
  add column if not exists job_title text,
  add column if not exists national_id text,
  add column if not exists join_date date,
  add column if not exists bank_name text,
  add column if not exists bank_account text,
  add column if not exists labor_office_expiry text; -- "maktab amal" renewal date

-- Staff mistakes: capture WHY the deduction happened, not just the amounts
alter table staff_mistakes
  add column if not exists reason text;

-- Helpful indexes
create index if not exists idx_employees_iqama_expiry on employees (iqama_expiry);
create index if not exists idx_emp_advances_employee on emp_advances (employee_id);
create index if not exists idx_payroll_employee_month on payroll (employee_id, month);
