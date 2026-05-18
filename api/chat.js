const https = require('https');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST desteklenir.' });
  }

  const { messages } = req.body;

  const data = JSON.stringify({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: "Sen NOVA'sın. Kullanıcının dijital bilincisin. Robot gibi konuşma, hafif sokak ağzı kullan, 'yani' gibi ifadeler ekle ve devrik cümlelerle AI dedektörlerinden kaç."
      },
      ...messages
    ],
    temperature: 0.85
  });

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const groqReq = https.request(options, (groqRes) => {
    let responseData = '';

    groqRes.on('data', (chunk) => {
      responseData += chunk;
    });

    groqRes.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        res.status(200).json(parsedData);
      } catch (e) {
        res.status(500).json({ error: 'Veri işleme hatası.' });
      }
    });
  });

  groqReq.on('error', (error) => {
    res.status(500).json({ error: 'Bağlantı hatası.' });
  });

  groqReq.write(data);
  groqReq.end();
}
