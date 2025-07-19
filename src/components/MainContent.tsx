import { useAuth } from "@/providers/AuthContext";

const MainContent = () => {
    const {user} = useAuth();

    return (
        <div className="bg-secondary fixed top-0 h-screen w-screen flex flex-col shadow pl-16 pt-32">
            <p className="text-white">{user?.username}</p>
            <textarea className="max-h-200 m-5 text-white bg-secondary"/>
        </div>
    );
}


export default MainContent;