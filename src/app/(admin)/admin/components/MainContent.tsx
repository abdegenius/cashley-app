'use client';

import { EntityType } from '@/types/admin';
import Header from './header';
import Dashboard from './Dashboard';
import UserCRUD from './crud/UserCRUD';
import TransactionsCRUD from './crud/transactionCRUD'
import WalletsCRUD from './crud/walletCRUD';
import { Card, CardContent } from '@/components/ui/card';
import AirtimeCRUD from './crud/airtimeCRUD';
import DataCRUD from './crud/dataCRUD';
import ElectricityCRUD from './crud/electricityCRUD';
import TvCRUD from './crud/tvCRUD';
import { Dispatch, SetStateAction } from 'react';

interface MainContentProps {
  activeEntity: EntityType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  setActiveTab: Dispatch<SetStateAction<EntityType>>
  onEntityChange: (entity: EntityType) => void;
  
}

export default function MainContent({ activeEntity, searchQuery, onSearchChange, onEntityChange }: MainContentProps) {
  const renderEntityContent = () => {
    switch (activeEntity) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserCRUD searchQuery={searchQuery} />;
      case 'transactions':
        return <TransactionsCRUD searchQuery={searchQuery} />;
      case 'wallets':
        return <WalletsCRUD searchQuery={searchQuery} />;
       case 'airtime':
        return <AirtimeCRUD searchQuery={searchQuery} />;
       case 'data':
        return <DataCRUD searchQuery={searchQuery} />;
       case 'electricity':
        return <ElectricityCRUD searchQuery={searchQuery} />;
       case 'tv-subscription':
        return <TvCRUD searchQuery={searchQuery} />;
      default:
        return (
          <div className="p-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select an entity to manage</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen h-full flex flex-col">
      <Header 
      onEntityChange={onEntityChange}
        activeEntity={activeEntity}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <main className="w-full h-auto overflow-auto">
        {renderEntityContent()}
      </main>
    </div>
  );
}