"use client";

import { DollarSign, Motorbike, Package, Store, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { api } from "@/lib/api";

type Statistics = {
  usersCount: number;
  vendorsCount: number;
  ordersCount: number;
  ridersCount: number;
  revenue: {
    totalAmount: number;
  };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics>({
    usersCount: 0,
    vendorsCount: 0,
    ordersCount: 0,
    ridersCount: 0,
    revenue: {
      totalAmount: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getReports();
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats?.usersCount || 0,
      icon: Users,
      colorClass: "text-blue-500",
    },
    {
      label: "Total Vendors",
      value: stats?.vendorsCount || 0,
      icon: Store,
      colorClass: "text-primary",
    },

    {
      label: "Total Riders",
      value: stats?.ridersCount || 0,
      icon: Motorbike,
      colorClass: "text-primary",
    },

    {
      label: "Total Orders",
      value: stats?.ordersCount || 0,
      icon: Package,
      colorClass: "text-purple-500",
    },
    {
      label: "Revenue",
      value: `₦${(stats?.revenue?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      colorClass: "text-green-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
