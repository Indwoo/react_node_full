const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require("./models/Users");
const config = require('./config/key');

//application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 형식의 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World!!!!'));


app.post('/register',(req,res)=>{   
    //회원가입할 때 필요한 정보들을 client에서 가져오면,
    //그 정보들을 DB에 넣어준다.
    const user = new User(req.body);

    //user모델에 정보가 저장됨
    //실패 시, 실패한 정보를 보내줌
    user.save().then(()=>{
        res.status(200).json({
            success:true
        })
    }).catch((err)=>{
        return res.json({success:false,err})
    });


})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
