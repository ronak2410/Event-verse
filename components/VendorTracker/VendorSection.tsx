"use client";

import React, { useState } from "react";
import { Briefcase, Plus, CheckCircle2, DollarSign, Clock, ShieldCheck, Download } from "lucide-react";
import { VendorTable } from "./VendorTable";
import { AddVendorModal } from "./AddVendorModal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { EventVerseState, Vendor, VendorStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface VendorSectionProps {
  state: EventVerseState;
  onUpdateVendorStatus: (id: string, status: VendorStatus) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorSection: React.FC<VendorSectionProps> = ({
  state,
  onUpdateVendorStatus,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalCommitted = state.vendors
    .filter((v) => v.status === "Booked" || v.status === "Paid")
    .reduce((acc, v) => acc + (v.actualCost || v.estimatedCost), 0);

  const paidCount = state.vendors.filter((v) => v.status === "Paid").length;
  const bookedCount = state.vendors.filter((v) => v.status === "Booked").length;
  const researchingCount = state.vendors.filter((v) => v.status === "Researching" || v.status === "Contacted").length;

  const handleExportCSV = () => {
    const headers = ["Vendor Name", "Category", "Contact Person", "Email", "Phone", "Status", "Estimated Cost", "Actual Cost", "Contract Signed", "Deposit Paid", "Notes"];
    const rows = state.vendors.map(v => [
      `"${v.name}"`,
      `"${v.category}"`,
      `"${v.contactPerson || ''}"`,
      `"${v.email || ''}"`,
      `"${v.phone || ''}"`,
      `"${v.status}"`,
      v.estimatedCost,
      v.actualCost || v.estimatedCost,
      v.contractSigned ? "Yes" : "No",
      v.depositPaid ? "Yes" : "No",
      `"${(v.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${state.event.title.replace(/\s+/g, '_')}_Vendor_Contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-3d shadow-neon-emerald">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" size="sm" className="gap-1">
              <Briefcase className="w-3 h-3" />
              Interactive Vendor CRM & Checklist
            </Badge>
            <span className="text-xs text-slate-400">
              Procurement & Contract Tracker
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Vendor Directory & Status Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Committed Spend: <strong className="text-white">{formatCurrency(totalCommitted, state.event.currency)}</strong> of {formatCurrency(state.event.totalBudget, state.event.currency)} • {state.vendors.length} Total Partners
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs text-emerald-300 border-emerald-500/40 hover:border-emerald-400"
            title="Download CSV spreadsheet of all vendor contacts and contract costs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="luxury"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vendor</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Paid & Confirmed</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{paidCount} Vendors</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Contracts Booked</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{bookedCount} Vendors</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">In Discovery / Contacted</div>
            <div className="text-xl font-bold text-neon-cyan mt-0.5">{researchingCount} Vendors</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-cyan/15 text-neon-cyan shadow-neon-cyan">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Interactive Table */}
      <VendorTable
        vendors={state.vendors}
        currency={state.event.currency}
        onUpdateStatus={onUpdateVendorStatus}
        onUpdateVendor={onUpdateVendor}
        onDeleteVendor={onDeleteVendor}
      />

      {/* Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={onAddVendor}
        currency={state.event.currency}
      />
    </div>
  );
};
