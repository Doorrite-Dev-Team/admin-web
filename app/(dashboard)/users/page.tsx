"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { api } from "@/lib/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { page, setPage } = usePagination();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log(refreshKey);
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // 'page' is safely accessed here and is a dependency
        const response = await api.getUsers(page, 20);
        // console.log(response);
        setUsers(response.data.users);
        setTotal(response.data.total);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        // Add user-facing error handling here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // The effect runs when 'page' changes (pagination) or 'refreshKey' changes (action success).
  }, [page, refreshKey]);

  const handleDelete = async () => {
    if (!confirmDialog.user) return;
    try {
      await api.deleteUser(confirmDialog.user.id);
      // Trigger data re-fetch by updating the refreshKey
      setRefreshKey((k) => k + 1);
      setConfirmDialog({ open: false, user: null });
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    {
      key: "verified",
      label: "Verified",
      render: (user: User) => (
        <Badge variant={user.isVerified ? "default" : "outline"}>
          {user.isVerified ? "Verified" : "Not Verified"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setConfirmDialog({ open: true, user })}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users Management</h2>

      <DataTable
        data={users}
        columns={columns}
        searchKey="fullName"
        searchPlaceholder="Search users..."
        page={page}
        total={total}
        limit={20}
        onPageChange={setPage}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${confirmDialog.user?.fullName}? This action cannot be undone.`}
        variant="destructive"
      />
    </div>
  );
}
