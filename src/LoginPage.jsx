import { useState } from 'react';
import { supabase } from './supabase';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const handleLogin = async () => {
        const { data, error } = await supabase.from('users').select('*')
            .eq('login_id', id).single();

        if (data && data.password === pw) {
            localStorage.setItem('user', JSON.stringify(data));
            window.opener.postMessage({ type: 'LOGIN_SUCCESS', user: data }, '*'); // 부모에게 메시지 전달
            alert('로그인 성공');
            window.close();
        } else {
            alert('로그인 실패');
        }
    };

    // 회원가입 창
    const openSignupWindow = () => {
       window.location.href='/DailyEnglish/login/signup';
    }
    return (
        <div className="loginWindow">
            <div className="loginHeader">
                <h>Hello!</h>
            </div>
            <div className="loginBody">
                <div className="inputContianer">
                    <p>
                        ID: <input className="idInput" type="text" onChange={(e) => setId(e.target.value)} />
                    </p>
                    <p>
                        PW: <input className="pwInput" type="password" onChange={(e) => setPw(e.target.value)} />
                    </p>
                </div>
                <div className="buttonArea">
                    <button onClick={handleLogin}>Login</button>
                    <button>비밀번호 찾기</button>
                    <button onClick={openSignupWindow}>회원가입</button>
                </div>
            </div>
        </div>
    );
}