import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    return (
        <main className="flex items-center justify-center h-screen">
            <div className="items-center justify-center">
                <h1>Create a new account</h1>
                <RegisterForm/>
                <p className="m-5">You allready have an account ? <Link to={"/login"}>Click here to login</Link></p>
            </div>
        </main>
    )
}

export default RegisterPage;
