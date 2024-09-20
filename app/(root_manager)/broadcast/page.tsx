import { BroadcastForm } from "@/components/broadcast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BroadcastPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Broadcast
                </CardTitle>
            </CardHeader>
            <CardContent>

                <BroadcastForm />
            </CardContent>
        </Card>
    );
}