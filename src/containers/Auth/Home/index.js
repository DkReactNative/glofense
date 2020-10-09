import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Owl from '../../../components/owlSlider';
var options = {
  rtl: false,
  loop: true,
  margin: 0,
  items: 1,
  nav: true,
  dots: true,
  center: true,
  autoplay: false,
};
const Home = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'active_link',
      payload: window.location.pathname.substring(
        window.location.pathname.search('/')
      ),
    });
  });

  var list = [
    {
      description:
        "Lorem Ipsum is simp ly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley n book.  standard dummy text ever since.",
      name: 'Mrs. John White A',
      post: 'CEO',
      image: require('../../../assets/img/header_profile.png'),
    },
    {
      description:
        "Lorem Ipsum is simp ly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley n book.  standard dummy text ever since.",
      name: 'Mrs. John White B',
      post: 'CEO',
      image: require('../../../assets/img/header_profile.png'),
    },
    {
      description:
        "Lorem Ipsum is simp ly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley n book.  standard dummy text ever since.",
      name: 'Mrs. John White C',
      post: 'CEO',
      image: require('../../../assets/img/header_profile.png'),
    },
    {
      description:
        "Lorem Ipsum is simp ly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley n book.  standard dummy text ever since.",
      name: 'Mrs. John White D',
      post: 'CEO',
      image: require('../../../assets/img/header_profile.png'),
    },
    {
      description:
        "Lorem Ipsum is simp ly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley n book.  standard dummy text ever since.",
      name: 'Mrs. John White E',
      post: 'CEO',
      image: require('../../../assets/img/header_profile.png'),
    },
  ];

  var HowItPlaylist = [
    {
      description:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nam eu nullapsum',
      title: 'Select a contest',
      image: require('../../../assets/img/step-1.png'),
    },
    {
      description:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nam eu nullapsum',
      title: 'Create Team',
      image: require('../../../assets/img/step-2.png'),
    },
    {
      description:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nam eu nullapsum',
      title: 'Win Contes',
      image: require('../../../assets/img/step-3.png'),
    },
  ];

  const _renderOwlSlider = () => {
    return list.map((ele, i) => {
      return (
        <div key={i} className={i == 0 ? 'item active' : 'item'}>
          <div className="client_says_box position-relative">
            <div className="client_img">
              <img src={ele.image} alt="client" />
            </div>
            <p className="text-center">{ele.description}</p>
            <h4 className="text-center">
              {ele.name} <small className="pt-2">{ele.post}</small>
            </h4>
            <div className="quote_sec">
              <img src={require('../../../assets/img/quote_icon.png')} alt="" />
            </div>
          </div>
        </div>
      );
    });
  };

  const _renderHowItPlay = () => {
    return HowItPlaylist.map((ele, i) => {
      return (
        <div key={i} className="col-12 col-sm-12 col-md-4">
          <div className="match-proses">
            <div className="win-img">
              <img src={ele.image} alt="logo" />
            </div>
            <div className="wein-content">
              <h5>
                {i + 1}. {ele.title}
              </h5>
              <p>{ele.description}</p>
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <section
        className="banner_block position-relative"
        style={{backgroundImage: 'url(../../../assets/img/sliderbg.jpg)'}}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-7 col-lg-7 col-xl-7">
              <div className="banner_data_block text-md-left text-center">
                <h1 className="banner_title">
                  What is Lorem Ipsum. Every Appointment
                </h1>
                <div className="banner_desc">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor.{' '}
                </div>
                <div className="book_now_btns">
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-lg-5 col-xl-5">
              <div className="banner_data_img text-center">
                <img
                  src={require('../../../assets/img/rightslider.png')}
                  alt="#"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="aboutusboxes">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="headingbox">
                <h2>About </h2>
                <hr />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-7 col-lg-6">
              <div className="about-S-content">
                <p>
                  PlayStocks11 allows millions of cricket fan to have their own
                  selected team to play against the rest of the world. Its a
                  “game of skill”. You have to move every steps smartly to be in
                  THE TOP.
                </p>
                <p>
                  You just have to select the perfect players at right time
                  knowing the pitch conditions, opponent team, their
                  performance, availabilities, etc.. and one of the most
                  important part is to select A Captain and Vice-Captain very
                  smartly.
                </p>
                <p>
                  PlayStocks11 allows millions of cricket fan to have their own
                  selected team to play against the rest of the world. Its a
                  “game of skill”. You have to move every steps smartly to be in
                  THE TOP.
                </p>
                <p>
                  You just have to select the perfect players at right time
                  knowing the pitch conditions, opponent team, their
                  performance, availabilities, etc.. and one of the most
                  important part is to select A Captain and Vice-Captain very
                  smartly. <Link to="#">Learn More</Link>
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-5 col-lg-6">
              <div className="play-stocks-img">
                <img
                  src={require('../../../assets/img/aboutright.png')}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="howitplay">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="headingbox">
                <h2>How it Play</h2>
                <hr />
              </div>
            </div>
            {_renderHowItPlay()}
          </div>
        </div>
      </section>
      <section className="client_says_block">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="headingbox">
                <h2>What User’s Says</h2>
                <hr />
              </div>
            </div>
            <div className="col-md-12">
              <Owl
                item={1}
                className="client_says_slider owl-carousel"
                options={options}
                component={_renderOwlSlider()}
              />
            </div>
          </div>
        </div>
      </section>
      <section
        className="download_app_block position-relative py-5"
        style={{
          backgroundImage: 'url(../../../assets/img/download_app_bg.jpg)',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 offset-lg-6">
              <div className="download_app_data_block position-relative">
                <div className="download_app_screen">
                  <img
                    src={require('../../../assets/img/downloadappleft.png')}
                    alt="download app"
                  />
                </div>
                <div className="position-relative" style={{zIndex: 2}}>
                  <h2 className="download_app_heading mb-4">
                    Download App - it's free
                  </h2>
                  <div className="download_app_desc mb-4">
                    Lorem Ipsum is simp ly dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                  </div>
                  <ul className="download_app_btns">
                    <li>
                      <a
                        href="https://drive.google.com/file/d/19Wa_HeQ6VmJyeCuvzlNMMPTbhyQFueYl/view?usp=drivesdk"
                        target="_blank"
                      >
                        <img
                          src={require('../../../assets/img/google_play.png')}
                          alt="Google Play"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">
                        <img
                          src={require('../../../assets/img/app_store.png')}
                          alt="App Store"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(Home);
