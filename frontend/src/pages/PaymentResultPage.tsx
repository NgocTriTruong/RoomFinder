import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { transactionService } from '@/services/transactionService';
import type { TransactionResponse } from '@/services/transactionService';
import { getErrorMessage } from '@/services/api';

type ResultState = 'loading' | 'success' | 'failed' | 'error';

export default function PaymentResultPage() {
  const location = useLocation();
  const [result, setResult] = useState<ResultState>('loading');
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const responseCode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('vnp_ResponseCode');
  }, [location.search]);

  useEffect(() => {
    let mounted = true;

    const resolvePayment = async () => {
      if (!location.search) {
        if (mounted) {
          setResult('error');
          setError('Khong tim thay thong tin thanh toan tu VNPay.');
        }
        return;
      }

      try {
        const payment = await transactionService.processVnpayReturn(location.search);
        if (!mounted) {
          return;
        }
        setTransaction(payment);
        setResult(payment.status === 'SUCCESS' ? 'success' : 'failed');
      } catch (err) {
        if (!mounted) {
          return;
        }
        setResult('error');
        setError(getErrorMessage(err));
      }
    };

    resolvePayment();
    return () => {
      mounted = false;
    };
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {result === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Dang xac nhan thanh toan</h1>
            <p className="mt-2 text-gray-600">He thong dang doi chieu ket qua tu VNPay.</p>
          </div>
        )}

        {result === 'success' && transaction && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Thanh toan thanh cong</h1>
            <p className="mt-2 text-gray-600">Giao dich cua ban da duoc ghi nhan thanh cong tren he thong.</p>
            <div className="mt-6 text-left bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-700"><strong>Ma giao dich:</strong> {transaction.transactionRef}</p>
              <p className="text-sm text-gray-700"><strong>So tien:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.amount)}</p>
              <p className="text-sm text-gray-700"><strong>Phuong thuc:</strong> VNPay</p>
            </div>
          </div>
        )}

        {result === 'failed' && (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Thanh toan chua thanh cong</h1>
            <p className="mt-2 text-gray-600">
              {responseCode ? `VNPay tra ve ma phan hoi ${responseCode}.` : 'Giao dich khong duoc hoan tat.'}
            </p>
          </div>
        )}

        {result === 'error' && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Khong the xac minh thanh toan</h1>
            <p className="mt-2 text-gray-600">{error || 'Da xay ra loi khong mong muon.'}</p>
          </div>
        )}

        {result !== 'loading' && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/landlord/transactions"
              className="flex-1 text-center px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem lich su giao dich
            </Link>
            <Link
              to="/landlord/packages"
              className="flex-1 text-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Quay lai mua goi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
