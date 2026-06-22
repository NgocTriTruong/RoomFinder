import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Upload, FileCheck, AlertCircle, Clock, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import mediaService from '../../services/mediaService';
import { resolveMediaUrl } from '../../utils/mediaUrl';

type ImageField = 'frontIdCardUrl' | 'backIdCardUrl' | 'selfieUrl' | 'businessLicenseUrl';

export default function VerificationPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    frontIdCardUrl: '',
    backIdCardUrl: '',
    selfieUrl: '',
    businessLicenseUrl: ''
  });

  // Fetch fresh user data on mount to ensure we have the latest KYC status
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Pre-populate formData from current user if they have existing uploads
  useEffect(() => {
    if (user) {
      setFormData({
        frontIdCardUrl: user.frontIdCardUrl || '',
        backIdCardUrl: user.backIdCardUrl || '',
        selfieUrl: user.selfieUrl || '',
        businessLicenseUrl: user.businessLicenseUrl || ''
      });
    }
  }, [user]);

  // Refs for file inputs
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  const getStatusDisplay = () => {
    switch (user?.verificationStatus) {
      case 'PENDING':
        return {
          icon: <Clock className="w-12 h-12 text-blue-600" />,
          title: 'Đang chờ xét duyệt',
          description: 'Hồ sơ của bạn đã được gửi và đang được đội ngũ quản trị viên kiểm tra. Quá trình này thường mất 24-48 giờ.',
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      case 'APPROVED':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-600" />,
          title: 'Đã xác thực thành công',
          description: 'Tài khoản của bạn đã được xác thực chính thức. Bạn có thể tận hưởng đầy đủ các tính năng dành cho chủ trọ uy tín.',
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'REJECTED':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-600" />,
          title: 'Hồ sơ bị từ chối',
          description: 'Rất tiếc, hồ sơ xác thực của bạn không đạt yêu cầu. Vui lòng kiểm tra lại hình ảnh và gửi lại yêu cầu mới.',
          color: 'bg-red-50 border-red-200 text-red-800'
        };
      default:
        return null;
    }
  };

  const status = getStatusDisplay();

  const handleUploadClick = (field: ImageField) => {
    if (uploadingField) return;
    
    switch (field) {
      case 'frontIdCardUrl':
        frontInputRef.current?.click();
        break;
      case 'backIdCardUrl':
        backInputRef.current?.click();
        break;
      case 'selfieUrl':
        selfieInputRef.current?.click();
        break;
      case 'businessLicenseUrl':
        licenseInputRef.current?.click();
        break;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: ImageField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file dưới 10MB.');
      return;
    }

    try {
      setUploadingField(field);
      // Upload to server using USER_KYC category
      const response = await mediaService.uploadFile(file, 'USER_KYC');
      
      // Update form data with the returned URL
      setFormData(prev => ({ ...prev, [field]: response.fileUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Tải ảnh biểu lên thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingField(null);
      // Clear input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLandlord = user?.role === 'LANDLORD';
    const isMissingField = !formData.frontIdCardUrl || !formData.backIdCardUrl || !formData.selfieUrl || (isLandlord && !formData.businessLicenseUrl);
    
    if (isMissingField) {
      alert(isLandlord ? 'Vui lòng cung cấp đầy đủ hình ảnh CCCD và Giấy phép kinh doanh/Giấy chứng nhận sở hữu' : 'Vui lòng cung cấp đầy đủ hình ảnh yêu cầu');
      return;
    }

    try {
      setLoading(true);
      await userService.submitKYC(formData);
      alert('Gửi hồ sơ thành công! Vui lòng chờ quản trị viên phê duyệt.');
      setIsEditing(false); // Reset editing state on successful submit
      await refreshUser();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi gửi hồ sơ';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (status && !(user?.verificationStatus === 'REJECTED' && isEditing)) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
        {/* Status Header Block */}
        <div className={`p-8 text-center space-y-4 border rounded-2xl shadow-sm ${status.color}`}>
          <div className="flex justify-center">{status.icon}</div>
          <h2 className="text-2xl font-bold">{status.title}</h2>
          <p className="opacity-90 max-w-lg mx-auto leading-relaxed text-sm">{status.description}</p>
          
          {user?.verificationStatus === 'REJECTED' && user.adminNote && (
            <div className="mt-4 p-4 bg-white/40 rounded-xl border border-red-200/50 text-left text-red-950">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Lý do từ chối từ Admin:</p>
              <p className="text-sm italic">"{user.adminNote}"</p>
            </div>
          )}

          {user?.verificationStatus === 'REJECTED' && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm"
            >
              Gửi lại yêu cầu
            </button>
          )}
        </div>

        {/* Submitted Documents Review Section */}
        {(user?.frontIdCardUrl || user?.backIdCardUrl || user?.selfieUrl || user?.businessLicenseUrl) && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              {user?.role === 'LANDLORD' 
                ? 'Hình ảnh hồ sơ xác thực đã tải lên (CCCD & Giấy phép/Sở hữu)' 
                : 'Hình ảnh thẻ sinh viên/CCCD đã tải lên'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.frontIdCardUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {user?.role === 'LANDLORD' ? 'Mặt trước CCCD/CMND' : 'Mặt trước Thẻ sinh viên / CCCD'}
                  </span>
                  <div className="aspect-video rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <img 
                      src={resolveMediaUrl(user.frontIdCardUrl)} 
                      alt="Mặt trước CCCD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
              {user.backIdCardUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {user?.role === 'LANDLORD' ? 'Mặt sau CCCD/CMND' : 'Mặt sau Thẻ sinh viên / CCCD'}
                  </span>
                  <div className="aspect-video rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <img 
                      src={resolveMediaUrl(user.backIdCardUrl)} 
                      alt="Mặt sau CCCD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={`grid grid-cols-1 ${user?.role === 'LANDLORD' ? 'md:grid-cols-2' : 'max-w-md mx-auto w-full'} gap-6 mt-6`}>
              {user.selfieUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center">
                    {user?.role === 'LANDLORD' ? 'Ảnh chân dung cầm CCCD' : 'Ảnh chân dung cầm thẻ sinh viên / CCCD'}
                  </span>
                  <div className="aspect-video rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <img 
                      src={resolveMediaUrl(user.selfieUrl)} 
                      alt="Ảnh chân dung" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
              {user?.role === 'LANDLORD' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center">
                    Giấy phép kinh doanh / Chứng minh sở hữu
                  </span>
                  <div className="aspect-video rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    {user.businessLicenseUrl ? (
                      <img 
                        src={resolveMediaUrl(user.businessLicenseUrl)} 
                        alt="Giấy phép kinh doanh" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">Chưa tải lên giấy phép</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 px-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShieldCheck className="w-9 h-9 text-blue-600" />
          {user?.role === 'LANDLORD' ? 'Xác thực danh tính chủ trọ' : 'Xác thực tài khoản sinh viên'}
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          {user?.role === 'LANDLORD' 
            ? 'Để tăng tính minh bạch và uy tín, chúng tôi yêu cầu các chủ trọ xác thực thông tin cá nhân.' 
            : 'Để nâng cao tính an toàn và tin cậy cho cộng đồng, vui lòng tải ảnh thẻ sinh viên hoặc CCCD của bạn.'}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Lưu ý quan trọng:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>Hình ảnh phải rõ nét, không bị mờ hoặc lóa sáng (định dạng JPG, PNG).</li>
            <li>Thông tin trên giấy tờ phải khớp hoàn toàn với thông tin tài khoản.</li>
            <li>Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của bạn.</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hidden File Inputs */}
        <input type="file" ref={frontInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'frontIdCardUrl')} />
        <input type="file" ref={backInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'backIdCardUrl')} />
        <input type="file" ref={selfieInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'selfieUrl')} />
        <input type="file" ref={licenseInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'businessLicenseUrl')} />

        {/* Front ID Card */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">
            {user?.role === 'LANDLORD' ? 'Mặt trước CCCD/CMND' : 'Mặt trước Thẻ sinh viên / CCCD'}
          </label>
          <div 
            onClick={() => handleUploadClick('frontIdCardUrl')}
            className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              formData.frontIdCardUrl ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {uploadingField === 'frontIdCardUrl' ? (
              <div className="flex flex-col items-center text-blue-600">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span className="text-xs font-medium">Đang tải lên...</span>
              </div>
            ) : formData.frontIdCardUrl ? (
              <>
                <img src={resolveMediaUrl(formData.frontIdCardUrl) || ''} alt="Front ID" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">Thay đổi ảnh</span>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Bấm để tải ảnh lên</span>
              </>
            )}
          </div>
        </div>

        {/* Back ID Card */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">
            {user?.role === 'LANDLORD' ? 'Mặt sau CCCD/CMND' : 'Mặt sau Thẻ sinh viên / CCCD'}
          </label>
          <div 
            onClick={() => handleUploadClick('backIdCardUrl')}
            className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              formData.backIdCardUrl ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {uploadingField === 'backIdCardUrl' ? (
              <div className="flex flex-col items-center text-blue-600">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span className="text-xs font-medium">Đang tải lên...</span>
              </div>
            ) : formData.backIdCardUrl ? (
              <>
                <img src={resolveMediaUrl(formData.backIdCardUrl) || ''} alt="Back ID" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">Thay đổi ảnh</span>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Bấm để tải ảnh lên</span>
              </>
            )}
          </div>
        </div>

        {/* Selfie */}
        <div className={`${user?.role === 'LANDLORD' ? 'md:col-span-1' : 'md:col-span-2'} space-y-3`}>
          <label className="block text-sm font-bold text-gray-700 text-center">
            {user?.role === 'LANDLORD' ? 'Ảnh chân dung cầm CCCD' : 'Ảnh chân dung cầm thẻ sinh viên / CCCD'}
          </label>
          <div 
            onClick={() => handleUploadClick('selfieUrl')}
            className={`max-w-md mx-auto aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              formData.selfieUrl ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {uploadingField === 'selfieUrl' ? (
              <div className="flex flex-col items-center text-blue-600">
                <Loader2 className="w-12 h-12 animate-spin mb-2" />
                <span className="text-xs font-medium">Đang tải lên...</span>
              </div>
            ) : formData.selfieUrl ? (
              <>
                <img src={resolveMediaUrl(formData.selfieUrl) || ''} alt="Selfie" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">Thay đổi ảnh</span>
                </div>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Chụp hoặc tải ảnh chân dung</span>
              </>
            )}
          </div>
        </div>

        {/* Giấy phép kinh doanh / Chứng nhận sở hữu (chỉ dành cho Chủ trọ) */}
        {user?.role === 'LANDLORD' && (
          <div className="md:col-span-1 space-y-3">
            <label className="block text-sm font-bold text-gray-700 text-center">
              Giấy phép kinh doanh / Giấy chứng nhận sở hữu trọ
            </label>
            <div 
              onClick={() => handleUploadClick('businessLicenseUrl')}
              className={`max-w-md mx-auto aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                formData.businessLicenseUrl ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {uploadingField === 'businessLicenseUrl' ? (
                <div className="flex flex-col items-center text-blue-600">
                  <Loader2 className="w-12 h-12 animate-spin mb-2" />
                  <span className="text-xs font-medium">Đang tải lên...</span>
                </div>
              ) : formData.businessLicenseUrl ? (
                <>
                  <img src={resolveMediaUrl(formData.businessLicenseUrl) || ''} alt="Giấy phép kinh doanh" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">Thay đổi ảnh</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Bấm để tải ảnh giấy phép kinh doanh / sở hữu</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-center py-4">
          <button
            type="submit"
            disabled={loading || !!uploadingField}
            className="flex items-center gap-3 bg-blue-600 text-white px-12 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg font-bold text-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FileCheck className="w-6 h-6" />
                Gửi hồ sơ xác thực
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

