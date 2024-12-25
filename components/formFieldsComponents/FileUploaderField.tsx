import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/file-uploader"
import Image from "next/image"
import { DropzoneOptions } from "react-dropzone"

interface FileUploaderFieldProps {
    field: any;
    fieldName: string;
    validationRules: any;
    form: any;
    fileStates: { [key: string]: File[] | null };
    handleFileChange: (fieldName: string, files: File[] | null) => void;
}

export const FileUploaderField: React.FC<FileUploaderFieldProps> = ({
    field,
    fieldName,
    validationRules,
    form,
    fileStates,
    handleFileChange
}) => {
    const dropzone: DropzoneOptions = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 4,
        maxSize: 1 * 1024 * 1024,
    };

    const files = fileStates?.[fieldName] || [];

    return (
        <FormField
            control={form.control}
            name={fieldName}
            rules={validationRules}
            render={({ field: formField }) => (
                <FormItem>
                    <FormLabel>{formField.name}</FormLabel>
                    <FileUploader
                        key={field.id}
                        value={files}
                        fieldName={formField.name}
                        onValueChange={(files) => handleFileChange(formField.name, files)}
                        dropzoneOptions={dropzone}
                        imgLimit={field?.imgLimit}
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
    )
}

