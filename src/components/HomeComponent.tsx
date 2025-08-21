import { useAuth } from "@/providers/AuthContext";
import logo from '/SuperNotes_icon.png';

const HomeComponent = () => {
    const {user} = useAuth();

    return (
        <div className="flex flex-col flex-1 w-full items-center justify-center text-muted-foreground">
            <img src={logo} alt="Logo Super Notes"/>
            <p>Hello <b>{user?.username}</b>, welcome to Super Notes !</p>
            <p>You can create groups and pages using the left bar.</p>
        </div>
    );
}


export default  HomeComponent;