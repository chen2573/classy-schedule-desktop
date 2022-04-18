
export function runAlgorithm(){
    let _payload = {
        request: 'RUN',
        message: 'Renderer RUN Algorithm',
    };
    
    // Send a query to main
    window.DB.send("toMain:Algo", _payload);

    // Recieve the results
    window.DB.receive("fromMain:Algo", (payload) => {
        if(payload.status === 'SUCCESS'){
            window.alert(payload.message);
        }
        else{
            window.alert(payload.message + '\n' + payload.errorCode);
        }
    });
}