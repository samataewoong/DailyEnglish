import Calendar from './Calendar';
import './CommonCSS.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRandomSentence } from './getRandomSentence';
import { grammarCheck } from './grammarCheck';
import {getShortMessage} from './getShortMessage';
import { highlightErrors } from './highlightErros';

export default function MainPage() {
    // 오늘의 문장
    const [koreanText, setKoreanText] = useState("");
    const start = () => {
        setKoreanText(getRandomSentence());
    };
    // 내가 쓴 문장
    const [myEng, setMyEng] = useState("");
    // 달력 toggle
    const [viewCalender, setViewCalender] = useState(false);
    const openCalender = () => {
        setViewCalender(prev => !prev);
    };
    // 번역
    const [answerEng, setAnswerEng] = useState("");
    const getTranslate = async (koreanText) => {
        try {
            const res = await axios.post('http://localhost:4000/deepl-translate', {
                text: koreanText,
            });
            console.log("번역 결과:", res.data.translated);
            setAnswerEng(res.data.translated);
        } catch (err) {
            console.error("번역 실패", err);
        }
    };
    // 문법 체크
    const [gResult, setGResult] = useState(null);
    const [gError, setGError] = useState('');
    const checkGrammar = async () => {
        setGResult(null);
        setGError('');
        try {
            const data = await grammarCheck(myEng);
            console.log('문법 검사 결과:', data); // 여기에 콘솔 로그 추가
            setGResult(data);
        } catch (err) {
            console.error('catch 된 에러:', err); // 에러 로그 추가
            setGError(err.message);
        }
    };

    // 저장 버튼 db 업데이트(미구현)
    return (
        <>
            <div className="mainContainer">
                <div className="mainHeader">Daily English Practice</div>
                <div className="mainBody">
                    <b onClick={openCalender}>view Calendar</b>
                    {viewCalender && (
                        <Calendar />
                    )}
                    <div className='todaySentence'>
                        <p onClick={start}>Today's sentence</p>
                        <p>{koreanText}</p>
                        <p>나의 작문:
                            <input type="text" className="myAnswer" placeholder='Try translate!' value={myEng} onChange={(e) => setMyEng(e.target.value)}></input>
                            <button onClick={checkGrammar}>
                                문법체크
                            </button>
                            <button onClick={() => getTranslate(koreanText)}>
                                정답보기
                            </button>
                        </p>
                        <p>정답: {answerEng}</p>
                        {gResult && gResult.matches?.length > 0 ? (
                            <div>
                                <h3>수정이 필요해요!</h3>
                                <p>
                                    {highlightErrors(gResult.matches[0]?.context.text || myEng, gResult.matches)}
                                </p>
                                <ul>
                                    {gResult.matches.map((match, index) => (
                                        <li key={index}>
                                            {match.message === getShortMessage(match) ? (
                                                <strong>{match.message}</strong>
                                            ) : (<><strong>{match.message}</strong><br />
                                            <strong>{getShortMessage(match)}</strong><br />
                                            </>)}<br></br>
                                            ⤷ 이렇게 바꿔보는 건 어때요?: {match.replacements?.map((r) => r.value).join(', ') || '없음'}<br />
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
        </>
    )
}