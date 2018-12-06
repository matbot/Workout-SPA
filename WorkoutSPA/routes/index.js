var date = require('date-and-time');

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Ardast12!',
    database: 'gym',
    insecureAuth: true
});
connection.connect(function(error) {
    if(error) throw error;
    console.log("Connected!");
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var context = {};
    var fullTableQuery = "SELECT * from workouts";
    connection.query(fullTableQuery, function(error,rows,fields) {
        if(error) { next(err) }
        context.table = rows;
        var now = new Date();
        date.format(now, 'ddd, MMMM DD, YYYY HH:mm:ss AZ');
        res.render('index', { title: 'My WorkoutsDB', workouts: context.table, alert: now });
    });
});

router.post('/addExercise', function(req, res, next) {
    var sql = "INSERT INTO workouts (date,name,weight,lbs,reps) VALUES ?";
    var values = [[req.body.date,req.body.name,req.body.weight,req.body.lbs,req.body.reps]];
    connection.query(sql,[values], function(error,result) {
        if(error===null) {
            res.send(JSON.stringify({ "status" : 200, "error" : null, "response" : result}));
        }
        else {
            res.send(JSON.stringify({ "status" : 500, "error" : true, "response" : null}));
        }
    });
});

router.delete('/deleteExercise', function(req, res, next) {
    var sql = "DELETE FROM workouts WHERE id=";
    var value = req.body.deleteId;
    connection.query(sql+value, function(error,result) {
        if(error===null) {
            res.send(JSON.stringify({ "status" : 200, "error" : null, "response" : result}));
        }
        else {
            res.send(JSON.stringify({ "status" : 500, "error" : true, "response" : null}));
        }
    });
});

router.patch('/patchExercise', function(req, res, next) {
   var sql = 'UPDATE workouts SET date="' + req.body.date +
                                '", name="' + req.body.name +
                                '", weight=' + req.body.weight +
                                ', lbs=' + req.body.lbs +
                                ', reps=' + req.body.reps +
                                ' WHERE id=' + req.body.updateId;
   connection.query(sql, function(error,result) {
       if(error===null) {
           res.send(JSON.stringify({ "status" : 200, "error" : null, "response" : result}));
       }
       else {
           res.send(JSON.stringify({ "status" : 500, "error" : true, "response" : null}));
       }
   });
});



router.post('/x', function(req,res,next) {
    console.log(req.body);
});

// adapted from CS290 assignment page:
router.get('/reset-table',function(req,res,next){
    var context = {};
    connection.query("DROP TABLE IF EXISTS workouts;", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createWorkoutsTable = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "lbs BOOLEAN,"+
            "date DATE);";
        connection.query(createWorkoutsTable, function(err){
            var now = new Date();
            date.format(now, 'ddd, MMMM DD, YYYY HH:mm:ss AZ');
            res.render('index', {title: "New WorkoutsDB!", alert: "Table Reset: "+ now});
        })
    });
});

module.exports = router;
