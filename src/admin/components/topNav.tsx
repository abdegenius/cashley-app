import React from 'react'

export default function TopNav({activeTab} : {activeTab : string}) {
  return (
    <div className='w-full h-full max-h-20 border-b flex items-center border-stone-300 shadow-lg'>
      <h1 className='w-full text-center text-xl font-semibold text-blue-700 '>{activeTab}</h1>
    </div>
  )
}
