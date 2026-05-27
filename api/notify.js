// api/notify.js — Vercel Serverless Function
// Fa da proxy tra admin.html e OneSignal (evita il blocco CORS)

export default async function handler(req, res) {
  // Permetti solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protezione base: controlla che arrivi dal nostro dominio
  const origin = req.headers.origin || '';
  const allowed = ['https://fantamatrimonio.vercel.app', 'http://localhost:3000'];
  if (!allowed.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { title, body } = req.body;
  if (!body) {
    return res.status(400).json({ error: 'Missing body' });
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Key q5sb3stwuuifuyxdhhty57lea'
      },
      body: JSON.stringify({
        app_id: '70bae416-3c11-4b7a-b5ba-92cc9d47ab1e',
        included_segments: ['Total Subscribed'],
        headings: { it: title || '💍 Fantamatrimonio', en: title || '💍 Fantamatrimonio' },
        contents: { it: body, en: body },
        url: 'https://fantamatrimonio.vercel.app/',
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors });
    }

    return res.status(200).json({ success: true, recipients: data.recipients });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
