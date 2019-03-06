var express=require('express'),
app = express(),
port = process.env.PORT || 1337;
var credentials = require('../credentials.json');

var mysql=require("mysql");

credentials.host="ids"
credentials.database = "create_tables"
var connection = mysql.createConnection(credentials);
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var tableinf = [];

var getConnection=function(){
  return pool.getConnectionAsync().disposer(
    function(connection){
      return connection.release();
    }
  );
};

var query = function(command) {
  return using(getConnection(),function(connection){
    return connection.queryAsync(command);
  });
};

var result = query("select * from till_buttons;");

result.then(function(dbfs,err){
  console.log(dbfs)
}).then(function(){
  pool.end();
});

connection.connect(function(err) {
  if (err) throw err;
  connection.query("select * from till_buttons;", function (err, result, fields) {
    if (err) throw err;
    tableinf = result;
  });
});

console.log(tableinf[0])

var buttons=[{"buttonID":1,"left":10,"top":70,"width":100,"label":"hotdogs","invID":1},{"buttonID":2,"left":110,"top":70,"width":100,"label":"hambugers","invID":2},{"buttonID":3,"left":210,"top":70,"width":100,"label":"bannanas","invID":3},{"buttonID":4,"left":10,"top":120,"width":100,"label":"milkduds","invID":4}]; //static buttons

app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
  res.send(buttons);
});

app.listen(port);
