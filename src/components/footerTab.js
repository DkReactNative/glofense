import React from 'react';
import {Link} from 'react-router-dom';
export default function () {
  return (
    <div className="web-bg">
      <div className="download-app-right">
        <div className="logoright">
          <Link to={`/auth`}>
            <img
              src={require('../assets/img/logo.png')}
              alt="#"
              className="img-fluid"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
