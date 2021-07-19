const socket = io();
let userName = "";
let userList = [];

const c = (element) => document.querySelector(element);
const cl = (element) => document.querySelectorAll(element);

let loginPage = document.querySelector(".modal-chat");
let chatPage = document.querySelector(".pageContent");

let loginInput = document.querySelector("#nameInput");
let chatInput = document.querySelector("#msgInput");
let btnSend = document.querySelector(".img-button a");

function renderUserList() {
  let ul = document.querySelector(".users ul");
  ul.innerHTML = "";

  userList.forEach((element) => {
    ul.innerHTML += `<li>${element}</li>`;
  });
}

function addMesage(type, user, message) {
  let ul = document.querySelector(".chat-log ul");

  switch (type) {
    case "status":
      ul.innerHTML += `<li class="m-status"> ${message} </li>`;
      break;

    case "msg":
      if (userName == user) {
        ul.innerHTML += `<li class="chat-input"><p>${message}</p></li>`;
      } else {
        ul.innerHTML += `<li class="chat-output"><a>${user}...</a> <p>${message}</p></li>`;
      }
      break;
  }
}

btnSend.addEventListener("click", (e) => {
  e.preventDefault();

  let txt = chatInput.value.trim();
  chatInput.value = "";

  if (txt != "") {
    socket.emit("send-msg", txt);
  }
});

loginInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    let name = loginInput.value.trim();

    if (name != "") {
      userName = name;
      document.title = `Chat (${userName})`;

      socket.emit("join-request", userName);
    }
  }
});

socket.on("user-ok", (list) => {
  loginPage.style.display = "none";
  chatPage.style.display = "flex";
  chatInput.focus();

  addMesage("status", null, "CONECTADO!");

  userList = list;
  renderUserList();
});

socket.on("list-update", (data) => {
  if (data.joined) addMesage("status", null, ` ${data.joined} entrou no chat`);
  if (data.left) addMesage("status", null, ` ${data.left} saiu no chat`);

  userList = data.list;
  renderUserList();
});

socket.on("show-msg", (data) => {
  addMesage("msg", data.username, data.msg);
});

socket.on("disconnect", () => {
  addMesage("status", null, 'VOCÊ FOI DESCONECTADO');
})

socket.on("connect_error", () => {
  addMesage("status", null, 'TENTANDO RECONNECTAR...');
})
