# BConnect MVP Implementation Guide

## Product
BConnect — Connect. Report. Respond.

## Core workflow
Resident report → AI assistance → official verification → responder assignment → response status → resolution → closure.

## Roles
- resident
- responder
- official
- barangay_admin
- lgu_admin
- super_admin
- auditor

## AI boundary
AI may classify, extract, summarize, identify missing information, suggest priority, and flag related reports. AI must not independently dispatch, determine guilt, diagnose, verify, reject, escalate, or close high-stakes incidents.

## Reliability rule
The incident intake workflow must remain usable when AI, GPS, push notifications, or the network fail. Offline-created reports are explicitly marked as queued until the server confirms receipt.

## Initial implementation order
1. App shell and design system
2. Auth and profile roles
3. Incident create/read lifecycle
4. Official verification workflow
5. Responder assignment/status workflow
6. AI service adapter and structured analysis
7. Notifications
8. Offline queue and sync
9. Evidence upload
10. Analytics and disaster-mode extensions

## Production gate
Before real residents use BConnect, apply reviewed RLS policies, privacy controls, secure storage, backups, monitoring, rate limiting, incident-response procedures, and an LGU-approved operational workflow.
