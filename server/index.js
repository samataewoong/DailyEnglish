const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const deeplTranslateRouter = require('./routes/deeplTranslate');
const grammarCheckRouter = require('./routes/grammarCheck');
const similarityRouter = require('./routes/similarity');
dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 🔁 번역 요청 API
app.use('/deepl-translate', deeplTranslateRouter);

// 문법 검사 API
app.use('/check-grammar', grammarCheckRouter);

// 유사도 검사
app.use('/similarity', similarityRouter);

app.listen(PORT, () => {
  console.log(`✅ 번역 서버 실행 중: http://localhost:${PORT}`);
});
