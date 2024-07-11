import { Lock } from "lucide-react";

export default function AccessDenied() {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-200 to-gray-400 font-lato">
            <Lock  size={50}/>
            <h1 className="mt-10 mb-5 text-2xl">Access to this page is restricted</h1>
            <p>Please check with the site admin if you believe this is a mistake.</p>
        </div>
    );
}