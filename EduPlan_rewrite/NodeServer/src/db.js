var greska = [], // objekt koji vraca gresku
    outputvalue = [], // output parametar kod azuriranja podataka
    appConfig = require('./appConfig.js'),
    ConnectionPool = require('tedious-connection-pool');
    
// konfiguracija za pooler
var config = {
  server: appConfig.databaseServer,
  instanceName: appConfig.instancename,
  userName: appConfig.username,
  password: appConfig.password,
  options: {
    encrypt: true,
    database: appConfig.databaseName
  }
};
if (appConfig.instanceName !== '') {
  config.options.instanceName = appConfig.instanceName;
}

var poolConfig = {
  min: 2,
  max: 4,
  log: false,
  acquireTimeout: 300000
};
var pool = new ConnectionPool(poolConfig, config);

function createConnection() {
  var config = {
    server: appConfig.databaseServer,
    instanceName: appConfig.instancename,
    
    // nova verzija logiranja Tediousa
    // authentication: {
    //   type: "default",
    //   options: {
    //     userName: appConfig.username,
    //     password: appConfig.password,
    //   }
    // },

    // stara verzija logiranja Tediousa
    userName: appConfig.username,
    password: appConfig.password,

    options: {
      encrypt: true,
      database: appConfig.databaseName
    }
  };
  var Connection = require('tedious').Connection;
  var connection = new Connection(config);
  return connection;
}

function createRequest(query, connection) {
  var Request = require('tedious').Request;
  var req =
    new Request(query,
      function (err, rowCount) {
        if (err) {
          //logger.log('error in db.createRequest', err);
        }
        connection && connection.close();
      });
  return req;
}

function createRequestPool(query, connection) {
  var Request = require('tedious').Request;
  var req =
    new Request(query,
      function (err, rowCount) {
        if (err) {
          //logger.log('error in db.createRequest', err);
        }
        connection.release();
      });
  return req;
}

function stream(query, connection, output, defaultContent) {
  errorHandler = function (ex) {
    throw ex;
  };
  var request = query;
  if (typeof query == "string") {
    request = this.createRequest(query, connection);
  }

  var empty = true;
  request.on('row', function (columns) {
    empty = false;
    output.write(columns[0].value);
  });

  request.on('done', function (rowCount, more, rows) {
    if (empty) {
      output.write(defaultContent);
    }
    output.end();
  });

  var empty = true;
  request.on('row', function (columns) {
    empty = false;
    output.write(columns[0].value);
  });

  request.on('done', function (rowCount, more, rows) {
    if (empty) {
      output.write(defaultContent);
    }
    output.end();
  });

  request.on('doneProc', function (rowCount, more, returnStatus, rows) {
    if (empty) {
      output.write(defaultContent);
    }
    output.end();
  });

  connection.on('connect', function (err) {
    if (err) {
      //logger.log('error in db.Stream.Connection on:', err);
    }
    connection.execSql(request);
  });
}

function execStoredProc(query, connection, output, defaultContent, callback) {
  var request = query;
  greska = [];
  outputvalue = [];
  if (typeof query == "string") {
    request = this.createRequest(query, connection);
  }
  var empty = true;
  request.on('row', function (columns) {
    empty = false;
    output.write(columns[0].value);
  });
  request.on('done', function (rowCount, more, rows) {
    if (empty) {
      output.write(defaultContent);
    }
    output.end();
  });

  request.on('doneProc', function (rowCount, more, returnStatus, rows) {
    if (typeof callback === 'function' && greska.length === 0) {
      callback(outputvalue);
    }
    if (greska.length > 0) {
      output.status(500).write(JSON.stringify(greska[0]));
    }
    if (empty && greska.length == 0) {
      output.write(JSON.stringify(outputvalue));
    }
    outputvalue = [];
    output.end();
  });

  request.on('returnValue', function (parameterName, value, metadata) {
    var temp = {};
    temp[parameterName] = value;
    outputvalue.push(temp);
  });

  connection.on('errorMessage', function (err) {
    //logger.log('error in db.execStoredProc.connection on', err);
    if (err) {
      greska.push(err);
    }
  });

  connection.on('connect', function (err) {
    if (err) {
      console.log(err);
    }
    connection.callProcedure(request);
  });
};

function execStoredProcFromNode(query, connection, output, callback) {
  var request = query,
    greska = [],
    outputvalue = [],
    outputParams = {},
    dbResultObj = [],
    resultRowCount = 0,
    empty = true;

  request.on('doneProc', function (rowCount, more, returnStatus, rows) {
    if (greska.length > 0) {
      output = 'NOK';
      callback(output, outputParams, dbResultObj);
    }
    if (empty && greska.length == 0) {
      output = 'OK';
      callback(output, outputParams, dbResultObj);
    }
  });

  request.on('row', function (columns) {
    var rowObject = {};
    columns.forEach(function (column) {
      rowObject[column.metadata.colName] = column.value;
    });
    dbResultObj.push(rowObject);
  });

  connection.on('errorMessage', function (err) {
    console.log('errorMessage');
    console.log('err', err)
    if (err) {
      greska.push(err);
    }
  });

  request.on('returnValue', function (parameterName, value, metadata) {
    outputParams[parameterName] = value;
  });

  //Ako se koristi s obicnom konekcijom, mora se pozvati unutar eventa
  // connection.on('connect', function (err) {
  //     if (err) {
  //         logger.log('error in db.execStoredProcFromNode.connection.on:', err);
  //     }
  //    connection.callProcedure(request);
  // });

  //radi samo sa tedious poolerom
  connection.callProcedure(request);
};

function execStoredProcNoJSONLocalResults(dbRequest, connection, req, res, callback) {
  var request = dbRequest;
  var resultData = [];
  greska = [];

  request.on('row', function (columns) {
      var rowObject = {};
      columns.forEach(function (column) {
          rowObject[column.metadata.colName] = column.value;
      });
      resultData.push(rowObject);
  });
  request.on('doneProc', function () {
      if (greska.length === 0) {
          if (typeof callback === "function") {
              callback({
                  resultStatus: '0',
                  resultData: resultData
              }, req, res);
          } else {
              return {
                  resultStatus: '0',
                  resultData: resultData
              }
          }
      } else {
          if (typeof callback === "function") {
              callback(greska, req, res);
          } else {
              return {
                  greska
              }
          }
      }
  });
  connection.on('errorMessage', function (err) {
      console.log('error errorMessage', err.message);
      if (err) {
          greska = {
              resultStatus: '9999',
              resultData: err
          };
          return {
              resultStatus: err.message,
              resultData: err
          }
      }
  });
  connection.on('connect', function (err) {
      if (err) {
          // logger.log('error in db.execStoredProcPredmetLocal.connection.on:', err);
          console.log('error connect');
      }
      connection.callProcedure(request);
  });
};

function execStoredProcFromNodeNoPooler(query, connection, output, callback) {

  var request = query,

    greska = [],

    outputvalue = [],

    outputParams = {},

    dbResultObj = [],

    resultRowCount = 0,

    empty = true;



  request.on('doneProc', function (rowCount, more, returnStatus, rows) {

    if (greska.length > 0) {

      // output = 'NOK';

      output = greska[0];

      callback(output, outputParams, dbResultObj);

    }

    if (empty && greska.length == 0) {

      //output.write(defaultContent);

      output = 'OK';

      callback(output, outputParams, dbResultObj);

    }

  });



  request.on('row', function (columns) {

    var rowObject = {};

    columns.forEach(function (column) {

      rowObject[column.metadata.colName] = column.value;

    });

    dbResultObj.push(rowObject);

  });



  connection.on('errorMessage', function (err) {

    console.log('errorMessage');

    console.log('err', err)

    if (err) {

      greska.push(err);

    }

  });



  request.on('returnValue', function (parameterName, value, metadata) {

    outputParams[parameterName] = value;

  });



  connection.on('connect', function (err) {

    if (err) {

      console.log(err);

    }

    connection.callProcedure(request);

  });
};

module.exports.createConnection = createConnection;
module.exports.pool = pool;
module.exports.createRequest = createRequest;
module.exports.createRequestPool = createRequestPool;
module.exports.stream = stream;
module.exports.execStoredProc = execStoredProc;
module.exports.execStoredProcFromNode = execStoredProcFromNode;
module.exports.execStoredProcNoJSONLocalResults = execStoredProcNoJSONLocalResults;
module.exports.execStoredProcFromNodeNoPooler = execStoredProcFromNodeNoPooler;
