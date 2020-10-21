import React from 'react';

//***** Common component for error message */
export default function ErrorMessage({text, className = 'error-line', style}) {
  return (
    <div className={className}>
      <p
        style={{
          ...{
            fontSize: 12,
            letterSpacing: 0,
            fontFamily: 'Mulish-Regular',
            textAlign: 'right',
            color: 'red',
            padding: 0,
          },
          ...style,
        }}
      >
        {text}
      </p>
    </div>
  );
}
