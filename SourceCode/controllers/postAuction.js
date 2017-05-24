var formidable = require('formidable'),
    { DIRNAME } = require('../config'),
    { getNewToken } = require('../helpers/jwt');

module.exports = (req,res) => {
    var form = new formidable.IncomingForm();
    form.on('fileBegin', function(name, file) {
        let arrayFileName = file.name.split('.'),
            fileExtension = arrayFileName[arrayFileName.length - 1];
        arrayFileName[arrayFileName.length - 1] = Date.now();
        file.name = arrayFileName.join('-') + '.' + fileExtension;
        file.path = DIRNAME + '/public/images/product/'  + file.name;
    });
    form.on('file', function (name, file)   {
        console.log('Uploaded ' + file.name);
    });
    form.on('error', function(err) {
        console.log(err);
        // data.error = { id: 104, message: err + '\nissue at ' + moment().format() };
    });
    new Promise(function(resolve, reject) {
        form.parse(req, function(err, fields, files) {
            if (err) return reject(err);
            // console.log(files);
            return resolve(fields.info);
        });
    })
    .then(info => {
        console.log(info);
        // Object.assign(productInfo,JSON.parse(info));
        // return verify(productInfo.token);
    })
    .catch(function(error){
        console.log(error);
        // data.error = { id: 104, message: error + '\nissue at ' + moment().format() };
        // res.send(data);
        // fs.unlink(DIRNAME + '/public/img/product/'  + imageName);
    });
}