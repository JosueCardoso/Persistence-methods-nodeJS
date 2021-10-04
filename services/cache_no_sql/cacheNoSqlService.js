const noSqlConfig = require('../shared/noSqlConfig.js');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

CacheNoSqlService = function(app){
    app.post('/createAccountCacheNoSql', createAccount);
    app.post('/deleteAllAccountCacheNoSql', deleteAllAccounts);
}

function getAllAccounts(req, res){
    const mykeys = myCache.keys();
    res.send(myCache.mget(mykeys));
}

function createAccount(req, res){    
    const Accounts = noSqlConfig.Mongoose.model('account', noSqlConfig.UserSchema, 'account');

    const username = req.body.name == undefined ? 'teste' : req.body.name;
    const email = req.body.email == undefined ? 'teste@teste.com' : req.body.email;
    const password = req.body.password == undefined ? '1234' : req.body.password;    
    const guid = uuidv4();
    var createDate = new Date();
    createDate = createDate.toISOString().slice(0, 19).replace('T', ' ');

    const accountToCache = {
        name: username,
        email: email,
        password: password,
        createDate: createDate,
        guid: guid
    };

    const account = new Accounts({ username, email, password, createDate, guid});

    try {
        account.save().then(() => {
            myCache.set(accountToCache.guid, accountToCache, 0);
            getAllAccounts(req, res);
        });        
    } catch (err) {
        res.status(500).send(err);
    }
}

function deleteAllAccounts(req, res){   
    const accounts = noSqlConfig.Mongoose.model('account', noSqlConfig.UserSchema, 'account');    

    try {
        accounts.deleteMany({}).then((result) => {
            myCache.flushAll();
            res.status(200).send(result);
        });       
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.CacheNoSqlService = CacheNoSqlService;