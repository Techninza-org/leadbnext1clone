"use client"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/file-uploader";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"


import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "graphql-hooks"
import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atom/userAtom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { leadMutation } from "@/lib/graphql/lead/mutation"
import { CallData, cn, formatFormData } from "@/lib/utils"
import { useModal } from "@/hooks/use-modal-store"
import { DropzoneOptions } from "react-dropzone"
import { useState } from "react"
import Image from "next/image"
import { CalendarDaysIcon } from "lucide-react"
import { format } from "date-fns"

export const SubmitLeadModal = () => {

    const user = useAtomValue(userAtom)
    const { toast } = useToast()

    const [files, setFiles] = useState<File[] | null>([]);

    const dropzone = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 4,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;


    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead, fields } = modalData;

    const isModalOpen = isOpen && type === "submitLead";

    const [submitFeedback, { loading: feedBackLoading }] = useMutation(leadMutation.SUBMIT_LEAD);

    const form = useForm<any>({
        // resolver: zodResolver(submitFeedbackSchema),
    })

    const { formState: { errors } } = form

    const onSubmit = async (data: any) => {
        try {
            let uploadedFiles: any[] = [];

            if (files?.length) {
                const formData = new FormData();
                files.forEach((file: File) => {
                    formData.append(file.name, file); // Use the field name
                });

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API || 'http://localhost:8080'}/graphql/upload`, {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                uploadedFiles = uploadData.files; // Assuming the response contains an array of file objects with fieldname and url

                // Map the uploaded files to the form data
                const formDataWithUrls = fields?.subDeptFields.map((field: any) => {
                    if (field.fieldType === 'IMAGE') {
                        const uploadedFile = uploadedFiles?.find((file: any) => file.fieldname === field.name);
                        if (uploadedFile) {
                            return { ...field, value: uploadedFile.url };
                        }
                    }
                    return field;
                });

                console.log(formatFormData((formDataWithUrls as CallData[]), data))
                // Proceed with GraphQL mutation
                const { data: resData, loading, error } = await submitFeedback({
                    variables: {
                        deptId: user?.deptId,
                        leadId: lead?.id || "",
                        callStatus: "SUCCESS",
                        paymentStatus: "PENDING",
                        feedback: formatFormData((formDataWithUrls as CallData[]), data),
                    },
                });

                if (error) {
                    const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ");
                    toast({
                        title: 'Error',
                        description: message || "Something went wrong",
                        variant: "destructive"
                    });
                    return;
                }

                toast({
                    variant: "default",
                    title: "Lead Submitted Successfully!",
                });
                handleClose();
            } else {
                // No files to upload, directly proceed with GraphQL mutation
                const { data: resData, loading, error } = await submitFeedback({
                    variables: {
                        deptId: user?.deptId,
                        leadId: lead?.id || "",
                        callStatus: "SUCCESS",
                        paymentStatus: "PENDING",
                        feedback: formatFormData(fields?.subDeptFields ?? [], data),
                    },
                });

                if (error) {
                    const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ");
                    toast({
                        title: 'Error',
                        description: message || "Something went wrong",
                        variant: "destructive"
                    });
                    return;
                }

                toast({
                    variant: "default",
                    title: "Lead Submitted Successfully!",
                });
                // handleClose();
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast({
                title: 'Error',
                description: "Failed to submit lead feedback.",
                variant: "destructive"
            });
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-sm">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        {fields?.name}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        {fields?.subDeptFields.map((cfield: any) => {
                            if (cfield.fieldType === 'INPUT' || cfield.fieldType === 'TEXTAREA') {
                                return (
                                    <FormField
                                        key={cfield.id}
                                        control={form.control}
                                        name={cfield.name}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className=" font-semibold dark:text-secondary/70">{cfield.name}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="bg-zinc-100/50 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                        placeholder={cfield.name}
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }
                            if (cfield.fieldType === 'SELECT') {
                                return (
                                    <FormField
                                        key={cfield.id}
                                        control={form.control}
                                        name={cfield.name}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{cfield.name}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue className="placeholder:capitalize" placeholder={cfield.name} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {cfield.options.map((option: any) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                );
                            }
                            if (cfield.fieldType === 'RADIO') {
                                return (
                                    <FormField
                                        key={cfield.id}
                                        control={form.control}
                                        name={cfield.name}
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>{cfield.name}</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={cfield.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        {cfield.options.map((option: any) => (
                                                            <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value={option.value} />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {option.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                );
                            }
                            if (cfield.fieldType === "IMAGE") {
                                return (
                                    <FileUploader
                                        key={cfield.id}
                                        value={files}
                                        fieldName={cfield.name}
                                        onValueChange={setFiles}
                                        dropzoneOptions={dropzone}
                                    >
                                        <FileInput>
                                            <div className="flex items-center justify-center h-32 border bg-background rounded-md">
                                                <p className="text-gray-400">Drop files here</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent className="flex items-center flex-row gap-2">
                                            {files?.map((file, i) => (
                                                <FileUploaderItem
                                                    key={i}
                                                    index={i}
                                                    className="size-20 p-0 rounded-md overflow-hidden"
                                                    aria-roledescription={`file ${i + 1} containing ${file.name}`}
                                                >
                                                    <Image
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        height={80}
                                                        width={80}
                                                        className="size-20 p-0"
                                                    />
                                                </FileUploaderItem>
                                            ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                )
                            }
                            if (cfield.fieldType === "DATE") {
                                return (
                                    <FormField
                                        key={cfield.id}
                                        control={form.control}
                                        name={cfield.name}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>{cfield.name}</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }
                        })}


                        <Button type="submit" className="mt-6">Submit Lead</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}