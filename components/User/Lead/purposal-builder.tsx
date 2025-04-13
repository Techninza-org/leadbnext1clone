"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, FileDown, FileText, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useState } from "react";
import { useMutation } from "graphql-hooks";


const GENERATE_PROJECT_PDF = `
  mutation generateQuotation($platform: String!, $database: String!, $apiFramework: String!, $backend: String!, $app: String!, $budget: String!, $timeline: String!, $leadId: String!) {
    generateQuotation(
      platform: $platform,
      database: $database,
      apiFramework: $apiFramework,
      backend: $backend,
      app: $app,
      budget: $budget,
      timeline: $timeline
      leadId: $leadId
    ) {
      success
      pdfUrl
      fileName
      error
    }
  }
`;


export const PurposalBuilder = ({ row }: { row: any }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
    // PDF generation state
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    // Form state
    const [formState, setFormState] = useState({
        platform: "",
        database: "",
        apiFramework: "",
        backend: "",
        app: "",
        budget: "",
        timeline: ""
    });

    // Mutation for generating PDF
    const [generatePdf] = useMutation(GENERATE_PROJECT_PDF, {
        onSuccess: ({ data }) => {
            if (data?.generateQuotation?.success) {
                // Add host to PDF URL if it's not already an absolute URL
                const fullPdfUrl = data.generateQuotation.pdfUrl.startsWith('http') 
                    ? data.generateQuotation.pdfUrl 
                    : `${window.location.origin}${data.generateQuotation.pdfUrl}`;
                
                setPdfUrl(fullPdfUrl);
                setFileName(data.generateQuotation.fileName);
                setIsGenerating(false);
                setIsDialogOpen(false);
                setIsResultDialogOpen(true);
                toast.success("Project PDF generated successfully");
            } else {
                setIsGenerating(false);
                toast.error(data?.generateQuotation?.error || "Failed to generate PDF");
            }
        },
        // onError: (error) => {
        //     setIsGenerating(false);
        //     toast.error("Error generating PDF: " + error.message);
        // }
    });

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormState({
            ...formState,
            [field]: value
        });
    };

    // Handle PDF generation
    const handleGeneratePdf = async (row: any) => {
        setIsGenerating(true);
        setPdfUrl(null);

        await generatePdf({
            variables: {
                leadId: row.original.id,
                platform: formState.platform,
                database: formState.database,
                apiFramework: formState.apiFramework,
                backend: formState.backend,
                app: formState.app,
                budget: formState.budget,
                timeline: formState.timeline
            }
        });
    };

    // Handle PDF download
    const handleDownloadPdf = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', fileName || 'project-requirements.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Handle copy PDF URL
    const handleCopyPdfUrl = () => {
        if (pdfUrl) {
            navigator.clipboard.writeText(pdfUrl)
                .then(() => toast.success("PDF URL copied to clipboard"))
                .catch(() => toast.error("Failed to copy URL"));
        }
    };


    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate PDF
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate Project Requirements PDF</DialogTitle>
                        <DialogDescription>
                            Configure the project requirements to generate a PDF document.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <Textarea
                                id="platform"
                                value={formState.platform}
                                onChange={(e) => handleInputChange("platform", e.target.value)}
                                placeholder="Enter platform details"
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="database">Database</Label>
                            <Input
                                id="database"
                                value={formState.database}
                                onChange={(e) => handleInputChange("database", e.target.value)}
                                placeholder="Enter database"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apiFramework">API Framework</Label>
                            <Input
                                id="apiFramework"
                                value={formState.apiFramework}
                                onChange={(e) => handleInputChange("apiFramework", e.target.value)}
                                placeholder="Enter API framework"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="backend">Backend</Label>
                            <Input
                                id="backend"
                                value={formState.backend}
                                onChange={(e) => handleInputChange("backend", e.target.value)}
                                placeholder="Enter backend"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="app">App</Label>
                            <Input
                                id="app"
                                value={formState.app}
                                onChange={(e) => handleInputChange("app", e.target.value)}
                                placeholder="Enter app framework"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input
                                id="budget"
                                value={formState.budget}
                                onChange={(e) => handleInputChange("budget", e.target.value)}
                                placeholder="Enter budget"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline</Label>
                            <Input
                                id="timeline"
                                value={formState.timeline}
                                onChange={(e) => handleInputChange("timeline", e.target.value)}
                                placeholder="Enter timeline"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={() => handleGeneratePdf(row)}
                            disabled={isGenerating}
                            className="w-full sm:w-auto"
                        >
                            {isGenerating ? "Generating..." : "Generate PDF"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Result Dialog to show PDF URL */}
            <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>PDF Generated Successfully</DialogTitle>
                        <DialogDescription>
                            Your PDF has been generated. You can download it or copy the link.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium">PDF URL:</p>
                                <div className="flex items-center border rounded-md p-2 mt-1">
                                    <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                                    <p className="text-sm truncate max-w-[400px]">{pdfUrl}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCopyPdfUrl}
                            className="w-full sm:w-auto"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button 
                            onClick={handleDownloadPdf} 
                            className="w-full sm:w-auto"
                        >
                            <FileDown className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
