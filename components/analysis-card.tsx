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

export const AnalysisCard = ({title, data}: {title: string, data: any}) => {

    return (
        <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-4xl">{data}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                    +10% from last month
                </div> */}
            </CardContent>
            <CardFooter>
                <Progress value={data} aria-label="12% increase" />
            </CardFooter>
        </Card>
    )
}