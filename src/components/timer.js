import React, {useEffect, useState} from 'react';
var Interval;
export default function Countdown({counter, onFinish, style = 'timer'}) {
  const [value, setValue] = useState(counter);
  useEffect(() => {
    Interval = setInterval(() => {
      let hours = Math.floor(counter / (60 * 60));
      let minutes = Math.floor((counter / 60) % 60);
      let seconds = Math.floor(counter % 60);
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      setValue(hours + 'h ' + minutes + 'm ' + seconds + 's');
      if (--counter < 0) {
        onFinish();
      }
    }, 1000);
    return () => {
      clearInterval(Interval);
    };
  }, [counter]);

  return <span>{value}</span>;
}
