const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Indwoo:0504@cluster0.5zredre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
