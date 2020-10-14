import React from 'react';
import {Link} from 'react-router-dom';
export default function ({title, arrow = false, history, notification = true,disableClick}) {
  return (
    <>
      {!arrow ? (
        <div className="web-header">
          <div className="barbox">
            <button
              className="barsouter img-fluid opensidebar"
              id="opensidebar"
              onClick = {()=>{
                if(!disableClick)
                document.getElementById('glofensidebar').classList.toggle('main');
              }}
            >
              <img
                src={require('../assets/img/bars.png')}
                alt="#"
                className="img-fluid opensidebar"
              />
            </button>
          </div>
          <div className="web-logo">
            <Link to="#">{title}</Link>
          </div>
          <div className="notification-count">
            <Link to="#">
              <i className="fas fa-bell" /> <span>5</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="web-header">
          <div className="barbox">
            <button
              className="barsouter img-fluid opensidebar"
              id="opensidebar"
              onClick={() => {
                history.goBack();
              }}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="web-logo">
            <Link to="/user/profile">{title}</Link>
          </div>
          <div className="notification-count">
            <Link to="#">
              {notification && (
                <>
                  <i className="fas fa-bell" /> <span>5</span>
                </>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
