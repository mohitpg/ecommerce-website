const express=require("express");
const bodyParser= require("body-parser");
const https = require('https');
const mongoose= require("mongoose");
const { stringify } = require("querystring");
const app=express();
app.set("view engine","ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://127.0.0.1:27017/temp");
const userSchema= {
    name: String,
    email: String,
    password: String
}
const User= mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})
var loginstat=false;
var logout=true;
var femail;
var items=[];
app.get("/login",function(req,res){
    if(loginstat==true){
        res.send("<h1>You are already Logged in!</h1>");
    }
    else{
        res.sendFile(__dirname+"/login/login.html")
    }
})
app.get("/register",function(req,res){
    res.sendFile(__dirname+"/register/register.html")
})
app.post("/login",function(req,res){
    femail=req.body.email;
    let pwd=req.body.pwd;
    let temp= User.find({},'name').exec();
    temp.then(function(res){
        let temp2= res[0].name;
        console.log(temp2)
        console.log(res);
    })
    loginstat=true;
    logout=false;
    res.redirect("/");
    
})
app.post("/register",function(req,res){
    let remail=req.body.remail;
    let rpass=req.body.rpass;
    let rname=req.body.rname;
    const user= new User({
        name: rname,
        email: remail,
        password: rpass
    })
    user.save();
    res.redirect("/");
    
})
app.get("/logout",function(req,res){
    loginstat=false;
    logout=true;
    res.redirect("/");
})
app.get("/views/trackOrder",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{  
    res.render("trackOrder/track");}
})
app.get("/views/mcard",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{
    res.render("mcard/mcard");}
})
app.get("/views/mcart",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{
    res.render("mcart/mcart");}
})
app.get("/views/mlist",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{
    res.render("mlist/mlist",{iteml:items});}
})
app.post("/views/mlist",function(req,res){
    var itemp= req.body.newitem;
    items.push(itemp);
    res.redirect("/views/mlist");
})
app.get("/views/mprod",function(req,res){
    let fauth="a@gmail.com";
    console.log(femail);
    console.log(fauth);
    if(femail !== fauth){
            res.send("<h1>Sorry! You are not authorized</h1>");}
    else if (loginstat==false){
        res.send("<h1>Sorry! You are not logged in</h1>");
    }
    else{
    res.render("mprod/mprod");}
})
app.get("/views/muser",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{
    res.render("muser/muser");}
})
app.listen(3000,()=>{
    console.log("ok");
})
//736b677ceeca34c64969e4d233c135c3-us17
//2e5bdb1c8c