import { ISolidButtonProps } from "../../types/misc.type";

export default function SolidButton ({ onClick, text, buttonType = "button", classes }: ISolidButtonProps) {
    return (
        <button type={buttonType} onClick={onClick} className={`${classes} bg-black text-white py-2 `}>
            {text}
        </button>
    )
}
