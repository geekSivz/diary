const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const diaryService = require('./services/diaryService');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(cors(corsOptions));


// Allows cross-origin domains to access this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/api/fileUpload', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.fileUpload(req, res);
})

app.post('/api/addDiary', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.addDiary()
})

app.post('/api/getDiary', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.getDiary()
})

app.post('/api/uploadToMongoFileStream', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.uploadToMongoFileStream()
})

app.get('/api/downloadFromMongoFileStream', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.downloadFromMongoFileStream()
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, (req, res) => {
    console.log('Diary Web app service listening on port' + port);
});
