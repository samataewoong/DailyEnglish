export function getShortMessage(match) {
  const desc = match.rule.description.toLowerCase();

  if (desc.includes('base form') || desc.includes('verb form')) {
    return '동사 형태 오류예요!';
  }
  if (desc.includes('tense') || desc.includes('shift')) {
    return '시제 오류예요!';
  }
  if (desc.includes('agreement') || desc.includes('singular') || desc.includes('plural')) {
    return '주어-동사 수일치 오류예요!';
  }
  if (desc.includes('article')) {
    return '관사 사용 오류예요';
  }
  if (desc.includes('everyday') && desc.includes('every day')) {
    return '"everyday" 대신 "every day"를 써야 해요';
  }
  if (desc.includes('spelling')) {
    return '철자 오류입니다';
  }
  if (desc.includes('whitespace') || desc.includes('missing space')) {
    return '띄어쓰기가 잘못됐어요';
  }
  if (desc.includes('punctuation')) {
    return '구두점이 올바르지 않아요';
  }
  if (desc.includes('repetition')) {
    return '단어가 중복됐어요';
  }
  if (desc.includes('capitalization')) {
    return '대문자 사용법을 확인하세요';
  }
  if (desc.includes('preposition') || desc.includes('conjunction')) {
    return '전치사 또는 접속사 사용 오류';
  }
  if (desc.includes('word order')) {
    return '어순이 자연스럽지 않아요';
  }
  if (desc.includes('word usage') || desc.includes('wrong word')) {
    return '적절하지 않은 단어 선택입니다';
  }
  if (desc.includes('missing punctuation')) {
    return '문장 부호가 누락됐어요';
  }
  if (desc.includes('infinitive') || desc.includes('gerund')) {
    return 'to 부정사 또는 동명사 사용 오류예요';
  }
  if (desc.includes('redundancy')) {
    return '중복되는 표현이 있어요';
  }
  if (desc.includes('sentence complexity')) {
    return '문장이 너무 길거나 복잡해요';
  }

  // 기본 반환
  return match.message;
}
