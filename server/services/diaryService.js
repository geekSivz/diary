const multer = require('multer');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const fs = require('fs');
const url = require('url');

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

var Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "./uploads");
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});

var upload = multer({ storage: Storage }).array("snap", 3); //Field name and max count

class DiaryService {

	constructor(req, res) {
		this.req = req
		this.res = res
	}

	insert(diaryItem, db, callback) {
		db.collection('diary').insertOne({
			"Title": diaryItem,
			"ActivityType": diaryItem,
			"Description": diaryItem,
			"FileNames": diaryItem
		}, function () {
			callback()
		})
	}

	fileUpload(req, res) {
		upload(req, res, function (err) {
			if (err) {
				return res.end("Something went wrong!");
			}
			var files = req.files.map(function (val) {
				return val.filename;
			}).join(',');

			uploadToMongoFileStream(files);
			/*res.redirect(307, url.format({
				pathname: "/api/uploadToMongoFileStream",
				query: {
					"filename": files
				}
			}));*/
		});
	}

	uploadToMongoFileStream(files) {
		try {
			connection.once('open', () => {
				var gfs = gridfs(connection.db);
				var files = (files != '') ? files : this.req.query.filename.split(',');

				for (i = 0; i < files.length; i++) {
					var writestream = gfs.createWriteStream({ filename: files[i] });
					fs.createReadStream(__dirname + "/uploads/" + files[i]).pipe(writestream);
				}
				writestream.on('close', (file) => {
					// res.send('Stored File: ' + file.filename);
					res.redirect('/');
				});
			})
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}

	downloadFromMongoFileStream() {
		try {
			connection.once('open', () => {
				var gfs = gridfs(connection.db);
				var filename = this.req.query.filename;

				gfs.exist({ filename: filename }, (err, file) => {
					if (err || !file) {
						res.status(404).send('File Not Found');
						return
					}

					var readstream = gfs.createReadStream({ filename: filename });
					readstream.pipe(res);
				});
			})
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}


	deleteFromMongoFileStream() {
		try {
			connection.once('open', () => {
				var gfs = gridfs(connection.db);
				var filename = this.req.query.filename;
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
			})
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}

	metaDetailsFromMongoFileStream() {
		try {
			connection.once('open', () => {
				var gfs = gridfs(connection.db);
				var filename = this.req.query.filename;
				gfs.exist({ filename: filename }, (err, file) => {
					if (err || !file) {
						res.send('File Not Found');
						return;
					}

					gfs.files.find({ filename: filename }).toArray((err, files) => {
						if (err) res.send(err);
						res.json(files);
					});
				});
			})
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}


	addDiary() {
		let self = this;
		let diaryItem = this.req.body.diaryItem;
		try {
			connection.once('open', () => {
				assert.equal(null, err);
				let db = connection.db;
				self.insert(diaryItem, db, function () {
					connection.close();
					return self.res.status(200).json({
						status: 'success'
					})
				})
			})
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}
	getDiary() {
		let self = this;
		try {
			connection.once('open', () => {
				let db = connection.db;
				assert.equal(null, err);
				let diaryList = []
				let cursor = db.collection('diary').find();

				cursor.each(function (err, doc) {
					assert.equal(err, null);
					if (doc != null) {
						diaryList.push(doc)
					} else {
						connection.close();
						return self.res.status(200).json({
							status: 'success',
							data: diaryList
						})
					}
				});
			});
		}
		catch (error) {
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}
}
module.exports = DiaryService