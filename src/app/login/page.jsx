'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import InputComponent from '@/components/FormElements/InputComponent';
import ComponentLevelLoader from '@/components/Loader';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context/GlobalState';
import { login } from '@/services/login';
import { Button } from '@/components/UIComponents/Button';

function Login() {
  const { register, handleSubmit } = useForm();
  const { isAuthUser, setIsAuthUser, setUser, componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);

  const router = useRouter();

  const handleLogin = async data => {
    setComponentLevelLoader({ loading: true, id: '' });
    const res = await login(data);

    if (res?.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsAuthUser(true);
      setUser(res?.finalData?.user);
      Cookies.set('token', res?.finalData?.token);
      localStorage.setItem('user', JSON.stringify(res?.finalData?.user));
    } else {
      toast.error(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsAuthUser(false);
    }
    setComponentLevelLoader({ loading: false, id: '' });
  };

  useEffect(() => {
    if (isAuthUser) router.push('/');
  }, [isAuthUser]);

  return (
    <div className="relative mb-8">
      <div className="flex flex-col items-center justify-between py-0 px-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mx-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start p-10 bg-background shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center">Login</p>
              <form onSubmit={handleSubmit(handleLogin)} className="w-full mt-6 mx-0 mb-0 relative space-y-8">
                <InputComponent type="email" placeholder="Enter your email" label="Email" register={{ ...register('email') }} />
                <InputComponent
                  type="password"
                  placeholder="Enter your password"
                  label="password"
                  register={{ ...register('password') }}
                />
                <Button type="submit" className="w-full">
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader text={'Logging In'} loading={componentLevelLoader && componentLevelLoader.loading} />
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
              <div className="flex flex-col gap-2 w-full mt-6">
                <p>New to website ?</p>
                <Button className="w-full" onClick={() => router.push('/register')}>
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Login;
