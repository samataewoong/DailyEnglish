import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage'
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';
import './CommonCSS.css';
function App() {

  return (
    <BrowserRouter basename="/DailyEnglish">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/signup" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
