const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Vonaxity <hello@vonaxity.com>';

// Escape user-supplied strings before inserting into HTML
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
    subject: `New job available in ${esc(city)} — ${esc(serviceType)}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">New job available near you</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(nurseName)}, a new visit request just came in that matches your area.</p>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="margin-bottom:10px"><strong>Service:</strong> ${esc(serviceType)}</div>
          <div style="margin-bottom:10px"><strong>City:</strong> ${esc(city)}</div>
          <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View &amp; Apply →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: nurse applied to their visit ────────────────────────────────
  nurseApplied: ({ clientName, nurseName, nurseCity, serviceType, visitId }) => ({
    subject: `${esc(nurseName)} applied for your visit`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">A nurse applied to your visit</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(clientName)}, <strong>${esc(nurseName)}</strong> from ${esc(nurseCity)} has applied for your <strong>${esc(serviceType)}</strong> visit.</p>
        <p style="color:#475569;margin-bottom:24px">Review their profile and select them if you're happy to proceed.</p>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View applicants →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To nurse: client selected them ────────────────────────────────────────
  nurseSelected: ({ nurseName, clientName, serviceType, city, scheduledAt, relativeName }) => ({
    subject: `You've been selected for a visit in ${esc(city)}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">You've been selected!</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(nurseName)}, great news — ${esc(clientName)} has selected you for their visit.</p>
        <div style="background:#ECFDF5;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #6EE7B7">
          <div style="margin-bottom:10px"><strong>Patient:</strong> ${esc(relativeName)}</div>
          <div style="margin-bottom:10px"><strong>Service:</strong> ${esc(serviceType)}</div>
          <div style="margin-bottom:10px"><strong>City:</strong> ${esc(city)}</div>
          <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View your visits →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: visit completed + health report ─────────────────────────────
  visitCompleted: ({ clientName, nurseName, relativeName, serviceType, scheduledAt, bp, glucose, notes }) => ({
    subject: `Health report: visit for ${esc(relativeName)} completed`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Visit completed</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(clientName)}, ${esc(nurseName)} has completed the ${esc(serviceType)} visit for <strong>${esc(relativeName)}</strong>.</p>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:#0F172A">Health report</div>
          ${bp ? `<div style="margin-bottom:8px"><strong>Blood pressure:</strong> ${esc(bp)} mmHg</div>` : ''}
          ${glucose ? `<div style="margin-bottom:8px"><strong>Glucose:</strong> ${esc(glucose)} mmol/L</div>` : ''}
          ${notes ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #E2E8F0;font-style:italic;color:#475569">"${esc(notes)}"</div>` : ''}
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
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(nurseName)}, your Vonaxity nurse profile has been reviewed and approved. You can now browse and apply to visit requests in your area.</p>
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
        <p style="color:#475569;margin-bottom:16px">Hi ${esc(nurseName)}, unfortunately we were unable to approve your profile at this time.</p>
        ${reason ? `<div style="background:#FEF2F2;border-radius:10px;padding:16px;margin-bottom:24px;border:1px solid #FECACA;color:#DC2626">${esc(reason)}</div>` : ''}
        <p style="color:#475569;margin-bottom:24px">You can update your profile and resubmit for review.</p>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Update profile →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: booking confirmation ────────────────────────────────────────
  bookingConfirmed: ({ clientName, serviceType, city, scheduledAt, relativeName, workOrderNumber }) => ({
    subject: `Visit booked${workOrderNumber ? ` · ${workOrderNumber}` : ''} — ${esc(serviceType)} on ${new Date(scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Visit booked successfully</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(clientName)}, your visit has been booked. Nurses in ${esc(city)} are being notified and will apply soon.</p>
        ${workOrderNumber ? `<div style="background:#EFF6FF;border-radius:10px;padding:14px 18px;margin-bottom:20px;border:1px solid #BFDBFE"><div style="font-size:11px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Work Order Number</div><div style="font-size:20px;font-weight:800;color:#1D4ED8;letter-spacing:2px">${workOrderNumber}</div><div style="font-size:11px;color:#6B7280;margin-top:4px">Keep this number — you can use it to reference your case with our team.</div></div>` : ''}
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="margin-bottom:10px"><strong>Service:</strong> ${esc(serviceType)}</div>
          <div style="margin-bottom:10px"><strong>For:</strong> ${esc(relativeName)}</div>
          <div style="margin-bottom:10px"><strong>City:</strong> ${esc(city)}</div>
          <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <p style="color:#475569;margin-bottom:24px">You will receive another email when a nurse applies. You can then review and select your preferred nurse from your dashboard.</p>
        <a href="${process.env.FRONTEND_URL||'https://vonaxity.com'}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View dashboard →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),
  // ── Welcome email to new nurse ──────────────────────────────────────────────
  welcomeNurse: ({ name }) => ({
    subject: 'Welcome to Vonaxity — complete your profile',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Welcome aboard, ${esc(name)}!</h2>
        <p style="color:#475569;margin-bottom:24px">Your nurse account has been created. The next step is to complete your profile so our team can review and approve you to start receiving visit requests.</p>
        <div style="background:#F0FDF4;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #BBF7D0">
          <div style="font-weight:600;margin-bottom:8px;color:#065F46">Here's what to do next:</div>
          <ol style="margin:0;padding-left:20px;color:#047857;line-height:1.8">
            <li>Fill in your professional details (city, experience, certifications)</li>
            <li>Add your languages and specialties</li>
            <li>Submit for admin review</li>
          </ol>
        </div>
        <a href="${BASE_URL}/en/nurse/profile" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Complete my profile →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To client: visit cancelled ──────────────────────────────────────────────
  visitCancelled: ({ clientName, serviceType, scheduledAt }) => ({
    subject: `Your ${esc(serviceType)} visit has been cancelled`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Visit cancelled</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(clientName)}, we're sorry to inform you that the following visit has been cancelled.</p>
        <div style="background:#FEF2F2;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #FECACA">
          <div style="margin-bottom:8px"><strong>Service:</strong> ${esc(serviceType)}</div>
          <div><strong>Scheduled:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <p style="color:#475569;margin-bottom:24px">You can book a new visit at any time from your dashboard. We apologise for any inconvenience.</p>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Book a new visit →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── To nurse: assigned visit was cancelled ───────────────────────────────────
  visitCancelledNurse: ({ nurseName, serviceType, scheduledAt }) => ({
    subject: `Job cancelled — ${esc(serviceType)}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Job cancelled</h2>
        <p style="color:#475569;margin-bottom:24px">Hi ${esc(nurseName)}, a job you were assigned has been cancelled by the client or admin.</p>
        <div style="background:#FEF2F2;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #FECACA">
          <div style="margin-bottom:8px"><strong>Service:</strong> ${esc(serviceType)}</div>
          <div><strong>Scheduled:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <a href="${BASE_URL}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View available jobs →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),

  // ── Admin: nurse submitted profile for review ────────────────────────────────
  adminNurseSubmission: ({ nurseName, nurseEmail, nurseId }) => ({
    subject: `New nurse profile submitted — ${esc(nurseName)}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity Admin</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">New nurse profile ready for review</h2>
        <p style="color:#475569;margin-bottom:24px">A nurse has submitted their profile and is waiting for approval.</p>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
          <div style="margin-bottom:8px"><strong>Name:</strong> ${esc(nurseName)}</div>
          <div style="margin-bottom:8px"><strong>Email:</strong> ${esc(nurseEmail)}</div>
          <div><strong>Nurse ID:</strong> ${esc(String(nurseId))}</div>
        </div>
        <a href="${BASE_URL}/en/admin" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Review in admin panel →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Internal notification</p>
      </div>`,
  }),

  // ── Welcome email to new client ─────────────────────────────────────────────
  welcomeClient: ({ name }) => ({
    subject: 'Welcome to Vonaxity',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Welcome, ${esc(name)}!</h2>
        <p style="color:#475569;margin-bottom:24px">Your account is ready. You can now book professional nurse visits for your loved ones in Albania.</p>
        <a href="${BASE_URL}/en/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Go to dashboard →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
  }),
};

module.exports = { sendEmail, emailTemplates };

// Nurse nudge - remind nurse about upcoming visit
module.exports.sendNurseNudge = async ({ nurseEmail, nurseName, serviceType, scheduledAt, city }) => {
  const { sendEmail } = module.exports;
  return sendEmail({
    to: nurseEmail,
    subject: `Reminder: Visit tomorrow — ${esc(serviceType)} in ${esc(city)}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
      <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Visit reminder</h2>
      <p style="color:#475569;margin-bottom:24px">Hi ${esc(nurseName)}, you have a visit scheduled tomorrow.</p>
      <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #E2E8F0">
        <div style="margin-bottom:10px"><strong>Service:</strong> ${esc(serviceType)}</div>
        <div style="margin-bottom:10px"><strong>City:</strong> ${esc(city)}</div>
        <div><strong>Date:</strong> ${new Date(scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
      </div>
      <a href="${process.env.FRONTEND_URL||'https://vonaxity.com'}/en/nurse" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">View visit details →</a>
    </div>`,
  });
};
