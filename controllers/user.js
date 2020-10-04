// Load required packages
var config = require('../config'); // get config file
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Note = require('../models/note');
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
exports.loginUsers = function(req, res) {

    User.find({"username":req.body.username}, function (err, user){

        if (err) {
            return res.status(500).send(err);
        }
        else if(user[0] == null) {
            console.log("nenahod");
            return res.status(401).send({auth: false, token: null});
            // return false;
        }

        else {
            var passwordIsValid = bcrypt.compareSync(req.body.password, user[0].password);


                if (err) { return res.status(500).send(err); }
// Password did not matchs
                if (!passwordIsValid) { return res.status(401).send("Wrong password");   }

                // Success
                var token = jwt.sign({username: req.body.username}, config.secret, {
                    expiresIn: 86400 // expires in 24 hours

                });
                console.log("PIDOR")
                return res.status(200).send({auth: true, token: token});
                //return res.status(200).json({"token":'Basic '+Buffer.from(req.body.username+":"+req.body.password).toString('base64'),"_id":user[0]._id});
               // return true;


        }
    });

};
exports.getNotes = function(req, res){
    //User.findOneAndUpdate

    User.find({"username":req.body.decoded}, 'notes',function (err, user){

        if (err) {
            return res.status(500).send(err);
        }

        else  {

            res.status(200).json(user[0].notes);
        }

    });

}
exports.updateNote = function(req, res){
    //User.findOneAndUpdate
   var id =  req.params.id;

    User.findOne({"username":req.body.decoded, "notes._id" : id}, 'notes',function (err, user){
        console.log(req.body);
        if (err) {
            return res.status(500).send(err);
        }

        else  {
            var note  = user.notes.id(id);
            console.log(note);

            note.title = req.body.title;
            note.content = req.body.content;
            note.updateDate = new Date();


            user.save(function(err) {
                if (err)
                    return res.send(err);

                res.status(200).json({ message: 'Note modified! ' });
            });
        }

    });

}

exports.createNote = function(req, res){
    //User.findOneAndUpdate

    User.findOne({"username":req.body.decoded}, 'notes',function (err, user){
console.log(user);
        if (err) {
            return res.status(500).send(err);
        }

        else  {
            var note = new Note({
                id : req.body.id,
                title : req.body.title,
                content : req.body.content,
                createDate : req.body.createDate,
                updateDate : req.body.updateDate
            });
            user.notes.push(note);
            user.save(function(err) {
                if (err)
                    return res.send(err);

                res.status(200).json(note);
            });
        }

    });

}
//exports.createUser = function(req,res)
// Create endpoint /auth/register for POST
exports.postUsers = function(req, res) {
    User.find({"username":req.body.username}, function (err, user){

        if (err) {
            return res.status(500).send(err);
        }

        else if(user[0] == null) {
            var user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            user.save(function(err) {
                if (err)
                    return res.send(err);

                res.status(200).json({ message: 'User has been successfully created! ' });
            });
        }
        else {

           return res.status(302).json({message: 'Already created'});

        }
    });



};

// Create endpoint /auth/users for GET
exports.getUsers = function(req, res) {

    User.find(function(err, users) {
        if (err)
            return res.send(err);

        res.json(users);
    });
};