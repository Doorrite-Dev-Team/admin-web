"use client";

import { CheckCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { api } from "@/lib/api";

interface Vendor {
  id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  isApproved: boolean;
  isActive: boolean;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { page, setPage } = usePagination();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "delete" | null;
    vendor: Vendor | null;
  }>({ open: false, action: null, vendor: null });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log(refreshKey);
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // 'page' is safely accessed here and is a dependency
        const response = await api.getVendors(page, 20);
        setVendors(response.data.vendors);
        setTotal(response.data.total);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        // Add user-facing error handling here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();

    // The effect runs when 'page' changes (pagination) or 'refreshKey' changes (action success).
  }, [page, refreshKey]);

  const handleApprove = async () => {
    if (!confirmDialog.vendor) return;
    try {
      await api.approveVendor(confirmDialog.vendor.id);
      // Trigger data re-fetch by updating the refreshKey
      setRefreshKey((k) => k + 1);
      setConfirmDialog({ open: false, action: null, vendor: null });
    } catch (err) {
      console.error("Failed to approve vendor:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog.vendor) return;
    try {
      await api.deleteVendor(confirmDialog.vendor.id);
      // Trigger data re-fetch by updating the refreshKey
      setRefreshKey((k) => k + 1);
      setConfirmDialog({ open: false, action: null, vendor: null });
    } catch (err) {
      console.error("Failed to delete vendor:", err);
    }
  };

  const columns = [
    { key: "businessName", label: "Business Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (vendor: Vendor) => (
        <Badge variant={vendor.isApproved ? "default" : "secondary"}>
          {vendor.isApproved ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (vendor: Vendor) => (
        <div className="flex items-center gap-2">
          {!vendor.isApproved && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: "approve",
                  vendor,
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
                vendor,
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
      <h2 className="text-2xl font-bold mb-6">Vendors Management</h2>

      <DataTable
        data={vendors}
        columns={columns}
        searchKey="businessName"
        searchPlaceholder="Search vendors..."
        page={page}
        total={total}
        limit={20}
        onPageChange={setPage}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, action: null, vendor: null })
        }
        onConfirm={
          confirmDialog.action === "approve" ? handleApprove : handleDelete
        }
        title={
          confirmDialog.action === "approve"
            ? "Approve Vendor"
            : "Delete Vendor"
        }
        description={
          confirmDialog.action === "approve"
            ? `Are you sure you want to approve ${confirmDialog.vendor?.businessName}?`
            : `Are you sure you want to delete ${confirmDialog.vendor?.businessName}? This action cannot be undone.`
        }
        variant={confirmDialog.action === "delete" ? "destructive" : "default"}
      />
    </div>
  );
}
