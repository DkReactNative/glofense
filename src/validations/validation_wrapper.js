//***** import libraries */
import validation from './validation.js';

//***** Common function for validation of input fields */
export default function validate(fieldName, value, value2 = null) {
  let resp = '';
  if (validation.hasOwnProperty(fieldName)) {
    let v = validation[fieldName];
    if (value === '' || value == null) {
      resp = v['presence']['message'];
    } else if (
      v.hasOwnProperty('format') &&
      !v['format']['pattern'].test(value)
    ) {
      resp = v['format']['message'];
    } else if (v.hasOwnProperty('length')) {
      let l = v['length'];
      if (l.hasOwnProperty('minimum') && value.length < l['minimum']) {
        resp = l['message'];
      } else if (l.hasOwnProperty('maximum') && value.length > l['maximum']) {
        resp = l['message'];
      } else {
        if (v.hasOwnProperty('match')) {
          let l = v['match'];
          if (value !== value2) {
            resp = l['message'];
          } else {
          }
        } else {
        }
      }
    } else if (v.hasOwnProperty('date')) {
      var today = new Date();
      var date = Math.floor(
        (today - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if(date < 18){
        resp = v['date']['message'];
      } else {
        resp = '';
      }
    } else {
      resp = '';
    }
  } else {
    resp = '';
  }

  return resp;
}
