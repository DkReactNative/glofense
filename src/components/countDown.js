import React, {useEffect, useState} from 'react';
var Interval;
export default function Countdown({counter, onFinish, style="timer"}) {
  const [value, setValue] = useState(counter);
  var timer = counter;
  useEffect(() => {
    Interval = setInterval(() => {
      setValue(timer);
      if (--timer < 0) {
        clearInterval(Interval);
        onFinish();
      }
    }, 1000);
    return () => {
      clearInterval(Interval);
    };
  }, [counter]);

  return <span className={style}>{value}</span>;
}
