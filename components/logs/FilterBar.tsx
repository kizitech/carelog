"use client";
// components/logs/FilterBar.tsx
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function FilterBar() {
  const { search, setSearch, filterStaff, setFilterStaff, filterDate, setFilterDate, clearFilters, hasActiveFilters, allStaffNames } = useApp();

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
          Filter Logs
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
            <X className="w-3 h-3" />Clear all
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by resident or staff name…"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
        </div>

        {/* Staff + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Staff Member</label>
            <select value={filterStaff} onChange={e => setFilterStaff(e.target.value)} className={inputClass}>
              <option value="">All staff</option>
              {allStaffNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Date</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Active chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {search      && <Chip label={`"${search}"`}    onRemove={() => setSearch("")}      />}
            {filterStaff && <Chip label={filterStaff}      onRemove={() => setFilterStaff("")} />}
            {filterDate  && <Chip label={filterDate}       onRemove={() => setFilterDate("")}  />}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold px-2 py-0.5 rounded-full">
      {label}<button onClick={onRemove} className="ml-0.5 hover:opacity-70"><X className="w-2.5 h-2.5" /></button>
    </span>
  );
}
