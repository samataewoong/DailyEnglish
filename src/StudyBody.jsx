import FeedbackMessage from './FeedbackMessage';
import { highlightErrors } from './highlightErros';
import { getShortMessage } from './getShortMessage';

export default function StudyBody({
    koreanText,
    myEng,
    setMyEng,
    handleCheck,
    isLoading,
    gResult,
    similarity,
    answerEng,
    showAnswer,
    setShowAnswer,
    finish,
    setResult,
    start,
}) {
    return (
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
                <button onClick={handleCheck} disabled={isLoading}>
                    {isLoading ? '검사 중...' : '체크'}
                </button>
            </p>

            {/* 로딩 메시지 */}
            {isLoading && <p>⏳ 잠시만요...</p>}

            {/* 통합 피드백 메시지 */}
            {!isLoading && gResult && similarity !== null && (
                <FeedbackMessage similarity={similarity} gResult={gResult} setResult={setResult}/>
            )}

            {/* 문법 상세 설명 (오류가 있을 경우만) */}
            {!isLoading && gResult && gResult.matches?.length > 0 && (
                <div>
                    <h3>문법 제안</h3>
                    <p>{highlightErrors(gResult.matches[0]?.context.text || myEng, gResult.matches)}</p>
                    <ul>
                        {gResult.matches.map((match, index) => (
                            <li key={index}>
                                <strong>{match.message}</strong><br />
                                {getShortMessage(match)}<br />
                                ⤷ 제안: {match.replacements?.map(r => r.value).join(', ') || '없음'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 정답 보기 버튼과 정답 내용 */}
            {!isLoading && !showAnswer && answerEng && (
                <button onClick={() => setShowAnswer(true)}>정답 보기</button>
            )}

            {!isLoading && showAnswer && answerEng && (
                <p>정답: {answerEng}</p>
            )}

            {showAnswer && (
                <button onClick={finish}>저장</button>
            )}
        </div>
    );
}
