
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminVendorProfile from "@/components/admin/MobileAdminVendorProfile";
import VendorProfileHeader from "@/components/admin/VendorProfileHeader";
import VendorInfoCard from "@/components/admin/VendorInfoCard";
import VendorPerformanceCards from "@/components/admin/VendorPerformanceCards";
import VendorGoalHistory from "@/components/admin/VendorGoalHistory";
import VendorTopClients from "@/components/admin/VendorTopClients";
import VendorAssignedClients from "@/components/admin/VendorAssignedClients";
import SetSalesGoalDialog from "@/components/admin/SetSalesGoalDialog";
import { getVendor, listVendorGoals, setVendorGoal, Vendor } from "@/services/vendorsApi";
import { useToast } from "@/hooks/use-toast";

// Fallback mock if API fails (will be replaced by real fetch)
const mockVendor = {
  id: "V001",
  name: "Ana Martínez",
  email: "ana.martinez@clubhx.cl",
  phone: "+56 9 1234 5678",
  region: "Metropolitana",
  customers: 35,
  totalSales: 24500000,
  salesTarget: 30000000,
  targetCompletion: 82,
  status: "active",
  avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  joinDate: "2023-03-15",
  lastActivity: "2024-12-20",
  assignedClients: [
    { id: "C001", name: "Salón Bella Vista", contact: "María González", phone: "+56 9 8765 4321", lastOrder: "2024-12-18" },
    { id: "C002", name: "Estilo & Color", contact: "Carlos Pérez", phone: "+56 9 7654 3210", lastOrder: "2024-12-17" },
    { id: "C003", name: "Hair Studio Premium", contact: "Ana López", phone: "+56 9 6543 2109", lastOrder: "2024-12-15" },
    { id: "C004", name: "Beauty Center", contact: "Laura Díaz", phone: "+56 9 5432 1098", lastOrder: "2024-12-16" },
    { id: "C005", name: "Cortes Modernos", contact: "Roberto Silva", phone: "+56 9 4321 0987", lastOrder: "2024-12-14" }
  ],
  performance: {
    monthlyTarget: 2500000,
    monthlyAchieved: 2100000,
    avgDealSize: 700000,
    conversionRate: 78
  },
  recentSales: [
    { id: "S001", client: "Salón Bella Vista", amount: 850000, date: "2024-12-18", status: "completed" },
    { id: "S002", client: "Estilo & Color", amount: 1200000, date: "2024-12-17", status: "completed" },
    { id: "S003", client: "Hair Studio", amount: 650000, date: "2024-12-15", status: "pending" }
  ],
  topClients: [
    { name: "Salón Premium", totalSpent: 3400000, lastOrder: "2024-12-18" },
    { name: "Beauty Center", totalSpent: 2800000, lastOrder: "2024-12-16" },
    { name: "Cortes Modernos", totalSpent: 2100000, lastOrder: "2024-12-14" }
  ]
};

export default function AdminVendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalHistory, setGoalHistory] = useState<any[]>([]);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const v = await getVendor(id || "");
        const goals = await listVendorGoals(id || "");
        if (!cancelled) {
          setVendor(v);
          setGoalHistory(goals);
        }
      } catch {
        if (!cancelled) {
          setVendor(mockVendor as unknown as Vendor);
          setGoalHistory([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleBack = () => {
    navigate("/main/admin/vendors");
  };

  const handleEditVendor = () => {
    // TODO: Implement edit vendor functionality
    console.log("Edit vendor");
  };

  const handleSaveGoal = async (goalData: { period: string; salesTarget: number }) => {
    if (!vendor) return;
    try {
      await setVendorGoal(vendor.id, goalData);
      const goals = await listVendorGoals(vendor.id);
      setGoalHistory(goals);
      toast.success(`Meta asignada a ${vendor.name}`);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo asignar la meta");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Vendedor no encontrado</h1>
          <VendorProfileHeader 
            vendor={{ id: "", name: "" }} 
            onBack={handleBack} 
            onEditVendor={handleEditVendor}
            onSetGoal={() => setShowGoalDialog(true)}
          />
        </div>
      </div>
    );
  }

  // Use mobile component for mobile devices
  if (isMobile) {
    return <MobileAdminVendorProfile vendor={vendor} onBack={handleBack} />;
  }

  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6">
      {/* Header */}
      <VendorProfileHeader 
        vendor={vendor}
        onBack={handleBack}
        onEditVendor={handleEditVendor}
        onSetGoal={() => setShowGoalDialog(true)}
      />

      {/* Vendor Info Card */}
      <VendorInfoCard vendor={vendor} />

      {/* Performance Cards */}
      <VendorPerformanceCards vendor={vendor} />

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal History */}
        <VendorGoalHistory goals={goalHistory} />

        {/* Top Clients */}
        <VendorTopClients topClients={vendor.topClients} />
      </div>

      {/* Assigned Clients */}
      <VendorAssignedClients assignedClients={vendor.assignedClients} />

      {/* Dialog */}
      <SetSalesGoalDialog
        open={showGoalDialog}
        onOpenChange={setShowGoalDialog}
        vendor={vendor}
        onSave={handleSaveGoal}
      />
    </div>
  );
}
