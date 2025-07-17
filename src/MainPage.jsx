import Calendar from './Calendar';
import './CommonCSS.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getRandomSentence } from './getRandomSentence';
import { grammarCheck } from './grammarCheck';
import { getShortMessage } from './getShortMessage';
import { highlightErrors } from './highlightErros';
import FeedbackMessage from './FeedbackMessage';
import StudyBody from './StudyBody';
import { supabase } from './supabase';
import TestModeToggle from './TestModeToggle';


export default function MainPage() {
  const [koreanText, setKoreanText] = useState("");
  const [myEng, setMyEng] = useState("");
  const [viewCalender, setViewCalender] = useState(false);
  const [answerEng, setAnswerEng] = useState("");
  const [gResult, setGResult] = useState(null);
  const [gError, setGError] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todayStudy, setTodayStudy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [result, setResult] = useState("");
  const [shortMessages, setShortMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [isLogined, setIsLogined] = useState(false);

  const calendarRef = useRef(null);
  const buttonRef = useRef(null); // 버튼 ref 추가

  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'LOGIN_SUCCESS') {
        setUser(event.data.user);
        setIsLogined(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const loginedUser = localStorage.getItem('user');
    if (loginedUser) {
      setUser(JSON.parse(loginedUser));
      setIsLogined(true);
    } else {
      setIsLogined(false);
    }
  }, []);

  useEffect(() => {
    const storedDate = localStorage.getItem('lastStudyDate');
    if (storedDate === today) {
      setTodayStudy(true);
    }
  }, [today]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setViewCalender(false);
      }
    }

    if (viewCalender) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewCalender]);

  const start = () => {
    setKoreanText(getRandomSentence());
    setAnswerEng('');
    setMyEng('');
    setGResult(null);
    setSimilarity(null);
    setShowAnswer(false);
    setIsLoading(false);
  };

  const finish = async () => {
    const dataToInsert = {
      user_id: user.id,
      when: today,
      korean: koreanText,
      english_user: myEng,
      english_ai: answerEng,
      feedback: shortMessages,
      result: result,
    };

    // ✅ 디버깅용 콘솔 로그
    console.log('📦 저장할 데이터:', dataToInsert);

    const { data, error } = await supabase
      .from('study_log')
      .insert([dataToInsert]);

    if (error) {
      console.error('❌ 저장 실패:', error.message);
      alert('저장 중 오류가 발생했어요. 다시 시도해 주세요!');
      return; // 여기서 바로 종료 → 아래 코드 실행 안 됨
    }

    // ✅ 성공한 경우에만 오늘 학습 완료 처리
    localStorage.setItem('lastStudyDate', today);
    setTodayStudy(true);

    console.log('✅ 저장 성공:', data);
    alert('✅ 저장 완료! 오늘 학습이 기록되었어요.');
  };


  const openCalender = () => {
    setViewCalender(prev => !prev);
  };

  const getTranslate = async (koreanText) => {
    try {
      const res = await axios.post('http://localhost:4000/deepl-translate', { text: koreanText });
      setAnswerEng(res.data.translated);
      return res.data.translated;
    } catch (err) {
      console.error("번역 실패", err);
      return null;
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
    if (!userText || !aiText) return null;
    try {
      const res = await axios.post('http://localhost:4000/similarity', {
        user: userText,
        ai: aiText
      });
      setSimilarity(res.data.score);
      return res.data.score;
    } catch (e) {
      console.error('유사도 계산 실패:', e);
      setSimilarity(null);
      return null;
    }
  };

  const handleCheck = async () => {
    setIsLoading(true);
    setGResult(null);
    setSimilarity(null);
    const translated = await getTranslate(koreanText);
    if (translated) {
      await checkSimilarity(myEng, translated);
    }
    await checkGrammar();
    setIsLoading(false);
  };
  // 로그인 창
  const openLoginWindow = () => {
    const loginWindow = window.open(
      '/DailyEnglish/login',
      'LoginWindow',
      'width=400, height=600'
    );
  }
  useEffect(() => {
    if (gResult?.matches?.length > 0) {
      const messages = gResult.matches.map(match => getShortMessage(match));
      const uniqueMessages = [...new Set(messages)];
      setShortMessages(uniqueMessages);
    } else {
      setShortMessages([]);
    }
  }, [gResult]);
  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLogined(false);
    setUser(null);
    window.location.reload(); // 새로고침 or 다른 페이지로 리디렉션
  };

  return (
    <div className="mainContainer">
      <div className="mainHeader">
        <div className="mainHeader-title">Daily English Practice</div>
        {isLogined ? (
          <div className="userGreeting">
            Hi&nbsp;
            <span className="username" onClick={() => alert('프로필 페이지로 이동')}>
              {user?.username}
            </span>
            님&nbsp;!
            <button className="logoutBtn" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        ) : (
          <button onClick={openLoginWindow} className="material-symbols-outlined logInButton">
            account_circle
          </button>
        )}
      </div>
      <TestModeToggle />
      <div className="mainBody">
        <b
          ref={buttonRef}  // 버튼 ref 연결
          style={{ fontSize: '21px', cursor: 'pointer' }}
          onClick={openCalender}
        >
          view Calendar
        </b>
        {viewCalender && (
          <div ref={calendarRef}>
            <Calendar />
          </div>
        )}
        {todayStudy ? (
          <p>✅ 오늘은 이미 연습을 완료했어요! 😊</p>
        ) : (
          <StudyBody
            koreanText={koreanText}
            myEng={myEng}
            setMyEng={setMyEng}
            handleCheck={handleCheck}
            isLoading={isLoading}
            gResult={gResult}
            similarity={similarity}
            answerEng={answerEng}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            finish={finish}
            setResult={setResult}
            start={start}
          />
        )}
      </div>
      <div className="mainFooter">footer</div>
    </div>
  );
}
