const sql = require('mssql');
const sqlConfig = require('../shared/sqlConfig.js').SqlConfig;
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

CacheSqlServer = function (app){
    app.post('/createAccountCacheSql', createAccount);
    app.post('/deleteAllAccountCacheSql', deleteAllAccounts);

    sql.connect(sqlConfig, err => {
        if (err) {
           console.log('Failed to open a SQL Database connection.', err.stack);
           process.exit(1);
        }
     });
}

function getAllAccounts(req, res){
    const mykeys = myCache.keys();
    res.send(myCache.mget(mykeys));
}

function createAccount(req, res){    
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

    const productQuery = `insert into Account (Name, Email, Password, CreateDate, Guid) values ('${username}', '${email}', '${password}', '${createDate}', '${guid}')`;
    const request = new sql.Request();

    request.query(productQuery, (err, result) => {
        if (err) 
            res.status(500).send(err);
        
        myCache.set(accountToCache.guid, accountToCache, 0);
        getAllAccounts(req, res);
    });
}

function deleteAllAccounts(req, res){
    const productQuery = `delete Account`;
    const request = new sql.Request();

    request.query(productQuery, (err, result) => {
        if (err) 
            res.status(500).send(err);
        
        myCache.flushAll();
        res.status(200).send(result);
    });
}

exports.CacheSqlServer = CacheSqlServer;