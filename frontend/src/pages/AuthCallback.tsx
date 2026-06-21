import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // 1. Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('OAuth authentication error from Supabase:', error);
        navigate('/login', { replace: true });
        return;
      }

      // 2. Extract user info
      const userEmail = session.user?.email;
      const userFullName = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name || 'Social User';

      if (userEmail) {
        try {
          // 3. Send info to Spring Boot Backend
          await googleLogin(userEmail, userFullName);
          
          // 4. Redirect to home page
          navigate('/', { replace: true });
        } catch (err) {
          console.error('Backend authentication failed:', err);
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, googleLogin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 font-medium">Đang hoàn tất đăng nhập xã hội...</p>
    </div>
  );
}
