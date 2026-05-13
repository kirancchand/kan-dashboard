function retryPromise(fn, retriesLeft = 3, interval = 2000) {
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch((error) => {
          setTimeout(() => {
            if (retriesLeft === 1) {
              // reject('maximum retries exceeded');
              reject(error);
              return;
            }
            // Passing on "reject" is the important part
            retryPromise(fn, retriesLeft - 1, interval).then(resolve, reject);
          }, interval);
        });
    });
  }
  
  export default retryPromise;