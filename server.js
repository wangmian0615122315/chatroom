/*
var http = require('http');

var server = http.createServer(function(req,res){
	res.writeHead(200,{
		'Content-Type':'text/html'
	});
	res.write('<h1>hello world!</h1>');
	res.end();
});

//�����˿�

server.listen(3000);
console.log('server startyed');
*/
var express = require('express');
var app=express();
var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	users=[];//�������������û����ǳ�
app.use('/',express.static(__dirname +'/www'));
server.listen(3000);
console.log('stared'); 

//socket����
io.on('connection',function(socket){
	socket.on('login',function(nickname){
		if(users.indexOf(nickname)>-1){
		  socket.emit('nickExisted');	
		}else{
			socket.userIndex=users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system',nickname,users.length,'login'); //�����������û������ǳơ�
		}
	});
	
	//�Ͽ�����
  socket.on('disconnect',function(){
	//ɾ�������û�
	users.splice(socket.userIndex,1);
	//֪ͨ������
	socket.broadcast.emit('system',socket.nickname,users.length,'logout');
	
	//��������Ϣ
	socket.on('postMsg',function(msg){
		socket.broadcast.emit('newMsg',socket.nickname,msg);
	});
	//����ͼƬ
	socket.on('img',function(imgData){
		socket.broadcast.emit('newImg',socket.nickname,imgData);
	});
  });
});
