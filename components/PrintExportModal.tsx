"use client";

import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { EventVerseState } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Printer, Download, FileText, CheckCircle2 } from "lucide-react";

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EventVerseState;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({ isOpen, onClose, state }) => {
  const { event, budgetAllocations, dayOfSchedule, vendors } = state;
  const currency = event.currency;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Executive Day-of Operational & Budget Packet"
      description="Standardized printable packet for venue captains, master coordinators, and banquet leads."
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-200">
        {/* Printable Document Preview */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 font-sans text-xs">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400">
                Official Event Run-of-Show Blueprint
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{event.title}</h2>
              <p className="text-slate-400 mt-0.5">
                {event.type.toUpperCase()} • {event.date || "Date: TBD"} • {event.location || "Location: TBD"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {formatCurrency(event.totalBudget, currency)}
              </div>
              <div className="text-slate-400">{event.guestCount} Confirmed Guests</div>
            </div>
          </div>

          {/* Section 1: Day of Schedule */}
          <div>
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              1. Day-of Run-of-Show Timetable
            </h3>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-900/80 p-2 font-semibold text-slate-300">
                <div className="col-span-2">Time</div>
                <div className="col-span-5">Milestone / Task</div>
                <div className="col-span-3">Assigned Lead</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              {dayOfSchedule.map((item) => (
                <div key={item.id} className="grid grid-cols-12 p-2 text-slate-300 items-center">
                  <div className="col-span-2 font-mono text-cyan-400 font-bold">{item.time}</div>
                  <div className="col-span-5">
                    <span className="font-medium text-white">{item.title}</span>
                    {item.notes && <p className="text-[10px] text-slate-500 italic">{item.notes}</p>}
                  </div>
                  <div className="col-span-3 text-slate-400">{item.leadPerson}</div>
                  <div className="col-span-2 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${item.completed ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {item.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Budget Breakdown */}
          <div>
            <h3 className="font-bold text-sm text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              2. Budget & Expenditure Allocation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(budgetAllocations).map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="font-semibold text-white">{cat.name}</div>
                  <div className="text-cyan-400 font-mono font-bold mt-0.5">
                    {formatCurrency(cat.allocatedAmount, currency)} ({cat.percentage}%)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Committed: {formatCurrency(cat.spentAmount, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Vendor Emergency Directory */}
          <div>
            <h3 className="font-bold text-sm text-pink-300 uppercase tracking-wider mb-2">
              3. Critical Vendor Contacts & Leads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vendors.map((v) => (
                <div key={v.id} className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between">
                  <div>
                    <span className="font-bold text-white">{v.name}</span>
                    <span className="text-[10px] ml-1.5 text-cyan-400 uppercase">({v.category})</span>
                    <p className="text-[11px] text-slate-400">{v.contactPerson || "Lead"} • {v.phone || v.email || "No phone"}</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">{v.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Line */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
            <div>
              <p>Lead Coordinator Signature: _______________________</p>
            </div>
            <div className="text-right">
              <p>Venue Director Sign-off: _______________________</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            💡 Opens system print dialogue (Select "Save as PDF" to export).
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="luxury" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
