const express=require("express");
const bodyParser= require("body-parser");
const https = require('https');
const mongoose= require("mongoose");
const notifier = require('node-notifier');
const { stringify } = require("querystring");
const app=express();
app.set("view engine","ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://127.0.0.1:27017/temp");
const userSchema= {
    name: String,
    email: String,
    password: String,
    product: [String]
}
const User= mongoose.model("User",userSchema);
const productSchema={
    code: String
}
const Product= mongoose.model("Product",productSchema);
const listproductSchema={
    code: String
}
const listProduct= mongoose.model("listProduct",productSchema);
const invSchema=mongoose.Schema;
const Inventory= mongoose.model("Inventory",new invSchema({item:String, price:Number}),'inventory');

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
    var loginflag=false;
    let userdata= User.find({}).exec();
    userdata.then(function(result){
        console.log(result[0].password);
        for(let i=0;i<result.length;i++){
            let auth=result[i].password;
            console.log(auth);
            if(auth===pwd){
                loginflag=true;
            }
        }
        if(loginflag===false){
            notifier.notify('Invalid username or password');
            res.redirect("/login");
        }
        else{
        loginstat=true;
        logout=false;
        res.redirect("/");
    }
    })
    console.log(pwd);
    console.log(loginflag);
    
})
app.post("/register",function(req,res){
    let remail=req.body.remail;
    let rpass=req.body.rpass;
    let rname=req.body.rname;
    const user= new User({
        name: rname,
        email: remail,
        password: rpass,
        product: []
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
    }
    else{
        let pdata= Product.find({}).exec();
        pdata.then(function(result){
            res.render("mcart/mcart",{itemc:result});
        })
    }
})
app.post("/views/mcart",function(req,res){
    let itemp= req.body.newitem;
    const newitem= new Product({
        code: itemp
    })
    newitem.save();
    res.redirect("/views/mcart");
})
app.post("/cartdelete",function(req,res){
    const lidtemp=req.body.cartcheckbox;
    console.log(lidtemp)
    Product.findByIdAndRemove(lidtemp).exec();
    res.redirect("/views/mcart");
})
app.get("/views/mlist",function(req,res){
    if(loginstat==false){
            res.send("<h1>Sorry! You are not logged in</h1>");
    }
    else{
        let pdata= listProduct.find({}).exec();
        pdata.then(function(result){
            console.log(result)
            res.render("mlist/mlist",{iteml:result});
        })
    }
})
app.post("/views/mlist",function(req,res){
    let itemp= req.body.newitem;
    const newitem= new listProduct({
        code: itemp
    })
    newitem.save();
    res.redirect("/views/mlist");
})
app.post("/listdelete",function(req,res){
    const lidtemp=req.body.listcheckbox;
    console.log(lidtemp)
    listProduct.findByIdAndRemove(lidtemp).exec();
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
        let pdata= Inventory.find({}).exec();
        pdata.then(function(result){
            result.forEach(function(item){
                console.log(item);
                console.log(item.price);
            })
            res.render("mprod/mprod",{itemc:result});
        })
    }
})
app.get("/views/muser",function(req,res){
    if(loginstat==false){
        res.send("<h1>Sorry! You are not logged in</h1>");
    }
    else{
        let pdata= User.find({email: femail}).exec();
        pdata.then(function(result){
            console.log(result)
            res.render("muser/muser",{itemc:result});
        })
    }
})
app.listen(3000,()=>{
    console.log("ok");
})
//736b677ceeca34c64969e4d233c135c3-us17
//2e5bdb1c8c