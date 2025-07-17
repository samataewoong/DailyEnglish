import { useState } from "react";
import { supabase } from "./supabase"; // 🔹 supabase import 확인!

export default function CreateAccount() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState('');
  const [userName, setUserName] = useState('');

  const joinButton = async () => {
    if (!id || !pw || !userName) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    const { data, error } = await supabase.from('users').insert([{
      login_id: id,
      password: pw,
      username: userName,
    }]);

    if (error) {
      console.error('❌ 회원가입 실패', error);
      alert("회원가입에 실패했어요.");
      return;
    }

    alert("✅ 회원가입 완료!");
    window.location.href = '/DailyEnglish/login'; // ✅ return 이후로 위치 수정
  };

  return (
    <>
      <div className="CAHeader">
        <h1>Welcome!</h1>
      </div>
      <div className="CABody">
        <p>
          ID : <input type="text" onChange={(e) => setId(e.target.value)} />
        </p>
        <p>
          PW : <input type="password" onChange={(e) => setPw(e.target.value)} />
        </p>
        <p>
          NAME : <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </p>
      </div>
      <div className="CAButtons">
        <button onClick={joinButton} className="accountCreate">
          회원가입
        </button>
      </div>
    </>
  );
}
