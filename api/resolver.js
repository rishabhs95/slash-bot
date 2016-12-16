var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  handleIdString(term, req, res);
};

function handleIdString(id, req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'http://finance.google.com/finance/info',
      qs: {
        client: 'ig',
        q: id
      },
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var stock = response[0];
  var html = '<div><ul>' +
              + '<li> Name: ' + response.t + '</li>'
              + '<li> Market: ' + response.e + '</li>'
              + '<li> Price: ' + response.el_cur + " " + response.ec + '</li>'
              + '<li> Time: ' + response.elt + '</li>'
              + '</ul></div>';
  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
}
