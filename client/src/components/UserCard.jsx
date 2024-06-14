import React, { useState } from 'react'
import { Button, InputField } from './FormElements'
import { useToast } from '../utils/useToast'



const UserCard = ({ user, handleDelete, handleUpdate, onClick }) => {

  const [editMode, setEditMode] = useState(false)

  const [formName, setFormName] = useState(user.name)

  const handleEdit = (e) => {
      setEditMode(true)
  }
  
  const handleCancel = (e) => {
        setEditMode(false)
        setFormName(user.name)
  }

  const updateWrapper = async (email, data) => {
      try {
          await handleUpdate(email, data)
          setEditMode(false)
      }catch (error) {
          useToast('Error updating user', 'error', 'user-update-request-error', {limit: 1})
      }
  }


    return (
      <div className="w-fit h-fit min-h-12 flex flex-col md:flex-row items-center md:justify-self-center md:w-full p-4 bg-white shadow-md rounded-md">
        {
            editMode ? (
                <>
                <div className='flex flex-col items-center gap-y-2'>
                    <h2 className="text-base font-bold">Edit User</h2>
                    <InputField testid={`input-${user.email}`} label="Full Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value) }/>
                </div>
                
                <div className='flex justify-between md:justify-normal ml-auto gap-x-2'>
                    <Button label="Cancel" color="bg-black" onClick={handleCancel} />
                    <Button  testid={`confirm-${user.email}`} label="Confirm" color="bg-green-500" onClick={() =>updateWrapper(user.email, {name: formName})} />
                </div>
                </>
            ) :
            (
            <>
                <div onClick={onClick} className='hover:underline cursor-pointer'>
                    <h1 className="text-lg font-bold">{user.name}</h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className='flex ml-auto gap-x-2'>
                    <Button testid={`edit-${user.email}`} label="Edit" color="bg-blue-500" onClick={handleEdit} />
                    <Button testid={`delete-${user.email}`} label="Delete" color="bg-red-500" onClick={() =>  handleDelete(user.email)}/>
                </div>
            </>
            )
        
      }
        
    </div>

    )
  }
export default UserCard