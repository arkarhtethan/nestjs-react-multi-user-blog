import { Helmet } from "react-helmet";
import { ISEOHeaderProps } from "../../types/component.type";

export default function SEOHeader ({ title, description }: ISEOHeaderProps) {
    return (
        <Helmet>
            <title>KM Blog | {title}</title>
            <meta name="description" content={description} />
        </Helmet>
    )
}
