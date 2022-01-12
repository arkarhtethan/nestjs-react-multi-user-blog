import { SEOHeader } from "../header";

export default function Dashboard () {
    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <SEOHeader title="Dashboard" description="Edit your profile." />
            <h3 className="text-2xl mb-4 font-bold">Dashboard</h3>
            <hr className="border-black" />
            <p className="mb-3 mt-6 text-gray-500">
                See Your Statitics.
            </p>
            <div className="flex justify-evenly w-full space-x-4">
                <div className="shadow-xl w-full text-xl font-bold flex justify-between items-center p-5">
                    <p>Total Posts</p>
                    <p className="text-4xl">33</p>
                </div>
                <div className="shadow-xl w-full text-xl font-bold flex justify-between items-center p-5">
                    <p>Views Counts</p>
                    <p className="text-4xl">33</p>
                </div>
                <div className="shadow-xl w-full text-xl font-bold flex justify-between items-center p-5">
                    <p>Total Comments</p>
                    <p className="text-4xl">33</p>
                </div>
            </div>
            <div className="mt-10 shadow-lg text-5xl font-bold">
                chart
            </div>
        </div>
    )
}
