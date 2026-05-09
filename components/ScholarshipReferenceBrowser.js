import React, { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import ScholarshipTable from "./ScholarshipTable";
import {
  SCHOLARSHIP_STATUS_FILTERS,
  getScholarshipStatusFilterKey,
} from "../lib/scholarships/status";

const fuseOptions = {
  includeScore: false,
  shouldSort: true,
  threshold: 0.3,
  ignoreLocation: true,
  keys: ["Scholarship Name", "Stream", "State", "Eligibility"],
};

const ScholarshipReferenceBrowser = () => {
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const loadScholarships = async () => {
      try {
        const response = await fetch("/data/scholarships/scholarship_data.json");
        const data = await response.json();
        const sortedData = [...data].sort((a, b) =>
          String(a["Scholarship Name"] || "").localeCompare(
            String(b["Scholarship Name"] || "")
          )
        );
        setScholarships(sortedData);
      } catch (error) {
        console.error("Failed to load scholarship reference data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScholarships();
  }, []);

  const fuseInstance = useMemo(
    () => new Fuse(scholarships, fuseOptions),
    [scholarships]
  );

  const filteredScholarships = useMemo(() => {
    const searchResults = searchTerm.trim()
      ? fuseInstance.search(searchTerm.trim()).map((result) => result.item)
      : scholarships;

    if (statusFilter === "all") {
      return searchResults;
    }

    return searchResults.filter(
      (scholarship) =>
        getScholarshipStatusFilterKey(scholarship) === statusFilter
    );
  }, [fuseInstance, scholarships, searchTerm, statusFilter]);

  const closedCount = useMemo(
    () =>
      scholarships.filter(
        (item) => getScholarshipStatusFilterKey(item) !== "open"
      ).length,
    [scholarships]
  );

  useEffect(() => {
    setExpandedRows({});
  }, [searchTerm, statusFilter]);

  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 rounded-2xl border border-[#eaded8] bg-white p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2f2320]">
            Scholarship Reference List
          </h1>
          <p className="mt-2 max-w-3xl text-sm sm:text-base text-[#5b3a34]">
            This is a reference list. Scholarships shown here should be treated
            as closed or deadline-passed.
          </p>
          {!isLoading && scholarships.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#5b3a34]">
              <span className="rounded-full border border-[#e3d1cb] bg-[#fff7f4] px-3 py-1">
                {scholarships.length.toLocaleString("en-IN")} scholarships in
                the reference list
              </span>
              <span className="rounded-full border border-[#f0c7c8] bg-[#fff1f1] px-3 py-1 text-[#8f2e31]">
                {closedCount.toLocaleString("en-IN")} currently closed or past
                deadline
              </span>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-[#eaded8] bg-white p-5 shadow-sm">
          <label
            htmlFor="scholarship-search"
            className="mb-2 block text-sm font-semibold text-[#5b1f20]"
          >
            Search by scholarship name, stream, state, or eligibility
          </label>
          <input
            id="scholarship-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Try: engineering, girls scholarship, Maharashtra..."
            className="w-full rounded-xl border border-[#d8c7c1] bg-[#fffdfa] px-4 py-3 text-sm text-[#2f2320] outline-none transition focus:border-[#b52326] focus:ring-2 focus:ring-[#f4d5d6]"
          />
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-[#5b1f20]">
              Filter by status
            </p>
            <div className="flex flex-wrap gap-2">
              {SCHOLARSHIP_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setStatusFilter(filter.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    statusFilter === filter.key
                      ? "border-[#B52326] bg-[#B52326] text-white"
                      : "border-[#d8c7c1] bg-[#fffdfa] text-[#5b3a34] hover:bg-[#fff1f1]"
                  }`}
                  aria-pressed={statusFilter === filter.key}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-[#eaded8] bg-white px-6 py-12 text-center text-[#5b3a34] shadow-sm">
            Loading scholarship reference list...
          </div>
        ) : filteredScholarships.length > 0 ? (
          <ScholarshipTable
            filteredData={filteredScholarships}
            toggleRowExpansion={toggleRowExpansion}
            expandedRows={expandedRows}
          />
        ) : (
          <div className="rounded-2xl border border-[#eaded8] bg-white px-6 py-12 text-center text-[#5b3a34] shadow-sm">
            No scholarships matched your search and status filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipReferenceBrowser;
