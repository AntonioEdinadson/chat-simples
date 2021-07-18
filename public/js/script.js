const socket = io();
let userName = "";
let userList = [];

const c = (element) => document.querySelector(element);
const cl = (element) => document.querySelectorAll(element);

let loginPage = document.querySelector(".modal-chat");
let chatPage = document.querySelector(".pageContent");

let loginInput = document.querySelector("#nameInput");
let chatInput = document.querySelector("#msgInput");

function renderUserList() {
  
  userList.map((element, index) => {        
  
    let usersOn = c(".users").cloneNode(true);
    
    usersOn.querySelector('.img-user img').src = '/img/user_m.svg';
    usersOn.querySelector('.data-user a').innerHTML = element;
    usersOn.querySelector('.options-user p').innerHTML = new Date().toLocaleDateString();
    

    c('.page-users').append(usersOn);
    
  });
  
  
}

loginInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    
    let name = loginInput.value.trim();
    
    if(name != "") {
        userName = name;
        document.title = `Chat (${userName})`;    

        socket.emit('join-request', userName);
    }

  }
});


socket.on('user-ok', (list) => {
    loginPage.style.display = "none";
    chatPage.style.display = "flex";

    chatInput.focus();
    userList = list;

    renderUserList();
});
