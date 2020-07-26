var express = require('express');
var router = express.Router();
var db = require('../DBfunctions/sqlDB.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/getItems', function(req, res, next) {

	// STEP 1: SQL query = "SELECT * FROM items"

	// STEP 2: var result = query.runOnDatabase()

	// STEP 3: SEND BACK RESULT LIKE res.json({"items": result});

	db.getItems(function (err, result) {
		if (err) {
			console.log(err);
			return res.json({ "status": "failed", "message": "DB Error!", "code": 500 });
		}
		
		// RESULT OF QUERY IN result VARIABLE

		return res.json({ "status": "success", "message": "Items Received!", "code": 200, "items": result });
	});
});


router.post('/changeStatus', function(req, res, next) {

	// STEP 1: SQL query = "SELECT * FROM items"

	// STEP 2: var result = query.runOnDatabase()

	// STEP 3: SEND BACK RESULT LIKE res.json({"items": result});

	var id = req.body.id;
	var status = req.body.status;

	if(!id || !status)
		return res.json({ "status": "failed", "message": "Invalid Data!", "code": 500 });

	db.changeStatus(id, status, function (err, result) {
		if (err) {
			console.log(err);
			return res.json({ "status": "failed", "message": "DB Error!", "code": 500 });
		}
		
		// NO RESULT NEEDED IN UPDATE QUERY

		return res.json({ "status": "success", "message": "Items Received!", "code": 200 });
	});
});

router.post('/addElement', function(req, res, next) {

	// STEP 1: SQL query = "SELECT * FROM items"

	// STEP 2: var result = query.runOnDatabase()

	// STEP 3: SEND BACK RESULT LIKE res.json({"items": result});

	var id = req.body.id;
	var status = req.body.status;
	var description = req.body.description;

	if(!id || !status)
		return res.json({ "status": "failed", "message": "Invalid Data!", "code": 500 });

	db.addItem(id, description, status, function (err, result) {
		if (err) {
			console.log(err);
			return res.json({ "status": "failed", "message": "DB Error!", "code": 500 });
		}
		
		// NO RESULT NEEDED IN UPDATE QUERY

		return res.json({ "status": "success", "message": "Items Received!", "code": 200 });
	});
});



router.post('/submitForm', function(req, res, next) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;

	if (!firstname || !lastname || !email) {
      return res.json({ "status": "failed", "message": "Please fill all the required details!", "code": 412 });
    }

	db.submitApplyForm(firstname, lastname, email, function (err, result) {
		if (err) {
			console.log(err);
			return res.json({ "status": "failed", "message": "DB Error!", "code": 500 });
		}
		
		return res.json({ "status": "success", "message": "Form submitted!", "code": 200 });
	});
});

router.post('/editItem', function(req, res, next) {

	var id = req.body.id;
	var description = req.body.description;
	console.log("1hi");
	if(!description || !id)
		return res.json({ "status": "failed", "message": "Invalid Data!", "code": 500 });
	console.log("2hi");
	db.editItem(id, description, function (err, result) {
		if (err) {
			console.log(err);
			return res.json({ "status": "failed", "message": "DB Error!", "code": 500 });
		}

		return res.json({ "status": "success", "message": "Items Received!", "code": 200 });
	});
});

module.exports = router;
