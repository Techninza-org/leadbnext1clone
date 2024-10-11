//@ts-nocheck
"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowDown, ArrowUp, PlusIcon, X } from "lucide-react";
import { useManualQuery, useMutation, useQuery } from "graphql-hooks";
import { deptQueries } from "@/lib/graphql/dept/queries";
import { DeptMutation } from "@/lib/graphql/dept/mutation";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";
import { useAtomValue } from "jotai";
import { userAtom } from "@/lib/atom/userAtom";
import { companyMutation } from "@/lib/graphql/company/mutation";
import { MultiSelect } from "../multi-select-new";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useParams } from "next/navigation";

// Define the schema
const DepartmentSchema = z.object({
    deptFields: z.array(z.object({
        name: z.string().min(1, "Field name is required"),
        fieldType: z.string().min(1, "Field type is required"),
        ddOptionId: z.any().optional(),
        order: z.number().int().min(1, "Field order is required"),
        options: z.object({
            label: z.string(),
            value: z.any(),
        }).array().default([]),
        isRequired: z.boolean(),
        isDisabled: z.boolean(),
    })).default([]),
});


const UpdateDepartmentFieldsModal = ({ deptName, deptId, companyId }) => {
    const [deptFields, setDeptFields] = useState([]);
    const userInfo = useAtomValue(userAtom);
    const [currIdx, setCurrIdx] = useState(0)

    const { toast } = useToast();
    const [updateDepartmentFields] = useMutation(DeptMutation.UPDATE_DEPT);

    const { data } = useQuery(deptQueries.GET_COMPANY_DEPT_FIELDS, {
        variables: { deptId },
        skip: !userInfo?.token || !deptId,
        onSuccess: ({ data }) => {
            setDeptFields(data.getCompanyDeptFields);
        },
        refetchAfterMutations: [
            { mutation: DeptMutation.UPDATE_DEPT },
            { mutation: LOGIN_USER },
        ],
    });

    const filteredDeptFields = useMemo(() => {
        return deptFields.filter((field) => String(field.name) === String(deptName));
    }, [deptFields, deptName]);

    const form = useForm({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            deptFields: [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "deptFields",
    });

    useEffect(() => {
        if (data?.getCompanyDeptFields) {
            setDeptFields(data.getCompanyDeptFields);
        }
    }, [data]);

    useEffect(() => {
        if (filteredDeptFields.length > 0) {
            const sortedSubDeptFields = filteredDeptFields[0]?.subDeptFields?.sort((a, b) => a.order - b.order) || [];
            form.reset({ deptFields: sortedSubDeptFields });
        }
    }, [filteredDeptFields, form]);

    const onSubmit = useCallback(async (values) => {
        const { deptFields } = values;
        try {
            const { data, error } = await updateDepartmentFields({
                variables: {
                    input: {
                        companyDeptId: deptId || "",
                        name: deptName,
                        order: 4,
                        subDeptFields: deptFields,
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
    }, [deptId, deptName, updateDepartmentFields, toast]);

    const moveField = useCallback((index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= fields.length) return;

        const updatedFields = [...fields];
        const [removed] = updatedFields.splice(index, 1);
        updatedFields.splice(newIndex, 0, removed);

        update(index, updatedFields);

        const updatedDeptFields = updatedFields.map((field, idx) => ({
            ...field,
            order: idx + 1,
        }));
        form.setValue('deptFields', updatedDeptFields);
    }, [fields, update, form]);

    const handleSelectChange = useCallback((value, index) => {
        if (['SELECT', 'RADIO', 'DROPDOWN', 'CHECKBOX'].includes(value)) {
            form.setValue(`deptFields.${index}.fieldType`, value);
            const currentOptions = form.getValues(`deptFields.${index}.options`) || [];
            if (currentOptions.length === 0) {
                form.setValue(`deptFields.${index}.options`, []);
            }
        } else {
            form.setValue(`deptFields.${index}.fieldType`, value);
        }
    }, [form]);

    const dependenciesOptionsDropdown = useMemo(() => {
        return filteredDeptFields[0]?.subDeptFields
            ?.filter(x => ['SELECT', 'DD'].includes(x.fieldType))
            .map((field) => ({
                label: field.name,
                value: field.name,
            })) || [];
    }, [filteredDeptFields]);

    const handleDivClick = (index) => {
        setCurrIdx(index)
    }

    return (
        <Form {...form}>
            <Card className="grid grid-cols-3 gap-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-bold">
                            {/* @ts-ignore */}
                            {filteredDeptFields[0]?.name || ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {fields.map((inputfield, index) => (
                                <div
                                    key={inputfield.id}
                                    className={`mb-4 border p-4 rounded-md ${currIdx === index ? 'bg-blue-50' : ''}`}
                                    onClick={() => handleDivClick(index)}
                                >
                                    <div className="">
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
                                                                    onFocus={() => handleDivClick(index)}
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
                                                                    field.onChange(value);
                                                                    handleSelectChange(value, index);
                                                                    form.trigger();
                                                                    handleDivClick(index)
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger
                                                                        className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                                    >
                                                                        <SelectValue placeholder="Select Field Type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent
                                                                    className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                                >
                                                                    <SelectItem value="INPUT">Input</SelectItem>
                                                                    <SelectItem value="SELECT">Select</SelectItem>
                                                                    <SelectItem value="RADIO">Radio</SelectItem>
                                                                    <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                                                                    <SelectItem value="DD">Dependent Dropdown</SelectItem>
                                                                    <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                                                                    <SelectItem value="IMAGE">Image</SelectItem>
                                                                    <SelectItem value="TEXTAREA">Textarea</SelectItem>
                                                                    <SelectItem value="DATE">Date</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-2 col-span-2">
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        moveField(index, -1);
                                                    }}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp size={15} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        moveField(index, 1);
                                                    }}
                                                    disabled={index === fields.length - 1}
                                                >
                                                    <ArrowDown size={15} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        remove(index);
                                                    }}
                                                >
                                                    <X color="red" size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex gap-8">
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.isRequired`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mr-4">Required</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                {...field}
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.isDisabled`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mr-4">Disabled</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                {...field}
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => append({ name: '', fieldType: '', order: fields.length + 1, isRequired: true, isDisabled: false })}
                                className="mt-4 bg-blue-500 text-white"
                            >
                                Add Field
                            </Button>
                            <div className="mt-6 flex justify-end">
                                <Button type="button" className="mr-2 bg-gray-500 text-white">
                                    Cancel
                                </Button>
                                <Button type="submit" variant={'default'} className="text-white">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-bold"></CardTitle>
                    </CardHeader>
                    <CardContent>
                        {['SELECT', 'RADIO', 'CHECKBOX'].includes(form.getValues(`deptFields.${currIdx}.fieldType`)) && (
                            <div key={currIdx} className="mt-4 w-1/2">
                                <FormLabel className="mr-2">Options</FormLabel>
                                {form.getValues(`deptFields.${currIdx}.options`)?.map((_option: any, optIndex: React.Key | null | undefined) => (
                                    <div key={optIndex} className="flex items-center mb-2 mt-2">
                                        <Controller
                                            name={`deptFields.${currIdx}.options.${optIndex}.value`}
                                            control={form.control}
                                            render={({ field: inputField }) => (
                                                <Input
                                                    placeholder="Value"
                                                    className="mr-2"
                                                    value={typeof _option === 'object' ? _option.label || _option.value : _option}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        inputField.onChange(value);
                                                        handleOptionChange(index, optIndex, value);
                                                    }}
                                                />
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant={'ghost'}
                                            onClick={() => {
                                                const options = form.getValues(`deptFields.${currIdx}.options`);
                                                options.splice(optIndex, 1);
                                                form.setValue(`deptFields.${currIdx}.options`, [...options]);
                                                form.trigger();
                                            }}
                                        >
                                            <X size={20} color="red" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const options = form.getValues(`deptFields.${currIdx}.options`) || [];
                                        options.push({ label: '', value: '' });
                                        form.setValue(`deptFields.${currIdx}.options`, [...options]);
                                        form.trigger();
                                    }}
                                    className="mt-2 bg-blue-500 text-white"
                                >
                                    <PlusIcon size={15} />
                                    Add Option
                                </Button>
                            </div>
                        )
                        }
                        {['DD'].includes(form.getValues(`deptFields.${currIdx}.fieldType`)) && (
                            <div key={currIdx} className="mt-4 w-1/2">
                                <div>
                                    <Select
                                        defaultValue={dependenciesOptionsDropdown?.find(x => x.value === form.watch(`deptFields.${currIdx}.ddOptionId`))?.label}
                                        onValueChange={(value) => {
                                            console.log(value, 'value')
                                            form.setValue(`deptFields.${currIdx}.ddOptionId`, value ?? "")
                                        }}
                                    >
                                        <SelectTrigger className="w-[250px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                dependenciesOptionsDropdown?.map((option, optIndex) => (
                                                    <SelectItem key={optIndex} value={option.value}>
                                                        {option.label || option.value}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>

                                    {form.watch(`deptFields.${currIdx}.ddOptionId`) && (
                                        <div className="mt-4">
                                            <FormLabel className="mr-2 block">Select Values from Linked Field</FormLabel>
                                            <Controller
                                                name={`deptFields.${currIdx}.linkedFieldValues`}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            const options = form.getValues(`deptFields.${currIdx}.options`) || []
                                                            console.log(options)
                                                            if (!options.find(x => x.label === value)) {
                                                                options.push({ label: value, value: [] })
                                                                form.setValue(`deptFields.${currIdx}.options`, options)
                                                            }
                                                        }}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select values" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {filteredDeptFields?.[0]?.subDeptFields
                                                                .find((subField) => subField.name === form.watch(`deptFields.${currIdx}.ddOptionId`))
                                                                ?.options.map((option, optIndex) => (
                                                                    <SelectItem key={optIndex} value={option.label || option.value}>
                                                                        {option.label || option.value}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                                <FormLabel className="mr-2 mt-4 block">Options</FormLabel>
                                {(() => {
                                    const selectedOption = form.getValues(`deptFields.${currIdx}.options`)?.find(x => x.label === form.getValues(`deptFields.${currIdx}.linkedFieldValues`))
                                    const nestedOptions = selectedOption?.value || []

                                    return (
                                        <>
                                            {nestedOptions.map((nestedOption, nestedIndex) => (
                                                <div key={nestedIndex} className="flex items-center mb-2">
                                                    <Controller
                                                        name={`deptFields.${currIdx}.options.${form.getValues(`deptFields.${currIdx}.options`)?.findIndex(x => x.label === form.getValues(`deptFields.${currIdx}.linkedFieldValues`))}.value.${nestedIndex}.label`}
                                                        control={form.control}
                                                        render={({ field }) => (
                                                            <Input
                                                                placeholder="Nested Value"
                                                                className="mr-2"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant={'ghost'}
                                                        onClick={() => {
                                                            const optionIndex = form.watch(`deptFields.${currIdx}.options`)?.findIndex(x => x.label === form.watch(`deptFields.${currIdx}.linkedFieldValues`))
                                                            if (optionIndex !== undefined && optionIndex !== -1) {
                                                                const updatedNestedOptions = [...form.watch(`deptFields.${currIdx}.options.${optionIndex}.value`)]
                                                                updatedNestedOptions.splice(nestedIndex, 1)
                                                                form.setValue(`deptFields.${currIdx}.options.${optionIndex}.value`, updatedNestedOptions)
                                                            }
                                                        }}
                                                    >
                                                        <X size={20} color="red" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {form.watch(`deptFields.${currIdx}.linkedFieldValues`) && (
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        const optionIndex = form.watch(`deptFields.${currIdx}.options`)?.findIndex(x => x.label === form.watch(`deptFields.${currIdx}.linkedFieldValues`))
                                                        if (optionIndex !== undefined && optionIndex !== -1) {
                                                            const updatedNestedOptions = [...(form.watch(`deptFields.${currIdx}.options.${optionIndex}.value`) || [])]
                                                            updatedNestedOptions.push({ label: '', value: '' })
                                                            form.setValue(`deptFields.${currIdx}.options.${optionIndex}.value`, updatedNestedOptions)
                                                            form.trigger(`deptFields.${currIdx}.options.${optionIndex}.value`)
                                                        }
                                                    }}
                                                    className="mt-2 bg-blue-500 text-white"
                                                >
                                                    <PlusIcon size={15} />
                                                    Add Nested Option
                                                </Button>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Card>
        </Form>
    );
};

export default UpdateDepartmentFieldsModal;
