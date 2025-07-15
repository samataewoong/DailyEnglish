// server/routes/similarity.js
require('dotenv').config();
const express = require('express');
const { HfInference } = require('@huggingface/inference');

const router = express.Router();
const hf = new HfInference(process.env.HF_TOKEN);

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (magA === 0 || magB === 0) return 0; // 0으로 나누기 방지
  return dot / (magA * magB);
}

router.post('/', async (req, res) => {
  const { user, ai } = req.body;
  if (!user || !ai) return res.status(400).json({ error: 'user와 ai 문장이 필요합니다.' });

  try {
    // 두 문장에 대해 벡터를 뽑는다
    const [emb1, emb2] = await Promise.all([
      hf.featureExtraction({
        model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        inputs: user,
      }),
      hf.featureExtraction({
        model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        inputs: ai,
      }),
    ]);

    // 벡터는 배열 안에 배열 형태일 수 있으니 첫번째 배열만 사용
    const vector1 = Array.isArray(emb1[0]) ? emb1[0] : emb1;
    const vector2 = Array.isArray(emb2[0]) ? emb2[0] : emb2;

    const score = cosineSimilarity(vector1, vector2);

    res.json({ score });
  } catch (error) {
    console.error('Similarity error:', error.response?.data || error.message || error);
    res.status(500).json({ error: '유사도 계산 실패' });
  }
});

module.exports = router;
