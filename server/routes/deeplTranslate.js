// server/routes/deeplTranslate.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// DeepL 번역 API
router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '번역할 문장이 없습니다.' });
  }

  try {
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({
        auth_key: process.env.DEEPL_API_KEY,
        text,
        source_lang: 'KO',
        target_lang: 'EN',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const translated = response.data.translations[0].text;
    res.json({ translated });
  } catch (error) {
    console.error('❌ DeepL 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '번역 요청 실패' });
  }
});

module.exports = router;
