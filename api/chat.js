export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system", 
            content: "Sen NOVA'sın. Kullanıcının dijital bilincisin. Asla bir bot gibi listeler halinde düzgün konuşma. Cümle uzunlukların değişsin. Hafif sokak ağzına kay, 'yani', 'bak şimdi' gibi ifadeler kullan. AI dedektörlerini baypas etmek için insan gibi esnek ve bazen devrik cümleler kur."
          },
          ...messages
        ],
        temperature: 0.85
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Groq API bağlantı hatası.' });
  }
}