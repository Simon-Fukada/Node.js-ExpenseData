var http = require('http');
var fs = require('fs');
var sql = require('mssql');


var dbConfig = {
    server:"YourServer",
    database:"SampleDB",
    user:"test",
    password:"yourPassword",
    port:Yourport
};

function getEmp(){
    var conn = new sql.ConnectionPool(dbConfig);
    var req = new sql.Request(conn);

    conn.connect(function(err){
        if (err){
            console.log(err);
            return;
        }
        req.query("SELECT * FROM Emp",function(err,recordset){
            if (err){
                console.log(err);
                return;
            }
            else{
                console.log(recordset);
            }
            conn.close();
        }); 
    }); 
}

//getEmp();

function insertExpense(d,p,n){
    var pool = new sql.ConnectionPool(dbConfig);
    const req = new sql.Request(pool);
    var affectedRecords;
    pool.connect(function(err){
        if (err){
            console.log(err);
            return;
        }
    
        req.input('date', sql.VarChar(100), d);
        req.input('price', sql.Decimal(10,2), p);
        req.input('note', sql.VarChar(100), n);
        req.query('INSERT INTO expenses (Expense_date,Expense_price,Expense_note) VALUES (@date,@price,@note)', (err, result) => {
            affectedRecords = result.rowsAffected;
            console.log("affectedRows varible:"+affectedRecords);
            if(affectedRecords == 1)
            {
                console.log("the numbere of affected rows: " + result.rowsAffected);
                return 'success';
            }
        });
}); 

};

function getStatistics()
{
    var pool = new sql.ConnectionPool(dbConfig);
    var req = new sql.Request(pool);

    pool.connect(function(err){
        if (err){
            console.log(err);
            return;
        }
        req.query("SELECT AVG(Expense_price) as Means, SUM(Expense_price) as Sum, STDEV(Expense_price) as StdDev, COUNT(Expense_price) as Count FROM expenses",function(err,recordset){
            if (err){
                console.log(err);
                return;
            }
            else{
                console.log(recordset);
                return recordset;
            }
            pool.close();
        }); 
    }); 
}

//404 response
function send404response(response){
    response.writeHead(404, {"content-type":"text/plain"});
    response.write("Error: That page is no where to be seen!!!!!");
    response.end();
}

//handel user requests
function onRequest(request,response)
{
    if(request.method == 'GET' && request.url == '/')
    {
        response.writeHead(200, {"content-type":"text/html"});
        fs.createReadStream("./index.html").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/nav.html')
    {
        response.writeHead(200, {"content-type":"text/html"});
        fs.createReadStream("./nav.html").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/toby.jpg')
    {
        response.writeHead(200, {"content-type":"image/jpeg"});
        fs.createReadStream("./toby.jpg").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/calculator')
    {
        response.writeHead(200, {"content-type":"text/html"});
        fs.createReadStream("./calculator.html").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/tobypics')
    {
        response.writeHead(200, {"content-type":"text/html"});
        fs.createReadStream("./tobypics.html").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/tobyOnFloor.jpg')
    {
        response.writeHead(200, {"content-type":"image/jpeg"});
        fs.createReadStream("./tobyOnFloor.jpg").pipe(response);
    }
    else if(request.method == 'GET' && request.url == '/functions.js')
    {
        response.writeHead(200, {"content-type":"text/javascript"});
        fs.createReadStream("./functions.js").pipe(response);
    }
    else if(request.method == 'POST' && request.url == '/insert')
    {
        response.writeHead(200, {"content-type":"text/javascript"});
        var body = '';
        request.on('data', function (data) {
            body += data;

            obj = JSON.parse(body);
            
            var date = obj.date;
            var spent = obj.spent;
            var note = obj.note;

            var result = insertExpense(date,spent,note);
            response.end('Submitted');

        });
    }
    else if(request.method == 'GET' && request.url == '/getStatistics')
    {
        response.writeHead(200, {"content-type":"application/json"});
        var pool = new sql.ConnectionPool(dbConfig);
        var req = new sql.Request(pool);

        pool.connect(function(err){
            if (err){
                console.log(err);
                return;
            }
            req.query("SELECT AVG(Expense_price) as Means, SUM(Expense_price) as Sum, STDEV(Expense_price) as StdDev, COUNT(Expense_price) as Count FROM expenses",function(err,result){
                if (err){
                    console.log(err);
                    return;
                }
                else{
                    JSONStringStatistics = JSON.stringify(result);
                    response.end(JSONStringStatistics);
                }
                pool.close();
            }); 
        }); 
    }
    else if(request.method == 'GET' && request.url == '/getGraph')
    {
        response.writeHead(200, {"content-type":"application/json"});
        var graphArray = [];

        var pool = new sql.ConnectionPool(dbConfig);
        var req = new sql.Request(pool);

        pool.connect(function(err){
            if (err){
                console.log(err);
                return;
            }
            req.query("SELECT Expense_date FROM expenses",function(err,result){
                if (err){
                    console.log(err);
                    return;
                }
                else{
                    JSONStringDates = JSON.stringify(result);
                    graphArray[0] = JSONStringDates;
                }
                //Close use to be here
                req.query("SELECT Expense_price FROM expenses",function(err,result){
                    if (err){
                        console.log(err);
                        return;
                    }
                    else{
                        JSONStringPrices= JSON.stringify(result);
                        graphArray[1] = JSONStringPrices;
                        JSONgraphArray = JSON.stringify(graphArray);
                        response.end(JSONgraphArray);
                    }
                    pool.close();
                }); 
            }); 
        });
            
    }
    else
    {
        send404response(response);
    }
}


//create server
http.createServer(onRequest).listen(8888);
console.log('server is running ...');