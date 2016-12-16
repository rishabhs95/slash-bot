var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  var response;
  try {
    response = sync.await(request({
      url: 'https://s.yimg.com/aq/autoc',
      qs: {
        query: term,
        region: 'CA',
        lang: 'en-CA'
      },
     timeout: 10 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  if (response.statusCode !== 200 || !response.body) {
    res.status(500).send('Error');
    return;
  }

  var stocks = JSON.parse(response.body).ResultSet.Result;

  var results = _.chain(stocks)
    .map(function(stock) {
      return {
        title: '<a>' + stock.symbol + ' : ' + stock.exch + '</a>',
        text: stock.symbol
      };
    })
    .value();

  if (results.length === 0) {
    res.json([{
      title: '<i>(no results)</i>',
      text: ''
    }]);
  } else {
    res.json(results);
  }
};
