export interface ISEOHeaderProps {
    title: string;
    description: string;
}
export interface ISolidButtonProps {
    onClick: () => void;
    text: string;
    buttonType: "button" | "submit" | "reset" | undefined;
    classes: string;
}
export interface ISubmitButtonProps {
    loading: boolean;
    isValid: boolean;
    buttonText: string;
}

export interface ISpinnerProps {
    color?: string;
    height?: number;
}
