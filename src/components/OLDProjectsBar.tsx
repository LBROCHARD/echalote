import { useAuth } from '@/providers/AuthContext';
import superNotesLogo from '/SuperNotes_icon.png';


const ProjectsBar = () => {
    const { user } = useAuth();

    return (
        <div className="bg-primary fixed top-0 h-screen w-16 flex flex-col text-white shadow justify-between">
            <div>
                <img className="main-logo cursor-pointer" src={superNotesLogo} alt="Super Notes Logo"/>
                <p>--------</p>
                
                <SideBarIcon letter="AB" color="#22FF22"/>
                <SideBarIcon letter="GP" color="#993333"/>
                <SideBarIcon letter="PR" color="#563111"/>
                <SideBarIcon letter="TH" color="#111188"/>
                <SideBarIcon letter="WO" color="#885588"/>
                
                <div className="project-bar-icons cursor-pointer " style={{backgroundColor: 'grey'}}>
                    <p className=" font-bold">+</p>
                </div>
            </div>

            <div className="project-bar-icons cursor-pointer " style={{backgroundColor: 'grey'}}>
                <p>{user?.username}</p>
            </div>
        </div>
    );
}

type HEX = `#${string}`;
interface SideBarIconProps {
    color: HEX;
    letter: string;
}


const SideBarIcon = (props: SideBarIconProps) => (
    <div className="project-bar-icons cursor-pointer" style={{backgroundColor: props.color}}>
        <p className=" font-bold">{props.letter}</p>
    </div>
)

export default ProjectsBar;