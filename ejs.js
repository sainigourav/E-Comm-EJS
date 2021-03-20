var express = require("express");
var fs = require("fs");
var app = express();
var session = require("express-session");
var multer = require("multer");
var body_parser = require("body-parser");
var path = require("path");

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.listen(8000);
console.log("server is running");

var multer_storage_config = multer.diskStorage({
	destination:__dirname+"/public_html/uploads",
	filename: function(req, file, callback){
		callback(null, file.originalname);
	}
})
var uploader = multer({storage: multer_storage_config});
app.use(
	session({
	  secret: "helloworld",
	  resave: false,
	  saveUninitialized: true
	})
  );
// ----------------MiddleWare------------
app.use(express.static("public_html"));
app.use(express.static("uploads"));
app.use(express.static("partials"));
app.set("view engine","ejs");

app.get("/",function(req,res){
    if(req.session.login == true)
	{
		fs.readFile(path.join(__dirname+"/public_html/CartItem.txt"), function(err, data){
		if(err)
		{
			throw err;
		}
		data = JSON.parse(data);
		res.render("main",{item:data});
		})
		
	}
	else{
		res.render("index");
	}
})

app.get("/signup",function(req,res){
    if(req.session.login == true)
	{
		fs.readFile(path.join(__dirname+"/public_html/CartItem.txt"), function(err, data){
			if(err)
			{
				throw err;
			}
			data = JSON.parse(data);
			res.render("main",{item:data});
			})
	}
	else{
		res.render("signup");
	}
})

app.get("/main",function(req,res){
    if(req.session.login == undefined)
	{
		res.render("index");
	}
	else{
		fs.readFile(path.join(__dirname+"/public_html/CartItem.txt"), function(err, data){
			if(err)
			{
				throw err;
			}
			data = JSON.parse(data);
			res.render("main",{item:data});
			})
	}
})


app.get("/cart",function(req,res){
    if(req.session.login == undefined)
	{
		res.render("index");
	}
	else{
	fs.readFile(path.join(__dirname+"/public_html/emailcart.txt"), function(err, data){
		if(err)
		{
			throw err;
		}
		data = JSON.parse(data);
		var temp = [];
		for(var i=0;i<data.length;i++)
		{
			if(req.session.email == data[i].emailId)
			{
				temp.push(data[i]);
			}
		}
		res.render("cart",{item:temp});
		})
	}
})

app.get("/logout",function(req,res){
	req.session.destroy();
	res.render("index");
})

var emailId;
app.post("/",function(req,res){
	req.session.login = true;
	req.session.fname = req.body.name;
	req.session.email = req.body.email;
	emailId = req.body.email;
	fs.readFile(path.join(__dirname+"/public_html/CartItem.txt"), function(err, data){
		if(err)
		{
			throw err;
		}
		data = JSON.parse(data);
		res.render("main",{item:data});
		})
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
				res.send("./uploads/"+data[i].profile_pic);
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
	res.render("index");
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

