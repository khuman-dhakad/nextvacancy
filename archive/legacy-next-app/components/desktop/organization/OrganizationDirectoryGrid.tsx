"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Card, Input, Button } from "@/components/ui";

import { OrganizationProfile } from "@/types";

export interface OrganizationDirectoryGridProps {
  organizations: OrganizationProfile[];
  className?: string;
}

export const OrganizationDirectoryGrid: React.FC<OrganizationDirectoryGridProps> = ({
  organizations = [],
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const types = new Set(organizations.map((org) => org.categoryType));
    return ["All", ...Array.from(types)];
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (selectedCategory !== "All" && org.categoryType !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          org.name.toLowerCase().includes(q) ||
          org.shortName.toLowerCase().includes(q) ||
          org.headquarters.toLowerCase().includes(q) ||
          org.state.toLowerCase().includes(q) ||
          org.categoryType.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [organizations, selectedCategory, searchQuery]);

  return (
    <div className={["space-y-8", className].join(" ")}>
      {/* Search & Filter Bar */}
      <Card className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by authority, acronym (SSC, UPSC, RRB), or state..."
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          <span className="text-xs font-bold text-slate-500 font-mono self-end sm:self-center">
            Showing {filteredOrganizations.length} of {organizations.length} Recruiting Bodies
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={[
                "px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer",
                selectedCategory === cat
                  ? "bg-[#0F2744] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Directory Grid */}
      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 space-y-3">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            No recruiting authorities found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or switching to &ldquo;All&rdquo; categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Card
              key={org.id}
              className="p-6 bg-white border border-slate-200/90 rounded-3xl hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Top Badge & Verified status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[var(--primary)] font-mono font-black text-xs border border-blue-200">
                    {org.shortName}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {org.categoryType}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug">
                  <Link href={`/organizations/${org.slug}`}>
                    {org.name}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                  {org.tagline}
                </p>

                {/* Location & Established Year */}
                <div className="space-y-1 pt-1 text-[11px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{org.headquarters}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{org.stats.activeVacanciesCount} Active Drives</span>
                </div>

                <Link href={`/organizations/${org.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs group-hover:bg-[#0F2744] group-hover:text-white group-hover:border-[#0F2744] transition-all"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    View Career Portal
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

OrganizationDirectoryGrid.displayName = "OrganizationDirectoryGrid";
