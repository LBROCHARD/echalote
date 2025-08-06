import { useAuth } from "@/providers/AuthContext";
import { Button } from "./ui/button";

const AccountComponent = () => {
    const {user, logout} = useAuth();

    const onDisconnect = () => {
        logout();
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="items-center justify-center">
                <p>Username : {user?.username} </p>
                <p>Email : {user?.email} </p>
                <Button onClick={onDisconnect}>Disconnect</Button>
            </div>
        </div>
    );
}


export default AccountComponent;