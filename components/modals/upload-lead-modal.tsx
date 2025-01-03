"use client"

import { useForm } from 'react-hook-form';
import { userAtom } from '@/lib/atom/userAtom';
import { useAtom, useAtomValue } from 'jotai';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

import { useModal } from '@/hooks/use-modal-store';
import { generateCSV, parseCSVToJson } from '@/lib/utils';
import { UploadIcon } from 'lucide-react';
import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '../file-uploader';
import Image from 'next/image';
import { DropzoneOptions } from 'react-dropzone';

const dropzone = {
    accept: {
        "text/csv": [".csv"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
} satisfies DropzoneOptions;


export const UploadLeadModal = () => {

    const userInfo = useAtomValue(userAtom)
    const [uploadedCSVHeaders, setUploadedCSVHeaders] = useState<string[]>([])
    const [uploadCSVData, setUploadCSVData] = useState<any[]>()
    const [fileStates, setFileStates] = useState<{ [key: string]: File[] | null }>({});


    const { isOpen, onClose, type, data: modalData } = useModal();
    const { leads, fields } = modalData;

    const isModalOpen = isOpen && type === "uploadLeadModal";

    const validationSchema = fields?.formFields?.reduce((acc: any, field: any) => {
        if (field.isRequired) {
            acc[field.name] = { required: "Required" };
        }
        return acc;
    }, {});

    const form = useForm({
        defaultValues: fields?.formFields?.reduce((acc: any, field: any) => {
            acc[field.name] = "";
            return acc;
        }, {}),
        mode: "onSubmit",
        criteriaMode: "all",
    });

    const updateCsvKeys = (csvData: any, formDataMapping: any) => {
        const updatedJsonData = csvData.map((row: any) => {
            const newRow: any = {};
            Object.entries(formDataMapping).forEach(([formKey, csvKey]: any) => {
                newRow[formKey] = row[csvKey];
            });
            return newRow;
        });

        return updatedJsonData;
    };


    const wrapFieldsInDynamicFieldValueArray = (
        fields: any[],
        inputData: any[]
    ) => {
        return inputData.map((data) => {
            const dynamicFieldValue: Record<string, any> = {};
            const updatedData: Record<string, any> = { ...data };

            fields.forEach((field) => {
                const fieldName = field.name;
                if (data[fieldName] !== undefined) {
                    dynamicFieldValue[fieldName] = data[fieldName];
                    delete updatedData[fieldName];
                }
            });

            updatedData.dynamicFieldValue = dynamicFieldValue;
            return updatedData;
        });
    };


    const sortedFields = fields?.formFields?.sort((a: any, b: any) => a.order - b.order) || [];

    const onSubmit = async (data: any) => {
        const updatedCSVData = wrapFieldsInDynamicFieldValueArray(sortedFields || [], updateCsvKeys(uploadCSVData, data))
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API || 'http://localhost:8080'}/graphql/bulk-upload-lead`, {
                method: 'POST',
                body: JSON.stringify(updatedCSVData),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `x-lead-token ${userInfo?.token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error uploading CSV file');
            }

            const contentType = response.headers.get('Content-Type');

            if (contentType && contentType.includes('text/csv')) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'error_report.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                const result = await response.json();
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
        }
    };

    const handleClose = () => {
        setUploadedCSVHeaders([])
        form.reset();
        onClose();
    }


    const handleCSVChange = async ({ files }: { files: File[] | null }) => {
        if (!files || files.length === 0) return;

        try {
            const file = files[0];
            const parsedJson = await parseCSVToJson(file);
            setUploadCSVData(parsedJson.jsonData)
            setUploadedCSVHeaders(parsedJson.headers)
        } catch (error) {
            console.error("Error parsing CSV:", error);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md">
                <DialogHeader className="pt-6">
                    <DialogTitle className="flex justify-between text-2xl text-center font-bold">
                        <div>Upload Lead</div>


                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex justify-center w-full'>
                            {uploadedCSVHeaders.length >= 1 ? <ScrollArea className='h-[390px] w-full p-2'>
                                <div className='grid grid-cols-2 gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <Select disabled={uploadedCSVHeaders.length < 1} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select`} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            uploadedCSVHeaders.map((item, i) => (
                                                                <SelectItem key={i} value={item}>{item}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <Select disabled={uploadedCSVHeaders.length < 1} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select`} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            uploadedCSVHeaders.map((item, i) => (
                                                                <SelectItem key={i} value={item}>{item}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <Select disabled={uploadedCSVHeaders.length < 1} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select`} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            uploadedCSVHeaders.map((item, i) => (
                                                                <SelectItem key={i} value={item}>{item}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="alternatePhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Alternate Phone</FormLabel>
                                                <Select disabled={uploadedCSVHeaders.length < 1} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select`} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            uploadedCSVHeaders.map((item, i) => (
                                                                <SelectItem key={i} value={item}>{item}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {sortedFields?.map((cfield: any) => {
                                        //  const isRequired = cfield.isRequired;
                                        const isDisabled = cfield.isDisabled;
                                        const validationRules = validationSchema?.[cfield.name] || {};

                                        return (
                                            <FormField
                                                key={cfield.id}
                                                control={form.control}
                                                name={cfield.name}
                                                rules={validationRules}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-primary">{cfield.name}</FormLabel>
                                                        <Select disabled={uploadedCSVHeaders.length < 1} onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={`Select`} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    uploadedCSVHeaders.map((item, i) => (
                                                                        <SelectItem key={i} value={item}>{item}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        );


                                    })}
                                </div>
                            </ScrollArea> :
                                <FileUploader
                                    value={fileStates["file"]}
                                    fieldName={"file"}
                                    onValueChange={(files) => handleCSVChange({ files: files })}
                                    dropzoneOptions={dropzone}
                                    imgLimit={1}
                                    className='w-full'
                                >
                                    <FileInput>
                                        <div className="flex items-center justify-center h-32 border bg-background rounded-md">
                                            <p className="text-gray-400">Drop files here</p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent className="flex items-center flex-row gap-2">
                                        {fileStates["file"]?.map((file: any, i: number) => (
                                            <FileUploaderItem
                                                key={i}
                                                index={i}
                                                className="size-20 p-0 rounded-md overflow-hidden"
                                                aria-roledescription={`file ${i + 1} containing `}
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
                                </FileUploader>}
                        </div>

                        <div className="flex justify-between">

                            <div className='mt-6 space-x-2 flex gap-2'>

                                <Button
                                    variant="default"
                                    color="primary"
                                    size={"sm"}
                                    className="items-center gap-1"
                                    // @ts-ignore
                                    onClick={() => generateCSV([{ name: "Name" }, { name: "Phone" }, { name: "Email" }, { name: "Address" }, ...sortedFields], "lead")}
                                >
                                    <UploadIcon size={15} /> <span>Sample Lead</span>
                                </Button>

                                {/* ADDING VALIDATION AND STYING IS PENDINF */}
                                {/* <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    ref={fileInputRef}
                                    id="csv-upload"
                                    // @ts-ignore
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCSVChange({ target: { files: Array.from(event.target.files || []) } })}
                                />
                                <label htmlFor="csv-upload">
                                    <Button
                                        variant="default"
                                        color="primary"
                                        size={"sm"}
                                        className="items-center gap-1"
                                        onClick={() => fileInputRef?.current?.click()}
                                    >
                                        <UploadIcon size={15} /> <span>Upload Lead CSV File</span>
                                    </Button>
                                </label> */}

                            </div>
                            <Button
                                variant="default"
                                color="primary"
                                size={"sm"}
                                type='submit'
                                className="items-center gap-1 ml-auto mt-6"
                            >
                                Submit Lead
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}