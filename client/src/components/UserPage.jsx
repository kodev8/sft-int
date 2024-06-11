import React from 'react'
import { Button } from './FormElements'

const UserPage = ({user, setActiveUser}) => {
  return (
    
   <div>
        <h1 className='text-xl font-semibold'>Profile</h1>
        <h3 data->{user.name}</h3>
        <p>{user.email}</p>
        <Button label="Back" color="bg-blue-500" onClick={() => setActiveUser(null)} />
   </div>

  )
}

export default UserPage