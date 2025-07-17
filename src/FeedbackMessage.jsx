import { useEffect } from 'react';

export default function FeedbackMessage({ similarity, gResult, setResult }) {
  const hasGrammarIssues = gResult.matches?.length > 0;
  const sim = similarity;
  let message = "";
  let summary = ""; // <- 간략한 코드형 결과

  if (!hasGrammarIssues && sim > 0.8) {
    message = "✅ 아주 좋아요! 자연스럽고 의미도 잘 전달됐어요.";
    summary = "Great";
  } else if (!hasGrammarIssues && sim > 0.5) {
    message = "🙂 괜찮아요! 약간 다를 수 있지만 자연스러워요.";
    summary = "Okay";
  } else if (!hasGrammarIssues && sim <= 0.5) {
    message = "⚠️ 문법은 맞지만 의미가 많이 다른 것 같아요.";
    summary = "Misleading";
  } else if (hasGrammarIssues && sim > 0.8) {
    message = "⚠️ 의미는 맞지만 문법적으로 수정이 필요해요.";
    summary = "GrammarOnly";
  } else {
    message = "❗ 해석과 문법 모두 수정해보는 게 좋겠어요.";
    summary = "Wrong";
  }

  useEffect(() => {
    setResult?.(summary); // <- 요약값만 넘김
  }, [summary, setResult]);

  return <p>{message}</p>;
}
