import Calendar from './Calendar';
import './CommonCSS.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRandomSentence } from './getRandomSentence';

export default function MainPage() {
    // 오늘의 문장
    const [koreanText, setKoreanText] = useState("");
    const start = () => {
        setKoreanText(getRandomSentence());
    };
    
    // 달력 toggle
    const [viewCalender, setViewCalender] = useState(false);
    const openCalender = () => {
        setViewCalender(prev => !prev);
    };
    // 번역
    const [myEng, setMyEng] = useState("");
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

    // 저장 버튼 db 업데이트
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
                            <input type="text" className="myAnswer" placeholder='Try translate!' onChange={(e) => setMyEng(e.target.value)}></input>     
                            <button onClick={() => getTranslate(koreanText)}>
                                정답 보기
                            </button>      
                        </p>
                        
                        <p>{answerEng}</p>
                        <button>저장</button>
                    </div>
                </div>
                <div className="mainFooter">footer</div>
            </div>
        </>
    )
}