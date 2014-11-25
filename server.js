
var express = require('express');
var app = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var mongojs = require('mongojs');
var mongodbConnectionString = "mongodb://admin:avdQWWcu-riB@127.7.193.130:27017/experiments";

if (typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined") {
    mongodbConnectionString = "users";
}

var db = mongojs(mongodbConnectionString, ['users']);

app.get('/insertUser',function(req, res){
    var userSample = {
        userName : "username",
        password : "password",
        email : "email@email.com",
        firstName : "fname",
        lastname : "lname",
        dob : "mm/dd/yyyy",
        gender : "gender"
		
    };

    db.users.insert(userSample, function(err, data){
        res.json(data);
    });
});


app.get('/getAllUsers', function(req, res){
    db.users.find(function(err, data){
        res.json(data);
    });
});

app.get('/env', function(req,res){
    res.json(process.env);
});

app.get('/addUserValidation', function(req,res){
    db.users.findOne({
        query: {userName : 'username'}
    },function(err, data){
        if(data == null){
            var userSample = {
                userName : "username",
                password : "password",
                email : "email@email.com",
                firstName : "fname",
                lastname : "lname",
                dob : "mm/dd/yyyy",
                gender : "gender"
		
            };

            db.users.insert(userSample, function(err, data){
                res.json(data);
            });
        } else {
            res.send("Username alreadyexists");
        }
    });

});


app.get('/particularUser', function(req,res){
    db.users.findOne({
        query: {userName : 'username'}
    },function(err, data){
        res.json(data);
    });
});

app.get('/updatepassword',function (req,res){
    db.users.findAndModify({
        query: { userName: 'username' },
        update: { $set: { password:'updatedPassword' } },
    }, function(err, doc, lastErrorObject) {
        db.users.find({
            query: {userName : 'username'}
        },function(err, data){
            res.json(data);
        });
    });
});



app.get('/deleteUser', function(req, res){
    db.users.remove({userName : 'username'},function(err,doc){
        res.json(doc);
    });	
});



 

app.get('/customPage', function(req,res){
    res.sendfile(__dirname + '/customPage.html');
});


app.get('/login/:username/:password', function(req,res){
    db.users.findOne({
        query: {userName : req.params.username , password : req.params.password}
    },function(err, data){
        if (data == null) {
            res.json({ message: "Logged In" });
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    });
});


app.get('/countUsers', function(req,res){
    db.users.count(function(err,data){
        res.json(data);
    });
});

app.use(express.static(__dirname + '/public'));


app.get('/paramSend/:param', function(req,res){
    var param = req.params.param;
    res.send(param);	
});

app.get('/customMessage', function (req, res) { res.send("Hello World from Nodejs !!")});









app.listen(port, ipaddress);