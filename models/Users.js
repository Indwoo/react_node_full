const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // salt(*)가 몇 글자인지 나타냄
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // space를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자와 일반 유저를 구분하기 위해
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 비밀번호 암호화를 위한 bcrypt
userSchema.pre('save', function( next ) {
    // 비밀번호 암호화
    const user = this;

    // 비밀번호가 변경될 때만 암호화
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                return next();
            });
        });
    }
    else {
        return next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567이면 암호화된 비밀번호는 $2b$10$2...
    // 서로 일치하는지 확인해야 함
    const user = this;
    return bcrypt.compare(plainPassword, this.password)
}

// jwt를 이용해서 token 생성
userSchema.methods.generateToken = function(cb) {
    user = this;

    // jsonwebtoken을 이용해서 token 생성
    const token = jwt.sign(user._id.toJSON(), 'secretToken')
    user.token = token
    // user에 token이 저장된 상태로 DB에 저장
    return user.save();
}

userSchema.statics.findByToken = function(token, cb) {
    const user = this;

    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secretToken', function(err, decoded) {
            if (err) reject(err);

            user.findOne({"_id": decoded, "token": token})
                .then(user => {
                    resolve(user);
                })
                .catch(err => {
                    reject(err);
                });
        });
    });

}

const User = mongoose.model('User', userSchema)

module.exports = { User } // 다른 파일에서도 사용할 수 있게 export 해줌