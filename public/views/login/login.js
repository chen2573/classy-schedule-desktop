//const { ipcRenderer } = require("electron")
const login = document.getElementById("loginForm");

login.addEventListener("submit", async (event) => {
event.preventDefault()

const email = document.getElementById("username")
const password = document.getElementById("password")

var _payload = {
    email: email.value,
    password: password.value
};

window.DB.send('toMain:AuthLogIn', _payload);

window.DB.receive("fromMain:AuthLogIn", (error) => {
    window.alert("Incorrect Username or Password. Try Again!")
    password.value = '';
});


});