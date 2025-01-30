import MainContent from "./components/MainContent";
import ProjectsBar from "./components/ProjectsBar";
import TopBar from "./components/TopBar";

function App() {
  return (
    <div className='flex'>
      <MainContent/>
      <TopBar/>
      <ProjectsBar/>
    </div>
  )
}

export default App;
