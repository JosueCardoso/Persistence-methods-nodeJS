const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SqlManager = require('./services/sql/sqlService.js').SqlServer;
const sqlService = new SqlManager(app);

const NoSqlManager = require('./services/no_sql/noSqlService.js').NoSqlService;
const noSqlService = new NoSqlManager(app);

const CacheSqlManager = require('./services/cache_sql/cacheSqlService').CacheSqlServer;
const cacheSqlService = new CacheSqlManager(app);

const CacheNoSqlManager = require('./services/cache_no_sql/cacheNoSqlService.js').CacheNoSqlService;
const cacheNoSqlService = new CacheNoSqlManager(app);

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
 });