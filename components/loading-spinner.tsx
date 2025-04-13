import { LoaderCircle } from "lucide-react";

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-6">
        <LoaderCircle size={19} className="animate-spin mr-1" />
        Loading...
    </div>
);