import React from 'react';
export default function CmsWarpper({title}) {
  return (
    <div className="cms-container">
      <div style={{margin: '80 auto', textAlign: 'center'}}>
        <img
          src="http://13.235.72.118:6061/static/logo/adminlogo.png"
          width={100}
          height={100}
          alt="Web Logo"
        />
      </div>
      <div style={{margin: '50px auto', textAlign: 'center', fontSize: '28px'}}>
        <div className="box">
          <h2> {title} </h2>
          <div style={{textAlign: 'left'}} id="cms-content"></div>
        </div>
      </div>
    </div>
  );
}
