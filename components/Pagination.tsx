import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  search: string;
  filterType: string;
};

export default function Pagination({ currentPage, totalPages, search, filterType }: Props) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filterType !== "all") params.set("type", filterType);
    params.set("page", page.toString());
    return `/patients?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Link
        href={getPageUrl(Math.max(1, currentPage - 1))}
        className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      <span className="px-4 py-2 text-emerald-800 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={getPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
}