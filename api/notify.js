export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const origin = req.headers.origin || '';
  if (!['https://fantamatrimonio.vercel.app','http://localhost:3000'].includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { title, body } = req.body;
  if (!body) return res.status(400).json({ error: 'Missing body' });
  try {
    const r = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer os_v2_app_oc5oifr4cffxvnn2slgj2r5ldyqyhuaph4gekrfaijj7jzwbnhnlxf36u7seiq6j7arituipsxiyxorh67rysrhoea4pg62aaay4uxi'
      },
      body: JSON.stringify({
        app_id: '70bae416-3c11-4b7a-b5ba-92cc9d47ab1e',
        included_segments: ['Total Subscribed'],
        headings: { it: title || '💍 Fantamatrimonio', en: title || '💍 Fantamatrimonio' },
        contents: { it: body, en: body },
        url: 'https://fantamatrimonio.vercel.app/'
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: data });
    return res.status(200).json({ success: true, recipients: data.recipients });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
