// utils/highlightErrorsFromContext.js
import React from 'react';

export function highlightErrors(contextText, matches) {
  if (!matches || matches.length === 0) return [<span key="full">{contextText}</span>];

  let result = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const { offset, length, message } = match;
    const before = contextText.slice(lastIndex, offset);
    const error = contextText.slice(offset, offset + length);
    lastIndex = offset + length;

    result.push(<span key={`before-${index}`}>{before}</span>);
    result.push(
      <span
        key={`error-${index}`}
        style={{
          backgroundColor: '#ffe0e0',
          color: 'red',
          textDecoration: 'underline',
        }}
      >
        {error}
      </span>
    );
  });

  // 나머지 텍스트 추가
  result.push(<span key="last">{contextText.slice(lastIndex)}</span>);
  return result;
}
