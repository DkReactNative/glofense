import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const loader = ({
  loading = false,
  color = '#00BFFF',
  size = 80,
  className = 'loading-component',
}) => {
  if (loading) {
    document.body.classList.add('disabled-event');
    let element = document.getElementsByClassName('modal-content');
    console.log(element);
    for (let i = 0; i < element.length; i++) {
      element[i].classList.add('disabled-event');
    }
  } else {
    document.body.classList.remove('disabled-event');
    let element = document.getElementsByClassName('modal-content');
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove('disabled-event');
    }
  }

  return (
    <div className={className}>
      <Loader
        visible={loading}
        type="ThreeDots"
        color={color}
        height={100}
        width={100}
        // className = {"overlay"}
      />
    </div>
  );
};

export default loader;
