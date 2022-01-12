import { faCaretUp, faCaretDown, faAlignJustify, faChartBar, faReply, faUserCog, faUserEdit, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { removeToken, removeUser } from "../../service/localstorage.service";
import { logout } from "../../store/auth.slice";
import SidebarNavItem from "./sidebarNavItem";
import UserInfo from "./UserInfo";

export default function Sidebar () {

    const [showNav, setShowNav] = useState(true);
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isDesktop && showNav) {
            setShowNav(false);
        } else if (isDesktop) {
            setShowNav(true);
        }
    }, [isDesktop])

    const logoutHandler = () => {
        removeToken();
        removeUser();
        dispatch(logout())
    }

    return (
        <>
            <div className="bg-white shadow-lg mb-5 lg:shadow-none">
                <UserInfo />
            </div>
            <div onClick={() => setShowNav(!showNav)} className="bg-white py-3 px-3 shadow-lg text-gray-500 font-bold items-center justify-between cursor-pointer flex lg:hidden">
                <p>Navigations</p>
                <FontAwesomeIcon icon={showNav ? faCaretUp : faCaretDown} />
            </div>
            <div className={`${showNav ? "block" : "hidden"} flex-col lg:space-y-2 shadow-md`}>
                <div className="bg-gray-100 lg:mt-2 shadow-lg">
                    {/* <SidebarNavItem url="/profile" icon={faChartBar} title={"Dashboard"} /> */}
                    <SidebarNavItem url="/profile/posts" icon={faAlignJustify} title={"Your Posts"} />
                </div>
                <div className="bg-gray-100 lg:mt-2 shadow-lg">
                    <SidebarNavItem url="/profile/edit-profile" icon={faUserEdit} title={"Edit Profile"} />
                    <SidebarNavItem url="/profile/change-password" icon={faLock} title={"Change Password"} />
                    <SidebarNavItem url="/profile/account" icon={faUserCog} title={"Account"} />
                </div>
                <div className="bg-gray-100 lg:mt-2 shadow-lg" onClick={logoutHandler}>
                    <SidebarNavItem url="/" icon={faReply} title={"Log Out"} />
                </div>
            </div>
        </>
    )
}