// @ts-nocheck
"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAtomValue } from "jotai"
import { useQuery, useMutation } from "graphql-hooks"
import { ArrowDown, ArrowUp, Check, ChevronsUpDownIcon, PencilIcon, PlusIcon, SearchIcon, UploadIcon, X } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'

import { deptQueries } from "@/lib/graphql/dept/queries"
import { DeptMutation } from "@/lib/graphql/dept/mutation"
import { userAtom } from "@/lib/atom/userAtom"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { cn, parseCSVToJson } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import { useCompany } from '../providers/CompanyProvider'
import { fieldTypes } from './create-department-modal'

const DepartmentSchema = z.object({
    deptFields: z.array(z.object({
        name: z.string().min(1, "Field name is required"),
        fieldType: z.string().min(1, "Field type is required"),
        ddOptionId: z.any().optional(),
        order: z.number().int().min(1, "Field order is required"),
        options: z.array(z.object({
            label: z.string(),
            value: z.any(),
        })).default([]),
        isRequired: z.boolean(),
        isDisabled: z.boolean(),
    })).default([]),
})

const UpdateDepartmentOptFieldsModal = ({ deptName, companyId }) => {
    const [currIdx, setCurrIdx] = useState(0)
    const userInfo = useAtomValue(userAtom)
    const [currentOptionsIndx, setCurrentOptionsIndx] = useState(0)
    const { toast } = useToast()
    const { optForms } = useCompany()

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [jsonData, setJsonData] = useState<ParsedData[] | null>(null);


    const [searchTerm, setSearchTerm] = useState('')
    const [editingIndex, setEditingIndex] = useState(null);

    const [updateDepartmentOptFields] = useMutation(DeptMutation.UPDATE_DEPT_OPT)

    const form = useForm({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: { deptFields: [] },
    })

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "deptFields",
    })


    const filteredDeptFields = useMemo(() =>
        optForms?.filter(field => String(field.name) === String(deptName)) || [],
        [optForms, deptName])

    useEffect(() => {
        if (filteredDeptFields.length > 0) {
            const sortedSubDeptFields = filteredDeptFields[0]?.subDeptFields?.sort((a, b) => a.order - b.order) || []
            form.reset({ deptFields: sortedSubDeptFields })
        }
    }, [filteredDeptFields, form])

    const onSubmit = useCallback(async (values) => {
        try {
            const { data, error } = await updateDepartmentOptFields({
                variables: {
                    input: {
                        companyId: userInfo?.companyId || "",
                        name: deptName,
                        order: 4,
                        subDeptFields: values.deptFields,
                    }
                },
            });

            if (error) {
                const message = error?.graphQLErrors?.map((e) => e.message).join(", ");
                toast({
                    title: 'Error',
                    description: message || "Something went wrong",
                    variant: "destructive"
                });
                return;
            }

            toast({
                variant: "default",
                title: "Department Form Updated Successfully!",
            });

        } catch (error) {
            console.error(error);
        }
    }, [])

    const handleSelectChange = useCallback((value, index) => {
        console.log(value, index, "value, index");
        
        form.setValue(`deptFields.${index}.fieldType`, value)
        if (['SELECT', 'RADIO', 'DROPDOWN', 'CHECKBOX'].includes(value)) {
            const currentOptions = form.getValues(`deptFields.${index}.options`) || []
            if (currentOptions.length === 0) {
                form.setValue(`deptFields.${index}.options`, [])
            }
        }
    }, [form])

    const moveField = useCallback((index, direction) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= fields.length) return

        const updatedFields = fields.map((field, idx) => ({
            ...field,
            order: idx === index ? newIndex + 1 : idx === newIndex ? index + 1 : idx + 1,
        }))

        updatedFields.splice(newIndex, 0, updatedFields.splice(index, 1)[0])
        form.setValue('deptFields', updatedFields)
    }, [fields, form])

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            const file = files[0];
            const parsedJson = await parseCSVToJson(file);
            form.setValue(`deptFields.${currIdx}.options.${currentOptionsIndx}.value`, parsedJson)
            // setJsonData(parsedJson);
            // const { data, error } = await updateDepartmentFields({
            //     variables: {
            //         input: {
            //             companyDeptId: deptId || "",
            //             name: deptName,
            //             order: 4,
            //             subDeptFields: form.getValues(`deptFields`),
            //         }
            //     },
            // });
        } catch (error) {
            console.error("Error parsing CSV:", error);
        }
    };

    // console.log(form.watch(`deptFields.${currIdx}.options`), "`deptFields.${currIdx}.options`")

    const renderFieldOptions = useCallback(() => {
        const fieldType = form.watch(`deptFields.${currIdx}.fieldType`)

        if (['SELECT', 'RADIO', 'CHECKBOX'].includes(fieldTypes)) {
            // console.log(, "form.watch(`deptFields.${currIdx}.options`)")
            return (
                <div className="mt-4">
                    <FormLabel className="mr-2">Options ({form.watch(`deptFields.${currIdx}.name`)}) </FormLabel>
                    <div className="relative my-2">
                        <Input
                            type='text'
                            id="options-search"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                            className="pl-10"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <ScrollArea className='h-52 w-full'>
                        {form.watch(`deptFields.${currIdx}.options`)
                            ?.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase())) // Search filter
                            .map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center mb-2 mt-2">
                                    <Input
                                        placeholder="Value"
                                        className="mr-2"
                                        value={option.label || option.value}
                                        disabled={editingIndex !== optIndex}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const options = form.getValues(`deptFields.${currIdx}.options`);
                                            options[optIndex] = { label: value, value };
                                            form.setValue(`deptFields.${currIdx}.options`, options);
                                        }}
                                    />
                                    {editingIndex === optIndex ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setEditingIndex(null)}
                                        >
                                            <Check size={20} color="green" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setEditingIndex(optIndex)}
                                        >
                                            <PencilIcon size={20} color="blue" />
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            const options = form.getValues(`deptFields.${currIdx}.options`);
                                            options.splice(optIndex, 1);
                                            form.setValue(`deptFields.${currIdx}.options`, options);
                                        }}
                                    >
                                        <X size={20} color="red" />
                                    </Button>
                                </div>
                            ))}
                    </ScrollArea>

                    <Button
                        type="button"
                        onClick={() => {
                            const options = form.getValues(`deptFields.${currIdx}.options`) || [];
                            options.push({ label: '', value: '' });
                            form.setValue(`deptFields.${currIdx}.options`, options);
                        }}
                        className="mt-2 bg-blue-500 text-white"
                    >
                        <PlusIcon size={15} />
                        Add Option
                    </Button>
                </div>
            );
        }

        if (fieldType === 'DD' || fieldType === 'DD_IMG') {
            const grandParentElem = form.watch('deptFields').find((item) => item.name === (form.watch('deptFields').find(x => x.name == form.watch(`deptFields.${currIdx}.ddOptionId`)))?.ddOptionId)
            return (
                <div className="mt-4">

                    <div className='flex'>
                        <div>
                            {form.watch(`deptFields.${currIdx}.ddOptionId`) && grandParentElem && (
                                <div>
                                    <div className="font-medium text-sm mr-2">Field Label Name ({grandParentElem.name})</div>
                                    <FormLabel className="mr-2">Grand Parent ({grandParentElem.name})</FormLabel>
                                    <Select
                                        onValueChange={(value) => form.setValue(`deptFields.${currIdx}.grandParentId`, value)}
                                        value={form.watch(`deptFields.${currIdx}.grandParentId`) || undefined}
                                    >
                                        <SelectTrigger className="w-[300px]">
                                            <SelectValue placeholder="Select grand parent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                grandParentElem?.fieldType === "DD" ? grandParentElem.options.flatMap((pOption) => (
                                                    Array.isArray(pOption?.value) && pOption?.value?.map((option, optIndex) => (
                                                        option.label && <SelectItem key={optIndex} value={option.label}>
                                                            {option.label}
                                                        </SelectItem>
                                                    )))) : grandParentElem?.options.map((option, optIndex) => (
                                                        <SelectItem key={optIndex} value={option.label}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="font-medium text-sm mr-2">Field Label Name ({form.watch(`deptFields.${currIdx}.ddOptionId`)})</div>
                            <FormLabel className="mr-2">Dependent On ({form.watch(`deptFields.${currIdx}.ddOptionId`)})</FormLabel>
                            <Select
                                onValueChange={(value) => form.setValue(`deptFields.${currIdx}.ddOptionId`, value)}
                                value={form.watch(`deptFields.${currIdx}.ddOptionId`) || undefined}
                            >
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Select dependency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {form.watch('deptFields').filter(x => ["SELECT", "DD"].includes(x.fieldType)).map((field, index) => (
                                        field.name !== form.watch(`deptFields.${currIdx}.name`) && <SelectItem key={index} value={field.name}>
                                            {field.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {form.watch(`deptFields.${currIdx}.ddOptionId`) && (
                        <div className="mt-4">
                            <FormLabel className="mr-2 block">Select Values from Linked Field</FormLabel>
                            <Controller
                                name={`deptFields.${currIdx}.linkedFieldValues`}
                                control={form.control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[250px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value || "Select values"}
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search language..." />
                                                <CommandList>
                                                    <CommandEmpty>No language found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {(() => {
                                                            const selectedParent = filteredDeptFields[0]?.subDeptFields.find(
                                                                (subField) => subField.name === form.watch(`deptFields.${currIdx}.ddOptionId`)
                                                            )
                                                            if (selectedParent?.fieldType === "SELECT") {
                                                                return selectedParent.options.map((option, optIndex) => (
                                                                    option.label && <CommandItem
                                                                        key={`${option.label}-${optIndex}`}
                                                                        value={option.label}
                                                                        onSelect={(value) => {
                                                                            field.onChange(value)
                                                                            const options = form.getValues(`deptFields.${currIdx}.options`) || []
                                                                            if (!options.find(x => x.label === value)) {
                                                                                options.push({ label: value, value: [] })
                                                                                form.setValue(`deptFields.${currIdx}.options`, options)
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                option.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {option.label}
                                                                    </CommandItem>
                                                                ))
                                                            }
                                                            if (selectedParent?.fieldType === 'DD') {
                                                                return selectedParent.options.filter((x => x.label === form.watch(`deptFields.${currIdx}.grandParentId`))).flatMap((pOption) =>
                                                                    pOption.value.map((option, optIndex) => (
                                                                        option.label && <CommandItem
                                                                            key={`${option.label}-${optIndex}`}
                                                                            value={option.label}
                                                                            onSelect={(value) => {
                                                                                field.onChange(value)
                                                                                const options = form.getValues(`deptFields.${currIdx}.options`) || []
                                                                                if (!options.find(x => x.label === value)) {
                                                                                    options.push({ label: value, value: [] })
                                                                                    form.setValue(`deptFields.${currIdx}.options`, options)
                                                                                }
                                                                                // console.log(value, , "form.getValues(`deptFields.${currIdx}.options`)")
                                                                                setCurrentOptionsIndx(form.getValues(`deptFields.${currIdx}.options`).findIndex((x) => x.label === value))
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    option.value === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {option.label}
                                                                        </CommandItem>
                                                                    ))
                                                                )
                                                            }
                                                            return null
                                                        })()}

                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                    )}

                    <div className='my-3 '>

                        {/* ADDING VALIDATION AND STYING IS PENDINF */}
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            ref={fileInputRef}
                            id="csv-upload"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange({ target: { files: Array.from(event.target.files || []) } })}
                        />
                        <label htmlFor="csv-upload">
                            <Button
                                variant="default"
                                color="primary"
                                size={"sm"}
                                className="items-center gap-1"
                                onClick={() => fileInputRef?.current?.click()}
                            >
                                <UploadIcon size={15} /> <span>Upload Options</span>
                            </Button>
                        </label>
                    </div>


                    <div className='pl-5'>
                        <FormLabel className="mr-2 mt-4 block">Options</FormLabel>
                        <div className="relative my-2">
                            <Input
                                type='text'
                                id="options-search"
                                placeholder="Search options..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <ScrollArea className="h-52 p-3 rounded-md border">
                            {form.watch(`deptFields.${currIdx}.options`)
                                ?.find(x => x.label === form.watch(`deptFields.${currIdx}.linkedFieldValues`))
                                ?.value
                                .filter(option => option?.label?.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((nestedOption, nestedIndex) => (
                                    <div key={nestedIndex} className="flex items-center mb-2">
                                        <Input
                                            placeholder="Nested Value"
                                            className="mr-2 outline-none focus:outline-none focus:ring-0 focus:border-transparent" // Ensures no outline, ring, or border on focus
                                            value={nestedOption.label}
                                            disabled={editingIndex !== nestedIndex}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const options = form.getValues(`deptFields.${currIdx}.options`)
                                                const optionIndex = options.findIndex(x => x.label === form.getValues(`deptFields.${currIdx}.linkedFieldValues`))
                                                options[optionIndex].value[nestedIndex] = { label: value, value }
                                                form.setValue(`deptFields.${currIdx}.options`, options)
                                            }}
                                        />
                                        {editingIndex === nestedIndex ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setEditingIndex(null)}
                                            >
                                                <Check size={20} color="green" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setEditingIndex(nestedIndex)}
                                            >
                                                <PencilIcon size={20} color="blue" />
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                const options = form.getValues(`deptFields.${currIdx}.options`)
                                                const optionIndex = options.findIndex(x => x.label === form.getValues(`deptFields.${currIdx}.linkedFieldValues`))
                                                options[optionIndex].value.splice(nestedIndex, 1)
                                                form.setValue(`deptFields.${currIdx}.options`, options)
                                            }}
                                        >
                                            <X size={20} color="red" />
                                        </Button>
                                    </div>
                                ))}
                        </ScrollArea>
                    </div>

                    {form.watch(`deptFields.${currIdx}.linkedFieldValues`) && (
                        <Button
                            type="button"
                            onClick={() => {
                                const options = form.getValues(`deptFields.${currIdx}.options`)
                                const optionIndex = options.findIndex(x => x.label === form.getValues(`deptFields.${currIdx}.linkedFieldValues`))
                                options[optionIndex].value.push({ label: '', value: '' })
                                form.setValue(`deptFields.${currIdx}.options`, options)
                            }}
                            className="mt-2 bg-blue-500 text-white"
                        >
                            <PlusIcon size={15} />
                            Add Nested Option
                        </Button>
                    )}
                </div>
            )
        }

        return null
    }, [form, currIdx, searchTerm, editingIndex, filteredDeptFields])

    return (
        <Form {...form}>
            <Card className="grid grid-cols-7 gap-2">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-bold">Form Builder  {filteredDeptFields[0]?.name || ''}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className={`mb-4 border p-4 rounded-md ${currIdx === index ? 'bg-blue-50' : ''}`}
                                    onClick={() => setCurrIdx(index)}
                                >
                                    <div className="grid grid-cols-8 gap-2">
                                        <div className="col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                                placeholder="Field Name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.fieldType`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                                handleSelectChange(value, index)
                                                                form.trigger()
                                                                setCurrIdx(index)
                                                            }}
                                                            value={field.value || ""}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0">
                                                                    <SelectValue placeholder="Select Field Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0">
                                                                {fieldTypes.map(type => (
                                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* {form.watch(`deptFields.${index}.fieldType`) === "DD" && <div key={index}>
                                                <FormLabel className="mr-2">Dependent On ({index})</FormLabel>
                                                <Select
                                                    onValueChange={(value) => form.setValue(`deptFields.${index}.ddOptionId`, value)}
                                                    value={form.watch(`deptFields.${currIdx}.ddOptionId`) || undefined}
                                                >
                                                    <SelectTrigger className="w-[250px]">
                                                        <SelectValue placeholder="Select dependency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {form.watch('deptFields').filter(x => ["SELECT", "DD"].includes(x.fieldType)).map((field, index) => (
                                                            field.name !== form.watch(`deptFields.${currIdx}.name`) && <SelectItem key={index} value={field.name}>
                                                                {field.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>} */}
                                        </div>
                                        <div className="flex gap-2 col-span-2">
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    moveField(index, -1)
                                                }}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp size={15} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    moveField(index, 1)
                                                }}
                                                disabled={index === fields.length - 1}
                                            >
                                                <ArrowDown size={15} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    remove(index)
                                                }}
                                            >
                                                <X color="red" size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 mt-2">
                                        <FormField
                                            control={form.control}
                                            name={`deptFields.${index}.isRequired`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Required</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`deptFields.${index}.isDisabled`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Disabled</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => append({ name: '', fieldType: '', order: fields.length + 1, isRequired: true, isDisabled: false, ddOptionId: null })}
                                className="mt-4 bg-blue-500 text-white"
                            >
                                Add Field
                            </Button>
                            <div className="mt-6 flex justify-end">
                                <Button type="button" className="mr-2 bg-gray-500 text-white">Cancel</Button>
                                <Button type="submit" variant="default" className="text-white">Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-bold">Field Options</CardTitle>
                    </CardHeader>
                    <CardContent className='p-3'>
                        {renderFieldOptions()}
                    </CardContent>
                </Card>
            </Card>
        </Form>
    )
}

export default UpdateDepartmentOptFieldsModal