const Mongodb = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'groceryDb';
const url = 'mongodb://localhost:27017/' + dbName;

class GroceryService{
	
	constructor(req, res){
		this.req = req
		this.res = res
	}

	insert(groceryItem, db, callback){
		db.collection('grocery').insertOne({
		  		"item" : groceryItem
		}, function(){
			callback()		
		})
	}

	addGrocery(){
		let self = this;
		let groceryItem = this.req.body.groceryItem;
		try{
			Mongodb.connect(url, { useNewUrlParser: true },  function(err, client) {
				assert.equal(null, err);
				let db = client.db(dbName);
			  	self.insert(groceryItem, db, function(){
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
	getGrocery(){
		let self = this;
		try{
			Mongodb.connect(url, { useNewUrlParser: true }, function(err, client) {
				let db = client.db(dbName);
				assert.equal(null, err);
			  	let groceryList = []
			  	let cursor = db.collection('grocery').find();

			   	cursor.each(function(err, doc) {
			      assert.equal(err, null);
			      if (doc != null) {
			        groceryList.push(doc)
			      } else {
			        return self.res.status(200).json({
						status: 'success',
						data: groceryList
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
module.exports = GroceryService