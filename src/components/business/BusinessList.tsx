import { useEffect, useState } from "react";
import { BusinessCard } from "./BusinessCard";
import { businessService, BusinessSearchParams, type Business } from "../../api/services/businessService";
import { BusinessSearch } from "./BusinessSearch";
import { Pagination } from "../ui/pagination";
import { Spinner } from "../ui/spinner";
import { Separator } from "../ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BusinessSearchParams>({});
  const limit = 8; // Số lượng doanh nghiệp trên mỗi trang

  useEffect(() => {
    fetchBusinesses();
  }, [currentPage, filters]);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit,
      };
      
      const response = await businessService.getAllBusinesses(params);
      setBusinesses(response.data);
      setTotalPages(Math.ceil(response.total / response.pageSize));
    } catch (error) {
      setError("Không thể tải danh sách doanh nghiệp. Vui lòng thử lại sau.");
      console.error("Lỗi khi lấy danh sách doanh nghiệp:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: BusinessSearchParams) => {
    setFilters(newFilters);
    setCurrentPage(1); // Quay lại trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-medium mb-4">Tìm kiếm doanh nghiệp</h2>
        <BusinessSearch onSearch={handleSearch} initialFilters={filters} />
      </div>

      <Separator />

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : businesses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Không tìm thấy doanh nghiệp nào phù hợp với tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}