import { Button } from './FormElements'


const UserCard = ({ user }) => {


    return (
      <div className="w-fit h-fit min-h-12 flex flex-col md:flex-row items-center md:justify-self-center md:w-full p-4 bg-white shadow-md rounded-md">

        <div className='hover:underline cursor-pointer'>
            <h1 className="text-lg font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className='flex ml-auto gap-x-2'>
            <Button label="Edit" color="bg-blue-500"  />
            <Button label="Delete" color="bg-red-500" />
        </div>
        
    </div>

    )
  }
export default UserCard