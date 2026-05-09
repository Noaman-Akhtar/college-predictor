export const SCHOLARSHIP_STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "deadline-passed", label: "Deadline passed" },
];

export const parseScholarshipDeadline = (value) => {
  if (!value) return null;

  const parts = String(value)
    .split("/")
    .map((part) => Number(part));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  const [month, day, year] = parts;
  const deadline = new Date(year, month - 1, day);
  if (Number.isNaN(deadline.getTime())) return null;
  deadline.setHours(23, 59, 59, 999);
  return deadline;
};

export const getScholarshipStatusFilterKey = (scholarship, now = new Date()) => {
  const rawStatus = String(scholarship?.Status || "").trim().toLowerCase();
  if (rawStatus === "closed") return "closed";

  const deadline = parseScholarshipDeadline(scholarship?.["Last Date"]);
  if (deadline && deadline < now) return "deadline-passed";

  return "open";
};

export const getScholarshipDisplayStatus = (scholarship, now = new Date()) => {
  const filterKey = getScholarshipStatusFilterKey(scholarship, now);
  if (filterKey === "closed") return "Closed";
  if (filterKey === "deadline-passed") return "Deadline passed";

  const rawStatus = String(scholarship?.Status || "").trim();
  return rawStatus || "Open";
};
