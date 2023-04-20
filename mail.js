const express=require("express");
const bodyParser= require("body-parser");
const https = require('https');
const { stringify } = require("querystring");
const app=express();
app.set("view engine","ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})
var loginstat=false;
app.get("/login",function(req,res){
    res.sendFile(__dirname+"/login/login.html")
})
app.post("/login",function(req,res){
    let femail=req.body.email;
    let pwd=req.body.pwd;
    console.log(femail)
    loginstat=true;
    res.redirect("/");
    
})
app.get("/views/trackOrder",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }else{
    res.render("trackOrder/track");}
})

app.listen(3000,()=>{
    console.log("ok");
})
//736b677ceeca34c64969e4d233c135c3-us17
//2e5bdb1c8c