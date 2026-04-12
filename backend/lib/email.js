const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Vonaxity <hello@vonaxity.com>';

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL SKIPPED - no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email send failed');
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[EMAIL ERROR] ${err.message}`);
    return { ok: false, error: err.message };
  }
}

const BASE_URL = process.env.FRONTEND_URL || 'https://vonaxity.com';

const emailTemplates = {

  // ── To nurse: new job posted in their city ─────────────────────────────────
  newJobPosted: ({ nurseName, serviceType, city, scheduledAt, visitId }) => ({
    subject: `New job available in ${city} — ${serviceType}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">New job available near you</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${nurseName}, a new visit request just came in that matches your area.</p>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="margin-bottom:10px"><strong>Service:</strong> ${serviceType}</div>
          <div style="margin-bottom:10px"><strong>City:</strong> ${city}</div>
          <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View &amp; Apply →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: nurse applied to their visit ────────────────────────────────
  nurseApplied: ({ clientName, nurseName, nurseCity, serviceType, visitId }) => ({
    subject: `${nurseName} applied for your visit`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">A nurse applied to your visit</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${clientName}, <strong>${nurseName}</strong> from ${nurseCity} has applied for your <strong>${serviceType}</strong> visit.</p>
        <p style="color:#475569;margin-bottom:24px">Review their profile and select them if you're happy to proceed.</p>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View applicants →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To nurse: client selected them ────────────────────────────────────────
  nurseSelected: ({ nurseName, clientName, serviceType, city, scheduledAt, relativeName }) => ({
    subject: `You've been selected for a visit in ${city}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">You've been selected!</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${nurseName}, great news — ${clientName} has selected you for their visit.</p>
        <div style="background:#ECFDF5;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #6EE7B7">
          <div style="margin-bottom:10px"><strong>Patient:</strong> ${relativeName}</div>
          <div style="margin-bottom:10px"><strong>Service:</strong> ${serviceType}</div>
          <div style="margin-bottom:10px"><strong>City:</strong> ${city}</div>
          <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View your visits →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: visit completed + health report ─────────────────────────────
  visitCompleted: ({ clientName, nurseName, relativeName, serviceType, scheduledAt, bp, glucose, notes }) => ({
    subject: `Health report: visit for ${relativeName} completed`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Visit completed</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${clientName}, ${nurseName} has completed the ${serviceType} visit for <strong>${relativeName}</strong>.</p>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:#0F172A">Health report</div>
          ${bp ? `<div style="margin-bottom:8px"><strong>Blood pressure:</strong> ${bp} mmHg</div>` : ''}
          ${glucose ? `<div style="margin-bottom:8px"><strong>Glucose:</strong> ${glucose} mmol/L</div>` : ''}
          ${notes ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #E2E8F0;font-style:italic;color:#475569">"${notes}"</div>` : ''}
        </div>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View full report →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To nurse: approved by admin ────────────────────────────────────────────
  nurseApproved: ({ nurseName }) => ({
    subject: 'Your Vonaxity profile has been approved',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">You're approved!</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${nurseName}, your Vonaxity nurse profile has been reviewed and approved. You can now browse and apply to visit requests in your area.</p>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Browse jobs →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To nurse: rejected by admin ────────────────────────────────────────────
  nurseRejected: ({ nurseName, reason }) => ({
    subject: 'Update on your Vonaxity application',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Application update</h2>
        <p style="color:#475569;margin-bottom:16px">Hi ${nurseName}, unfortunately we were unable to approve your profile at this time.</p>
        ${reason ? `<div style="background:#FEF2F2;border-radius:10px;padding:16px;margin-bottom:24px;border:1px solid #FECACA;color:#DC2626">${reason}</div>` : ''}
        <p style="color:#475569;margin-bottom:24px">You can update your profile and resubmit for review.</p>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Update profile →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── Welcome email to new client ─────────────────────────────────────────────
  welcomeClient: ({ name }) => ({
    subject: 'Welcome to Vonaxity',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Welcome, ${name}!</h2>
        <p style="color:#475569;margin-bottom:24px">Your account is ready. You can now book professional nurse visits for your loved ones in Albania.</p>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Go to dashboard →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),
};

module.exports = { sendEmail, emailTemplates };
