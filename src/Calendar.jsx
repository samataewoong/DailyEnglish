import { useState, useRef } from 'react';
import './CommonCSS.css';
import StudyLogPopup from './StudyLogPopup';

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const [studied, setStudied] = useState(true);

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    const week = calendarDays.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    rows.push(week);
  }

  const days = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const thisMonth = days[month];

  const today = new Date();

  // popup 상태
  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    day: null,
    coords: { x: 0, y: 0 }
  });

  // 캘린더 요소 참조 (팝업 위치 계산용)
  const calendarRef = useRef(null);

  const prevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  // 날짜 클릭 시 팝업 표시
  const showLog = (e, day) => {
    if (!day) return;

    const rect = e.target.getBoundingClientRect();
    setPopupInfo({
      visible: true,
      day,
      coords: { x: rect.left, y: rect.top }
    });
  };

  return (
    <div className="calendar" ref={calendarRef} style={{ position: 'relative' }}>
      <div className="buttonContainer">
        <button className="arrowButton" onClick={prevMonth}>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2>{year}.{thisMonth}</h2>
        <button className="arrowButton" onClick={nextMonth}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
            <th>Thu</th><th>Fri</th><th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((day, idx) => (
                <td
                  key={idx}
                  className={studied ? 'studied' : ''}
                  style={{
                    backgroundColor:
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear()
                        ? '#aaf'
                        : '',
                  }}
                  onClick={studied ? (e) => showLog(e, day) : undefined}
                >
                  {day || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {popupInfo.visible && calendarRef.current && (
        <StudyLogPopup
          day={popupInfo.day}
          year={year}
          month={month}
          coords={popupInfo.coords}
          parentRect={calendarRef.current.getBoundingClientRect()}
          onClose={() =>
            setPopupInfo({ visible: false, day: null, coords: { x: 0, y: 0 } })
          }
        />
      )}
    </div>
  );
}
