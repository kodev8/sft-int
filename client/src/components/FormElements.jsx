import React from 'react';


export const InputField = ({label, type="text", placeholder, name, value, onChange, testid = "input-field"}) => {

  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor={name}>
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input data-testid={testid} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
        onChange={onChange} id={name} name={name} placeholder={placeholder} type={type} value={value}/>
      </div>
  </div>
  )
}

export const Button = ({label, color, type, onClick, testid  = "button"}) => {
  return (
          <button 
          data-testid={testid}
          className={`shadow ${color ?? "bg-purple-500 hover:bg-purple-400"} focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded h-fit`} 
          type={type ?? "button"}
          onClick={onClick}
          >
            {label}
          </button>
  )
}