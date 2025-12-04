'use client';

import { useState } from 'react';
import { Wallet } from '@/types/api';
import { walletService } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WalletsCRUDProps {
  searchQuery: string;
}

export default function WalletsCRUD({ searchQuery }: WalletsCRUDProps) {
  const [wallets, setWallets] = useState(walletService.getAll());
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredWallets = wallets.filter(wallet =>
    String(wallet.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdate = () => {
    if (selectedWallet?.id) {
      walletService.update(String(selectedWallet.id), selectedWallet);
      setWallets(walletService.getAll());
      setSelectedWallet(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedWallet?.id) {
      walletService.delete(String(selectedWallet.id));
      setWallets(walletService.getAll());
      setSelectedWallet(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleView = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (wallet: Wallet) => {
    setSelectedWallet({...wallet});
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsDeleteDialogOpen(true);
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0);
  };

  // Calculate wallet statistics
  const walletStats = {
    totalBalance: wallets.reduce((sum, w) => sum + ((w.balance) || 0), 0),
    totalLocked: wallets.reduce((sum, w) => sum + (w.locked || 0), 0),
    totalWallets: wallets.length,
    averageBalance: wallets.length > 0 ? wallets.reduce((sum, w) => sum + (w.balance || 0), 0) / wallets.length : 0,
    highestBalance: Math.max(...wallets.map(w => w.balance || 0)),
    lowestBalance: Math.min(...wallets.map(w => w.balance || 0)),
  };

  // Calculate total balance for display
  const getTotalBalance = (wallet: Wallet) => {
    return (wallet.balance || 0) + (wallet.locked || 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Wallet Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Badge variant="default">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">Across all wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Funds</CardTitle>
            <Badge variant="secondary">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalLocked)}</div>
            <p className="text-xs text-muted-foreground">In escrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Badge variant="outline">{walletStats.totalWallets}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletStats.totalWallets}</div>
            <p className="text-xs text-muted-foreground">Active wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
            <Badge variant="default">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.averageBalance)}</div>
            <p className="text-xs text-muted-foreground">Per wallet</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Wallets Management</CardTitle>
          <CardDescription>
            View and manage user wallets ({filteredWallets.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Available Balance</TableHead>
                <TableHead>Locked Funds</TableHead>
                <TableHead>Total Balance</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWallets.map((wallet) => (
                <TableRow 
                  key={wallet.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleView(wallet)}
                >
                  <TableCell className="font-medium">{wallet.id}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(wallet.balance)}
                  </TableCell>
                  <TableCell className="text-yellow-600">
                    {formatCurrency(wallet.locked)}
                  </TableCell>
                  <TableCell className="font-bold text-blue-600">
                    {formatCurrency(getTotalBalance(wallet))}
                  </TableCell>
                  <TableCell>{wallet.created_at}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(wallet);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(wallet);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(wallet);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
            <DialogDescription>
              Complete wallet information
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet ID</label>
                  <p className="text-sm">{selectedWallet.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm">{selectedWallet.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Available Balance</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedWallet.balance)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Locked Funds</label>
                  <p className="text-lg font-semibold text-yellow-600">
                    {formatCurrency(selectedWallet.locked)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Balance</label>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(getTotalBalance(selectedWallet))}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{selectedWallet.created_at}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>
              Update wallet balances
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Available Balance (₦)</label>
                <Input
                  type="number"
                  value={selectedWallet.balance || 0}
                  onChange={(e) => setSelectedWallet({
                    ...selectedWallet,
                    balance: parseFloat(e.target.value) || 0,
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Locked Funds (₦)</label>
                <Input
                  type="number"
                  value={selectedWallet.locked || 0}
                  onChange={(e) => setSelectedWallet({
                    ...selectedWallet,
                    locked: parseFloat(e.target.value) || 0,
                  })}
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <label className="text-sm font-medium">Total Balance</label>
                <p className="text-lg font-bold">{formatCurrency(getTotalBalance(selectedWallet))}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wallet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wallet? This will permanently remove the wallet record.
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-2">
              <p><strong>Wallet ID:</strong> {selectedWallet.id}</p>
              <p><strong>Balance:</strong> {formatCurrency(getTotalBalance(selectedWallet))}</p>
              <p><strong>User ID:</strong> {selectedWallet.id}</p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}