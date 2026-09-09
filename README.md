# BConnect

**Connect. Report. Respond.**

BConnect is an AI-powered barangay incident reporting and coordination platform designed to turn resident reports into structured, actionable information for authorized barangay officials and responders.

## MVP architecture

- Next.js + TypeScript
- Tailwind CSS
- Supabase/PostgreSQL
- Role-based access control
- AI-assisted incident intake
- Resident, official, responder, and admin experiences
- Offline-first reporting foundation
- Human-in-the-loop safety model

## Core incident lifecycle

`DRAFT → SUBMITTED → AI_PROCESSING → PENDING_VERIFICATION → VERIFIED → ASSIGNED → ACCEPTED → RESPONDING → ON_SITE → RESOLVED → CLOSED`

Alternative terminal/exception states include `REJECTED`, `DUPLICATE`, and `CANCELLED`.

## Safety principle

AI provides classification, extraction, summaries, missing-information prompts, and priority recommendations. Authorized humans retain final authority over verification, prioritization, escalation, dispatch, and closure.

## Development status

Foundation initialization in progress. The repository is intentionally being built in dependency order from the approved BConnect Master Blueprint.
