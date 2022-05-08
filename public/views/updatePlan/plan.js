
let id;

window.DB.receive('fromMain:ModalElectron', (data) => { 
    const planName = document.getElementById("name");
    const description = document.getElementById("description");
    const year = document.getElementById("year");
    const semester = document.getElementById("semester");
    console.log(data);

    id = data.id;
    planName.value = data.name;
    description.value = data.description,
    year.value = data.year,
    semester.value = data.semester

    console.log(planName.value, description.value, year.value ,semester.value)
});

const login = document.getElementById("planForm");

login.addEventListener("submit", async (event) => {
    event.preventDefault()

    const planName = document.getElementById("name");
    const description = document.getElementById("description");
    const year = document.getElementById("year");
    const semester = document.getElementById("semester");

    var _payload = {
        request: 'UPDATE_EXISTING_PLAN',
        id: id,
        planName: planName.value,
        description: description.value,
        year: year.value,
        semester: semester.value,
        message: 'Accepted user input to update plan'
    };

    if(planName.value.length <= 0) {
        window.alert('Please enter Schedule Name.');
    }
    else if(year.value >= 2099 || year.value <= 2021) {
        window.alert('Please enter a valid year (2022-2099).')
    }
    else if(semester.value == -1){
        window.alert("Please select a semester.");
    }
    else if(description.value <= 0) {
        window.alert('Please enter a description.');
    }
    else{
        window.DB.send('toMain:Modal', _payload);
    }
});

login.addEventListener("reset", async (event) => {
    event.preventDefault()

    var _payload = {
        request: 'CANCEL_PLAN',
        message: 'User cancelled creating a plan'
    };

    window.DB.send('toMain:Modal', _payload);

});
