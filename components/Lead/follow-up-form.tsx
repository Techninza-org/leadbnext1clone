'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn, formatFormData } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '../ui/textarea';
import { useMutation } from 'graphql-hooks';
import { leadMutation } from '@/lib/graphql/lead/mutation';
import { useToast } from '../ui/use-toast';
import { useCompany } from '../providers/CompanyProvider';
import { DropzoneOptions } from 'react-dropzone';
import Image from 'next/image';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '../file-uploader';
import { Input } from '../ui/input';
import { PhoneInput } from '../ui/phone-input';
import { DateTimePicker } from '../date-time-picker';
import { RsInput } from '../ui/currency-input';
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from '../multiselect-input';
import { MultiSelect } from '../multi-select-new';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const FollowUpSchema = z.object({
    nextFollowUpDate: z.string(),
    remarks: z.string().min(1, 'Remarks is required'),
    customerResponse: z.string().min(1, 'Customer Response is required'),
    rating: z.string().min(1, 'Rating is required'),
});

interface FollowUpFormProps {
    lead: any;
    isFollowUpActive: boolean;
    forLead: boolean;
    setIsFollowUpActive: React.Dispatch<React.SetStateAction<boolean>>;

}

const FollowUpForm = ({ lead, isFollowUpActive, setIsFollowUpActive, forLead }: FollowUpFormProps) => {
    const [fileStates, setFileStates] = useState<{ [key: string]: File[] | null }>({});
    const { toast } = useToast();
    const { optForms } = useCompany()

    const [updateLeadFollowUpDate, { }] = useMutation(leadMutation.UPDATE_FOLLOWUP);
    const [updateProspectFollowUpDate, { }] = useMutation(leadMutation.UPDATE_FOLLOWUP_PROSPECT);

    const fields = optForms.find((x: any) => x.name.toUpperCase() === (forLead ? "LEAD FOLLOW UP" : "PROSPECT FOLLOW UP"))

    const validationSchema = fields?.fields.reduce((acc: any, field: any) => {
        if (field.isRequired) {
            acc[field.name] = { required: "Required" };
        }
        return acc;
    }, {});

    const form = useForm({
        defaultValues: fields?.fields.reduce((acc: any, field: any) => {
            acc[field.name] = "";
            return acc;
        }, {}),
        mode: "onSubmit",
        criteriaMode: "all",
    });

    const isLoading = form.formState.isSubmitting;
    const dropzone = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 4,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;

    const onSubmit = async (values: z.infer<typeof FollowUpSchema>) => {
        try {
            const variables = {
                leadId: lead?.id,
                nextFollowUpDate: values.nextFollowUpDate || "",
                customerResponse: values.customerResponse,
                rating: values.rating,
                remark: values.remarks,
                feedback: fields?.fields && formatFormData(fields?.fields, values)
            }
            let res: any;
            if (forLead) {
                res = await updateLeadFollowUpDate({
                    variables: variables,
                });
            } else {
                res = await updateProspectFollowUpDate({
                    variables: variables,
                });
            }

            const { error } = res;

            if (error) {
                const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ");
                toast({
                    title: 'Error',
                    description: message || "Something went wrong",
                    variant: "destructive"
                });
                return;
            }
            handleCancel();

            toast({
                variant: "default",
                title: "FollowUp Added Successfully!",
            });

        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = () => {
        form.reset();
        setIsFollowUpActive(false);
    }

    const handleFileChange = (fieldName: string, files: File[] | null) => {
        setFileStates((prevState) => ({
            ...prevState,
            [fieldName]: files,
        }));
    };

    const sortedFields = fields?.fields.sort((a: any, b: any) => a.order - b.order);

    return (
        <Card>
            <CardContent className='my-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-3 gap-4'>
                            <FormField
                                control={form.control}
                                name="nextFollowUpDate"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="capitalize  font-bold text-zinc-500 dark:text-secondary/70">Select Follow Up Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger className='w-full' asChild>
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
                                                            <span>Pick Follow Up Date</span>
                                                        )}
                                                        <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value as any}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='customerResponse'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize font-bold text-zinc-500 dark:text-secondary/70">Customer Response</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="Select Response" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectItem value="Hot">Hot</SelectItem>
                                                <SelectItem value="Warm">Warm</SelectItem>
                                                <SelectItem value="Cold">Cold</SelectItem>

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='remarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize font-bold text-zinc-500 dark:text-secondary/70">Remarks</FormLabel>
                                        <Input
                                            className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            placeholder="Remarks"
                                            disabled={isLoading}
                                            {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {sortedFields?.map((cfield: any) => {
                                //  const isRequired = cfield.isRequired;
                                const isDisabled = cfield.isDisabled;
                                const validationRules = validationSchema?.[cfield.name] || {};

                                if (['TEXTAREA', 'INPUT'].includes(cfield.fieldType)) {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-primary dark:text-secondary/70">{cfield.name}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-zinc-100/50 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                            placeholder={cfield.name}
                                                            disabled={isDisabled}
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }
                                if (['PHONE'].includes(cfield.fieldType)) {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-primary dark:text-secondary/70">{cfield.name}</FormLabel>
                                                    <FormControl>
                                                        <PhoneInput
                                                            className="bg-zinc-100/50 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                            placeholder={cfield.name}
                                                            disabled={isDisabled}
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }
                                if (['DATETIME'].includes(cfield.fieldType)) {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem className="flex w-72 flex-col gap-2">
                                                    <FormLabel htmlFor="datetime">{cfield.name}</FormLabel>
                                                    <FormControl>
                                                        <DateTimePicker granularity="minute" value={field.value || new Date()} onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }
                                if (['CURRENCY'].includes(cfield.fieldType)) {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-primary dark:text-secondary/70">{cfield.name}</FormLabel>
                                                    <FormControl>
                                                        <RsInput
                                                            className="bg-zinc-100/50 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                            placeholder={cfield.name}
                                                            disabled={isDisabled}
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }
                                if (['TAG'].includes(cfield.fieldType)) {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-primary dark:text-secondary/70">{cfield.name}</FormLabel>
                                                    <FormControl>
                                                        <MultiSelector
                                                            onValuesChange={field.onChange}
                                                            values={field.value}
                                                        >
                                                            <MultiSelectorTrigger>
                                                                <MultiSelectorInput placeholder="Select members to assign" />
                                                            </MultiSelectorTrigger>
                                                            <MultiSelectorContent>
                                                                <MultiSelectorList className="h-32 scrollbar-hide  overscroll-y-auto">
                                                                    {
                                                                        cfield.options?.map((opt: any) => (
                                                                            <MultiSelectorItem
                                                                                key={opt?.value}
                                                                                value={opt?.value || ""}
                                                                                className="capitalize"
                                                                            >
                                                                                {opt?.value}
                                                                            </MultiSelectorItem>
                                                                        ))}
                                                                </MultiSelectorList>
                                                            </MultiSelectorContent>
                                                        </MultiSelector>
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
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-primary">{cfield.name}</FormLabel>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    );
                                }
                                if (cfield.fieldType === 'DD') {
                                    const options = cfield.options.flatMap((pOption: any) => {
                                        if (form.watch(cfield.ddOptionId)?.includes(pOption.label)) {
                                            return pOption.value.map((option: any, optIndex: any) => ({
                                                label: option.label,
                                                value: option.value || option.label
                                            }))
                                        }
                                        return []
                                    })

                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-primary">{cfield.name}</FormLabel>
                                                    <MultiSelect
                                                        disabled={!form.watch(cfield.ddOptionId)}
                                                        options={options}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        placeholder={cfield.name}
                                                        variant="secondary"
                                                        maxCount={3}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    );
                                }
                                if (cfield.fieldType === 'DD_IMG') {
                                    const options = cfield.options.flatMap((pOption: any) => {
                                        if (form.watch(cfield.ddOptionId)?.includes(pOption.label)) {
                                            return pOption.value.map((option: any, optIndex: any) => ({
                                                label: option.label,
                                                value: option.value || option.label
                                            }))
                                        }
                                        return []
                                    })

                                    const allLabels = cfield.options.flatMap((pOption: any) => pOption.label);
                                    const isChildExist = sortedFields.some((x: any) => allLabels.includes(x.name));
                                    return (
                                        <>
                                            <FormField
                                                key={cfield.id}
                                                control={form.control}
                                                name={cfield.name}
                                                rules={validationRules}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-primary">{cfield.name}</FormLabel>
                                                        <MultiSelect
                                                            disabled={!form.watch(cfield.ddOptionId)}
                                                            options={options}
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            placeholder={cfield.name}
                                                            variant="secondary"
                                                            maxCount={3}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {!isChildExist && form.watch(cfield.name)?.map((selectedField: any) => <FormField
                                                key={cfield.id}
                                                control={form.control}
                                                name={selectedField}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{selectedField}</FormLabel>
                                                        <FileUploader
                                                            key={cfield.id}
                                                            value={fileStates[selectedField]}
                                                            fieldName={selectedField}
                                                            onValueChange={(files) => handleFileChange(selectedField, files)}
                                                            dropzoneOptions={dropzone}
                                                            imgLimit={cfield?.imgLimit}
                                                        >
                                                            <FileInput>
                                                                <div className="flex items-center justify-center h-32 border bg-background rounded-md">
                                                                    <p className="text-gray-400">Drop files here</p>
                                                                </div>
                                                            </FileInput>
                                                            <FileUploaderContent className="flex items-center flex-row gap-2">
                                                                {fileStates[selectedField]?.map((file: any, i: number) => (
                                                                    <FileUploaderItem
                                                                        key={i}
                                                                        index={i}
                                                                        className="size-20 p-0 rounded-md overflow-hidden"
                                                                        aria-roledescription={`file ${i + 1} containing ${selectedField}`}
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
                                            />)}
                                        </>
                                    );
                                }
                                if (cfield.fieldType === 'RADIO') {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
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
                                    const files = fileStates?.[cfield.name] || [];
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{field.name}</FormLabel>
                                                    <FileUploader
                                                        key={cfield.id}
                                                        value={files}
                                                        fieldName={field.name}
                                                        onValueChange={(files) => handleFileChange(field.name, files)}
                                                        dropzoneOptions={dropzone}
                                                        imgLimit={cfield?.imgLimit}
                                                    >
                                                        <FileInput>
                                                            <div className="flex items-center justify-center h-32 border bg-background rounded-md">
                                                                <p className="text-gray-400">Drop files here</p>
                                                            </div>
                                                        </FileInput>
                                                        <FileUploaderContent className="flex items-center flex-row gap-2">
                                                            {files?.map((file: any, i: number) => (
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

                                if (cfield.fieldType === "DATE") {
                                    return (
                                        <FormField
                                            key={cfield.id}
                                            control={form.control}
                                            name={cfield.name}
                                            rules={validationRules}
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

                        </div>

                        <div className='grid place-items-end justify-between grid-flow-col mt-2'>
                            {/* <Button type="button" variant={'destructive'} onClick={handleCancel}>Cancel</Button> */}
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default FollowUpForm