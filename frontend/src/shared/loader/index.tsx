import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { ISpinnerProps } from "../../types/component.type";


export const Spinner = ({ color = "#fff", height = 20 }: ISpinnerProps) => {
    return (
        <Loader
            type="Oval"
            color={color}
            height={height}
        />
    )
}


export const DotLoader = () => <Loader type="ThreeDots" color="#000" height={80} width={80} />

export { default as LoadingCompoent } from "./loadingCmp";