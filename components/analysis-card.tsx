'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import { leads } from "@/lib/atom/leadAtom";
import { useAtom } from "jotai";

export const AnalysisCard = () => {
    const [leadInfo] = useAtom(leads)
    
    return (
        <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">{leadInfo?.length}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    +10% from last month
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={12} aria-label="12% increase" />
            </CardFooter>
        </Card>
    )
}