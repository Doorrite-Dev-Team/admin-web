"use client";

import { CheckCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { api } from "@/lib/api";

interface Rider {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  isApproved: boolean;
  isAvailable: boolean;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { page, setPage } = usePagination();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "delete" | null;
    rider: Rider | null;
  }>({ open: false, action: null, rider: null });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log(refreshKey);
    const fetchRiders = async () => {
      setLoading(true);
      try {
        // 'page' is safely accessed here and is a dependency
        const response = await api.getRiders(page, 20);
        setRiders(response.data.riders);
        setTotal(response.data.total);
      } catch (err) {
        console.error("Failed to fetch riders:", err);
        // Add user-facing error handling here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();

    // The effect runs when 'page' changes (pagination) or 'refreshKey' changes (action success).
  }, [page, refreshKey]);

  const handleApprove = async () => {
    if (!confirmDialog.rider) return;
    try {
      await api.approveRider(confirmDialog.rider.id);
      // Trigger data re-fetch by updating the refreshKey
      setRefreshKey((k) => k + 1);
      setConfirmDialog({ open: false, action: null, rider: null });
    } catch (err) {
      console.error("Failed to approve rider:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog.rider) return;
    try {
      await api.deleteRider(confirmDialog.rider.id);
      // Trigger data re-fetch by updating the refreshKey
      setRefreshKey((k) => k + 1);
      setConfirmDialog({ open: false, action: null, rider: null });
    } catch (err) {
      console.error("Failed to delete rider:", err);
    }
  };

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "vehicleType", label: "Vehicle" },
    {
      key: "status",
      label: "Status",
      render: (rider: Rider) => (
        <Badge variant={rider.isApproved ? "default" : "secondary"}>
          {rider.isApproved ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (rider: Rider) => (
        <div className="flex items-center gap-2">
          {!rider.isApproved && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: "approve",
                  rider,
                })
              }
              className="text-primary hover:bg-primary/10"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setConfirmDialog({
                open: true,
                action: "delete",
                rider,
              })
            }
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Riders Management</h2>

      <DataTable
        data={riders}
        columns={columns}
        searchKey="fullName"
        searchPlaceholder="Search riders..."
        page={page}
        total={total}
        limit={20}
        onPageChange={setPage}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, action: null, rider: null })
        }
        onConfirm={
          confirmDialog.action === "approve" ? handleApprove : handleDelete
        }
        title={
          confirmDialog.action === "approve" ? "Approve Rider" : "Delete Rider"
        }
        description={
          confirmDialog.action === "approve"
            ? `Are you sure you want to approve ${confirmDialog.rider?.fullName}?`
            : `Are you sure you want to delete ${confirmDialog.rider?.fullName}? This action cannot be undone.`
        }
        variant={confirmDialog.action === "delete" ? "destructive" : "default"}
      />
    </div>
  );
}
