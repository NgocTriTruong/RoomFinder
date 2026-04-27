import React, { useCallback, useEffect, useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { transactionService, TransactionResponse } from '@/services/transactionService';
import { getErrorMessage } from '@/services/api';
import { PaginatedData } from '@/types';

const PAGE_SIZE = 10;

export default function TransactionManagementPage() {
  const [pageData, setPageData] = useState<PaginatedData<TransactionResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Current API returns all, we do client-side pagination in service
      const data = await transactionService.getAllTransactionsForAdmin(page, PAGE_SIZE);
      
      // Filter by status if not ALL
      if (statusFilter !== 'ALL') {
        // Since the service does pagination, if we filter here we might get fewer items than PAGE_SIZE
        // For 20 items it's fine. In a real large app, the API should handle filtering.
        const allData = await transactionService.getAllTransactionsForAdmin(0, 1000);
        const filtered = allData.content.filter(t => t.status === statusFilter);
        const start = page * PAGE_SIZE;
        const pagedFiltered = filtered.slice(start, start + PAGE_SIZE);
        
        setPageData({
          ...allData,
          content: pagedFiltered,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / PAGE_SIZE),
          number: page
        });
      } else {
        setPageData(data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            Thành công
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <XCircle className="w-3 h-3" />
            Thất bại
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Chờ xử lý
          </span>
        );
    }
  };

  const transactions = pageData?.content ?? [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = pageData?.totalPages ?? 0;
  const startItem = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min(totalElements, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý Giao dịch</h2>
          <p className="text-gray-500 font-medium mt-1">Theo dõi và quản lý toàn bộ luồng tiền trên hệ thống</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, dịch vụ..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 py-2 pr-10"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
            <option value="PENDING">Chờ xử lý</option>
          </select>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Toàn thời gian</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Lỗi hệ thống</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-6 py-5">Thông tin dịch vụ</th>
                <th className="px-6 py-5">Mã giao dịch</th>
                <th className="px-6 py-5">Thời gian</th>
                <th className="px-6 py-5">Số tiền</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="text-sm font-medium tracking-wide">Đang tải dữ liệu giao dịch...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="text-gray-400 italic">Không tìm thấy giao dịch nào phù hợp.</div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                          tx.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 
                          tx.status === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{tx.serviceName}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black mt-0.5">{tx.paymentMethod}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-500">#{tx.transactionRef}</code>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 font-medium">{formatDate(tx.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900 text-base">{formatCurrency(tx.amount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {getStatusBadge(tx.status)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-5 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Hiển thị <span className="text-gray-900 font-bold">{startItem}</span> - <span className="text-gray-900 font-bold">{endItem}</span> trên tổng <span className="text-gray-900 font-bold">{totalElements}</span> giao dịch
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === i 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
