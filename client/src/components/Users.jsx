import React, { useState, useEffect } from 'react'
import { Button, InputField } from './FormElements'  
import { createUser,} from '../utils/services/user'

function Users  () { // use function to get access to prototype methods


  const [userForm, setUserForm] = useState({
    name: "",
    email: ""
  })

 const [users, setUsers] = useState([])

 useEffect(() => {
// fetch users here
  }, [])


  const handleAddUser = (e) => {
    e.preventDefault()

    if (!userForm.name || !userForm.email) {
      console.error("Please fill in all fields")
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
      console.error(err)
    })
    
    
  }


  
  return (
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
                  users.length === 0 ?
                    <p>No users found</p>
                  :
                    users.map((user, index) => (
                      <div key={index} className="w-full">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        </div>
                    ))
                }
                </div>
          </div>
      </>
  )
}

export default Users