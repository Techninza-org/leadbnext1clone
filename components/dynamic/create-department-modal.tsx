"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import React from 'react'
import { useToast } from '../ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm, useFieldArray } from "react-hook-form";
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

const CreateDepartmentModal = () => {
    const { isOpen, onClose, type } = useModal();

    const { toast } = useToast();

    const isModalOpen = isOpen && type === "createDepartment";

    const DepartmentSchema = z.object({
        // formName: z.string().min(1, "Form name is required"),
        deptName: z.string().min(1, "Department name is required"),
        order: z.any().optional(),
        deptFields: z.array(z.object({
            fieldName: z.string().min(1, "Field name is required"),
            fieldType: z.string().min(1, "Field type is required"),
            fieldOrder: z.number().int().min(1, "Field order is required"),
            fieldRequired: z.boolean().default(true),
            fieldDisabled: z.boolean().default(false),
        })).default([]),
    })

    const form = useForm<z.infer<typeof DepartmentSchema>>({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            deptFields: [{ fieldName: '', fieldType: '', fieldOrder: 1, fieldRequired: true, fieldDisabled: false }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "deptFields",
    });

    const onSubmit = async (values: z.infer<typeof DepartmentSchema>) => {
        console.log(form.getValues());
        // handle form submission
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        New Department
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mt-4">
                            <FormField
                                control={form.control}
                                name="deptName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Department Name"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className=" grid grid-cols-2 gap-2">
                                {/* <FormField
                                    control={form.control}
                                    name="formName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Form Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                    placeholder="Form Name"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                {/* <FormField
                                    control={form.control}
                                    name="order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                    placeholder="Department Order"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-4">Department Fields</h3>
                            {fields.map((field, index) => (
                                <div key={field.id} className="mb-4 border p-4 rounded-md">
                                    <div className=" grid grid-cols-2 gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`deptFields.${index}.fieldName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Field Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                            placeholder="Field Name"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`deptFields.${index}.fieldType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Field Type</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
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
                                        <FormField
                                            control={form.control}
                                            name={`deptFields.${index}.fieldOrder`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Field Order</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                            placeholder="Field Order"
                                                            type="number"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.fieldRequired`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mr-4">Field Required</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                {...field}
                                                                onCheckedChange={field.onChange}
                                                                value={field.value.toString()} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`deptFields.${index}.fieldDisabled`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mr-4">Field Disabled</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                {...field}
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                value={field.value.toString()} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" onClick={() => remove(index)} className="mt-2 bg-red-500 text-white">Remove Field</Button>
                                </div>
                            ))}
                            <Button type="button" onClick={() => append({ fieldName: '', fieldType: '', fieldOrder: fields.length + 1, fieldRequired: true, fieldDisabled: false })} className="mt-4 bg-blue-500 text-white">Add Field</Button>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="button" onClick={handleClose} className="mr-2 bg-gray-500 text-white">Cancel</Button>
                            <Button type="submit" className="bg-blue-500 text-white">Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDepartmentModal;
