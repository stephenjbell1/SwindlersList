//Dropzone
Dropzone.autoDiscover = false;
$(document).on("click", "#dropzoneButton", function() {
    $('#dropzoneButton').remove();
    $("#dropzoneID").addClass("dropzone").dropzone({
        url: "/upload",
        maxFilesize: 6,
        maxFiles: 10,
        capture: "camera",
        addRemoveLinks: true,
        dictDefaultMessage: "DROP FILES TO BE UPLOADED HERE"
    });
});


// When user clicks an item from the home page, the database ID of the listing is captured in a variable.
// a call is passed to the API route to retrieve a single listing via ID
// this will result in a GET request to the database that will retrieve the Listing's object
// the object will then be rendered with all images in a handlebars page
$(document).on('click', '.listingItem', function(){
  var clickedId = $(this).attr('id');
  console.log(clickedId)
  window.location.replace("/api/listing/" + clickedId);
})


// Configuring and initializing Image Slider plugin
$(function () {
  $(".rslides").responsiveSlides({
      auto: false,
      pager: true,
      nav: true,
      speed: 500,
      maxwidth: 800,
      namespace: "transparent-btns"
    });
});