import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
    return (
        <main className="flex items-center justify-center h-screen">
            <div className="items-center justify-center">
                <h1>Log-in to your account :</h1>
                <LoginForm/>
                <p className="m-5">You don't have an account ? <Link to={"/register"}>Click here to register</Link></p>
            </div>
        </main>
    )
}

export default LoginPage;
