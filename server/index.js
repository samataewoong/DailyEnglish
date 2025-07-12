const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 🔁 번역 요청 API
app.post('/deepl-translate', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`✅ 번역 서버 실행 중: http://localhost:${PORT}`);
});
