const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/generate', async (req, res) => {
  const target = process.env.TARGET_URL; // e.g. https://generativelanguage.googleapis.com/v1beta2/models/YOUR_MODEL:generate
  const key = process.env.GEMINI_API_KEY; // your API key stored in env

  if (!target || !key) {
    return res.status(500).json({ error: 'Falta TARGET_URL o GEMINI_API_KEY en variables de entorno del servidor.' });
  }

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    // Intentar parsear JSON y devolver tal cual
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch (e) {
      return res.status(response.status).send(text);
    }
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Error conectando al endpoint remoto', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
