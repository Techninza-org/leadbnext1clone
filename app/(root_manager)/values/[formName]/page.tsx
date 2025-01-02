"use client"
import AdvancedDataTable from "@/components/advance-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyQueries } from "@/lib/graphql/company/queries";
import { useQuery } from "graphql-hooks";

export default function Page({ params }: { params: { formName: string } }) {
    const formName = decodeURIComponent(params?.formName);
    const { data, loading, error } = useQuery(companyQueries.GET_SUBMITTED_FORM_VALUE, {
        variables: {
            formName
        }
    })
    const formData = data?.getFormValuesByFormName;

    return (
        <Card className="w-full max-w-3xl mx-auto my-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">{formName}</CardTitle>
            </CardHeader>
            <CardContent>
                <AdvancedDataTable dependentCols={formData?.cols?.dependentCols} columnNames={formData?.cols?.columnNames} data={formData?.rows} />
            </CardContent>
        </Card>
    )
}