//const { ipcRenderer } = require("electron")
const login = document.getElementById("loginForm");

login.addEventListener("submit", async (event) => {
event.preventDefault()

const email = document.getElementById("username")
const password = document.getElementById("password")



if(email.value.length <= 0) {
    window.alert('Please enter a username!');
    return;
}
else if(password.value.length <= 0) {
    window.alert('Please enter a password!');
    return;
}
else{
    var _payload = {
        request: 'SIGNIN',
        email: email.value,
        password: password.value
    };
    window.DB.send('toMain:AuthLogIn', _payload);
}

window.DB.receive("fromMain:AuthLogIn", (error) => {
    window.alert("Incorrect Username or Password. Try Again!")
    password.value = '';
});


});