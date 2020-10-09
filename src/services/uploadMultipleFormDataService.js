import axios from 'axios';
/******** MUTLIPART FORM DATA ********/
export default function uploadImageWithData(
  formData,
  url = 'createGroup',
  token = ''
) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: process.env.REACT_APP_API_BASE_URL+"api/users/" + url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
