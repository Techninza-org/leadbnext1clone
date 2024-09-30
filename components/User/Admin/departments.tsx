'use client'
import { useCompany } from '@/components/providers/CompanyProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useModal } from '@/hooks/use-modal-store'
import { userAtom } from '@/lib/atom/userAtom'
import { useAtomValue } from 'jotai'
import React from 'react'

const Departments = () => {
  const { departments, braodcasteForm } = useCompany()
  const { onOpen } = useModal()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Departments</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-8'>
          {
            departments?.map((dept: any) => (
              <Card key={dept.id} onClick={() => onOpen("updateGlobalDepartmentFields", { dept: dept })}>
                <CardContent className='grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md'>
                  <CardTitle>{dept.name}</CardTitle>
                </CardContent>
              </Card>
            ))
          }
        </CardContent>
      </Card>
      <Card className='my-3'>
        <CardHeader>
          <CardTitle className="font-bold">Broadcast</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-8'>
          <Card onClick={() => onOpen("updateGlobalBroadcastForm", { dept: braodcasteForm })}>
            <CardContent className='grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md'>
              <CardTitle>{"Broadcast"}</CardTitle>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  )
}

export default Departments