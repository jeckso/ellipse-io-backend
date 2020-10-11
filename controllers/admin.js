// Load required packages
var config = require('../config'); // get config file
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Admin = require('../models/admin');
var Note = require('../models/note');
var User = require('../models/user');
const sortArray = require('sort-array');
exports.getUsers = function(req, res){
    const options ={
        offset : req.query.offset,
        limit : req.query.count,
        sort : req.query.orderBy,

    }
User.paginate({},options,function(err,result){
    return res.status(200).json(result);
})

}
function Arrpaginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
exports.getPaginate = function(req,res){

    const options ={
        offset : req.query.offset,
        limit : req.query.count,
        sort : req.query.orderBy,

    }
    console.log(req.params.id);
    User.find({"_id":req.params.id}, 'notes',function (err, user){

        if (err) {
            return res.status(500).send(err);
        }

        else  {
            console.log(user);
            var pageNumber = options.offset/options.limit+1;
            var numItemsPerPage = options.limit;
            const jsArray = user[0].notes.toObject();
            // console.log(jsArray);
            const result = Arrpaginate(jsArray,numItemsPerPage,pageNumber);
            res.status(200).json(sortArray(result,{ by: 'createDate',
                order: options.sort}));
        }

    });

}
exports.postAdmin = function(req, res) {
    Admin.find({"username":req.body.username}, function (err, user){

        if (err) {
            return res.status(500).send(err);
        }

        else if(user[0] == null) {
            var user = new Admin({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            user.save(function(err) {
                if (err)
                    return res.send(err);

                res.status(200).json({ message: 'Admin has been successfully created! ' });
            });
        }
        else {

            return res.status(302).json({message: 'Already created'});

        }
    });



};
exports.loginAdmin = function(req, res) {
    Admin.find({"username":req.body.username}, function (err, admin){

        if (err) {
            return res.status(500).send(err);
        }
        else if(admin[0] == null) {
            console.log("nenahod");
            return res.status(401).send({auth: false, token: null});
            // return false;
        }

        else {
            var passwordIsValid = bcrypt.compareSync(req.body.password, admin[0].password);


            if (err) { return res.status(500).send(err); }
// Password did not matchs
            if (!passwordIsValid) { return res.status(401).send("Wrong password");   }

            // Success
            var token = jwt.sign({username: req.body.username, isAdmin : 1}, config.secret, {
                expiresIn: 86400 // expires in 24 hours

            });
            console.log("PIDOR")
            return res.status(200).send({auth: true, token: token});
            //return res.status(200).json({"token":'Basic '+Buffer.from(req.body.username+":"+req.body.password).toString('base64'),"_id":user[0]._id});
            // return true;


        }
    });

};