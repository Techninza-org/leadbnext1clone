import { BroadcastForm } from "@/components/broadcast";
import BroadcastCards from "@/components/broadcast/broadcast-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal-store";

export default function BroadcastPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Broadcast
                </CardTitle>
            </CardHeader>
            <CardContent>
                <BroadcastCards />
            </CardContent>
        </Card>
    );
}