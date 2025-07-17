import React from 'react';
import './CommonCSS.css';

export default function StudyLogPopup({ day, year, month, coords, onClose, parentRect }) {
  if (!day) return null;

  const style = {
    top: coords.y - parentRect.top - 40,
    left: coords.x - parentRect.left,
  };

  return (
    <div className="logPopup" style={style}>
      <div><strong>{year}.{month + 1}.{day}</strong></div>
      <div>정보는 여기에 표시됩니다.</div>
      <button className="date-popup-close-btn" onClick={onClose}>닫기</button>
    </div>
  );
}
