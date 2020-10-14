import React, {useEffect, useState} from 'react';
import {Line} from 'rc-progress';

var Interval;
export default function QuestionResponseTimer({
  counter,
  style = 'timer',
  status,
  onFinish10SecondTimer,
}) {
  const [value, setValue] = useState(counter);
  const [progress, setprogress] = useState(100);
  var timer = counter;
  useEffect(() => {
    if (status) {
      Interval = setInterval(() => {
        setValue(timer);
        setprogress((timer * 100) / counter);
        if (--timer < 0) {
          clearInterval(Interval);
          onFinish10SecondTimer();
          setprogress(100)
        }
      }, 1000);
    } else {
      clearInterval(Interval);
    }
    return () => {
      clearInterval(Interval);
    };
  }, [counter, status]);
  return (
    <div className="statusouter">
      <div className="d-flex mt-3">
        <Line
          percent={progress}
          strokeWidth="1"
          trailWidth="1"
          trailColor="#ccc"
          strokeColor="#fed613"
          style={{width: '100%', height: 10, borderRadius: 5, marginRight: 5}}
        />
        <div id="fullscreen"></div>
        <span className="watchtimer">
          <i className="fas fa-clock" />
        </span>
      </div>
      {status && (
        <div className="d-flex align-items-center">
          <span className={style}>{value} Second</span>
        </div>
      )}
    </div>
  );
}
