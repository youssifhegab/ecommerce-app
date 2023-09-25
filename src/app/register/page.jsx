'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import InputComponent from '@/components/FormElements/InputComponent';
import ComponentLevelLoader from '@/components/Loader';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context/GlobalState';
import { registerNewUser } from '@/services/register';
import { Button } from '@/components/UIComponents/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UIComponents/Select';

export default function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { componentLevelLoader, setComponentLevelLoader, isAuthUser } = useContext(GlobalContext);

  const { register, handleSubmit, setValue } = useForm();

  const router = useRouter();

  const handleRegisterOnSubmit = async data => {
    setComponentLevelLoader({ loading: true, id: '' });
    const res = await registerNewUser(data);

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsRegistered(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setComponentLevelLoader({ loading: false, id: '' });
  };

  useEffect(() => {
    if (isAuthUser) router.push('/');
  }, [isAuthUser]);

  return (
    <div className="relative mb-8">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-background shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                {isRegistered ? 'Registration Successfull !' : 'Sign up for an account'}
              </p>
              {isRegistered ? (
                <button
                  className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                "
                  onClick={() => router.push('/login')}
                >
                  Login
                </button>
              ) : (
                <form onSubmit={handleSubmit(handleRegisterOnSubmit)} className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  <InputComponent placeholder="Enter your name" label="Name" register={{ ...register('name') }} />
                  <InputComponent
                    type="email"
                    placeholder="Enter your email"
                    label="Email"
                    register={{ ...register('email') }}
                  />
                  <InputComponent
                    type="password"
                    placeholder="Enter your password"
                    label="Password"
                    register={{ ...register('password') }}
                  />
                  <Select onValueChange={e => setValue('role', e)}>
                    <SelectTrigger>
                      <SelectValue {...register('role')} placeholder="Select a Role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full">
                    {componentLevelLoader && componentLevelLoader.loading ? (
                      <ComponentLevelLoader text={'Registering'} loading={componentLevelLoader} />
                    ) : (
                      'Register'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
