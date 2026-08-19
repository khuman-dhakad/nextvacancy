import React from "react";
import { Search, MapPin, LayoutGrid, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export interface SearchPanelProps {
  className?: string;
  defaultQuery?: string;
  defaultLocation?: string;
  defaultCategory?: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  className = "",
  defaultQuery = "",
  defaultLocation = "all",
  defaultCategory = "all",
}) => {
  return (
    <div className={["w-full max-w-5xl mx-auto", className].filter(Boolean).join(" ")}>
      <form
        action="/search"
        method="GET"
        role="search"
        aria-label="Search government and private job circulars"
        className="bg-white rounded-2xl sm:rounded-3xl p-2.5 shadow-2xl border border-white/80 flex flex-col lg:flex-row items-stretch gap-2"
      >
        {/* Col 1: Keyword Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 min-h-[52px] min-w-0">
          <Search className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <input
              type="search"
              name="q"
              defaultValue={defaultQuery}
              placeholder="Search by job title, commission (SSC, UPSC, RRB), or post..."
              aria-label="Search by job title, post, or department"
              className="w-full text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
              autoComplete="off"
            />
            <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">
              e.g. SSC CGL, Railway NTPC, Bank PO, Clerk, Police SI
            </span>
          </div>
        </div>

        {/* Vertical Divider 1 */}
        <div className="hidden lg:block w-px self-stretch bg-slate-200 my-2 shrink-0" aria-hidden="true" />

        {/* Col 2: Location Dropdown */}
        <div className="lg:w-48 xl:w-52 shrink-0 flex items-center gap-2.5 px-4 py-2 min-h-[52px]">
          <MapPin className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="relative flex-1 min-w-0">
            <select
              name="location"
              defaultValue={defaultLocation}
              aria-label="Select state or region"
              className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer appearance-none pr-5 truncate"
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
            <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">
              Select Location
            </span>
          </div>
        </div>

        {/* Vertical Divider 2 */}
        <div className="hidden lg:block w-px self-stretch bg-slate-200 my-2 shrink-0" aria-hidden="true" />

        {/* Col 3: Category Dropdown */}
        <div className="lg:w-48 xl:w-52 shrink-0 flex items-center gap-2.5 px-4 py-2 min-h-[52px]">
          <LayoutGrid className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <div className="relative flex-1 min-w-0">
            <select
              name="category"
              defaultValue={defaultCategory}
              aria-label="Select job category"
              className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer appearance-none pr-5 truncate"
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
            <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">
              Select Category
            </span>
          </div>
        </div>

        {/* Col 4: Search Button */}
        <div className="shrink-0">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full lg:w-auto font-black bg-[#D97706] hover:bg-[#B45309] text-white min-h-[52px] px-8 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 tracking-wide whitespace-nowrap transition-all rounded-xl sm:rounded-2xl"
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
