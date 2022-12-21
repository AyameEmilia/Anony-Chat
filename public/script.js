let user = {}
let data = {
  password: "",
  name: ""
}

const socket = io();
socket.on("connect", () => {
    console.log(`socket.io : connected (${socket.id})`);
});
socket.on('disconnect', () => {
    console.log("socket.io : disconnected");
});

socket.on('message', function(msg) {
    document.getElementById("message").scrollBy(0, document.getElementById("message").offsetHeight+99);
    user[msg.uid] = msg.name
    console.log(`message :`,msg)
    document.getElementById("message").innerHTML += `<p><b><i class="fas fa-comments-alt text-yellow-200 mt-1"></i> ${msg.name}</b> ${msg.message}</p>`
});

socket.on('join_info', function(msg) {
    console.log(`join_info :`,msg)
    user[msg.uid] = msg.name
    document.getElementById("message").innerHTML += `<p class="bg-neutral-700 bg-opacity-50 rounded-xl my-1 px-3"><b><i class="fas fa-arrow-to-right text-green-500"></i> ${msg.name}</b> Join the channel</p>`
});
socket.on('leave_info', function(msg) {
    console.log(`leave_info :`,msg, user[msg.uid])
    document.getElementById("message").innerHTML += `<p class="bg-neutral-700 bg-opacity-50 rounded-xl my-1 px-3"><b><i class="fas fa-arrow-to-left text-red-500"></i> ${user[msg.uid]??"Unknow"}</b> Leave the channel</p>`
});

function start() {
  data = {
    password: document.getElementById("password").value,
    name: document.getElementById("name").value
  }

  if(!data.password || !data.name || data.name === "" || data.password === "") return alert("Enter room Id and your name!")
  socket.emit('join', { room: data.password, name:data.name });
  document.getElementById("showPrompt").classList.add("hidden")
}

function send(){
    let message = document.getElementById("messagecontent").value;
    if(!message || message === "") return;
    socket.emit('send', {room:data.password,name:data.name,message});  
    document.getElementById("messagecontent").value = ""
}

document.getElementById("messagecontent").addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key === "Enter"){
    send()
  }
});



function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}