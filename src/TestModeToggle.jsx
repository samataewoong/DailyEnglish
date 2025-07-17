// TestModeToggle.jsx
export default function TestModeToggle() {
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = localStorage.getItem('lastStudyDate');

  const isTodayDone = storedDate === today;

  const toggleLastStudyDate = () => {
    if (isTodayDone) {
      localStorage.removeItem('lastStudyDate');
      alert('🧪 테스트: 오늘 학습 완료 상태를 제거했습니다.');
    } else {
      localStorage.setItem('lastStudyDate', today);
      alert('🧪 테스트: 오늘 학습 완료 상태로 설정했습니다.');
    }
    window.location.reload(); // 상태 즉시 반영
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={toggleLastStudyDate}>
        {isTodayDone
          ? '✅ 학습 완료 → ❌ 미완료 (테스트)'
          : '❌ 미완료 → ✅ 완료 (테스트)'}
      </button>
    </div>
  );
}
