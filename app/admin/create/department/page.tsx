import CreateDepartmentForm from '@/components/dynamic/create-department-page'
import React from 'react'

const page = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold">Create Department</h1>
        <CreateDepartmentForm />
    </div>
  )
}

export default page