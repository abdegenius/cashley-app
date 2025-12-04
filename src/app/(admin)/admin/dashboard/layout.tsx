import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
     
      <main className='h-screen bg-white w-full'>{children}</main>
    </div>
  );
}