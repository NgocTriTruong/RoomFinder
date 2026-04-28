import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import systemService, { SystemSetting } from '../../services/systemService';
import { getErrorMessage } from '../../services/api';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await systemService.getSettings();
      setSettings(data);
      
      // Initialize form data
      const initialForm: Record<string, string> = {};
      data.forEach(s => {
        initialForm[s.key] = s.value;
      });
      setFormData(initialForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      await systemService.updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Group settings by group name
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'general': return <Globe className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'notifications': return <Bell className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getGroupTitle = (group: string) => {
    switch (group) {
      case 'general': return 'Cấu hình chung';
      case 'security': return 'Bảo mật & Xác thực';
      case 'notifications': return 'Thông báo & Email';
      default: return group.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thiết lập hệ thống</h1>
          <p className="text-gray-500 mt-1">Quản lý các thông số vận hành và cấu hình kỹ thuật của nền tảng</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu cấu hình
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-bold">Cấu hình hệ thống đã được cập nhật thành công!</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          {Object.keys(groupedSettings).map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-all ${
                activeGroup === group 
                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-lg shadow-sm border ${
                activeGroup === group ? 'bg-white border-blue-200' : 'bg-white border-gray-100'
              }`}>
                {getGroupIcon(group)}
              </div>
              {getGroupTitle(group)}
            </button>
          ))}
          
          <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Lưu ý quan trọng</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Các thay đổi trong phần thiết lập hệ thống có thể ảnh hưởng ngay lập tức đến toàn bộ người dùng đang truy cập.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="text-blue-600">{getGroupIcon(activeGroup)}</div>
              <h3 className="font-bold text-gray-900">{getGroupTitle(activeGroup)}</h3>
            </div>
            <div className="p-6 space-y-5">
              {groupedSettings[activeGroup]?.map((setting) => (
                <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700">{setting.description}</label>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">{setting.key}</span>
                  </div>
                  <div className="w-full sm:w-2/3">
                    {setting.type === 'checkbox' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData[setting.key] === 'true'} 
                          onChange={(e) => handleFieldChange(setting.key, e.target.checked.toString())}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <input
                        type={setting.type}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleFieldChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
              <Database className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-900">Vùng nguy hiểm</h3>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Làm mới hệ thống</p>
                <p className="text-xs text-gray-500 mt-1">Khởi động lại các tham số cấu hình về mặc định</p>
              </div>
              <button className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
                Thực hiện
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
