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
import { leadQueries } from "@/lib/graphql/lead/queries";
import { useQuery } from "graphql-hooks";

export const AnalysisCard = () => {
    const { data } = useQuery(leadQueries.GET_LAST_MONTH_ALL_LEADS);
    const count = data?.getLastMonthAllLeads.length || 0;
    
    return (
        <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
                <CardDescription>Last Month Leads</CardDescription>
                <CardTitle className="text-4xl">{count}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                    +10% from last month
                </div> */}
            </CardContent>
            <CardFooter>
                <Progress value={12} aria-label="12% increase" />
            </CardFooter>
        </Card>
    )
}