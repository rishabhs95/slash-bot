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

  var stock = JSON.parse(response.body.substring(4))[0];
  console.log(stock);

  var html = '<div><ul>'
              + '<li> Name: ' + stock.t + '</li>'
              + '<li> Market: ' + stock.e + '</li>'
              + '<li> Price: ' + stock.el_cur + ' (' + stock.ec + ')</li>'
              + '<li> Updated at: ' + stock.elt + '</li>'
              + '</ul></div>';
  res.write(html);
}
