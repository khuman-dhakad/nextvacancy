import React from "react";
import { Search, MapPin, LayoutGrid, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export interface SearchPanelProps {
  className?: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ className = "" }) => {
  return (
    <div className={["w-full max-w-5xl mx-auto", className].filter(Boolean).join(" ")}>
      <form
        action="/search"
        method="GET"
        role="search"
        aria-label="Search government and private job circulars"
        className="bg-white rounded-2xl p-2 shadow-2xl border border-slate-200/90 flex flex-col lg:flex-row items-center gap-2"
      >
        {/* Col 1: Keyword Input (Expands to fill extra space) */}
        <div className="w-full lg:flex-1 flex items-center gap-3 px-3 py-1.5 min-h-[48px]">
          <Search className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <input
              type="search"
              name="q"
              placeholder="Search by job title, post, department..."
              aria-label="Search by job title, post, or department"
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none bg-transparent"
              autoComplete="off"
            />
            <span className="text-[11px] text-slate-400 font-medium block truncate">
              e.g. SSC, Railway, Clerk, Engineer
            </span>
          </div>
        </div>

        {/* Vertical Divider 1 */}
        <div className="hidden lg:block w-[1px] h-9 bg-slate-200 shrink-0" aria-hidden="true" />

        {/* Col 2: Location Dropdown (Spacious Fixed Width) */}
        <div className="w-full lg:w-52 xl:w-56 shrink-0 flex items-center gap-2.5 px-3 py-1.5 min-h-[48px]">
          <MapPin className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="relative flex-1 min-w-0">
            <select
              name="location"
              defaultValue="all"
              aria-label="Select state or region"
              className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer appearance-none pr-5 truncate"
            >
              <option value="all">All India / Central</option>
              <option value="delhi">Delhi NCR</option>
              <option value="uttar pradesh">Uttar Pradesh</option>
              <option value="bihar">Bihar</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="madhya pradesh">Madhya Pradesh</option>
              <option value="west bengal">West Bengal</option>
              <option value="karnataka">Karnataka</option>
              <option value="tamil nadu">Tamil Nadu</option>
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <span className="text-[11px] text-slate-400 font-medium block truncate">
              Select Location
            </span>
          </div>
        </div>

        {/* Vertical Divider 2 */}
        <div className="hidden lg:block w-[1px] h-9 bg-slate-200 shrink-0" aria-hidden="true" />

        {/* Col 3: Category Dropdown (Spacious Fixed Width) */}
        <div className="w-full lg:w-52 xl:w-56 shrink-0 flex items-center gap-2.5 px-3 py-1.5 min-h-[48px]">
          <LayoutGrid className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="relative flex-1 min-w-0">
            <select
              name="category"
              defaultValue="all"
              aria-label="Select job category"
              className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer appearance-none pr-5 truncate"
            >
              <option value="all">All Categories</option>
              <option value="government">Government Jobs</option>
              <option value="private">Private Careers</option>
              <option value="admit-card">Admit Cards</option>
              <option value="result">Exam Results</option>
              <option value="scholarship">Scholarships</option>
              <option value="internship">Internships</option>
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <span className="text-[11px] text-slate-400 font-medium block truncate">
              Select Category
            </span>
          </div>
        </div>

        {/* Col 4: Solid Orange Search Button (Exact Width, Zero Unwanted Stretch) */}
        <div className="w-full lg:w-auto shrink-0 pl-1">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full lg:w-auto font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl min-h-[48px] px-7 text-sm shadow-md flex items-center justify-center gap-2 tracking-wide whitespace-nowrap transition-transform active:scale-[0.98]"
          >
            <span>Search Vacancies</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
};

SearchPanel.displayName = "SearchPanel";
