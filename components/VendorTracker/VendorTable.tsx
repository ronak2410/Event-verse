"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Trash2, 
  Check, 
  Edit3, 
  ExternalLink,
  DollarSign
} from "lucide-react";
import { Vendor, VendorStatus, Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface VendorTableProps {
  vendors: Vendor[];
  currency: Currency;
  onUpdateStatus: (id: string, status: VendorStatus) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  currency,
  onUpdateStatus,
  onUpdateVendor,
  onDeleteVendor
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const filteredVendors = vendors.filter((v) => {
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case "Paid":
        return <Badge variant="success" size="sm">🟢 Paid / Confirmed</Badge>;
      case "Booked":
        return <Badge variant="purple" size="sm">🟣 Booked</Badge>;
      case "Contacted":
        return <Badge variant="secondary" size="sm">🔵 Contacted</Badge>;
      default:
        return <Badge variant="cyan" size="sm">⚪ Researching</Badge>;
    }
  };

  const startEditNotes = (v: Vendor) => {
    setEditingNotesId(v.id);
    setTempNotes(v.notes || "");
  };

  const saveEditNotes = (id: string) => {
    onUpdateVendor(id, { notes: tempNotes });
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, contact or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Researching", "Contacted", "Booked", "Paid"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards List */}
      {filteredVendors.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No vendors matching this filter. Click "+ Add Vendor" to add a new contact.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => {
            const hasVariance = vendor.actualCost > 0 && vendor.actualCost !== vendor.estimatedCost;
            const variance = vendor.actualCost - vendor.estimatedCost;

            return (
              <Card key={vendor.id} className="p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Vendor Identity & Category */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {vendor.name}
                      </h4>
                      <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                        {vendor.category}
                      </Badge>
                      {vendor.contractSigned && (
                        <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.2 rounded-full border border-indigo-200 dark:border-indigo-800">
                          Contract Signed
                        </span>
                      )}
                      {vendor.depositPaid && (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                          Deposit Paid
                        </span>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {vendor.contactPerson && (
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Contact: {vendor.contactPerson}
                        </span>
                      )}
                      {vendor.email && (
                        <a
                          href={`mailto:${vendor.email}`}
                          className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{vendor.email}</span>
                        </a>
                      )}
                      {vendor.phone && (
                        <a
                          href={`tel:${vendor.phone}`}
                          className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{vendor.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        Quote: {formatCurrency(vendor.estimatedCost, currency)}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {vendor.actualCost > 0
                          ? `Actual: ${formatCurrency(vendor.actualCost, currency)}`
                          : "Actual: Pending"}
                      </div>
                      {hasVariance && (
                        <div className={`text-[10px] font-medium ${variance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                          {variance > 0 ? `+${formatCurrency(variance, currency)} over` : `${formatCurrency(Math.abs(variance), currency)} saved`}
                        </div>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={vendor.status}
                      aria-label={`Status for ${vendor.name}`}
                      onChange={(e) => onUpdateStatus(vendor.id, e.target.value as VendorStatus)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold focus:ring-2 focus:ring-neon-cyan outline-none"
                    >
                      <option value="Researching">⚪ Researching</option>
                      <option value="Contacted">🔵 Contacted</option>
                      <option value="Booked">🟣 Booked</option>
                      <option value="Paid">🟢 Paid / Confirmed</option>
                    </select>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteVendor(vendor.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      aria-label={`Remove vendor ${vendor.name}`}
                      title={`Remove vendor ${vendor.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editable Notes Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  {editingNotesId === vendor.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEditNotes(vendor.id)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
                        placeholder="Add notes, payment schedules, or deliverable checklists..."
                      />
                      <button
                        onClick={() => saveEditNotes(vendor.id)}
                        className="px-3 py-1.5 rounded-xl bg-neon-cyan text-slate-950 text-xs font-semibold hover:shadow-neon-cyan"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEditNotes(vendor)}
                      className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer group"
                    >
                      <span className="italic line-clamp-1">
                        {vendor.notes ? `"${vendor.notes}"` : "+ Click to add notes, contract deliverables, or payment milestones..."}
                      </span>
                      <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-neon-cyan" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
