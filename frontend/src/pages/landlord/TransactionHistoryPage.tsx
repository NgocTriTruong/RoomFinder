import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import type { TransactionResponse } from '../../services/transactionService';
import { CheckCircle2, XCircle, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { getErrorMessage } from '../../services/api';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTransactions(true);
  }, []);

  const fetchTransactions = async (reset: boolean = false) => {
    const currentPage = reset ? 0 : page;
    
    if (!reset && !hasMore) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactions(currentPage, 20);
      if (reset) {
        setTransactions(data.content);
      } else {
        setTransactions(prev => [...prev, ...data.content]);
      }
      setHasMore(!data.last);
      setPage(currentPage + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: TransactionResponse['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return <CreditCard className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusBadge = (status: TransactionResponse['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Thành công
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Thất bại
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <CreditCard className="w-4 h-4 mr-1" />
            Đang xử lý
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Hoàn tiền
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: TransactionResponse['type']) => {
    switch (type) {
      case 'PACKAGE':
        return 'Mua gói dịch vụ';
      case 'BOOST':
        return 'Đẩy tin VIP';
      case 'POST':
        return 'Đăng tin';
      case 'REFUND':
        return 'Hoàn tiền';
      default:
        return type;
    }
  };

  const getPaymentMethodLabel = (method: TransactionResponse['paymentMethod']) => {
    switch (method) {
      case 'VNPAY':
        return 'VNPay';
      case 'MOMO':
        return 'Ví MoMo';
      case 'WALLET':
        return 'Ví trong app';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchTransactions(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h2>
        <p className="text-gray-600 mt-1">Theo dõi các giao dịch mua gói và đẩy tin của bạn</p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch nào</h3>
          <p className="text-gray-500">Các giao dịch của bạn sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã GD
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại dịch vụ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tháng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tx.transactionRef || tx.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{getTypeLabel(tx.type)}</div>
                        <div className="text-xs text-gray-400">
                          {getPaymentMethodLabel(tx.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tx.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchTransactions(false)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  'Tải thêm'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
