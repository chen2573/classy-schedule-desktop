

export function createPlan(){
    let _payload = {
        request: 'NEW_PLAN'
    }

    window.DB.send("toMain:Modal", _payload);

    return new Promise((resolve, reject) => {
        window.DB.recieve("fromMain:Plan", (data) => {
            console.log(data);
        });
    })
}