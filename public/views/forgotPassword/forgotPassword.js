const login = document.getElementById("loginForm");

login.addEventListener("submit", async (event) => {
event.preventDefault()

const email = document.getElementById("username");


if(email.value.length <= 0) {
    window.alert('Please enter a username!');
    return;
}
else{
    var _payload = {
        request: 'FORGOT_PASSWORD',
        email: email.value,
    };

    window.DB.send('toMain:AuthLogIn', _payload);
}

window.DB.receive("fromMain:AuthLogIn", (payload) => {

    if(payload.result === 'FAIL')
    {
        window.alert(payload.message);
    }
    else if(payload.result === 'SUCCESS'){
        window.alert(payload.message);
    }
});


});