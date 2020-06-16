var express = require('express');
var mysql = require('mysql');
const path = require('path');
const io=require('socket.io')(8000);
var app = express();
const port = 80;


    app.set('view engine', 'pug') // Set the template engine as pug
    app.set('views', path.join(__dirname, 'views'));
    app.use('/static', express.static('static')); // For serving static files
    app.use(express.urlencoded());
///
///	Create connection to MySQL database server.
/// 

function getMySQLConnection() {
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'Abhi@123',
	  database : 'batch'
	    //  port : '3306',
	});
}


app.get('/', (req, res)=>{
    const con = "This is the best content on the internet so far so use it wisely"
    const params = {'title': 'PubG is the best game', "content": con}
    res.status(200).render('main.pug', params);
});
app.get('/contact',(req,res)=>{
	params="you can contact here";
	res.status(200).render('contact.pug', {"params":params});
});

app.post('/', function(req, res) {
	// Connect to MySQL database.
	// console.log("iAm here");
	let bod=req.body;
	
	var connection = getMySQLConnection();
    connection.connect();
      let idname=bod.id;
      let pass=bod.pass;
	// Do the query to get data.
	connection.query(`SELECT * FROM clients WHERE id LIKE '${idname}'` ,  function(err, rows, fields) {
		var person;
        //   console.log("i am here");
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		if(rows.length>=1) {
	  			// Create the object to save the data.
	  			var person = {
		  			'name':rows[0].name,
		  			'email':rows[0].email,
		  			'phone':rows[0].phone,
		  			'id':rows[0].id
                  }
                  let namek=person.name;
				  let passk=namek.substr(0,2)+namek.substr(namek.length-2,2);
                  if(passk.localeCompare(pass)==0) {
                    res.render('chatP.pug', {"person": person});
                  }
                  else{
                    res.status(404).json({"status_code":404, "status_message": "Wrong Password"});
                  }
		  		   
	  		} else {
	  			// render not found page
	  			res.status(404).json({"status_code":404, "status_message": "Not found"});
	  		}
	  	}
	});

	// Close MySQL connection
	connection.end();
});



const users = {};
io.on('connection', socket =>{
       socket.on('request',name=>{
		   console.log(name);
		   users[socket.id]=name;
		   socket.broadcast.emit('joined',name);
	   });
	   socket.on('smsg', message =>{
			socket.broadcast.emit('rcv',{'message': message,'name':users[socket.id]});
	   });
	   socket.on('disconnect', message =>{
		socket.broadcast.emit('chalgya',users[socket.id]);
		delete users[socket.id];
   });
	
});

app.listen(port, function () {
    
    console.log('listening on port', 80);
});