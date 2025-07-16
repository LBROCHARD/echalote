import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

interface ConnexionPageProps {
    setToken: (newToken: string) => void;
}

const ConnexionPage = (props: ConnexionPageProps) => {
    return (
        <>
            <RegisterForm/>
            <LoginForm setToken={props.setToken}/>
        </>
    )
}

export default ConnexionPage;
