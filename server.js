const express = require("express")
const multer = require("multer")
const fs = require("fs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const app = express()

const user = require("./models/user")
const item = require("./models/item")

app.use(session({
    secret:"HelloMyMan",
    saveUninitialized:true,
    resave:true
}))
app.use(flash());

mongoose.connect("mongodb://localhost/coba-multer",{
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+"_"+file.originalname)
    }
})

app.use(express.static(__dirname+"/images"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer({storage:fileStorage}).single("image"))
app.set("view engine","ejs")

app.listen(3000,()=>{
    console.log("Server is running!")
})

app.get("/",(req,res)=>{
    let message = req.flash("info")
            if(message.length < 1){
                message = null
            }else{
                message= message
            }
    item.find((err,doc)=>{
        if(err){
            req.flash("info","Something Wrong with the data")
            res.render("home",{
                message:message
            })
        }else{
            console.log(doc)
            if(doc.length < 1){
                doc = null
            }else{
                doc = doc
            }
            res.render("home",{
                message:message,
                data:doc
            })
        }
    })
})

app.post("/upload",(req,res)=>{
    user.create({
        email:req.body.email,
        password:req.body.password
    },(err,doc)=>{
        if(err){
            req.flash("error","Something Wrong!")
            res.redirect("/")
        }else{
            if(req.file){
                console.log(req.file)
                item.create({
                    path:req.file.path,
                    filename:req.file.filename,
                    user_id:doc._id
                })
                req.flash('info', 'A Picture is Updated!')
                res.redirect("/")
            }else{
                req.flash('info', 'No Picture is Updated!')
                res.redirect("/")
            }
        }
    })
    
})