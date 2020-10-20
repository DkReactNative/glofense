import React from 'react';
import {Link} from 'react-router-dom';
export default function TabBar({active}) {
  return (
    <div className="footer-tab footer_height">
      <div className="list-group" id="myList" role="tablist">
        <Link
          className={`'list-group-item list-group-item-action homeicon ' ${
            active === 'home' ? 'active' : ''
          }`}
          to="/user"
        >
          <span>Home</span>
        </Link>
        <Link
          className={`"list-group-item list-group-item-action mycontest " ${
            active === 'contest' ? 'active' : ''
          }`}
          to="#"
        >
          <span>My Contest</span>
        </Link>
        <Link
          className={`"list-group-item list-group-item-action news " ${
            active === 'news' ? 'active' : ''
          }`}
          to="/user/news"
        >
          <span>News</span>
        </Link>
        <Link
          className={`"list-group-item list-group-item-action profiles " ${
            active === 'profile' ? 'active' : ''
          }`}
          to="/user/profile"
        >
          <span>Profile</span>
        </Link>
        <Link
          className={`"list-group-item list-group-item-action moreopctions " ${
            active === 'more' ? 'active' : ''
          }`}
          to="/user/more"
        >
          <span>More</span>
        </Link>
      </div>
    </div>
  );
}
