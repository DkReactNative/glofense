import React, {useEffect, useState} from 'react';
import Countdown from './countDown';
export default function WaitingUser({counter, style, status, onFinish}) {
  React.useEffect(() => {}, [status, counter]);
  return (
    <div className="web-bg">
      <div className="download-app-right">
        <div className="questionsrightpart">
          <div className="waitingboard">
            <Countdown
              counter={counter}
              style={style}
              status={status}
              onFinish={() => {
                console.log('on finish');
                onFinish();
              }}
            />
            <div className="loader">
              <img
                src={require('../assets/img/Loading-Image.gif')}
                alt="#"
                className="img-fluid"
              />
              <h3>
                <strong>Waiting for opponent to join</strong>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
