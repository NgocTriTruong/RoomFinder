import React, { useEffect, useState } from 'react';
import { Mic, X, AlertCircle } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onResult }: VoiceSearchModalProps) {
  const [status, setStatus] = useState<'listening' | 'processing' | 'error' | 'success'>('listening');
  const [errorMessage, setErrorMessage] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setStatus('error');
      setErrorMessage('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'vi-VN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setStatus('listening');
    };

    rec.onresult = (event: any) => {
      setStatus('processing');
      const speechToText = event.results[0][0].transcript;
      if (speechToText) {
        setStatus('success');
        setTimeout(() => {
          onResult(speechToText);
          onClose();
        }, 800);
      } else {
        setStatus('error');
        setErrorMessage('Không thể nhận diện giọng nói. Vui lòng thử lại.');
      }
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setStatus('error');
      if (event.error === 'not-allowed') {
        setErrorMessage('Vui lòng cấp quyền truy cập Micro để sử dụng tính năng này.');
      } else {
        setErrorMessage('Có lỗi xảy ra khi nhận diện giọng nói. Vui lòng thử lại.');
      }
    };

    rec.onend = () => {
      // Done
    };

    rec.start();
    setRecognition(rec);

    return () => {
      if (rec) {
        rec.abort();
      }
    };
  }, [isOpen, onResult, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative border border-gray-100 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Graphic */}
        <div className="flex justify-center py-4">
          {status === 'listening' && (
            <div className="relative">
              {/* Pulsing Outer Rings */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150"></div>
              <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-pulse scale-125"></div>
              
              {/* Inner Circle */}
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg relative border-4 border-white">
                <Mic className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-spin">
              <Mic className="w-10 h-10 text-white" />
            </div>
          )}

          {status === 'success' && (
            <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {status === 'error' && (
            <div className="w-24 h-24 bg-gradient-to-tr from-red-600 to-rose-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Text Guidelines */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            {status === 'listening' && 'Đang lắng nghe...'}
            {status === 'processing' && 'Đang xử lý giọng nói...'}
            {status === 'success' && 'Nhận diện thành công!'}
            {status === 'error' && 'Không thành công'}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {status === 'listening' && 'Hãy nói tên khu vực hoặc loại phòng bạn đang muốn tìm kiếm...'}
            {status === 'processing' && 'Vui lòng chờ trong giây lát...'}
            {status === 'success' && 'Đang chuyển hướng kết quả tìm kiếm...'}
            {status === 'error' && errorMessage}
          </p>
        </div>

        {/* Control Button for Error State */}
        {status === 'error' && (
          <button
            onClick={() => {
              setStatus('listening');
              setErrorMessage('');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
}
