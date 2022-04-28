

export function createPlan(){
    let _payload = {
        request: 'NEW_PLAN'
    }

    window.DB.send("toMain:Modal", _payload);

    return new Promise((resolve, reject) => {
        window.DB.receive('fromMain:Modal', (data) => {
            if(data.id === -1){
                window.alert(data.message + '\n' + data.errorCode);
                resolve(data.id);
            }
            else {
                window.alert(data.message);
                resolve(data.id);
            } 
        });
    })
}