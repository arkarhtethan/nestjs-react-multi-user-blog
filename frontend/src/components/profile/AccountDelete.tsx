import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { SolidButton } from "../../shared/button";
import Modal from "../../shared/Modal";
import { SEOHeader } from "../header";

export default function AccountDelete () {

    const confirmDelete = () => {
        setShowModal(true);
    }

    const deleteAccount = () => {
        setShowModal(false);
    }

    const [showModal, setShowModal] = useState(false);
    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <SEOHeader title="Account" description="Your account details." />
            <h3 className="text-2xl mb-4 font-bold">Account Settings</h3>
            <hr className="border-black" />
            <div className="mt-8">
                <h5 className="mb-3 text-xl">
                    Delete your account
                </h5>
                <p className="mb-3">Once you delete your account, there is no going back.</p>
                {/* <button type="submit" onClick={() => this.setState({ openDelModal: true })} className="btn ">Delete */}
                <SolidButton text="Delete" onClick={confirmDelete} classes="px-10 focus:outline-none" />
            </div>
            <Modal
                onCancel={() => setShowModal(false)}
                show={showModal}
                onClick={deleteAccount}
                icon={faExclamationTriangle}
                title={"Delete account"}
                description={"Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone."} />
        </div>

    )
}
