'use client'
import React, { useEffect, useState } from 'react'
import { userQueries } from '@/lib/graphql/user/queries'
import { useQuery } from 'graphql-hooks'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { format } from 'date-fns'
import { CalendarDaysIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import Map from './map'

const Track = () => {
    const [selectedMember, setSelectedMember] = React.useState('')
    const [date, setDate] = React.useState(null)
    const [show, setShow] = useState(false)
   
    const { data, loading, error } = useQuery(userQueries.GET_MEMBERS, {
        variables: {
            role: "Sales Person"
        },
        onSuccess: (data) => {
            console.log(data, 'sales')
        }
    })

    async function handleTrack() {
        console.log(selectedMember, date, 'track');
        setShow(!show)
    }

    useEffect(() => {
        console.log(selectedMember, 'selectedMember');
    }, [selectedMember])

    return (
        <div>
            <h1 className="text-2xl font-bold">Track</h1>
            <div className='my-6 flex gap-8'>
                <Select
                    onValueChange={(value) => setSelectedMember(value)}
                >
                    <SelectTrigger
                        className="w-1/4 bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                    >
                        <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                    >
                        {data?.getMembersByRole.map((member: any) => {
                            return (
                                <SelectItem
                                    key={member.name}
                                    value={member.name}
                                >
                                    {member.name}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal"
                            )}
                        >
                            {date ? (
                                format(date, "PPP")
                            ) : (
                                <span>Pick A Date</span>
                            )}
                            <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date as any || null}
                            onSelect={(date) => setDate(date as any)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleTrack}>Track</Button>
            </div>
                <Map memberId={selectedMember} date={date} />
        </div>
    )
}

export default Track