import React, { useState, useEffect } from 'react'
import { Button, InputField } from './FormElements'  
import UserCard from './UserCard'
import UserPage from './UserPage'
import { createUser, fetchUsers, deleteUser, updateUser } from '../utils/services/user'
import { useToast } from '../utils/useToast'

const Users = () => { 

  const [activeUser, setActiveUser] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const [userForm, setUserForm] = useState({
    name: "",
    email: ""
  })

 const [users, setUsers] = useState([])

 useEffect(() => {
  setLoading(true)
    fetchUsers()
    .then((data) => {
      setUsers(data)
    })
    .catch((err) => {
      useToast("An error occurred", "error", "toast", { limit: 1})
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  const handleDeleteUser = (email) => {
    deleteUser(email)
    .then((data) => {
      const newUsers = users.filter((user) => user.email !== email)
      setUsers(newUsers)
      useToast("User deleted successfully", "success", "toast", { limit: 1})
    })
    .catch((err) => {
      useToast("An error occurred while deleting user", "error", "toast", { limit: 1})
    })
  }

  const handleUpdateUser = async(email, data) => {

    // errors caught in usercard to only unset form if update is successful // see UserCard.jsx updateWrapper
      const res = await updateUser(email, data)
      setUsers(users.map((user) => {
        if (user.email === email) {
          return { ...user, ...data }
        }
        return user
    }))
    if (res === 204) {
      useToast(`${email}'s data not changed`, "success", "toast", { limit: 1})
    }else{
      useToast(`${email} updated successfully`, "success", "toast", { limit: 1})
    }
  }

  const handleAddUser = (e) => {
    e.preventDefault()

    if (!userForm.name || !userForm.email) {
      useToast("Please fill in all fields", "warn", "toast", { limit: 1 })
      return
    }
    createUser(userForm)
    .then((data) => {
      setUsers([...users, data])
      setUserForm({
        name: "",
        email: ""
      })
    })
    .catch((err) => {
      useToast("An error occurred while creating user", "error", "toast", { limit: 1})
    })
    
    
  }


  
  return (
        <>
        { 
          activeUser ? (
            <UserPage user={activeUser} setActiveUser={setActiveUser}/> 
          )
      
            :
            (

              <>
            <div className="flex flex-col gap-y-8  col-span-full md:col-span-5 text-center h-full items-center p-4 mt-12">

              <h1 className="text-3xl font-bold">Enter a new user!</h1>

                <form className="w-full max-w-sm" onSubmit={handleAddUser}>
                  <InputField 
                  label="Full Name" 
                  type="text" 
                  placeholder="Enter your name" 
                  name="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})} 
                  />

                  <InputField 
                  label="Email" 
                  type="text" 
                  name="email"
                  placeholder="Enter your email" 
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
                  />

                  <Button label="Add User" type={'submit'}/>
                  
                </form>
              
          </div>

          <span className="mx-auto col-span-full w-full h-[1px] md:h-full md:w-[1px] md:col-span-2 bg-slate-400 "></span>

          <div className="flex flex-col col-span-full md:col-span-5 items-center justify-center gap-y-8 ">
                <h1 className="text-3xl font-bold">Users</h1>

                <div className="w-full h-full grid grid-cols- gap-y-4">
                {
                  users.length === 0 && !loading ?
                    <p>No users found</p>
                  :
                    users.map((user, index) => (
                      <UserCard key={index} handleDelete={handleDeleteUser}  handleUpdate={handleUpdateUser} user={user} onClick={() => setActiveUser(user)}  />
                    ))
                }
                </div>
          </div>
          </>
          )
        }
      </>
  )
}

export default Users