import React, { useState, useEffect } from 'react';
import styles from './pomodoro.module.scss';

type TPomodoroRunningType = 'pomodoro' | 'shortBreak' | 'longBreak';

const mockSetting = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(mockSetting.pomodoro);
  const [runningType, setRunningType] = useState<TPomodoroRunningType>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const tomatoWorkLongBreakCalling = 4;
  let tomatoWorkCounter = 0;

  function changeRunningType(next: TPomodoroRunningType, stop = true) {
    if (runningType === next) {
      return;
    } else {
      setIsRunning(stop ? false : isRunning);
      setRunningType(next);
      setSeconds(mockSetting[next]);
    }
  }

  function start() {
    setIsRunning(true);
  }

  function stop() {
    setIsRunning(false);
    setSeconds(mockSetting[runningType]);
  }

  function skip() {
    switch (runningType) {
      case 'pomodoro':
        tomatoWorkCounter++;
        if (tomatoWorkCounter % tomatoWorkLongBreakCalling === 0) {
          changeRunningType('longBreak');
        } else {
          changeRunningType('shortBreak');
        }
        break;
      case 'shortBreak':
        changeRunningType('pomodoro');
        break;
      case 'longBreak':
        changeRunningType('pomodoro');
    }
  }

  function run() {
    if (seconds > 1) {
      setSeconds((s) => --s);
    } else {
      switch (runningType) {
        case 'pomodoro':
          tomatoWorkCounter++;
          if (tomatoWorkCounter % tomatoWorkLongBreakCalling === 0) {
            changeRunningType('longBreak', false);
          } else {
            changeRunningType('shortBreak', false);
          }
          break;
        case 'shortBreak':
          changeRunningType('pomodoro', false);
          break;
        case 'longBreak':
          changeRunningType('pomodoro', false);
      }
    }
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  }

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(run, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className={styles.reactPomodoro}>
      <ul className={styles.reactPomodoro__menu}>
        <li className={runningType === 'pomodoro' ? styles['pomodoroItem--active'] : ''}>
          <a onClick={() => changeRunningType('pomodoro')}>Pomodoro</a>
        </li>
        <li className={runningType === 'shortBreak' ? styles['pomodoroItem--active'] : ''}>
          <a onClick={() => changeRunningType('shortBreak')}>S.Break</a>
        </li>
        <li className={runningType === 'longBreak' ? styles['pomodoroItem--active'] : ''}>
          <a onClick={() => changeRunningType('longBreak')}>L.Break</a>
        </li>
      </ul>
      <div className={styles.reactPomodoro__timer}>{formatTime(seconds)}</div>
      <div className={styles['reactPomodoro__action-container']}>
        <button className={styles.reactPomodoro__action} onClick={isRunning ? stop : start}>
          <span className="material-icons">{isRunning ? 'stop' : 'play_arrow'}</span>
        </button>
        <button className={styles.reactPomodoro__action} onClick={skip}>
          <span className="material-icons">skip_next</span>
        </button>
      </div>
    </div>
  );
}
