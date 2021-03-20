var express = require("express");
var fs = require("fs");
var app = express();
var session = require("express-session");
var multer = require("multer");
var body_parser = require("body-parser");
var path = require("path");

// ----------------MiddleWare------------
app.use(express.static("public_html"));
app.use(body_parser.json());
var multer_storage_config = multer.diskStorage({
	destination:__dirname+"/public_html/uploads",
	filename: function(req, file, callback){
		callback(null, file.originalname);
	}
})

var uploader = multer({storage: multer_storage_config});

app.use(body_parser.urlencoded({extended:true}));
app.use(
	session({
	  secret: "helloworld",
	  resave: false,
	  saveUninitialized: true
	})
  );
app.listen(8000);
console.log("server is running");


// app.post("/uploads",uploader.single("profile_pic"),function(req,res,next){
// 		res.send(req.file);
// })
// -------------Route Handling----------
app.get("/",function(req,res){
	if(req.session.login == true)
	{
		res.redirect("/main.html");
	}
	else{
		res.sendFile(path.join(__dirname+"/index.html"));
	}
	
})

app.get("/main.html",function(req,res){
	if(req.session.login == undefined)
	{
		res.redirect("/");
	}
	else if(req.session.login == true)
	{
		res.sendFile(path.join(__dirname+"/main.html"));
	}	
})

app.get("/signup.html",function(req,res){
	if(req.session.login == true)
	{
		res.redirect("/main.html");
	}
	else if(req.session.login == undefined)
	{
		res.sendFile(path.join(__dirname+"/signup.html"));
	}
	
})

app.get("/cart.html",function(req,res){
	if(req.session.login == undefined)
	{
		res.redirect("/");
	}
	else if(req.session.login == true)
	{
		res.sendFile(path.join(__dirname+"/cart.html"));
	}
	
})

app.get("/logout",function(req,res){
	req.session.destroy();
	return res.redirect("/");
})



var emailId;
app.post("/",function(req,res){
	req.session.login = true;
	req.session.fname = req.body.name;
	req.session.email = req.body.email;
	console.log(req.body);
	var user = [req.body];
	emailId = req.body.email;
	fs.writeFile(path.join(__dirname+"/public_html/loggedin.txt"), JSON.stringify(user), function(err){
		if(err)
		{
			throw err;
		}
	})
	res.redirect("main.html");
})
app.get("/profile",function(req,res){
	res.send(req.session.fname);
})
app.get("/p_pic",function(req,res){
	fs.readFile(path.join(__dirname+"/public_html/newCustomer.txt"), function(err, data){
		if(err)
		{
			throw err;
		}
		data = JSON.parse(data);
		for(var i=0;i<data.length;i++)
		{
			if(req.session.email == data[i].email)
			{
				res.send("/uploads/"+data[i].profile_pic);
			}
		}
	})
})
app.get("/userEmail",function(req,res){
	res.send(req.session.email);
})


app.post("/login", uploader.single("profile_pic"),function(req,res){
	var reqPath = "newCustomer"
	req.session.login == true;
	var fullname = req.body.fullname;
	var email = req.body.email;
	var password = req.body.password;
	var profile_pic = req.file.originalname;
	var obj = {fullname,email,password,profile_pic};
	req.session.pic == req.file.profile_pic;
	fileReadWrite(reqPath, obj);
	res.sendFile(path.join(__dirname+"/index.html"));
})

app.post("/emailcart",function(req, res){
	var id = req.body.id;
	var itemName = req.body.itemName;
	var rupees = req.body.rupees;
	var source = req.body.source;
	var descr = req.body.descr;
	var quantity = req.body.quantity;

	var obj = {emailId,id,itemName,rupees,source,descr,quantity};
	fileReadWrite("emailcart", obj);
	res.end();
})

app.get("/del",function(req, res){
	res.sendFile(path.join(__dirname+"/public_html/emailcart.txt"));
})
app.post("/del",function(req, res){
			fs.writeFile(path.join(__dirname+"/public_html/emailcart.txt"), JSON.stringify(req.body), function(err){
				if(err)
				{
					throw err;
				}
			})
			res.end();
	})

function fileReadWrite(pathReach, newData){
	fs.readFile(path.join(__dirname+"/public_html/"+pathReach+".txt"), function(err, data){
		if(err)
		{
			throw err;
		}
				if(data.length === 0)
				{
					data = [];
				}
				else
				{
					data = JSON.parse(data);
				}
				data.push(newData);
				fs.writeFile(path.join(__dirname+"/public_html/"+pathReach+".txt"), JSON.stringify(data), function(err){
					if(err)
					{
						throw err;
					}
				})
				
			});
}


