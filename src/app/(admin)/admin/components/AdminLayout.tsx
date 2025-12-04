'use client';

import { useState } from 'react';
import { EntityType } from '@/types/admin';
import Sidebar from './side-bar';
import MainContent from './MainContent';

export default function AdminLayout() {
  const [activeEntity, setActiveEntity] = useState<EntityType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        activeEntity={activeEntity} 
        onEntityChange={setActiveEntity} 
      />
      <div className="flex-1 flex flex-col">
        <MainContent
          activeEntity={activeEntity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
}