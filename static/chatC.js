// const { format } = require("path");

const socket = io('http://localhost:8000');
const myform=document.getElementById('texcontainer');
const mymsg=document.getElementById('textC');
const msgCon=document.querySelector('.container');
const name=document.getElementById('rhj').innerText;
//const name = prompt('enter your name');
var audio= new Audio('../static/ting.mp3');

const insrt=(msg,pos)=>{
     const msgele = document.createElement('div');
     console.log(msg);
     msgele.innerText=msg;
     msgele.classList.add('message');
     msgele.classList.add(pos);
     msgCon.append(msgele);
     audio.play();
}
myform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const mssg=mymsg.value;
    insrt(`${mssg}`,'right');
    socket.emit('smsg',mssg);
    mymsg.value="";
})
socket.emit('request',name);
socket.on('joined', name =>{
    console.log(name);
    let names=name.split(" ");
  insrt(`${names[0]} aa gya/gyi`,'right');
})

socket.on('rcv',inf=>{
    let kar=inf.name.split(" ");
    insrt(`${kar[0]}: ${inf.message}`);
})
socket.on('chalgya',name=>{
    insrt(`${name} chalaa gya/gyi`,'left');
})