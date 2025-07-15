import Calendar from './Calendar';
import './CommonCSS.css';
import { useState } from 'react';
import axios from 'axios';
import { getRandomSentence } from './getRandomSentence';
import { grammarCheck } from './grammarCheck';
import { getShortMessage } from './getShortMessage';
import { highlightErrors } from './highlightErros';

export default function MainPage() {
  const [koreanText, setKoreanText] = useState("");
  const [myEng, setMyEng] = useState("");
  const [viewCalender, setViewCalender] = useState(false);
  const [answerEng, setAnswerEng] = useState("");
  const [gResult, setGResult] = useState(null);
  const [gError, setGError] = useState('');
  const [similarity, setSimilarity] = useState(null); // ✅ 유사도 추가

  const start = () => {
    setKoreanText(getRandomSentence());
    setAnswerEng('');
    setMyEng('');
    setGResult(null);
    setSimilarity(null);
  };

  const openCalender = () => {
    setViewCalender(prev => !prev);
  };

  const getTranslate = async (koreanText) => {
    try {
      const res = await axios.post('http://localhost:4000/deepl-translate', { text: koreanText });
      setAnswerEng(res.data.translated);
      checkSimilarity(myEng, res.data.translated); // ✅ 번역 이후 유사도 체크
    } catch (err) {
      console.error("번역 실패", err);
    }
  };

  const checkGrammar = async () => {
    setGResult(null);
    setGError('');
    try {
      const data = await grammarCheck(myEng);
      setGResult(data);
    } catch (err) {
      console.error('문법 검사 실패:', err);
      setGError(err.message);
    }
  };

  const checkSimilarity = async (userText, aiText) => {
  if (!userText || !aiText) return;
  try {
    const res = await axios.post('http://localhost:4000/similarity', {
      user: userText,
      ai: aiText
    });
    setSimilarity(res.data.score);
  } catch (e) {
    console.error('유사도 계산 실패:', e);
    setSimilarity(null);
  }
};

  return (
    <div className="mainContainer">
      <div className="mainHeader">Daily English Practice</div>
      <div className="mainBody">
        <b onClick={openCalender}>view Calendar</b>
        {viewCalender && <Calendar />}
        <div className='todaySentence'>
          <p onClick={start}>Today's sentence</p>
          <p>{koreanText}</p>
          <p>나의 작문:
            <input
              type="text"
              className="myAnswer"
              placeholder='Try translate!'
              value={myEng}
              onChange={(e) => setMyEng(e.target.value)}
            />
            <button onClick={checkGrammar}>문법체크</button>
            <button onClick={() => getTranslate(koreanText)}>정답보기</button>
          </p>

          {answerEng && (
            <>
              <p>정답: {answerEng}</p>
              {similarity !== null && (
                <p>
                  🧠 유사도: {(similarity * 100).toFixed(2)}%
                  {similarity > 0.8
                    ? ' ✅ 해석이 아주 좋아요!'
                    : similarity > 0.5
                      ? ' 🙂 괜찮은 해석이에요'
                      : ' ⚠️ 유사도가 낮아요. 다시 시도해볼까요?'}
                </p>
              )}
            </>
          )}

          {gResult && gResult.matches?.length > 0 ? (
            <div>
              <h3>수정이 필요해요!</h3>
              <p>{highlightErrors(gResult.matches[0]?.context.text || myEng, gResult.matches)}</p>
              <ul>
                {gResult.matches.map((match, index) => (
                  <li key={index}>
                    {match.message === getShortMessage(match) ? (
                      <strong>{match.message}</strong>
                    ) : (
                      <>
                        <strong>{match.message}</strong><br />
                        <strong>{getShortMessage(match)}</strong><br />
                      </>
                    )}
                    ⤷ 이렇게 바꿔보는 건 어때요?: {match.replacements?.map(r => r.value).join(', ') || '없음'}<br />
                  </li>
                ))}
              </ul>
            </div>
          ) : (gResult && <p>좋은 해석이에요!</p>)}

          <button>저장</button>
        </div>
      </div>
      <div className="mainFooter">footer</div>
    </div>
  );
}
