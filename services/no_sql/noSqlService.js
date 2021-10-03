const noSqlConfig = require('../shared/noSqlConfig.js');
const { v4: uuidv4 } = require('uuid');

NoSqlService = function(app){
    app.post('/createAccountNoSql', createAccount);
    app.post('/deleteAllAccountNoSql', deleteAllAccounts);
}

function getAllAccounts(req, res){
    const accounts = noSqlConfig.Mongoose.model('account', noSqlConfig.UserSchema, 'account');
    accounts.find({}).lean().exec().then((docs)=>{
        res.send(docs);
    });
}

function createAccount(req, res){    
    const Accounts = noSqlConfig.Mongoose.model('account', noSqlConfig.UserSchema, 'account');

    const username = req.body.name == undefined ? 'teste' : req.body.name;
    const email = req.body.email == undefined ? 'teste@teste.com' : req.body.email;
    const password = req.body.password == undefined ? '1234' : req.body.password;    
    const guid = uuidv4();
    var createDate = new Date();
    createDate = createDate.toISOString().slice(0, 19).replace('T', ' ');

    const account = new Accounts({ username, email, password, createDate, guid});

    try {
        account.save().then(() => getAllAccounts(req, res));        
    } catch (err) {
        res.status(500).send(err);
    }
}

function deleteAllAccounts(req, res){   
    const accounts = noSqlConfig.Mongoose.model('account', noSqlConfig.UserSchema, 'account');    

    try {
        accounts.deleteMany({}).then((result) => res.status(200).send(result));       
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.NoSqlService = NoSqlService;