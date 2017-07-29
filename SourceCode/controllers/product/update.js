const {
    updateProduct
} = require('../../models/product');
const {
    verify,
    refreshToken
} = require('../../helpers/jwt');
const { sendUnactivated } = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
    let productId = req.params.productId;
    let {
        token,
        product
    } = req.body;
    if (!productId || !token || !product) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        });
    }
    verify(token)
        .then(({
            object,
            sessionId
        }) => {
            if (!object.accountId) {
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][1]
                });
            }
            this.accountId = object.accountId;
            token = refreshToken(object, sessionId);
            return updateProduct(productId, product);
        })
        .then(() => {
            res.send({
                success: true,
                token
            });
            sendUnactivated(this.accountId);
        })
        .catch((reason) => {
            res.send({
                success: false,
                error: reason.error
            });
        })
}