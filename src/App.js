import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分を秒で表現
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const workTime = 25 * 60; // 25分
  const shortBreak = 5 * 60; // 5分
  const longBreak = 15 * 60; // 15分
  const pomodorosBeforeLongBreak = 4; // 長い休憩までのポモドーロ回数

  // 時間表示をMM:SS形式に変換
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // タイマーの処理
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 時間切れの処理
      audioRef.current.play();
      
      if (isWork) {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        
        // 4回に1回は長い休憩、それ以外は短い休憩
        if (newCount % pomodorosBeforeLongBreak === 0) {
          setTimeLeft(longBreak);
        } else {
          setTimeLeft(shortBreak);
        }
      } else {
        // 休憩後の作業時間
        setTimeLeft(workTime);
      }
      
      setIsWork(!isWork);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isActive, isWork, pomodoroCount]);

  // タイマーの開始/一時停止
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // タイマーのリセット
  const resetTimer = () => {
    clearTimeout(timerRef.current);
    setIsActive(false);
    setTimeLeft(isWork ? workTime : shortBreak);
  };

  // 作業/休憩の切り替え
  const switchMode = (isWorkMode) => {
    clearTimeout(timerRef.current);
    setIsActive(false);
    setIsWork(isWorkMode);
    setTimeLeft(isWorkMode ? workTime : shortBreak);
  };

  return (
    <div className={`app ${isWork ? 'work' : 'break'}`}>
      <div className="container">
        <h1>Pomodoro Timer</h1>
        
        <div className="mode-selector">
          <button 
            className={`mode-btn ${isWork ? 'active' : ''}`}
            onClick={() => switchMode(true)}
          >
            作業
          </button>
          <button 
            className={`mode-btn ${!isWork ? 'active' : ''}`}
            onClick={() => switchMode(false)}
          >
            休憩
          </button>
        </div>

        <div className="timer">
          <h2>{isWork ? '作業時間' : '休憩時間'}</h2>
          <div className="time-display">
            {formatTime(timeLeft)}
          </div>
          <div className="controls">
            <button onClick={toggleTimer}>
              {isActive ? '一時停止' : '開始'}
            </button>
            <button onClick={resetTimer}>リセット</button>
          </div>
        </div>

        <div className="pomodoro-count">
          完了したポモドーロ: {pomodoroCount}
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"
        preload="auto"
      />
    </div>
  );
}

export default App;
