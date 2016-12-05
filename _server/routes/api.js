'use strict';

var _ = require('underscore');
var MY_BAG = require('./data/myBag').myBag;

exports.getMyBag = function (req, res) {
  console.log('List items in the bag');
  return res.status(200).json(MY_BAG);
}

exports.removeItem = function (req, res) {
  var item = req.body;
  var isbn = getIsbn(item);
  var index = _.findIndex(MY_BAG, function (p) {
    return p.isbn === isbn;
  });
  if (index != -1) {
    var oldBag = MY_BAG[index];
    oldBag.quantity --;
    MY_BAG[index] = oldBag;
  }
  return res.status(200).json(MY_BAG);
}

exports.addItem = function (req, res) {
  var item = req.body;
  var isbn = getIsbn(item);
  var index = _.findIndex(MY_BAG, function (p) {
    return p.isbn === isbn;
  });
  if (index != -1) {
    console.log('Increment item : id=' + isbn);
    var oldBag = MY_BAG[index];
    for(var prop in item) {
      oldBag[prop] = item[prop]
    }
    oldBag.quantity ++;
    MY_BAG[index] = oldBag;
  }
  else {
    item.id = createId();
    item.quantity = 1;
    console.log('Add item : id=' + item.id);
    var size = MY_BAG.length;
    MY_BAG[size] = item;
  }
  return res.status(200).json(item);
}

exports.deleteItem = function (req, res) {
  var id = getId(req);
  console.log('Delete item : id=' + id);
  var index = _.findIndex(MY_BAG, function (p) {
    return p.id === id;
  });

  if (index === -1) {
    return res.status(404).json({error: 'The item with id "' + id + '" doesn\'t exist.'});
  }
  MY_BAG.splice(index, 1);
  return res.status(200).json(MY_BAG);
}

function getParam(req, param) {
  return req.params[param];
}

function getId(req) {
  var param = getParam(req, 'id');
  return param;
}

function createId() {
  return new Date().getTime()+"";
}

function getIsbn(req) {
  var param = req.isbn;
  return param;
}
