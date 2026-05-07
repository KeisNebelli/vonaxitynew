/**
 * lib/wellnessTips.js — Content config for the WellnessTicker component.
 *
 * Rules:
 *   - No medical claims, diagnoses, or treatment suggestions.
 *   - General wellness reminders only.
 *   - Bilingual: EN + SQ (Albanian).
 *
 * Each tip:
 *   icon   — key matching the TICKER_ICONS map in WellnessTicker.jsx
 *   text   — display string (keep under ~60 chars for readability at scroll speed)
 *   accent — pill accent color (blue / teal / purple from Vonaxity brand)
 */

export const WELLNESS_TIPS = {
  en: [
    { icon: 'droplet',   text: 'Stay hydrated throughout the day',                             accent: '#2563EB' },
    { icon: 'activity',  text: 'Regular blood pressure checks can help track wellness',         accent: '#059669' },
    { icon: 'clipboard', text: 'Keep your list of current medications up to date',              accent: '#7C3AED' },
    { icon: 'users',     text: 'Share health updates with trusted family members',              accent: '#2563EB' },
    { icon: 'calendar',  text: 'Routine check-ins can support everyday peace of mind',          accent: '#059669' },
    { icon: 'file',      text: 'Store important health documents in one accessible place',      accent: '#7C3AED' },
    { icon: 'shield',    text: 'Always consult a licensed professional for medical concerns',   accent: '#2563EB' },
    { icon: 'clock',     text: 'Non-emergency care works best when planned ahead',              accent: '#059669' },
    { icon: 'phone',     text: 'Keep emergency contacts easy to find at all times',             accent: '#7C3AED' },
    { icon: 'heart',     text: 'Small health changes are easier to spot with regular monitoring', accent: '#2563EB' },
  ],
  sq: [
    { icon: 'droplet',   text: 'Qëndroni i hidratuar gjatë gjithë ditës',                      accent: '#2563EB' },
    { icon: 'activity',  text: 'Kontrolli i rregullt i presionit ndihmon monitorimin shëndetësor', accent: '#059669' },
    { icon: 'clipboard', text: 'Mbani listën e barnave aktuale gjithmonë të përditësuar',       accent: '#7C3AED' },
    { icon: 'users',     text: 'Ndani informacionin shëndetësor me anëtarët e besuar të familjes', accent: '#2563EB' },
    { icon: 'calendar',  text: 'Vizitat rutinë ndihmojnë sigurinë dhe qetësinë shëndetësore',   accent: '#059669' },
    { icon: 'file',      text: 'Ruajini dokumentet shëndetësore në një vend lehtë të gjendshëm', accent: '#7C3AED' },
    { icon: 'shield',    text: 'Konsultohuni gjithmonë me profesionist të licencuar',           accent: '#2563EB' },
    { icon: 'clock',     text: 'Kujdesi joemergjent funksionon më mirë kur planifikohet paraprakisht', accent: '#059669' },
    { icon: 'phone',     text: 'Mbani kontaktet e emergjencës lehtë të gjendshme',              accent: '#7C3AED' },
    { icon: 'heart',     text: 'Ndryshimet e vogla shëndetësore vihen re me monitorim të rregullt', accent: '#2563EB' },
  ],
};
