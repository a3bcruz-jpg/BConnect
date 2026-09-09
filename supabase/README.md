# Supabase setup

1. Create a Supabase project.
2. Apply `migrations/0001_initial_schema.sql` using the Supabase SQL editor or migration tooling.
3. Configure Authentication providers for the environments you use. Residents can use phone OTP; staff accounts should use stronger authentication as required by the deployment policy.
4. Configure private storage for incident evidence before enabling uploads.
5. Add Row Level Security policies before connecting production users.

The initial migration intentionally defines the core tables and enums but does not ship permissive RLS policies. Production access policies must be reviewed and applied before handling real resident or incident data.
