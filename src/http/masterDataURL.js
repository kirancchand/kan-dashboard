import axios from 'axios';
import {http} from './http';
export default function getMdUrl(url,p) {
  return new Promise(function(resolve, reject) {
    let obj = null;
    if (typeof p === 'string') {
      obj = {
        requestName: p,
      };
    } else {
      obj = p;
    }
    http({
      method: 'POST',
      url: url,
      data: obj,
    })
      .then(function(response) {
        if (response.status == 200) {
          resolve(response.data);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}


