import { useGroupContext } from "@/providers/GroupContext";

const Test = () => {
    const {selectedPage} = useGroupContext();
    console.log(selectedPage)
    return(
        <>
            <h1>{selectedPage?.pageName}</h1>
        </>
    )
}

export default Test;