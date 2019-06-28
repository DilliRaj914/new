
   
var express = require("express");
var bodyParser = require("body-parser"); 
var sql = require("mssql");
var app = express(); 
var ejs = require("ejs");
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json()); 
  
var routes = require('./routes/index');


app.set('view engine','ejs');
app.set('views', __dirname+ '/views');
app.engine('ejs',require('ejs').renderFile);

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("app listening at http://%s:%s", host, port)
});

     
var dbConfig = { 
    user: 'sa',
    password:'revanth100',
    server: 'CHAITHANYAB-PC\\MSSQLSERVER11', 
    database: 'users' 
    };   

    app.get('/', function (req, res) {
      sql.connect(dbConfig, function() {
          var request = new sql.Request();
          var stringRequest = 'select * from usertable'; 
          request.query(stringRequest, function(err,rows) {
              if (err) {
                // req.flash('error', err)
                res.render('user/list', {
                  title: 'User List', 
                  data: ''
                })
              } else {
                // render to views/user/list.ejs template file
                // console.log('test - ',rows.length,', recordset - ',rows.recordset)
                res.render('user/list', {
                  title: 'User List', 
                  data: rows.recordset 
                  
                })
                
              }sql.close();
              
          });
      });
  })

app.use('/', routes);

app.get('/users/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
	
		FirstName: '',
    LastName: '',
    Age:'',	
	})  
})    

     

app.post('/add',urlencodedParser, function(req , res){
  
  sql.connect(dbConfig, function() {
    var request = new sql.Request();
    
		
    request.query( "INSERT INTO [usertable] (FirstName,Lastname,Age) values(' "+req.body.FirstName+"',' "+req.body.LastName + " ','"+ req.body.Age +"') ", function(err, data) {
      if (err) {
       
        
        // render to views/user/add.ejs
        res.render('user/add', {
          title: 'Add New User'
         
         
        })
      } else {				
        
        
        // render to views/user/add.ejs
        // res.render('user/add', {
        //   title: 'Add New User',
        //   ID: '',
        //   FirstName: '',
        //   LastName: '',
        //   Age	:''				
        // })
      //   res.render('user/list', {  
      //     title: 'Add New User',
      //     ID: req.body.ID,
      //     FirstName: req.body.FirstName,
      //     LastName: req.body.LastName,
      //     Age: req.body.Age
      // })
      res.send(data)
      }sql.close();
    });
});
    
                
});  
   
app.get('/users/edit/:id', function(req, res, next){
  sql.connect(dbConfig, function() {
    var request = new sql.Request();
    
  request.query('SELECT * FROM [usertable] WHERE id = '+req.params.id, function(err,rows){
    if(err) throw err
     var data=rows.recordset;
    // if user not found
    if (data.length <= 0) {
      req.flash('error', 'User not found with id = ' + req.params.id)
      res.redirect('/')
    }
    else { // if user found
      // render to views/user/edit.ejs template file
      res.render('user/edit', {
        title: 'Edit User', 
        //data: rows[0],
         
        id: data[0].id,
        FirstName: data[0].FirstName,
        LastName: data[0].LastName,
        Age: data[0].Age,
       					
      })
      // res.send(rows.recordset);
    }	sql.close();
  }) 
});
}) 
    
app.put('/users/edit/:id',urlencodedParser, function(req, res, next) {
  sql.connect(dbConfig, function() { 
    var request = new sql.Request();
     
  request.query("UPDATE [usertable] SET FirstName = '" + req.body.FirstName  +  "' , LastName=  '" + req.body.LastName + "',Age='" +req.body.Age + "' WHERE id = " +   req.params.id, function(err,rows) {
      //if(err) throw err
      if (err) {
        // req.flash('error', err)
        
        // render to views/user/add.ejs
        // res.render('user/edit', {
        //   title: 'Edit User',
         
        //   id: req.params.id,
        //   FirstName: req.body.FirstName,
        //   LastName: req.body.LastName,
        //   Age: req.body.Age
          
        // })
        res.send(err);
      } else {
        // req.flash('success', 'Data updated successfully!')
        
        // render to views/user/add.ejs
        res.render('user/edit', {
          title: 'Edit User',
          id: req.params.id,
         
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          Age: req.body.Age,
         
        }) 
        // res.send(rows);
      }sql.close();
    });
  })      
}) 
    

app.delete('/users/delete/:id',urlencodedParser, function(req, res, next) {
	 
  sql.connect(dbConfig, function() {  
    var request = new sql.Request();
     
  request.query("DELETE FROM [usertable] WHERE id = " + req.params.id , function(err,rows) {
  if (err) {
    // res.redirect('/')
    res.send(err);
  } else {
    // req.flash('success', 'User deleted successfully! id = ' + req.body.id)
    // redirect to users list page
    // res.redirect('/');
    res.send(rows);
  }sql.close();
});
})
}) 
 

module.exports = app;