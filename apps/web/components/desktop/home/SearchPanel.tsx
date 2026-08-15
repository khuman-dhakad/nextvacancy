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
        className="bg-white rounded-[18px] p-2.5 shadow-2xl border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center"
      >
        {/* Col 1: Keyword Input */}
        <div className="lg:col-span-4 flex items-center gap-3 px-3.5 py-1.5 min-h-[52px]">
          <Search className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <input
              type="search"
              name="q"
              placeholder="Search by job title, post, department..."
              aria-label="Search by job title, post, or department"
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-600 placeholder:font-normal focus:outline-none bg-transparent"
              autoComplete="off"
            />
            <span className="text-[11px] text-slate-500 font-medium block truncate">
              e.g. SSC, Railway, Clerk, Engineer
            </span>
          </div>
        </div>

        {/* Vertical Divider 1 */}
        <div className="hidden lg:block w-[1px] h-10 bg-slate-200" aria-hidden="true" />

        {/* Col 2: Location Dropdown */}
        <div className="lg:col-span-3 flex items-center justify-between gap-2 px-3.5 py-1.5 min-h-[52px] cursor-pointer group">
          <div className="flex items-center gap-3 min-w-0">
            <MapPin className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <select
                name="location"
                defaultValue="all"
                aria-label="Select state or region"
                className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer appearance-none pr-4"
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
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                Select Location
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Vertical Divider 2 */}
        <div className="hidden lg:block w-[1px] h-10 bg-slate-200" aria-hidden="true" />

        {/* Col 3: Category Dropdown */}
        <div className="lg:col-span-3 flex items-center justify-between gap-2 px-3.5 py-1.5 min-h-[52px] cursor-pointer group">
          <div className="flex items-center gap-3 min-w-0">
            <LayoutGrid className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <select
                name="category"
                defaultValue="all"
                aria-label="Select job category"
                className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="all">All Categories</option>
                <option value="government">Government Jobs</option>
                <option value="private">Private Careers</option>
                <option value="admit-card">Admit Cards</option>
                <option value="result">Exam Results</option>
                <option value="scholarship">Scholarships</option>
                <option value="internship">Internships</option>
              </select>
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                Select Category
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Col 4: Solid Orange Search Button */}
        <div className="lg:col-span-2 w-full">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-[14px] min-h-[50px] text-sm shadow-md flex items-center justify-center gap-2 tracking-wide transition-transform active:scale-[0.98]"
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
