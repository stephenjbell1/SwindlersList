var exports = module.exports = {}
 

exports.login = function(req, res) {
 
    res.render('login');
 
}

exports.index = function(req, res) {
 
    res.render('index');
 
}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}