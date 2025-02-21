import { useEffect, useState } from "react";

interface LoginRegisterComponentProps {
}

const LoginRegisterComponent = (props: LoginRegisterComponentProps) => {

    const [fetchError, setFetchError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {}, [fetchError, token]);


    const testAuth = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    console.log("Unauthorized");
                    setFetchError(`Response status:  ${response.status}`);
                    return
                }
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            console.log(json);
            // setServersData(json.username);
        } catch (error: any) {
            console.error(error.message);
        }
    }


    const connectionInfo = { 
        username: "john", 
        email: "john@bob.bob", 
        password: "johnword" 
    }

    const login = async () => {
        fetch("http://localhost:3000/auth/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(connectionInfo)
        })   
        .then(async (response) => {
            var responseObject = await response.json();
            setToken(await responseObject.access_token);
        })
    }


    return (
        <div className="bg-stone-200 p-20 w-500 h-500 rounded-lg shadow-lg">
            <p> Token : {token} </p>
            <p className="font-bold">no account ?</p>
            <p className="text-red-600"> {fetchError} </p>
            <button className="bg-slate-500" onClick={login}>connect</button>
            <button className="bg-yellow-200 ml-8" onClick={testAuth}>testAuth</button>
        </div>
    );
}


export default LoginRegisterComponent;