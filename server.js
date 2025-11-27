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
  console.error('❌ ERROR: GEMINI_API_KEY no está definida en .env');
  console.error('Por favor, copia .env.example a .env y añade tu API key.');
  process.exit(1);
}

if (GEMINI_API_KEY === 'tu_api_key_aqui' || GEMINI_API_KEY.length < 20) {
  console.error('❌ ERROR: GEMINI_API_KEY parece estar vacía o inválida');
  console.error('Abre .env y reemplaza "tu_api_key_aqui" con tu clave real de: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'message es requerido' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ]
    };

    console.log(`[Chat] Enviando: "${message.substring(0, 50)}..."`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log(`[Chat] Status: ${response.status}`);
    console.log(`[Chat] Response (primeros 300 chars): ${responseText.substring(0, 300)}`);

    if (!response.ok) {
      console.error(`❌ Error de Gemini API (${response.status}): ${responseText.substring(0, 200)}`);
      
      // Si es HTML, probablemente sea error del servidor
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        return res.status(response.status).json({ error: 'Gemini API devolvió HTML. Verifica tu API key en: https://aistudio.google.com/app/apikey' });
      }
      
      try {
        const errData = JSON.parse(responseText);
        return res.status(response.status).json({ error: errData.error?.message || responseText });
      } catch (e) {
        return res.status(response.status).json({ error: `Error ${response.status}: ${responseText}` });
      }
    }

    if (!responseText) {
      console.error('❌ Respuesta vacía de Gemini');
      return res.status(500).json({ error: 'Gemini devolvió una respuesta vacía' });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(`❌ JSON Parse error: ${responseText.substring(0, 100)}`);
      return res.status(500).json({ error: `Respuesta inválida de Gemini: ${responseText.substring(0, 100)}` });
    }
    
    // Extraer el texto de la respuesta de Gemini
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      console.log(`✅ Respuesta OK: "${reply.substring(0, 50)}..."`);
      return res.json({ reply });
    }
    
    console.error(`❌ Formato inesperado:`, JSON.stringify(data).substring(0, 200));
    return res.status(500).json({ error: 'Formato inesperado en la respuesta de Gemini.' });
  } catch (err) {
    console.error('❌ [Proxy error]:', err.message);
    return res.status(502).json({ error: `Error conectando a Gemini API: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor proxy escuchando en http://localhost:${PORT}`);
  console.log(`📱 Abre http://localhost:${PORT} en tu navegador`);
  console.log(`🔑 API key: ${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5)}\n`);
});




