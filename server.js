const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir archivos estáticos (index.html, styles.css, script.js)

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY no está definida en .env');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'message es requerido' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7
      }
    };

    console.log(`[Chat] Enviando mensaje a Gemini: "${message.substring(0, 50)}..."`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log(`[Chat] Status: ${response.status}, Response: ${responseText.substring(0, 200)}`);

    if (!response.ok) {
      console.error(`[Error] Respuesta no-OK de Gemini: ${responseText}`);
      return res.status(response.status).json({ error: `Error ${response.status}: ${responseText}` });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(`[Error] No se pudo parsear JSON: ${responseText}`);
      return res.status(500).json({ error: 'Respuesta inválida de Gemini API' });
    }
    
    // Extraer el texto de la respuesta de Gemini
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      console.log(`[Chat] Respuesta: "${reply.substring(0, 50)}..."`);
      return res.json({ reply });
    }
    
    console.error(`[Error] Formato inesperado en respuesta:`, data);
    return res.status(500).json({ error: 'Formato inesperado en la respuesta de Gemini.' });
  } catch (err) {
    console.error('[Proxy error]:', err);
    return res.status(502).json({ error: `Error conectando a Gemini API: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${PORT}`);
  console.log(`Abre http://localhost:${PORT} en tu navegador`);
  console.log(`API key configurada: ${GEMINI_API_KEY.substring(0, 10)}...`);
});



