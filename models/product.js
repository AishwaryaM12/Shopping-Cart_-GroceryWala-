var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	StockName:{type:String, required:true},
   	ImagePath:{type:String, required: true},
   	title:{type:String, required: true},
   	weight:{type:Number, required: true},
   	price:{type:Number, required: true},
});
module.exports = mongoose.model('Product', schema);