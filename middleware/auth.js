const { User } = require('../models/Users');

function auth(req, res, next) {
    // 쿠키에서 토큰 가져오기
    const token = req.cookies.x_auth;
    console.log("token is ", token);

    // 토큰 복호화 및 유저 검색
    User.findByToken(token)
    .then((user) => {
        if (!user) {
            throw new Error("유효하지 않은 토큰입니다.");
        }

        // 토큰과 유저정보를 다음 단계로 전달함.
        req.token = token;
        req.user = user;
        return next();
    })
    .catch((err) => {
        return res.status(401).json({
            isAuth: false,
            message: err.message
        });
    })
}

module .exports = { auth };