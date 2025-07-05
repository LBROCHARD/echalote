import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import RegisterForm from "./auth/RegisterForm";

interface AuthentificationComponentProps {
    setServersData: any
}

const AuthentificationComponent = (props: AuthentificationComponentProps) => {
    const API = import.meta.env.VITE_REACT_APP_API_URL

    const [fetchError, setFetchError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {}, [fetchError, token]);


    const testAuth = async () => {
        try {
            const response = await fetch(API + "/auth/profile", {
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
            props.setServersData(json.username);
        } catch (error: any) {
            console.error(error.message);
        }
    }

    // const connectionInfo = { 
    //     username: "john", 
    //     email: "john@bob.bob", 
    //     password: "johnword" 
    // }
    const connectionInfo = { 
        username: "bob", 
        email: "bob@bob.bob", 
        password: "bobword" 
    }

    const login = async () => {
        fetch(API + "/auth/login", {
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
            setFetchError("")
        })
    }


    return (
        // <div className="bg-stone-200 p-20 h-500 max-w-lg rounded-lg shadow-lg">
        //     <h1 className="font-bold text-2xl">Not connected ?</h1>
        //     <p className="w-xs text-clip"> Token : {token} </p>
        //     <p className="text-red-600"> {fetchError} </p>
        //     <Button className="bg-slate-500" onClick={login}>connect</Button>
        //     <Button className="bg-yellow-200 ml-8" onClick={testAuth}>testAuth</Button>
        // </div>
        <>
            <RegisterForm/>
        </>
    );
}


export default AuthentificationComponent;