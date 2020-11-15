// Load required packages
var config = require('../config'); // get config file
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Note = require('../models/note');
var Vitals = require('../models/vitals');
const sortArray = require('sort-array');
const paginate = require("paginate-array");
// module.exports.getByUserId = (req, res) => {
//     Order.find()
//         .select()
//         .where('user_id', req.params.id)
//         .sort({ name: 'asc' })
//         .exec((err, orders) => {
//             if (err) {
//                 return res.status(500).send(err)
//             } else {
//                 return res.status(200).send(orders);
//             }
//         });
// };
exports.addVitals =  async function (req, res){
    User.find({"username":req.body.username}, async function (err, user) {

        if (err) {
            return res.status(500).send(err);
        }
        const vitals = new Vitals(req.body);

        // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
        await vitals.save();
        user.vitals.push(vitals);
        await user.save();
        res.status(200).json({success:true, data: user });
    });
}

exports.addVitalsTest =  async function (req, res){
    User.find({"username": "380123456789"}, async function (err, user) {

        if (err) {
            return res.status(500).send(err);
        }
        const vitals = new Vitals(req.body);

        // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
        await vitals.save();
        user.vitals.push(vitals);
        await user.save();
        res.status(200).json({success:true, data: user });
    });
}
exports.getUserVitals = async function (req,res){
    User.
    findOne({"username":req.body.username}).
    populate({
        path : "vitals",
        options: { limit: 200 }
    }).
    exec(function (err, user) {
        if (err)  return res.status(500).send(err);
        res.status(200).json({success:true, data: user.vitals });
        //console.log('The author is %s', story.author.name);

    });
}
