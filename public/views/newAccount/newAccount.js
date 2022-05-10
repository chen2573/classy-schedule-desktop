const login = document.getElementById("loginForm");

login.addEventListener("submit", async (event) => {
event.preventDefault()

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("username");
const password = document.getElementById("password");
const passwordTwo = document.getElementById("passwordTwo");

if(firstName.value.length <= 0) {
    window.alert('Please enter your first name!');
    return;
}
else if(lastName.value.length <= 0) {
    window.alert('Please enter your last name!');
    return;
}
else if(email.value.length <= 0) {
    window.alert('Please enter a username!');
    return;
}
else if(password.value.length <= 0){
    window.alert('Please enter a password!');
    password.value = '';
    passwordTwo.value = '';
    return;
}
else if(passwordTwo.value.length <= 0){
    window.alert('Please re-enter password!');
    password.value = '';
    passwordTwo.value = '';
    return;
}
else if(password.value != passwordTwo.value){
    window.alert('Please enter passwords that match!');
    password.value = '';
    passwordTwo.value = '';
    return;
}
else{
    var _payload = {
        request: 'NEW_ACCOUNT',
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    };

    window.DB.send('toMain:AuthLogIn', _payload);
}

window.DB.receive("fromMain:AuthLogIn", (payload) => {

    if(payload.result === 'FAIL')
    {
        window.alert(payload.message);
        password.value = '';
        passwordTwo.value = '';
    }
    else if(payload.result === 'SUCCESS'){
        window.alert(payload.message);
    }
});


});