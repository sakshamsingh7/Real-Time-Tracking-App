//boiler code first
//backend code
const  express= require('express');
const app=express();
const path = require('path');
//setting socket io that run on http server 
const http=require("http");
const socketio=require("socket.io");
const server=http.createServer(app);//create server
const io=socketio(server);// calling socketio functiom and pass the server in it

//setting ejs
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
// this public direc will store all non static contents 
//like images ,vanila js etc;
//We use app.use to define middleware for serving static files, 
//while app.set is used to configure application settings; using app.set for static files is incorrect.
io.on("connection", function(socket){
    socket.on("send-location",function(data){
        //after reciving at backend we sent the details at front end
        io.emit("receive-location",{id:socket.id,...data});
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)//send to the front end
        
    })
    
});


app.get("/",function(req,res){
    res.render("index");
});
server.listen(3000);
