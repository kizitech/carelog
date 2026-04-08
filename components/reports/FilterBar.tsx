"use client";
// components/reports/FilterBar.tsx
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Select } from "@/components/shared";
import { CONDITIONS, DEPARTMENTS, SHIFTS, cn } from "@/lib/utils";

export function FilterBar() {
  const { search, setSearch, filterCondition, setFilterCondition, filterDepartment, setFilterDepartment, filterDate, setFilterDate, filterShift, setFilterShift, clearFilters, hasActiveFilters } = useApp();

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, staff, or department…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <Select value={filterCondition} onChange={e => setFilterCondition(e.target.value)} className="min-w-[140px] flex-shrink-0">
          <option value="">All Conditions</option>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="min-w-[155px] flex-shrink-0">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </Select>
        <Select value={filterShift} onChange={e => setFilterShift(e.target.value)} className="min-w-[130px] flex-shrink-0">
          <option value="">All Shifts</option>
          {SHIFTS.map(s => <option key={s}>{s}</option>)}
        </Select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="min-w-[145px] px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all flex-shrink-0" />
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-accent border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-all flex-shrink-0">
            <X className="w-3.5 h-3.5" />Clear
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><SlidersHorizontal className="w-3 h-3" /><span>Active filters:</span></div>
          {search && <Chip label={`"${search}"`} onRemove={() => setSearch("")} />}
          {filterCondition && <Chip label={filterCondition} onRemove={() => setFilterCondition("")} />}
          {filterDepartment && <Chip label={filterDepartment} onRemove={() => setFilterDepartment("")} />}
          {filterShift && <Chip label={filterShift + " Shift"} onRemove={() => setFilterShift("")} />}
          {filterDate && <Chip label={filterDate} onRemove={() => setFilterDate("")} />}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold px-2.5 py-1 rounded-full">
      {label}<button onClick={onRemove} className="ml-0.5 hover:opacity-70"><X className="w-3 h-3" /></button>
    </span>
  );
}
