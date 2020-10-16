import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import Svg from '../assets/img/loader.svg';
import Modal from 'react-bootstrap/Modal';
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
    <Modal
      aria-labelledby="exampleModalLabel"
      dialogClassName="loading-component"
      show={loading}
    >
      <img src={Svg} alt="React Logo" />
    </Modal>
  );
};

export default loader;
