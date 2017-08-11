var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
    db.Listing.findAll({
            include: db.Images
        })
        .then(function(data) {
            // res.send(JSON.stringify(data));
            // var picName = data[0].dataValues.Images[0].imageName;
            var hbsObject = { Listings: data }
            res.render("index", hbsObject);
        });
});

//for creating a new user after they enter credentials
router.post("/login", function(req, res) {
  db.user.create({
      name: req.body.username,
      password: req.body.password,
      email: req.body.email
    })
    .then(function() {
      res.render("/index");
    });
});

router.get("/index", function(req, res) {
    res.render("index.handlebars");
})

router.get("/login", function(req, res) {
    res.render("login.handlebars");
})

router.get("/sell", function(req, res) {
    res.render("sell.handlebars");
})

router.get("/upload", function(req, res) {
    res.render("uploadpic");
})

router.get("/create", function(req, res) {
    res.render("create.handlebars");
})

module.exports = router;