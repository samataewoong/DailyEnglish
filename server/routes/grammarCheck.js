// server/routes/grammarCheck.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// 문법 검사 API
router.post('/grammar-check', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '검사할 문장이 없습니다.' });
  }

  try {
    const response = await axios.post(
      'https://api.languagetool.org/v2/check',
      new URLSearchParams({
        text: text,
        language: 'en',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ LanguageTool 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '문법 검사 요청 실패' });
  }
});

module.exports = router;
