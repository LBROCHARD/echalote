import { useAuth } from "@/providers/AuthContext";

const HomeComponent = () => {
    const {user} = useAuth();

    return (
        <div className="flex flex-col flex-1 w-full items-center justify-center text-muted-foreground">
            <p>Hello <b>{user?.username}</b>, welcome to Super Notes !</p>
            <p>You can create groups and pages with the left bar</p>
        </div>
    );
}


export default  HomeComponent;