"use client"
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatCurrencyForIndia } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckIcon, LucideSeparatorHorizontal } from "lucide-react";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "../file-uploader";
import { useState } from "react";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";
import { userAtom } from "@/lib/atom/userAtom";
import { useAtomValue } from "jotai";

export const WalletDeductionSchema = z.object({
    type: z.string(),
    desc: z.string().min(5).max(100),
    image: z.array(z.any()).max(4),
});


export const BroadcastForm = () => {

    const user = useAtomValue(userAtom);

    const [fileStates, setFileStates] = useState<Record<string, File[] | null>>({});

    const form = useForm({
        resolver: zodResolver(WalletDeductionSchema),
        defaultValues: {
            desc: "",
            type: "offer",
            image: [],
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: any) => {
        
        try {
            let uploadedFiles: any[] = [];

            const formData = new FormData();

            // formData.append('id', '66e97b8ba05d53af8f834526');
            
            formData.append('isOffer', data.type === "offer" ? "true" : "false");
            formData.append('isTemplate', data.type === "template" ? "true" : "false");
            formData.append('isMessage', data.type === "message" ? "true" : "false");
            formData.append('message', data.desc);

            Object.keys(fileStates).forEach((fieldName) => {
                const filesForField = fileStates[fieldName];
                filesForField?.forEach((file, index) => {
                    formData.append(`${fieldName}_${index}`, file);
                });
            });

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API || 'http://localhost:8080'}/graphql/broadcastMessage`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `x-lead-token ${user?.token}`,
                }
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error("Failed to upload files");
            }

            uploadedFiles = uploadData.files || [];

            // Map the uploaded file URLs to the corresponding form fields

            // Submit the feedback with the uploaded file URLs
            // const { data: resData, loading, error } = await submitFeedback({
            //     variables: {
            //         deptId: user?.deptId,
            //         leadId: lead?.id || "",
            //         callStatus: "SUCCESS",
            //         paymentStatus: "PENDING",
            //         feedback: formatFormData((formDataWithUrls as CallData[]), data),
            //         submitType: "updateLead",
            //     },
            // });

            // if (error) {
            //     const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ");
            //     toast({
            //         title: 'Error',
            //         description: message || "Something went wrong",
            //         variant: "destructive"
            //     });
            //     return;
            // }

            // toast({
            //     variant: "default",
            //     title: "Lead Submitted Successfully!",
            // });
            // handleClose();
        } catch (error) {
            console.error("Error during submission:", error);
            // toast({
            //     title: 'Error',
            //     description: "Failed to submit lead feedback.",
            //     variant: "destructive"
            // });
        }
    };

    const files = fileStates['image'];
    console.log(files, 'files')

    const handleFileChange = (fieldName: string, files: File[] | null) => {
        setFileStates((prevState) => ({
            ...prevState,
            [fieldName]: files,
        }));
    };


    const dropzone = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[500px]   ">

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="offer" />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">
                                            offer
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="template" />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">
                                            template
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="message" />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">
                                            message
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Enter the Description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={'image'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FileUploader
                                value={files}
                                fieldName={field.name}
                                onValueChange={(files) => handleFileChange(field.name, files)}
                                dropzoneOptions={dropzone}
                                imgLimit={4}
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
                        </FormItem>
                    )}
                />


                <Button disabled={isLoading}>
                    Broadcast
                </Button>
            </form>
        </Form>

    )
};