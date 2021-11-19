import { useParams } from "react-router";
import { SEOHeader } from "../../components/header";
import { Dashboard, EditProfile, PostForm, ProfilePostList, Sidebar } from "../../components/profile";
import AccountDelete from "../../components/profile/AccountDelete";
import ChangePassword from "../../components/profile/ChangePassword";

export default function Profile () {
    const { slug } = useParams();
    const ComponentDict = [
        {
            key: "",
            component: <Dashboard />,
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
        <div className="p-5 m-10">
            <SEOHeader title="Profile" description={"Profile details about yourself."} />
            <div className="flex space-x-5">
                <div className="w-1/5">
                    <Sidebar />
                </div>
                <div className="w-4/5 shadow-lg bg-white">
                    {getComponent()}
                </div>
            </div>
        </div>
    )

}
