/*
var http = require('http');

var server = http.createServer(function(req,res){
	res.writeHead(200,{
		'Content-Type':'text/html'
	});
	res.write('<h1>hello world!</h1>');
	res.end();
});

//监听端口

server.listen(3000);
console.log('server startyed');
*/
var express = require('express');
var app=express();
var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	users=[];//保存所有在线用户的昵称
app.use('/',express.static(__dirname +'/www'));
server.listen(3000);
console.log('stared'); 

//socket部分
io.on('connection',function(socket){
	socket.on('login',function(nickname){
		if(users.indexOf(nickname)>-1){
		  socket.emit('nickExisted');	
		}else{
			socket.userIndex=users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system',nickname,users.length,'login'); //向所有在线用户推送昵称。
		}
	});
	
	//断开连接
  socket.on('disconnect',function(){
	//删除在线用户
	users.splice(socket.userIndex,1);
	//通知其他人
	socket.broadcast.emit('system',socket.nickname,users.length,'logout');
	
	//接收新消息
	socket.on('postMsg',function(msg){
		socket.broadcast.emit('newMsg',socket.nickname,msg);
	});
	//接收图片
	socket.on('img',function(imgData){
		socket.broadcast.emit('newImg',socket.nickname,imgData);
	});
  });
});
