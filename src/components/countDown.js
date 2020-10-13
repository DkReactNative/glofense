import React, {useEffect, useState} from 'react';
var Interval;
export default function Countdown({counter, onFinish, style}) {
  const [value, setValue] = useState('NA');
  var timer = counter;
  useEffect(() => {
    Interval = setInterval(() => {
      setValue(timer);
      if (--timer < 0) {
        clearInterval(Interval);
        // onFinish();
      }
    }, 1000);
    return () => {
      clearInterval(Interval);
    };
  }, [timer]);

  return <p style={style}>{value}</p>;
}
