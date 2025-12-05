'use client';

import { useState } from 'react';
import { EntityType } from '@/types/admin';
import Sidebar from './side-bar';
import MainContent from './MainContent';

export default function AdminLayout() {
  const [activeEntity, setActiveEntity] = useState<EntityType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex w-full min-h-screen h-full bg-white relative">
     <div className='hidden lg:flex'>
        <Sidebar 
          activeEntity={activeEntity} 
          onEntityChange={setActiveEntity} 
          setToggle={() => false}
        />
     </div>
      <div className="w-full lg:pl-[300px] flex flex-col">
        <MainContent
          activeEntity={activeEntity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          setActiveTab={setActiveEntity}
          onEntityChange={setActiveEntity}
        />
      </div>
    </div>
  );
}