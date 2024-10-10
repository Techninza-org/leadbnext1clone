'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, X, ChevronDown, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from 'graphql-hooks'
import { companyMutation } from '@/lib/graphql/company/mutation'

type OptionValue = {
    id: string
    name: string
}

type Option = {
    id: string
    name: string
    values: OptionValue[]
}

type SubCategory = {
    id: string
    name: string
    options: Option[]
}

type BroadcastForm = {
    id: string
    name: string
    subCategories: SubCategory[]
}

const CustomDropdown = ({ option, value, onChange }: { option: Option, value: string, onChange: (value: any) => void }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <div
                className="flex items-center justify-between p-2 border rounded-md cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || option.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {option.values.map((value) => (
                        <div
                            key={value.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onChange(value.name)
                                setIsOpen(false)
                            }}
                        >
                            {value.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const UpdateGlobalBroadcastModal = () => {
    const { isOpen, onClose, type, data: { dept } } = useModal()
    const { toast } = useToast()
    const isModalOpen = isOpen && type === "updateGlobalBroadcastForm"

    const [forms, setForms] = useState<BroadcastForm[]>([])
    const [selectedFormId, setSelectedFormId] = useState<string>(forms[0]?.id || '')
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    //mutation workds
    const [updateBroadcastForm] = useMutation(companyMutation.UPDATE_BROADCAST_FORM);

    useEffect(() => {
        setForms(dept || [])
    }, [dept])

    if (!isModalOpen) return null

    const selectedForm = forms?.find(form => form.id === selectedFormId) || forms[0]

    const handleSelectChange = (subCategoryIndex: number, optionIndex: number, selectedValue: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [`${subCategoryIndex}-${optionIndex}`]: selectedValue
        }))
    }

    const updateFormName = (formId: string, newName: string) => {
        setForms(prev => prev.map(form =>
            form.id === formId ? { ...form, name: newName } : form
        ))
    }

    const updateSubCategoryName = (formId: string, subCategoryIndex: number, newName: string) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].name = newName
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const updateOptionName = (formId: string, subCategoryIndex: number, optionIndex: number, newName: string) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options[optionIndex].name = newName
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const addNewForm = () => {
        const newForm: BroadcastForm = {
            id: `form-${Date.now()}`,
            name: "New Form",
            subCategories: []
        }
        setForms(prev => [...prev, newForm])
        setSelectedFormId(newForm.id)
    }

    const addNewSubCategory = (formId: string) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                return {
                    ...form,
                    subCategories: [
                        ...form.subCategories,
                        {
                            id: `sub-${Date.now()}`,
                            name: "New Subcategory",
                            options: []
                        }
                    ]
                }
            }
            return form
        }))
    }

    const removeSubCategory = (formId: string, subCategoryIndex: number) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories.splice(subCategoryIndex, 1)
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const addNewOption = (formId: string, subCategoryIndex: number) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options.push({
                    id: `opt-${Date.now()}`,
                    name: "New Option",
                    values: []
                })
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const removeOption = (formId: string, subCategoryIndex: number, optionIndex: number) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options.splice(optionIndex, 1)
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const addOptionValue = (formId: string, subCategoryIndex: number, optionIndex: number) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options[optionIndex].values.push({
                    id: `val-${Date.now()}`,
                    name: "New Value"
                })
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const removeOptionValue = (formId: string, subCategoryIndex: number, optionIndex: number, valueIndex: number) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options[optionIndex].values.splice(valueIndex, 1)
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const updateOptionValue = (formId: string, subCategoryIndex: number, optionIndex: number, valueIndex: number, newName: string) => {
        setForms(prev => prev.map(form => {
            if (form.id === formId) {
                const newSubCategories = [...form.subCategories]
                newSubCategories[subCategoryIndex].options[optionIndex].values[valueIndex].name = newName
                return { ...form, subCategories: newSubCategories }
            }
            return form
        }))
    }

    const handleSave = async () => {
        const response = await updateBroadcastForm({
            variables: {
                input: forms, // Input is passed here
            },
        });
        toast({
            title: "Forms Saved",
            description: "Your changes have been successfully saved.",
        })
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Global Broadcast Form</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a form" />
                            </SelectTrigger>
                            <SelectContent>
                                {forms.map(form => (
                                    <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={addNewForm}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Form
                        </Button>
                    </div>
                    {selectedForm && (
                        <div className="space-y-4 text-sm">
                            <Input
                                value={selectedForm.name}
                                onChange={(e) => updateFormName(selectedForm.id, e.target.value)}
                                className="font-bold"
                            />
                            <div className="max-h-[60vh] overflow-y-auto space-y-4">
                                {selectedForm.subCategories.map((subCategory, subCategoryIndex) => (
                                    <div key={subCategory.id} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <Input
                                                value={subCategory.name}
                                                onChange={(e) => updateSubCategoryName(selectedForm.id, subCategoryIndex, e.target.value)}
                                                className="w-full mr-2"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSubCategory(selectedForm.id, subCategoryIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {subCategory.options.map((option, optionIndex) => (
                                            <div key={option.id} className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Input
                                                        value={option.name}
                                                        onChange={(e) => updateOptionName(selectedForm.id, subCategoryIndex, optionIndex, e.target.value)}
                                                        className="w-full mr-2"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOption(selectedForm.id, subCategoryIndex, optionIndex)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                {/* <CustomDropdown
                          option={option}
                          value={selectedOptions[`${subCategoryIndex}-${optionIndex}`]}
                          onChange={(value: any) => handleSelectChange(subCategoryIndex, optionIndex, value)}
                        /> */}
                                                <div className="mt-2">
                                                    <h4 className="font-medium mb-2">Option Values:</h4>
                                                    {option.values.map((value, valueIndex) => (
                                                        <div key={value.id} className="flex items-center mb-2">
                                                            <Input
                                                                value={value.name}
                                                                onChange={(e) => updateOptionValue(selectedForm.id, subCategoryIndex, optionIndex, valueIndex, e.target.value)}
                                                                className="flex-grow mr-2"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeOptionValue(selectedForm.id, subCategoryIndex, optionIndex, valueIndex)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addOptionValue(selectedForm.id, subCategoryIndex, optionIndex)}
                                                    >
                                                        <PlusIcon className="h-4 w-4 mr-2" />
                                                        Add Value
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addNewOption(selectedForm.id, subCategoryIndex)}
                                            className="mt-2"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Add Option
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addNewSubCategory(selectedForm.id)}
                                className="mt-2"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Subcategory
                            </Button>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateGlobalBroadcastModal