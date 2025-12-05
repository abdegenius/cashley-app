"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/api";
import { Button } from "@/components/ui/buttonshed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import useFetch from "./components/hook/useFetch";
import api from "@/lib/axios";

interface TransactionsCRUDProps {
  searchQuery: string;
}

export default function TransactionsCRUD({ searchQuery }: TransactionsCRUDProps) {
  // Fetch transactions from API
  const {
    data: apiData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch("/admin/transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editFormData, setEditFormData] = useState<Partial<Transaction>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Transform API data to match Transaction type
  useEffect(() => {
    if (apiData) {
      // Check if data is an array or has a data property
      const dataArray = Array.isArray(apiData)
        ? apiData
        : (apiData as any)?.data
          ? (apiData as any).data
          : apiData;

      if (Array.isArray(dataArray)) {
        const transformedTransactions = dataArray.map((transaction: any) => ({
          id: transaction.id?.toString() || "",
          user_id: transaction.user_id?.toString() || "",
          reference: transaction.reference || "",
          type: transaction.type || "",
          action: transaction.action || "",
          amount: transaction.amount?.toString() || "0",
          fee: transaction.fee?.toString() || "0",
          balance_before: transaction.balance_before || 0,
          balance_after: transaction.balance_after || 0,
          status: transaction.status || "",
          description: transaction.description || "",
          wallet: transaction.wallet || "",
          created_at: transaction.created_at || new Date().toISOString(),
          updated_at: transaction.updated_at || null,
          // Add any additional fields from your API
          ...transaction,
        }));
        setTransactions(transformedTransactions);
      }
    }
  }, [apiData]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user_id?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Normal API call for update
  const handleUpdate = async () => {
    if (selectedTransaction?.id && selectedTransaction.id) {
      setUpdateLoading(true);
      try {
        const response = await api.put(
          `/admin/transactions/${selectedTransaction.id}`,
          editFormData
        );

        if (response.data) {
          refetch(); // Refresh the transaction list
          setSelectedTransaction(null);
          setEditFormData({});
          setIsEditDialogOpen(false);
          // Optional: Show success notification
        }
      } catch (error: any) {
        console.error("Error updating transaction:", error);
        // Optional: Show error notification
        alert(error.response?.data?.message || "Failed to update transaction");
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  // Normal API call for delete
  const handleDelete = async () => {
    if (selectedTransaction?.id && selectedTransaction.id) {
      setDeleteLoading(true);
      try {
        const response = await api.delete(`/admin/transactions/${selectedTransaction.id}`);

        if (response.data) {
          refetch(); // Refresh the transaction list
          setSelectedTransaction(null);
          setIsDeleteDialogOpen(false);
          // Optional: Show success notification
        }
      } catch (error: any) {
        console.error("Error deleting transaction:", error);
        // Optional: Show error notification
        alert(error.response?.data?.message || "Failed to delete transaction");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditFormData({
      status: transaction.status || "",
      description: transaction.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const isValidTransactionStatus = (value: string): value is NonNullable<Transaction["status"]> => {
    return ["pending", "completed", "failed", "reversed"].includes(value);
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "reversed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTypeVariant = (type?: string) => {
    return type === "credit" ? "default" : "secondary";
  };

  const formatCurrency = (amount?: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount || 0;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate transaction statistics
  const transactionStats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + (parseFloat(t.amount || "0") || 0), 0),
    completedTransactions: transactions.filter((t) => t.status === "completed").length,
    pendingTransactions: transactions.filter((t) => t.status === "pending").length,
    totalFees: transactions.reduce((sum, t) => sum + (parseFloat(t.fee || "0") || 0), 0),
    creditTransactions: transactions.filter((t) => t.type === "credit").length,
    debitTransactions: transactions.filter((t) => t.type === "debit").length,
  };

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading transactions: {fetchError}</div>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Transaction Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Badge variant="default">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(transactionStats.totalVolume)}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Badge variant="secondary">{transactionStats.totalTransactions}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Badge variant="default">{transactionStats.completedTransactions}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactionStats.completedTransactions}
            </div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <Badge variant="outline">₦</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(transactionStats.totalFees)}</div>
            <p className="text-xs text-muted-foreground">Commission earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions Management</CardTitle>
            <CardDescription>
              View and manage all transactions ({filteredTransactions.length})
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleView(transaction)}
                  >
                    <TableCell className="font-medium">{transaction.reference}</TableCell>
                    <TableCell>{transaction.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(transaction.type)}>
                        {transaction.type?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.action}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(transaction.fee)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(transaction);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(transaction);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(transaction);
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
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete transaction information</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference</label>
                  <p className="text-sm font-mono">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm">{selectedTransaction.user_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Badge variant={getTypeVariant(selectedTransaction.type)}>
                    {selectedTransaction.type?.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="text-sm capitalize">{selectedTransaction.action}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p
                    className={`text-lg font-semibold ${
                      selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fee</label>
                  <p className="text-sm">{formatCurrency(selectedTransaction.fee)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Balance Before
                  </label>
                  <p className="text-sm">{formatCurrency(selectedTransaction.balance_before)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Balance After</label>
                  <p className="text-sm">{formatCurrency(selectedTransaction.balance_after)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={getStatusVariant(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet</label>
                  <p className="text-sm capitalize">{selectedTransaction.wallet}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-sm">{formatDate(selectedTransaction.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction status and details</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editFormData.status || selectedTransaction.status || ""}
                  onValueChange={(value: string) => {
                    if (isValidTransactionStatus(value)) {
                      setEditFormData({
                        ...editFormData,
                        status: value,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="reversed">Reversed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editFormData.description || selectedTransaction.description || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Transaction"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-2">
              <p>
                <strong>Reference:</strong> {selectedTransaction.reference}
              </p>
              <p>
                <strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}
              </p>
              <p>
                <strong>User ID:</strong> {selectedTransaction.user_id}
              </p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete Transaction"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
