var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(4200);
var mangUsers = [];
//lang nghe ket noi voi server
io.on("connection", function(socket){
	console.log("someone connect: " + socket.id);
	//lang nghe ngat ket noi
	socket.on("disconnect", function(){
		console.log(socket.id + " is disconnected!!!");
	});
	//nhan du lieu tu client
	socket.on("client-send-Username", function(data){
		if(mangUsers.indexOf(data)>=0){
			socket.emit("server-send-dki-thatbai");
		}else{
			mangUsers.push(data);
			socket.Username = data;
			socket.emit("server-send-dki-thanhcong", data);
			io.sockets.emit("server-send-danhsach-Users", mangUsers);
		}
	});

	socket.on("client-logout", function(){
		mangUsers.splice(
			mangUsers.indexOf(socket.Username), 1
		);
		socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
	});

	socket.on("client-send-message", function(data){
		io.sockets.in(socket.Phong).emit("server-send-messages", {
			username: socket.Username,
			messages: data
		});
	});

	socket.on("client-typing", function(){
		io.sockets.in(socket.Phong).emit("server-status-someone-typing", socket.Username + " is typing ...");
	});

	socket.on("client-stop-typing", function(){
		io.sockets.in(socket.Phong).emit("server-status-someone-stop-typing");
	});

	socket.on("client-send-roomname", function(data){
		socket.join(data);
		socket.Phong = data;

		var lsroom = [];
		for (row in socket.adapter.rooms){
			lsroom.push(row);
		}
		io.sockets.emit("server-send-rooms", lsroom);
		socket.emit("server-send-currentroom", data);
	});
});

app.get("/", function(req, res){
	res.render("page");
});
