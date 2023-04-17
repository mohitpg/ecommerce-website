const express=require("express");
const bodyParser= require("body-parser");
const https = require('https');
const { stringify } = require("querystring");
const app=express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})
app.get("/login",function(req,res){
    res.sendFile(__dirname+"/login/login.html")
})
app.post("/login",function(req,res){
    let email=req.body.email;
    let pwd=req.body.pwd;
    let data={
        members:[
            {
                email_address:email
            }
        ]
    }
    var jsondata=stringify(data);
    const url='https://us17.api.mailchimp.com/3.0/lists/2e5bdb1c8c';
    const options={
        method:"POST",
        auth:"mohitpg:736b677ceeca34c64969e4d233c135c3-us17"
    }
    const reques= https.request(url,options,function(response){
        response.on("data",function(data){
            console.log("yes")
        })
    })
    reques.write(jsondata);
    reques.end();
})

app.listen(3000,()=>{
    console.log("ok");
})
//736b677ceeca34c64969e4d233c135c3-us17
//2e5bdb1c8c