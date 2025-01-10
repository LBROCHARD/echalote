import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const ProjectsBar = () => {

    return (
        <div className="bg-primary fixed top-0 h-screen w-16 flex flex-col text-white shadow">
            <SideBarIcon letter="AB" color="#22FF22"/>
            <SideBarIcon letter="GP" color="#993333"/>
            <SideBarIcon letter="PR" color="#563111"/>
            <SideBarIcon letter="TH" color="#111188"/>
            <SideBarIcon letter="WO" color="#885588"/>
        </div>
    );
}

type HEX = `#${string}`;
interface SideBarIconProps {
    color: HEX;
    letter: string;
}


const SideBarIcon = (props: SideBarIconProps) => (
    <div className="project-bar-icons" style={{backgroundColor: props.color}}>
        <p className=" font-bold">{props.letter}</p>
    </div>
)

export default ProjectsBar;