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
var pool = mysql.createPool(credentials);

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
  var dbfarr = new Array(dbfs.length);
  //console.log(dbfs[0].label)
  dbfs.forEach(function (item, index) {
  	//console.log(item.leftPosition)
	dbfarr[index] = {"buttonID":item.button_id,
		"left":item.leftPosition,
		"top":item.topPosition,
		"width":item.wide,
		"label":item.label,
		"invID":item.invID};
	//console.log(dbfarr[index])
  })
app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
  res.send(dbfarr);
});

app.listen(port);
}).then(function(){
  pool.end();
});

