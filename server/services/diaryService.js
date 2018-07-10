const Mongodb = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'diaryDb';
const url = 'mongodb://localhost:27017/' + dbName;

class DiaryService{
	
	constructor(req, res){
		this.req = req
		this.res = res
	}

	insert(diaryItem, db, callback){
		db.collection('diary').insertOne({
		  		"item" : diaryItem
		}, function(){
			callback()		
		})
	}

	addDiary(){
		let self = this;
		let diaryItem = this.req.body.diaryItem;
		try{
			Mongodb.connect(url, { useNewUrlParser: true },  function(err, client) {
				assert.equal(null, err);
				let db = client.db(dbName);
			  	self.insert(diaryItem, db, function(){
					client.close()
			  		return self.res.status(200).json({
						status: 'success'
					})
			  	})
			});
		}
		catch(error){
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}
	getDiary(){
		let self = this;
		try{
			Mongodb.connect(url, { useNewUrlParser: true }, function(err, client) {
				let db = client.db(dbName);
				assert.equal(null, err);
			  	let diaryList = []
			  	let cursor = db.collection('diary').find();

			   	cursor.each(function(err, doc) {
			      assert.equal(err, null);
			      if (doc != null) {
			        diaryList.push(doc)
			      } else {
			        return self.res.status(200).json({
						status: 'success',
						data: diaryList
					})
			      }
			   	});
			});
		}
		catch(error){
			console.log(error);
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}
}
module.exports = DiaryService