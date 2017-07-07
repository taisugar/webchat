
var socket = io("http://localhost:4200");

socket.on("server-send-dki-thatbai", function(){
	alert("ten da co nguoi su dung");
});

socket.on("server-send-dki-thanhcong", function(data){
	$("#currentUser").html(data);
	$("#loginForm").hide(2000);
	$("#chatForm").show(2000);
});

socket.on("server-send-danhsach-Users", function(data){
	$("#boxContent").html("");
	data.forEach(function(i){
		$("#boxContent").append("<div class='useronline'>" + i + "</div>");
	});
});

socket.on("server-send-messages", function(data){
	$("#listMessages").append("<div class='ms'>" + data.username + ": " + data.messages + "</div>");
});

socket.on("server-status-someone-typing", function(data){
	$("#status").html(data);
});

socket.on("server-status-someone-stop-typing", function(){
	$("#status").html("");
});

socket.on("server-send-rooms", function(data){
	$("#boxContentroom").html("");
	data.forEach(function(i){
		$("#boxContentroom").append("<div class='room'>" + i + "</div>");
	});
});

socket.on("server-send-currentroom", function(data){
	$("#currentroom").html("");
	$("#currentroom").html(data);
});

$(document).ready(function(){
	$("#loginForm").show();
	$("#chatForm").hide();

	$("#btnRegister").click(function(){
		socket.emit("client-send-Username", $("#txtUsername").val());
	});

	$("#btnLogout").click(function(){
		socket.emit("client-logout");
		$("#chatForm").hide(2000);
		$("#loginForm").show(1000);
	});

	$("#txtMessages").focusin(function(){
		socket.emit("client-typing");
	});

	$("#txtMessages").focusout(function(){
		socket.emit("client-stop-typing");
	});

	$("#btnSendMessage").click(function(){
		socket.emit("client-send-message", $("#txtMessages").val());
		$("#txtMessages").val("");
	});

	$("#btnCreateRoom").click(function(){
		socket.emit("client-send-roomname", $("#txtRoomname").val());
		$("#txtRoomname").val("");
	});
});
