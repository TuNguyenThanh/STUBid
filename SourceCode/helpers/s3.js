const CONFIG = require('../config');
const ERROR = require('../error.json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3(CONFIG.AWS_AUTH);

upload = (key, bufferData) => {
  return new Promise((resolve, reject) => {
    let params = {
      Key: 'public/' + key,
      Bucket: CONFIG.BUCKET.BUCKET_NAME,
      Body: bufferData,
    };

    s3.upload(params, function put(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject({
          status: 500,
          error: ERROR[500][21]
        });
      }

      delete params.Body;
      resolve(params);
    });
  });
}

get = (params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function put(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject({
          status: 500,
          error: ERROR[500][21]
        });
      }
      else {
        console.log(data);
        resolve();
      }
    });
  });
}

module.exports = { get, upload }