"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Vendor, VendorStatus, BudgetCategoryKey, Currency } from "@/lib/types";

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  currency: Currency;
}

export const AddVendorModal: React.FC<AddVendorModalProps> = ({
  isOpen,
  onClose,
  onAddVendor,
  currency
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "venue" as BudgetCategoryKey,
    contactPerson: "",
    email: "",
    phone: "",
    estimatedCost: 1000,
    actualCost: 1000,
    status: "Researching" as VendorStatus,
    notes: "",
    contractSigned: false,
    depositPaid: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAddVendor(formData);
    onClose();
    setFormData({
      name: "",
      category: "venue",
      contactPerson: "",
      email: "",
      phone: "",
      estimatedCost: 1000,
      actualCost: 1000,
      status: "Researching",
      notes: "",
      contractSigned: false,
      depositPaid: false
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vendor to Checklist"
      description="Track quotes, contacts, and contract commitments."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vendor / Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lumina Live Sound & Lights"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan capitalize"
            >
              <option value="venue">Venue & Rentals</option>
              <option value="catering">Catering & Bar</option>
              <option value="decor">Decor & Florals</option>
              <option value="entertainment">Entertainment & AV</option>
              <option value="photography">Photo & Video</option>
              <option value="contingency">Logistics / Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="contact@vendor.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="+1 (555) 012-3456"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Quote ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Actual Contract Cost ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={formData.actualCost}
              onChange={(e) => setFormData({ ...formData, actualCost: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as VendorStatus })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <option value="Researching">🟡 Researching</option>
              <option value="Contacted">🔵 Contacted</option>
              <option value="Booked">🟣 Booked</option>
              <option value="Paid">🟢 Paid / Confirmed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes, Deliverables & Contract Terms
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Includes 2 hours setup time, wireless mics, and travel fee."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.contractSigned}
              onChange={(e) => setFormData({ ...formData, contractSigned: e.target.checked })}
              className="rounded text-neon-cyan focus:ring-neon-cyan bg-slate-900 border-slate-700"
            />
            <span>Contract Signed</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.depositPaid}
              onChange={(e) => setFormData({ ...formData, depositPaid: e.target.checked })}
              className="rounded text-neon-cyan focus:ring-neon-cyan bg-slate-900 border-slate-700"
            />
            <span>Deposit Paid</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="luxury" size="sm">
            Save Vendor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
