import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {Link} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import Owl from '../../../components/owlSlider';
import Buttom from '../../../components/buttomTabBar';
var options = {
  loop: true,
  margin: 10,
  dots: false,
  nav: false,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
  autoplay: true,
};
const Home = (props) => {
  const [sliderList, setsliderList] = useState([]);
  const [categoryList, setcategoryList] = useState([]);
  const [effect, setEffect] = useState(true);
  var currentPage = 0;

  useEffect(() => {
    getcategoryList();
    getBannerList();
    var wrapper = document.getElementById('choosequizouter');
    wrapper.addEventListener('scroll', function (event) {
      checkForNewDiv(wrapper);
    });
    window.removeEventListener('beforeunload', () => {});
    window.removeEventListener('blur', () => {});
    document.removeEventListener('fullscreenchange', () => {});
    document.removeEventListener('mozfullscreenchange', () => {});
    document.removeEventListener('MSFullscreenChange', () => {});
    document.removeEventListener('webkitfullscreenchange', () => {});
    window.removeEventListener('onstatepop', () => {});
  }, [effect]);

  const getcategoryList = (page = currentPage + 1) => {
    currentPage = page;
    getService(
      `get-quiz-categories?page=${page}&itemsPerPage=100`,
      '',
      props.state.user.token
    )
      .then((response) => {
        response = response['data'];

        if (response['results']['docs'].length === 0) {
        }
        // setCurrentPage(page)
        let array = [...categoryList];
        array = response['results']['docs'].map((ele) => {
          if (ele.image) ele.image = response.image_path + ele.image;
          return ele;
        });

        setcategoryList(array);
      })
      .catch((err) => {});
  };

  const getBannerList = () => {
    getService(
      'get-banners?page=1&itemsPerPage=100',
      '',
      props.state.user.token
    )
      .then((response) => {
        response = response['data'];
        let array = [...sliderList];
        array = response['results']['docs'].filter((ele) => {
          if (ele.image) {
            ele.image = response.banner_path + ele.image;
            return ele;
          }
        });
        // if(sliderList.length != array.length || sliderList.length == 0  )
        setsliderList(array);
      })
      .catch((err) => {});
  };

  var checkForNewDiv = function (wrapper) {
    var lastDiv = document.querySelector('#scroll-content >li:last-child');
    if (lastDiv) {
      var lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
      var pageOffset = wrapper.scrollTop + wrapper.clientHeight;
      if (pageOffset > lastDivOffset - 300) {
        getcategoryList(currentPage + 1);
      }
    }
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="header_height">
              <WebHeader title={'Home'} />
              <div className="searchquiz">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Quiz"
                  name="true"
                />
                <i className="fas fa-search" />
              </div>

              <div className="sliderbanner">
                {sliderList.length > 0 && (
                  <Owl
                    item={1}
                    className="owl-carousel"
                    component={sliderList.map((ele, i) => {
                      return (
                        <div
                          key={i}
                          className={i === 0 ? 'item active' : 'item'}
                        >
                          <Link to="#">
                            <div className="carousel_img_outer">
                              <img
                                src={ele.image}
                                alt="#"
                                className="img-fluid"
                              />
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                    options={options}
                  />
                )}
              </div>
            </div>
            <div className="quizouterbox">
              <h4>Choose Quiz</h4>
              <div className="choosequizouter" id="choosequizouter">
                <ul id="scroll-content">
                  {categoryList.map((ele, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/user/contest-quiz/${ele._id}`}
                          className={index === 0 ? 'sport active' : 'sport'}
                        >
                          <span
                            style={{
                              backgroundImage: `url(${
                                ele.image
                                  ? ele.image
                                  : require('../../../assets/img/logo.png')
                              })`,
                            }}
                          />
                          {ele.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <Buttom active={'home'} />
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(Home);
