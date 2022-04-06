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

window.DB.send('toMain:Auth', _payload);
// const { token, errors } = await createSession(email.value, password.value)
// if (errors) {
//   const [{ title, detail }] = errors

//   alert(`${title}: ${detail}`)

//   return false
// }
});