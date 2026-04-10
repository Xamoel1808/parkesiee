import nodemailer from 'nodemailer';

/**
 * Crée et retourne un transporteur Nodemailer configuré via les variables d'environnement.
 * Supporte Gmail, SMTP générique, ou Ethereal (test) si pas de config.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('⚠️  SMTP non configuré — emails simulés dans la console.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Envoie un email à une liste de destinataires.
 * Si SMTP non configuré, affiche le contenu dans la console (mode dev).
 */
export async function sendMail({ to, subject, html }) {
  const transporter = createTransporter();

  if (!transporter) {
    // Mode dev : simulation console
    console.log('─'.repeat(60));
    console.log(`📧 [MAIL SIMULÉ] À : ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`   Sujet : ${subject}`);
    console.log(`   Corps (HTML) :\n${html.replace(/<[^>]+>/g, '').trim().slice(0, 300)}...`);
    console.log('─'.repeat(60));
    return { simulated: true };
  }

  const info = await transporter.sendMail({
    from: `"Parking ESIEE-IT" <${process.env.SMTP_USER}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  });

  console.log(`📧 Email envoyé : ${info.messageId}`);
  return info;
}

/**
 * Template HTML pour la notification de fermeture du parking.
 */
export function buildClosureEmailHtml({ reason, startDate, endDate, userName = '' }) {
  const fmt = (d) => { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
  const isSameDay = startDate === endDate;
  const period = isSameDay
    ? `le <strong>${fmt(startDate)}</strong>`
    : `du <strong>${fmt(startDate)}</strong> au <strong>${fmt(endDate)}</strong>`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Fermeture du Parking ESIEE-IT</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:8px;">🔒</div>
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Fermeture du Parking</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">ESIEE-IT — Information importante</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${userName ? `<p style="color:#e2e8f0;margin:0 0 16px;">Bonjour <strong>${userName}</strong>,</p>` : ''}
              <p style="color:#e2e8f0;margin:0 0 20px;line-height:1.6;">
                Nous vous informons que le parking ESIEE-IT sera <strong style="color:#f59e0b;">fermé</strong> ${period}.
              </p>

              <!-- Info box -->
              <table width="100%" style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;color:#f59e0b;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">📋 Motif</p>
                    <p style="margin:0;color:#e2e8f0;font-size:16px;font-weight:600;">${reason}</p>
                    <hr style="border:none;border-top:1px solid rgba(245,158,11,0.2);margin:14px 0;"/>
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:13px;">Période concernée</p>
                    <p style="margin:0;color:#e2e8f0;font-size:15px;font-weight:500;">${isSameDay ? fmt(startDate) : `${fmt(startDate)} → ${fmt(endDate)}`}</p>
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 8px;">
                Toute réservation existante sur cette période reste enregistrée mais le parking ne sera pas accessible.
                Aucune nouvelle réservation ne sera acceptée pour ces dates.
              </p>
              <p style="color:#94a3b8;font-size:14px;margin:0;">
                En cas de question, contactez l'administration.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0;">
                🅿️ Parking ESIEE-IT — Système de gestion automatisé<br/>
                Vous recevez cet email car vous êtes inscrit sur la plateforme.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
