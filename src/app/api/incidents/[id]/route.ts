import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const staffRoles = ['super_admin', 'lgu_admin', 'barangay_admin', 'official', 'responder', 'auditor'];
const workflowRoles = ['super_admin', 'lgu_admin', 'barangay_admin', 'official', 'responder'];
const assignmentRoles = ['super_admin', 'lgu_admin', 'barangay_admin', 'official'];

const transitions: Record<string, string[]> = {
  submitted: ['pending_verification', 'rejected', 'duplicate', 'cancelled'],
  ai_processing: ['pending_verification'],
  pending_verification: ['verified', 'rejected', 'duplicate', 'cancelled'],
  verified: ['assigned', 'cancelled'],
  assigned: ['accepted', 'cancelled'],
  accepted: ['responding', 'cancelled'],
  responding: ['on_site', 'cancelled'],
  on_site: ['resolved'],
  resolved: ['closed'],
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('id, barangay_id, role, is_active').eq('id', authData.user.id).maybeSingle();
    if (!profile?.is_active || !profile.barangay_id) return NextResponse.json({ error: 'An active barangay profile is required.' }, { status: 403 });
    const { data: incident, error } = await supabase.from('incidents').select('*').eq('id', id).single();
    if (error || !incident) return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
    const canRead = incident.reporter_id === authData.user.id || (incident.barangay_id === profile.barangay_id && staffRoles.includes(profile.role));
    if (!canRead) return NextResponse.json({ error: 'You are not authorized to view this incident.' }, { status: 403 });
    const { data: updates, error: updatesError } = await supabase.from('incident_updates').select('id, user_id, previous_status, new_status, note, created_at').eq('incident_id', id).order('created_at', { ascending: true });
    if (updatesError) console.error('incident updates lookup failed', updatesError);
    return NextResponse.json({ incident, updates: updates ?? [] });
  } catch (error) {
    console.error('incident detail failed', error);
    return NextResponse.json({ error: 'Incident service is temporarily unavailable.' }, { status: 503 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Request body must be an object.' }, { status: 422 });
  const input = body as Record<string, unknown>;
  const requestedStatus = typeof input.status === 'string' ? input.status : undefined;
  const note = typeof input.note === 'string' ? input.note.trim().slice(0, 1000) : undefined;
  const assignedTo = typeof input.assigned_to === 'string' ? input.assigned_to : undefined;
  const priority = typeof input.priority === 'string' ? input.priority : undefined;
  if (!requestedStatus && !assignedTo && !priority && !note) return NextResponse.json({ error: 'At least one supported field is required.' }, { status: 422 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('id, barangay_id, role, is_active').eq('id', authData.user.id).maybeSingle();
    if (!profile?.is_active || !profile.barangay_id || !workflowRoles.includes(profile.role)) return NextResponse.json({ error: 'You are not authorized to manage incidents.' }, { status: 403 });

    const { data: incident, error: incidentError } = await supabase.from('incidents').select('id, reference_number, barangay_id, status, assigned_to').eq('id', id).single();
    if (incidentError || !incident) return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
    if (incident.barangay_id !== profile.barangay_id) return NextResponse.json({ error: 'Incident belongs to another barangay.' }, { status: 403 });

    if (profile.role === 'responder') {
      if (incident.assigned_to !== authData.user.id) return NextResponse.json({ error: 'Only the assigned responder can update this incident.' }, { status: 403 });
      if (assignedTo || priority) return NextResponse.json({ error: 'Responders cannot reassign incidents or change final priority.' }, { status: 403 });
      if (requestedStatus && !['accepted', 'responding', 'on_site', 'resolved', 'cancelled'].includes(requestedStatus)) return NextResponse.json({ error: 'Responder is not authorized for this workflow action.' }, { status: 403 });
    }
    if (assignedTo && !assignmentRoles.includes(profile.role)) return NextResponse.json({ error: 'Only authorized officials can assign responders.' }, { status: 403 });

    let responderName: string | undefined;
    if (assignedTo) {
      const { data: responder } = await supabase.from('profiles').select('id, full_name, role, barangay_id, is_active, responder_availability').eq('id', assignedTo).maybeSingle();
      if (!responder || responder.role !== 'responder' || !responder.is_active || responder.barangay_id !== profile.barangay_id) return NextResponse.json({ error: 'Selected responder is not an active authorized responder for this barangay.' }, { status: 422 });
      if (responder.responder_availability === 'offline') return NextResponse.json({ error: 'Selected responder is currently offline.' }, { status: 409 });
      responderName = responder.full_name;
    }

    if (requestedStatus && (!transitions[incident.status] || !transitions[incident.status].includes(requestedStatus))) return NextResponse.json({ error: `Invalid status transition from ${incident.status} to ${requestedStatus}.` }, { status: 409 });
    if (requestedStatus === 'assigned' && !assignedTo && !incident.assigned_to) return NextResponse.json({ error: 'A responder must be assigned before the incident can move to Assigned.' }, { status: 422 });

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (requestedStatus) update.status = requestedStatus;
    if (priority && ['critical', 'high', 'medium', 'low'].includes(priority)) update.priority = priority;
    if (assignedTo) update.assigned_to = assignedTo;
    if (requestedStatus === 'verified') { update.verified_by = authData.user.id; update.verified_at = new Date().toISOString(); }
    if (requestedStatus === 'assigned') update.assigned_at = new Date().toISOString();
    if (requestedStatus === 'responding') update.responding_at = new Date().toISOString();
    if (requestedStatus === 'on_site') update.on_site_at = new Date().toISOString();
    if (requestedStatus === 'resolved') update.resolved_at = new Date().toISOString();
    if (requestedStatus === 'closed') update.closed_at = new Date().toISOString();

    const { data: updatedIncident, error: updateError } = await supabase.from('incidents').update(update).eq('id', id).select('*').single();
    if (updateError || !updatedIncident) { console.error('incident update failed', updateError); return NextResponse.json({ error: 'Unable to update incident.' }, { status: 500 }); }
    if (requestedStatus || note || assignedTo || priority) {
      const historyNote = assignedTo ? `Assigned responder: ${responderName ?? assignedTo}${note ? ` — ${note}` : ''}` : note ?? null;
      const { error: historyError } = await supabase.from('incident_updates').insert({ incident_id: id, user_id: authData.user.id, previous_status: incident.status, new_status: requestedStatus ?? incident.status, note: historyNote });
      if (historyError) console.error('incident history insert failed', historyError);
    }
    if (assignedTo) {
      const { error: notificationError } = await supabase.from('notifications').insert({ user_id: assignedTo, incident_id: id, type: 'incident_assignment', title: 'New incident assignment', message: `You have been assigned to incident ${incident.reference_number}.`, is_read: false });
      if (notificationError) console.error('assignment notification insert failed', notificationError);
    }
    return NextResponse.json({ incident: updatedIncident });
  } catch (error) {
    console.error('incident update failed', error);
    return NextResponse.json({ error: 'Incident service is temporarily unavailable.' }, { status: 503 });
  }
}
