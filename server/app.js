var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var gridfs = require('gridfs-stream');
var fs = require('fs');
var app = express();
var url = require('url');
let port = 3000;

const diaryService = require('./services/diaryService')

app.use(bodyParser.json());

/*
// Allows cross-origin domains to access this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/api/addDiary', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.addDiary()
})

app.post('/api/getDiary', function (req, res) {
    let diaryServiceObj = new diaryService(req, res)
    diaryServiceObj.getDiary()
})*/

/*
	Make a MongoDB connection
*/
mongoose.connect('mongodb://localhost:27017/diary')
mongoose.Promise = global.Promise;

gridfs.mongo = mongoose.mongo;
/*
	Check MongoDB connection
*/
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', () => {
var gfs = gridfs(connection.db);
    

    app.get('/', (req, res) => {
        res.send('Download/Upload GridFS files to MongoDB <br>- by JavaSampleApproach.com');
    });

	
	
  	// Upload a file from loca file-system to MongoDB
    app.get('/api/file/upload', (req, res) => {
		
		var files = req.query.filename.split(',');
		
		for(i=0;i<files.length;i++){
			var writestream = gfs.createWriteStream({ filename: files[i] });
			fs.createReadStream(__dirname + "/uploads/" + files[i]).pipe(writestream);
		}
        writestream.on('close', (file) => {
		   // res.send('Stored File: ' + file.filename);
		   res.redirect('/');
        });
    });
	
	app.post('/api/file/upload', (req, res) => {
		
		var files = req.query.filename.split(',');
		console.log('post');
		for(i=0;i<files.length;i++){
			var writestream = gfs.createWriteStream({ filename: files[i] });
			fs.createReadStream(__dirname + "/uploads/" + files[i]).pipe(writestream);
		}
        writestream.on('close', (file) => {
		   // res.send('Stored File: ' + file.filename);
		   res.redirect('/');
        });
    });

    // Download a file from MongoDB - then save to local file-system
    app.get('/api/file/download', (req, res) => {
        // Check file exist on MongoDB
		
		var filename = req.query.filename;
		
        gfs.exist({ filename: filename }, (err, file) => {
            if (err || !file) {
                res.status(404).send('File Not Found');
				return
            } 
			
			var readstream = gfs.createReadStream({ filename: filename });
			readstream.pipe(res);            
        });
    });

    // Delete a file from MongoDB
    app.get('/api/file/delete', (req, res) => {
		
		var filename = req.query.filename;
		
		gfs.exist({ filename: filename }, (err, file) => {
			if (err || !file) {
				res.status(404).send('File Not Found');
				return;
			}
			
			gfs.remove({ filename: filename }, (err) => {
				if (err) res.status(500).send(err);
				res.send('File Deleted');
			});
		});
    });

    // Get file information(File Meta Data) from MongoDB
	app.get('/api/file/meta', (req, res) => {
		
		var filename = req.query.filename;
		
		gfs.exist({ filename: filename }, (err, file) => {
			if (err || !file) {
				res.send('File Not Found');
				return;
			}
			
			gfs.files.find({ filename: filename }).toArray( (err, files) => {
				if (err) res.send(err);
				res.json(files);
			});
		});
	});

    var server = app.listen(3001, () => {
		
	  var host = server.address().address
	  var port = server.address().port
	 
	  console.log("App listening at http://%s:%s", host, port); 
	});

});


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("snap", 3); //Field name and max count

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/FormUpload", function (req, res, uploadToDB) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
		}
		var files = req.files.map(function(val) {
			return val.filename;
		  }).join(',');		
		res.redirect(307, url.format({
			pathname:"/api/file/upload",
			query: {
				"filename": files
			}
		}));
    });
});

app.listen(port, (req, res) => {
    console.log('Diary Web app service listening on port' + port);
});
