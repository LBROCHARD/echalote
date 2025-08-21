import { HexColorPicker } from "react-colorful";
import { Input } from "./ui/input";

interface ColorPickerProps {
    color: string;
    setColor: (newColor: string) => void;
    error: string;
}

const ColorPicker = (props: ColorPickerProps) => {

    return (
        <div className="flex flex-row">
            <HexColorPicker color={props.color} onChange={props.setColor} />
            <div className="ml-5">
                <div className="mt-5 w-24 h-8 rounded-lg" style={{backgroundColor: props.color}}/>
                <Input className="mt-5 w-24" value={props.color} onChange={(event) => props.setColor(event.target.value)}/>
                <p className="text-red-600 w-60">{props.error}</p>
            </div>
        </div>
    );
};

export default ColorPicker;