import { useNavigate } from "react-router";
import { SolidButton } from "../../shared/button";
import { IPostItemProps } from "../../types/component.type";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { format } from 'timeago.js';
import { Link } from "react-router-dom";

export default function PostItem ({ post }: IPostItemProps) {
    const navigate = useNavigate();
    const navigateToDetails = () => {
        navigate(`/${post.id}`)
    }
    return (
        <div className="shadow-lg p-3 bg-white" style={{ height: "240px" }}>
            <div className="flex">
                <div className="w-1/3">
                    iamge
                </div>
                <div className="w-2/3">
                    <h2 className="font-bold text-xl">
                        <Link to={`/${post.id}`}>{post.title}</Link>
                    </h2>
                    <div className="flex text-xs mt-1 space-x-3 text-gray-600">
                        <p><FontAwesomeIcon icon={faUser} size={'sm'} /> <Link to={`/user/${post.user.username}`}>{post.user.name}</Link></p>
                        <p><FontAwesomeIcon icon={faCalendar} size={'sm'} /> {format(post.createdAt)}</p>
                    </div>
                    <p className="mt-3">
                        {post.summary.substr(0, 280)}...
                    </p>
                    <SolidButton classes="px-2 mt-3 text-sm" text="Read More" onClick={navigateToDetails} />
                </div>
            </div>
        </div >
    )
}
