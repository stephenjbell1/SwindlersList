// Requiring our models
var db = require("../models");

var fs = require('fs');
var path = require('path');
var uid = require('uid2');
var mime = require('mime');

// Parse an incoming multipart/form-data request (uploads). Adds the files and files to req.
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var TARGET_PATH = path.resolve(__dirname, '../public/imageUploads/');
var IMAGE_TYPES = ['image/jpeg', 'image/png'];
var currentListingId;

// Routes
// =============================================================
module.exports = function (app) {

//GET route for all listings by every user
app.get("/api/listing", function (req, res) {
    db.Listing.findAll({
    }).then(function (dbListing) {
      res.json(dbListing);
    });
  });

  // GET route for getting all of the listing BY A SPECIFIC USER
  app.get("/api/listing", function (req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.User
    db.Listing.findAll({
      where: query,
      include: [db.User]
    }).then(function (dbListing) {
      res.json(dbListing);
    });
  });

  // Get route for retrieving a single Listing
  app.get("/api/listing/:id", function (req, res) {
    db.Listing.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Images]
    }).then(function(dbListing) {
      var singleListing = {Listing: dbListing};
      res.render("singleListing", singleListing);
    });
  });

  // Listing route for saving a new Listing
  app.post("/api/listing", function (req, res) {
    db.Listing.create({
      title: req.body.title,
      body: req.body.body,
      price: req.body.price,
      category: req.body.category,
      contact_email: req.body.contact_email
    }).then(function (dbListing) {
      res.render('uploadpic');
      currentListingId = dbListing.get('id');
      console.log("currentListingId = " + currentListingId);
      app.post("/upload", multipartMiddleware, function (req, res) {
        var is;
        var os;
        var targetPath;
        var targetName;
        // console.log(req.files);
        var tempPath = req.files.file.path;
        //get the mime type of the file
        var type = mime.lookup(req.files.file.path);
        //get the extension of the file
        var extension = req.files.file.path.split(/[. ]+/).pop();

        //check to see if we support the file type
        if (IMAGE_TYPES.indexOf(type) == -1) {
          return res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
        }

        //create a new name for the image
        targetName = uid(22) + '.' + extension;

        //determine the new path to save the image
        targetPath = path.join(TARGET_PATH, targetName);

        //create a read stream in order to read the file
        is = fs.createReadStream(tempPath);

        //create a write stream in order to write the a new file
        os = fs.createWriteStream(targetPath);

        is.pipe(os);

        //handle error
        is.on('error', function () {
          if (err) {
            return res.send(500, 'Something went wrong');
          }
        });

        //if we are done moving the file
        is.on('end', function () {

          //delete file from temp folder
          fs.unlink(tempPath, function (err) {
            if (err) {
              return res.send(500, 'Something went wrong');
            }

          });//#end - unlink
        });//#end - on.end
        db.Images.create({
          imageName: targetName,
          listId: currentListingId
        }).then(function (response) {
            res.send(response);
        });
      });
    });
  });

  // DELETE route for deleting listing
  app.delete("/api/listing/:id", function (req, res) {
    db.Listing.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbListing) {
      res.json(dbListing);
    });
  });

  // PUT route for updating body (description) for a listing
  app.put("/api/listing", function (req, res) {
    db.Listing.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbListing) {
        res.json(dbListing);
      });
  });
};
