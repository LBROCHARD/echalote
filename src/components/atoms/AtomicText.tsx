
export enum AtomicTextSizes{ title, h1, h2, h3, custom}
export enum AtomicTextBoldness{ normal, bold, thin}

interface AtomicTextProps {
    size?: AtomicTextSizes;
    customSize?: number;
    boldness?: AtomicTextBoldness;
    colorHexadecimal?: string;
}

const AtomicText = (props: AtomicTextProps) => {

    let size: number = 11
    if (props.size == AtomicTextSizes.custom && props.customSize != null) {
        size = props.customSize
    } else {
        switch(props.size) {
            case AtomicTextSizes.title:
                size = 26
                break;
            case AtomicTextSizes.h1:
                size = 20
                break;
            case AtomicTextSizes.h2:
                size = 16
                break;
            case AtomicTextSizes.h3:
                size = 14
                break;
        }
    }




    return (
        <>
            <p className="text-2xl" >test title</p>
            <p className={"text-[" + 20 + "]"} >test h1</p>
            <p className={"text-[" + 16 + "]"} >test h2</p>
            <p className={"text-[" + 14 + "]"} >test h3</p>
            <p className={"text-[" + 11 + "]"} >test normal</p>
        </>
    );
}


export default AtomicText;