import axios from 'axios';
import {http} from './http';
import { GET_MASTER_DATA } from './constants';
export default function getMd(p) {
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
      url: GET_MASTER_DATA,
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


