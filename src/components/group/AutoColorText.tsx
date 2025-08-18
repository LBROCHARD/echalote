import { isColorDark } from '@/utils/colorUtils';

export interface AutoColorTextProps {
    backgroundColor?: string;
    text?: string;
    TransferedClassName?: string;
    isHeader?: boolean;
}

const AutoColorText = ({backgroundColor, text, TransferedClassName = '', isHeader = false}: AutoColorTextProps ) => {
    const isDark = isColorDark(backgroundColor ? backgroundColor : "FFFFFF");
    const textColor = isDark ? 'text-white' : 'text-black';

    return (
        <>
            {   isHeader 
                ? 
                <h1 className={`${textColor} ${TransferedClassName}`}>{text}</h1> 
                :
                <p className={`${textColor} ${TransferedClassName}`}>{text}</p>
            }
        </>
    );
};

export default AutoColorText;