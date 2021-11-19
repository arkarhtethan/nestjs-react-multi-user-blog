import { ISubmitButtonProps } from '../../types/component.type'
import { Spinner } from '../loader'
import SolidButton from './SolidButton'


export default function SubmitButton ({ loading, isValid, buttonText }: ISubmitButtonProps) {
    return <>
        {
            loading ?
                <button type="submit" className={`bg-black text-white py-2 mb-4 flex justify-center cursor-wait`
                }> <Spinner /> </button > :
                <SolidButton buttonType="submit" classes={`mb-4 ${!isValid && 'cursor-not-allowed bg-gray-600'}`} text={buttonText} onClick={() => { }} />}
    </>
}
