const mongoose = require('mongoose');  //Module d'accès à la base de donnée
const Schema = mongoose.Schema;   
var Mixed = mongoose.Schema.Types.Mixed;   
var keydb = process.env.keydb;

var itemSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  cost: Number,
  key: String,
  id: Number,
  maxCount: Number,
  serversId: [String],
  global: Boolean
});

const Item = mongoose.model("LowItems", itemSchema);

module.exports = Item;