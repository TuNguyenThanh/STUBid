var { DOMAIN_NAME, MAILER_OPTIONS } = require('../config.js');
var nodemailer = require('nodemailer');

transporter = nodemailer.createTransport(MAILER_OPTIONS);
var mailOptions = {
    from: '"sBid" <team.sbid@gmail.com>'
};
exports.sendResetPasswordEmail = (receiver, firstName, verifyToken) => {
    mailOptions.to = receiver;
    mailOptions.subject = 'Làm mới mật khẩu tài khoản sBid';
    mailOptions.html =  `<div style="width:80%;border:1px solid #444;">
        <div style="height:50px;background:#0e5aa8;font-size:200%;text-align:center;color:#fff;line-height:50px;">
            sBid
        </div>
        <div style="padding:2%">
            <div style="font-size:120%;line-height:30px;margin:10px 0;">
                Chào ${firstName},
                <br/>Gần đây chúng tôi nhận được yêu cầu làm mới mật khẩu tài khoản sBid của bạn. Chúng tôi ở đây để giúp bạn!
                <br/>Đơn giản chỉ cần nhấn vào nút bên dưới để nhận mật khẩu mới:
            </div>
            <a
                href="${DOMAIN_NAME}/Accounts/resetPassword?verifyToken=${verifyToken}"
                style="display:block;text-decoration:none;text-align:center;font-weight:bold;font-size:200%;color:#f1f1f4;background:#0e5aa8;width:250px;padding:15px;box-shadow:4px 4px 8px #444"
                >
                Reset password
            </a>
            <div style="font-size:120%;line-height:30px;margin:10px 0;">
                Cám ơn bạn vì đã sử dụng dịch vụ của chúng tôi!
                <br/><br/>sBid
            </div>
        </div>
    </div>`;
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return reject(err)
            else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                return resolve();
            }
        });
    });
}
