//@ts-nocheck
"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import React, { useEffect, useState } from 'react'
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
import { useMutation, useQuery } from "graphql-hooks";
import { DeptMutation } from "@/lib/graphql/dept/mutation";
import { userQueries } from "@/lib/graphql/user/queries";
import { CREATE_ROOT_USER_MUTATION } from "@/lib/graphql/user/mutations";

// Define the schema
const DepartmentSchema = z.object({
    deptFields: z.array(z.object({
        name: z.string().min(1, "Field name is required"),
        fieldType: z.string().min(1, "Field type is required"),
        order: z.number().int().min(1, "Field order is required"),
        options: z.object({
            label: z.string(),
            value: z.string(),
        }).array().default([]),
        isRequired: z.boolean(),
        isDisabled: z.boolean(),
    })).default([]),
});

const UpdateGlobalDepartmentFieldsModal = () => {
    const { isOpen, onClose, type, data: modalData } = useModal();
    const { dept } = modalData;

    const { toast } = useToast();
    const [createDept] = useMutation(DeptMutation.CREATE_OR_UPDATE_GLOBAL_DEPTS);
    const isModalOpen = isOpen && type === "updateGlobalDepartmentFields";


    // {
    //     "id": "66f654c1bd39c4b2900d57ac",
    //     "name": "Category",
    //     "order": 1,
    //     "subCategory": [
    //         {
    //             "name": "SubCategory",
    //             "options": [
    //                 "option_1",
    //                 "option_2"
    //             ]
    //         }
    //     ]
    // },

    const form = useForm({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            //@ts-ignore
            deptFields: dept?.subDeptFields?.sort((a, b) => a.order - b.order) || [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "deptFields",
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    useEffect(() => {
        form.reset({
            //@ts-ignore
            deptFields: dept?.subDeptFields?.sort((a, b) => a.order - b.order) || [],
        });
    }, [dept, form.reset]);

    const onSubmit = async (values: any) => {
        const { deptFields } = values;
        try {
            const { data, error } = await createDept({
                variables: {
                    input: {
                        name: 'Sale Department',
                        subDeptName: dept.name,
                        order: 4,
                        deptFields: deptFields,
                    }
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
                title: "Department Form Updated Successfully!",
            });

        } catch (error) {
            console.log(error);
        }

    };

    const moveField = (index: number, direction: number) => {
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
    };

    const handleSelectChange = (value: string, index: number) => {
        if (value === 'SELECT' || value === 'RADIO' || value === 'DROPDOWN' || value === 'CHECKBOX') {
            form.setValue(`deptFields.${index}.fieldType`, value);

            const currentOptions = form.getValues(`deptFields.${index}.options`) || [];
            if (currentOptions.length === 0) {
                form.setValue(`deptFields.${index}.options`, []);
            }
        } else {
            form.setValue(`deptFields.${index}.fieldType`, value);
        }
    };

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="text-black max-w-screen-md max-h-[80%]">
                    <DialogHeader className="pt-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            {/* @ts-ignore */}
                            {dept?.name || ''}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {dept?.map((inputfield, index) => (
                                <div key={inputfield.name} className="mb-4 border p-4 rounded-md">
                                    <div className="">
                                        <div className="grid grid-cols-8 gap-2">
                                            <div className="col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a verified email to display" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                                </SelectContent>
                                                            </Select>
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
                                                            {/* <FormLabel>Field Type</FormLabel> */}
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value);
                                                                    handleSelectChange(value, index);
                                                                    form.trigger();
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
                                                    onClick={() => moveField(index, -1)}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp size={15} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    onClick={() => moveField(index, 1)}
                                                    disabled={index === fields.length - 1}
                                                >
                                                    <ArrowDown size={15} />
                                                </Button>
                                                <Button type="button" variant={"ghost"} onClick={() => remove(index)}>
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
                                    {['SELECT', 'RADIO', 'DROPDOWN', 'CHECKBOX'].includes(form.getValues(`deptFields.${index}.fieldType`)) && (
                                        <div className="mt-4 w-1/2">
                                            <FormLabel className="mr-2">Options</FormLabel>
                                            {form.getValues(`deptFields.${index}.options`)?.map((_option: any, optIndex: React.Key | null | undefined) => (
                                                <div key={optIndex} className="flex items-center mb-2 mt-2">
                                                    <Controller
                                                        name={`deptFields.${index}.options.${optIndex}.value`}
                                                        control={form.control}
                                                        render={({ field }) => (
                                                            <Input
                                                                placeholder="Value"
                                                                className="mr-2"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    field.onChange(value);
                                                                    form.setValue(`deptFields.${index}.options.${optIndex}.label`, value);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant={'ghost'}
                                                        onClick={() => {
                                                            const options = form.getValues(`deptFields.${index}.options`);
                                                            options.splice(optIndex, 1);
                                                            form.setValue(`deptFields.${index}.options`, [...options]);
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
                                                    const options = form.getValues(`deptFields.${index}.options`);
                                                    options.push({ value: '' });
                                                    form.setValue(`deptFields.${index}.options`, [...options]);
                                                    form.trigger();
                                                }}
                                                className="mt-2 bg-blue-500 text-white"
                                            >
                                                <PlusIcon size={15} />
                                                Add Option
                                            </Button>
                                        </div>
                                    )}
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
                                <Button type="button" onClick={handleClose} className="mr-2 bg-gray-500 text-white">
                                    Cancel
                                </Button>
                                <Button type="submit" variant={'default'} className="text-white">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateGlobalDepartmentFieldsModal;