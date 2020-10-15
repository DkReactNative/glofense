import {toast} from 'react-toastify';
const toastId = 'my-toast';

const showToast = (message, id = toastId) => {
  toast.configure();
  toast.dismiss();
  toast.success(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: id,
  });
};

const showDangerToast = (message, id = toastId) => {
  toast.configure();
  toast.dismiss();
  toast.error(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: id,
  });
};

const showInfoToast = (message, id = toastId) => {
  toast.configure();
  toast.dismiss();
  toast.info(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: id,
  });
};

export {showToast, showDangerToast,showInfoToast};
