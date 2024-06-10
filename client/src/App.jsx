import Users from "./components/Users"
function App() {

  return (
    <div id="main" className="w-full h-full grid grid-rows-[auto_1fr] grid-cols-12 p-12" >
      <div className='flex w-full col-span-full items-center justify-center'>
        <img src="/icon.png" alt="logo" className="w-20 " />
        <h1 className='font-bold text-3xl text-blue-400'>Basik Users</h1>
      </div>
      <div className="col-span-full bg-gray-100 w-full h-full grid md:grid-rows-[auto_1fr] grid-cols-12 p-8 pt-4 my-2">
     
      <Users />

      </div>
    </div>
  )
}

export default App
