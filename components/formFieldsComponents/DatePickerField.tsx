import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDaysIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DatePickerFieldProps {
    field: any;
    fieldName: string;
    validationRules: any;
    form: any;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    field,
    fieldName,
    validationRules,
    form
}) => {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            rules={validationRules}
            render={({ field: formField }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{field.name}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal",
                                        !formField.value && "text-muted-foreground"
                                    )}
                                >
                                    {formField.value ? (
                                        format(formField.value, "PPP")
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
                                selected={formField.value}
                                onSelect={formField.onChange}
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

