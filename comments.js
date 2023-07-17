// create web server
var express = require('express');
var router = express.Router();
// create database connection
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// connect to database
connection.query('USE ' + dbconfig.database);

// get all comments for a post
// input: post_id
// output: comments
router.get('/get', function(req, res, next) {
    connection.query("SELECT * FROM comments WHERE post_id = ?", [req.query.post_id], function(err, rows) {
        if (err) {
            res.send({ status: 'fail', msg: err });
        } else {
            res.send({ status: 'success', comments: rows });
        }
    });
});

// create a new comment
// input: post_id, email, content
// output: status, msg
router.post('/create', urlencodedParser, function(req, res, next) {
    connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], function(err, rows) {
        if (err) {
            res.send({ status: 'fail', msg: err });
        } else if (!rows[0]) {
            res.send({ status: 'fail', msg: 'User does not exist' });
        } else {
            connection.query("INSERT INTO comments (post_id, email, content) VALUES (?, ?, ?)", [req.body.post_id, req.body.email, req.body.content], function(err, rows) {
                if (err) {
                    res.send({ status: 'fail', msg: err });
                } else {
                    res.send({ status: 'success', msg: 'Comment created successfully' });
                }
            });
        }
    });
});

// update a comment
// input: id, content
// output: status, msg
router.post('/update', urlencodedParser, function(req, res, next) {
    connection.query("UPDATE comments SET content = ? WHERE id = ?", [req.body.content, req.body.id], function(err, rows) {
        if (err) {
            res.send({ status: 'fail', msg: err });
        } else {
            res.send({ status: 'success', msg: 'Comment updated successfully' });
        }
    });
});

// delete a comment
// input: id