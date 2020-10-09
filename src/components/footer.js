import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
console.log(process.env);
export default function Footer(props) {
  const dispatch = useDispatch();
  return (
    <footer>
      <div className="dividers">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <ul className="text-center text-lg-left">
                <li>
                  <Link to={`/`}>Home</Link>
                </li>
                <li>|</li>
                <li>
                  <Link to={`/about`}>About us</Link>
                </li>
                <li>|</li>
                <li>
                  <Link to="#">Services</Link>
                </li>
                <li>|</li>
                <li>
                  <Link to={`/how-it-works`}>How it Works</Link>
                </li>
                <li>|</li>
                <li>
                  <Link to={`/contact`}>Contact Us</Link>
                </li>
                <li>|</li>
                <li>
                  <Link to="#">Book</Link>
                </li>
                <li>|</li>
                <li>
                  <Link
                    to="#"
                    onClick={() =>
                      dispatch({type: 'login_form', payload: true})
                    }
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
              <div className="copy text-center text-lg-left mt-3">
                <Link to="privacy-policy">Privacy policy</Link>
                <span className="px-3">|</span>
                <Link to="terms-conditions">Terms and conditions</Link>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="footersocila text-center text-lg-right">
                <div className="social_icon">
                  <ul className="social_list">
                    <li className="active">
                      <a
                        href="https://www.facebook.com/octalsoftware"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://twitter.com/octalitsolution"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/octalinfosolution/?hl=en"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCGKnhHWHLDCrDvkvTFBpqJw"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fab fa-youtube" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="copy_right_text text-center text-lg-right mt-3">
                ©Copyright 2020. All rights reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
