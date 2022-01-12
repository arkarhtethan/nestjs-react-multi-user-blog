import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { SEOHeader } from "../../components/header";
import { EditProfile, PostForm, ProfilePostList, Sidebar } from "../../components/profile";
import AccountDelete from "../../components/profile/AccountDelete";
import ChangePassword from "../../components/profile/ChangePassword";
import { RootState } from "../../store";

export default function Profile () {
    const { slug } = useParams();
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate()

    if (!user) {
        navigate('/login')
    }

    const ComponentDict = [
        {
            key: "",
            component: <EditProfile />,
        },
        {
            key: "edit-profile",
            component: <EditProfile />,
        },
        {
            key: "change-password",
            component: <ChangePassword />,
        },
        {
            key: "posts",
            component: <ProfilePostList />,
        },
        {
            key: "post",
            component: <PostForm />,
        },
        {
            key: "account",
            component: <AccountDelete />,
        },
    ]
    const getComponent = () => {
        const key = slug ?? "";
        const componentObj = ComponentDict.find(comp => comp.key === key);
        return componentObj?.component;
    }

    return (
        <div className="lg:p-5 lg:m-10 my-4">
            <SEOHeader title="Profile" description={"Profile details about yourself."} />
            <div className="flex flex-col lg:flex-row lg:space-x-5">
                <div className="lg:w-1/5 w-full lg:mb-0 mb-4">
                    <Sidebar />
                </div>
                <div className="lg:w-4/5 w-full shadow-lg bg-white">
                    {getComponent()}
                </div>
            </div>
        </div>
    )

}
