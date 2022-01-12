import { useNavigate } from "react-router";
import { SolidButton } from "../../shared/button";
import { IPostItemProps } from "../../types/component.type";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { format } from 'timeago.js';
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function PostItem ({ post }: IPostItemProps) {

    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });
    const navigate = useNavigate();
    const navigateToDetails = () => {
        navigate(`/${post.id}`)
    }
    return (
        <div className="w-full shadow-lg bg-white" style={{ height: isDesktop ? "auto" : "auto" }}>
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 w-full" style={{ height: isDesktop ? "200px" : "200px" }}>
                    <img src={post.image} alt={post.title} className="bg-cover h-full w-full" />
                </div>
                <div className="lg:w-2/3 w-full p-3 flex flex-col justify-between items-start">
                    <div>
                        <h2 className="font-bold text-xl">
                            <Link to={`/${post.id}`}>{post.title}</Link>
                        </h2>
                        <div className="flex text-xs mt-1 space-x-3 text-gray-600">
                            <p><FontAwesomeIcon icon={faUser} size={'sm'} /> <Link to={`/user/${post.user.username}`}>{post.user.name}</Link></p>
                            <p><FontAwesomeIcon icon={faCalendar} size={'sm'} /> {format(post.createdAt)}</p>
                        </div>
                        <p className="mt-3">
                            {post.summary.substr(0, isDesktop ? 280 : 150)}...
                        </p>
                    </div>
                    <SolidButton classes="px-2 w-fit mt-3 text-sm" text="Read More" onClick={navigateToDetails} />
                </div>
            </div>
        </div >
    )
}
