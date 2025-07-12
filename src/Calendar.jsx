import { useState } from 'react';
import './CommonCSS.css';
export default function Calendar() {
    const [date, setDate] = useState(new Date());
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // 해당 달 마지막 날짜
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        const week = calendarDays.slice(i, i + 7);
        while (week.length < 7) {
            week.push(null);
        }
        rows.push(week);
    }
    console.log("rows:", rows);
    // 이전 달 이동
    const prevMonth = () => {
        setDate(new Date(year, month - 1, 1));
    };
    // 다음 달 이동
    const nextMonth = () => {
        setDate(new Date(year, month + 1, 1));
    };

    const days = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const thisMonth = days[month];

    const today = new Date(); // 오늘 날짜 변수

    return (
        <div className="calendar">
            <div className="buttonContainer">
                <button onClick={prevMonth}>이전</button>
                <h2>{year}.{thisMonth}</h2>
                <button onClick={nextMonth}>다음</button>
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((day, idx) => (
                                <td key={idx} style={{
                                    backgroundColor:
                                        day === today.getDate() &&
                                            month === today.getMonth() &&
                                            year === today.getFullYear()
                                            ? '#aaf'
                                            : 'transparent',
                                }}>
                                    {day || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
