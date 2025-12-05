'use client';

import { useEffect, useState } from 'react';
import { ApiResponse, Wallet } from '@/types/api';
import { Button } from '@/components/ui/buttonshed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Edit, Trash2, Wallet as WalletIcon, Lock, Coins, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import useFetch from './components/hook/useFetch';

interface WalletsCRUDProps {
  searchQuery: string;
}

export default function WalletsCRUD({ searchQuery }: WalletsCRUDProps) {
  const { data: apiData, loading, refetch, error } = useFetch("/admin/wallets");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Wallet>>({});

  // Transform API data to match Wallet type
  useEffect(() => {
    if (apiData && apiData.data) {
      const transformedWallets = apiData.data.map((wallet: any) => ({
        id: wallet.id,
        user_id: wallet.user_id || null,
        ngn_balance: wallet.ngn_balance?.toString() || "0",
        eth_balance: wallet.eth_balance?.toString() || "0",
        btc_balance: wallet.btc_balance?.toString() || "0",
        usdt_balance: wallet.usdt_balance?.toString() || "0",
        locked: wallet.locked || 0,
        created_at: wallet.created_at || new Date().toISOString(),
        updated_at: wallet.updated_at || null,
        // Add any additional fields from your API
        ...wallet
      }));
      setWallets(transformedWallets);
    }
  }, [apiData]);

  const filteredWallets = wallets.filter(wallet =>
    String(wallet.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(wallet.user_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field: keyof Wallet, value: string) => {
    if (selectedWallet) {
      setEditFormData({
        ...editFormData,
        [field]: value
      });
    }
  };

  const handleUpdate = async () => {
    if (selectedWallet && selectedWallet.id) {
      try {
        // Ensure we're sending numeric values
        const updateData = {
          ...editFormData,
          eth_balance: editFormData.eth_balance || selectedWallet.eth_balance,
          btc_balance: editFormData.btc_balance || selectedWallet.btc_balance,
          usdt_balance: editFormData.usdt_balance || selectedWallet.usdt_balance,
          ngn_balance: editFormData.ngn_balance || selectedWallet.ngn_balance,
          locked: editFormData.locked || selectedWallet.locked,
        };

        const response = await api.put(`/admin/wallets/${selectedWallet.id}`, updateData);
        if (response.data) {
          refetch(); // Refresh the wallet list
          setSelectedWallet(null);
          setEditFormData({});
          setIsEditDialogOpen(false);
        }
      } catch (error) {
        console.error('Error updating wallet:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedWallet && selectedWallet.id) {
      try {
        const response = await api.delete(`/admin/wallets/${selectedWallet.id}`);
        if (response.data) {
          refetch(); // Refresh the wallet list
          setSelectedWallet(null);
          setIsDeleteDialogOpen(false);
        }
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  const handleView = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setEditFormData({
      eth_balance: wallet.eth_balance,
      btc_balance: wallet.btc_balance,
      usdt_balance: wallet.usdt_balance,
      ngn_balance: wallet.ngn_balance,
      locked: wallet.locked,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsDeleteDialogOpen(true);
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numAmount);
  };

  const formatCrypto = (amount: number | string, currency: 'ETH' | 'BTC' | 'USDT') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return `${numAmount.toFixed(4)} ${currency}`;
  };

  // Calculate wallet statistics from API data
  const calculateTotalBalance = (wallet: Wallet) => {
    return (parseFloat(wallet.eth_balance || "0")) + 
           (parseFloat(wallet.btc_balance || "0")) + 
           (parseFloat(wallet.usdt_balance || "0")) + 
           (parseFloat(wallet.ngn_balance || "0"));
  };

  const walletStats = {
    totalBalance: wallets.reduce((sum, w) => sum + calculateTotalBalance(w), 0),
    totalLocked: wallets.reduce((sum, w) => sum + (Number(w.locked) || 0), 0),
    averageBalance: wallets.length > 0 ? 
      wallets.reduce((sum, w) => sum + calculateTotalBalance(w), 0) / wallets.length : 0,
    ethBalance: wallets.reduce((sum, w) => sum + (parseFloat(w.eth_balance || "0")), 0),
    btcBalance: wallets.reduce((sum, w) => sum + (parseFloat(w.btc_balance || "0")), 0),
    usdtBalance: wallets.reduce((sum, w) => sum + (parseFloat(w.usdt_balance || "0")), 0),
    ngnBalance: wallets.reduce((sum, w) => sum + (parseFloat(w.ngn_balance || "0")), 0),
  };

  // Calculate total balance for display (including locked funds)
  const getTotalBalance = (wallet: Wallet) => {
    return calculateTotalBalance(wallet) + (Number(wallet.locked) || 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading wallets: {error}</div>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Wallet Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">Across all wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Funds</CardTitle>
            <Lock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalLocked)}</div>
            <p className="text-xs text-muted-foreground">In escrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.averageBalance)}</div>
            <p className="text-xs text-muted-foreground">Per wallet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
            <Badge variant="outline">ETH</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletStats.ethBalance.toFixed(4)} ETH</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Balance</CardTitle>
            <Badge variant="outline">BTC</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletStats.btcBalance.toFixed(4)} BTC</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
            <Badge variant="outline">USDT</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletStats.usdtBalance.toFixed(2)} USDT</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NGN Balance</CardTitle>
            <Badge variant="outline">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.ngnBalance)}</div>
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
          {wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No wallets found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet ID</TableHead>
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
                    <TableCell>{wallet.user_id || 'N/A'}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(calculateTotalBalance(wallet))}
                    </TableCell>
                    <TableCell className="text-yellow-600">
                      {formatCurrency(Number(wallet.locked))}
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {formatCurrency(getTotalBalance(wallet))}
                    </TableCell>
                    <TableCell>
                      {wallet.created_at ? new Date(wallet.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                  <p className="text-sm font-semibold">{selectedWallet.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-semibold">{selectedWallet.user_id || 'N/A'}</p>
                </div>
              </div>
              
              {/* Token Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">ETH Balance</label>
                  <p className="text-lg font-semibold">
                    {formatCrypto(selectedWallet.eth_balance || "0", "ETH")}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">BTC Balance</label>
                  <p className="text-lg font-semibold">
                    {formatCrypto(selectedWallet.btc_balance || "0", "BTC")}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">USDT Balance</label>
                  <p className="text-lg font-semibold">
                    {parseFloat(selectedWallet.usdt_balance || "0").toFixed(2)} USDT
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">NGN Balance</label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedWallet.ngn_balance || "0")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Available Balance</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(calculateTotalBalance(selectedWallet))}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Locked Funds</label>
                  <p className="text-lg font-semibold text-yellow-600">
                    {formatCurrency(Number(selectedWallet.locked))}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Balance (Including Locked)</label>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(getTotalBalance(selectedWallet))}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">
                    {selectedWallet.created_at ? new Date(selectedWallet.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">
                    {selectedWallet.updated_at ? new Date(selectedWallet.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Wallet Balances</DialogTitle>
            <DialogDescription>
              Update wallet token balances
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ETH Balance</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={editFormData.eth_balance || selectedWallet.eth_balance || "0"}
                  onChange={(e) => handleInputChange("eth_balance", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">BTC Balance</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={editFormData.btc_balance || selectedWallet.btc_balance || "0"}
                  onChange={(e) => handleInputChange("btc_balance", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">USDT Balance</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.usdt_balance || selectedWallet.usdt_balance || "0"}
                  onChange={(e) => handleInputChange("usdt_balance", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">NGN Balance (₦)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.ngn_balance || selectedWallet.ngn_balance || "0"}
                  onChange={(e) => handleInputChange("ngn_balance", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Locked Funds (₦)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.locked || selectedWallet.locked || 0}
                  onChange={(e) => handleInputChange("locked", e.target.value)}
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <label className="text-sm font-medium">Total Balance</label>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    (parseFloat(editFormData.eth_balance || selectedWallet.eth_balance || "0")) +
                    (parseFloat(editFormData.btc_balance || selectedWallet.btc_balance || "0")) +
                    (parseFloat(editFormData.usdt_balance || selectedWallet.usdt_balance || "0")) +
                    (parseFloat(editFormData.ngn_balance || selectedWallet.ngn_balance || "0")) +
                    (parseFloat(String(editFormData.locked || selectedWallet.locked || 0)))
                  )}
                </p>
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
              <p><strong>User ID:</strong> {selectedWallet.user_id || 'N/A'}</p>
              <p><strong>Total Balance:</strong> {formatCurrency(getTotalBalance(selectedWallet))}</p>
              <p><strong>Created:</strong> {selectedWallet.created_at ? new Date(selectedWallet.created_at).toLocaleDateString() : 'N/A'}</p>
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