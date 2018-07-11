const express = require('express')
const bodyParser = require('body-parser')
const diaryService  = require('./services/diaryService')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/gridfstest')
const conn = mongoose.connection
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo
const gfs = Grid(conn.db)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

/** Seting up server to accept cross-origin browser requests */
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(bodyParser.json());

/** Setting up storage using multer-gridfs-storage */
var storage = GridFsStorage({
    gfs : gfs,
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'ctFiles' //root name for collection to store files into
});

var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
              res.json({error_code:1,err_desc:err});
              return;
        }
          res.json({error_code:0,err_desc:null});
    });
});

app.get('/file/:filename', function(req, res){
    gfs.collection('ctFiles'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
        /** return response */
        return readstream.pipe(res);
    });
});

app.post('/api/addDiary', function (req, res) {
  let diaryServiceObj = new diaryService(req, res)
  diaryServiceObj.addDiary()
})

app.post('/api/getDiary', function (req, res) {
  let diaryServiceObj = new diaryService(req, res)
  diaryServiceObj.getDiary()
})

app.listen(3000, function () {
  console.log('Diary Web app service listening on port 3000!')
})