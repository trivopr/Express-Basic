var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var app = express();

//====== Connect to MongoDB
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;


//========== body Parse Middle Ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


// =============== set VIEW ENGINE ==============
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//================ Set Static URL
app.use(express.static(path.join(__dirname, 'public')));


//=========== Next Middlewar ==================

var users = [{
    id: 1,
    first_name: "Erena",
    last_name: "Mackie",
    email: "emackie0@upenn.edu"
}, {
    id: 2,
    first_name: "Shelton",
    last_name: "Burtenshaw",
    email: "sburtenshaw1@goo.ne.jp"
}, {
    id: 3,
    first_name: "Leigh",
    last_name: "Gillam",
    email: "lgillam2@trellian.com"
}, {
    id: 4,
    first_name: "Derby",
    last_name: "Leitche",
    email: "dleitche3@upenn.edu"
}, {
    id: 5,
    first_name: "Laurence",
    last_name: "Yeell",
    email: "lyeell4@ucsd.edu"
}];


//====== Catch Global Error =============
// app.use(function(req, res, next) {
//     next.locals.errors = null;
//     next();
// });



//===========Express Validator ===========//
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


//=============LIST ROUTER AI ==============
app.get('/', function(req, res) {
    var data = {
        title: 'DYNAMIC TITLE',
        title3: 'hihi title 3',
        message: 'HELLO THEREE.. I\'M FREE NOW !!!!'
    };
    res.render('index', data);
});

//---- Get All User -------------
app.get('/users/', function(req, res) {
    db.users.find(function(err, docs) {
        console.log('docs=====:', docs);
        res.render('users', { data: users });
    });

});

//-------- Access Page Create User --------------
app.get('/users/add', function(req, res) {
    db.users.find(function(err, docs) {
        res.render('add', { data: docs });
    });
});

//--------- Create User --------------
app.post('/users/add', function(req, res) {

    // Express validate
    req.checkBody('firstname', 'First Name is required').notEmpty();
    req.checkBody('lastname', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('add', {
            title: 'Add User',
            users: users,
            errors: errors
        });
    } else {

        var newUser = {
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
        }

        db.users.insert(newUser, function(err, res) {
            if (err) {
                console.log('err', err);
            } else {
                console.log('Add user Success !');
            }
        });
    }
});

// ---------- DELETE user -----------
app.delete('/users/delete/:id', function(req, res) {

    var idUser = req.params.id;
    console.log('idUser:', idUser);
    db.users.remove({ _id: ObjectId(idUser) }, function(err, result) {
        if (err) {
            console.log('ERRR:', err);
        }

        var listUserUpdate = db.users.find(function(err, result) {
            res.json(result);
        });

    });
});



//============LOGGER MIDLEWARE===============
const logger = function(req, res, next) {
    console.log('log........');
    next();
}

app.use(logger);


// =========== Port Listen ========
app.listen(3000, function() {
    console.log('HELLO WORLD');
});