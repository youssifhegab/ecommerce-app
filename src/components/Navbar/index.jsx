'use client';
import React, { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ShoppingBag, User, Menu } from 'lucide-react';

import { GlobalContext } from '@/context/GlobalState';
import NavItems from './NavItems';
import CartModal from '../CartModal';
import { ThemeToggle } from '../ThemeToggle';
import { MainNav } from '../MainNav';
import { Button } from '../UIComponents/Button';
import { adminNavOptions, navOptions } from '@/utils';

const Navbar = () => {
  const { isAuthUser, setIsAuthUser, setUser, currentUpdatedProduct, setCurrentUpdatedProduct, setShowCartModal } =
    useContext(GlobalContext);

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathName !== '/admin-view/add-product' && currentUpdatedProduct !== null) setCurrentUpdatedProduct(null);
  }, [pathName]);

  function handleLogout() {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove('token');
    localStorage.clear();
    router.push('/');
  }

  const isAdminView = pathName.includes('admin-view');

  const accountOptions = () => [
    {
      id: 'settings',
      label: 'settings',
      path: '/account',
    },
    {
      id: 'adminView',
      label: 'admin view',
      path: '/admin-view',
      disable: isAdminView,
    },
    {
      id: 'clientView',
      label: 'client view',
      path: '/',
      disable: !isAdminView,
    },
    {
      id: 'login',
      label: 'Login',
      path: '/login',
      disable: isAuthUser,
    },
    {
      id: 'logout',
      label: 'Logout',
      disable: !isAuthUser,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full shadow-md bg-background">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex">
            <NavItems
              router={router}
              options={isAdminView ? adminNavOptions : navOptions}
              button={
                <Button size="sm" variant="ghost">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              }
            />
            <div onClick={() => router.push('/')} className="flex items-center cursor-pointer">
              <MainNav />
            </div>
          </div>
          <div className="flex md:order-2 gap-2 items-center">
            <ThemeToggle />
            {!isAuthUser && (
              <Button onClick={() => router.push('/login')}>
                <span className="font-bold">Login</span>
              </Button>
            )}
            {!isAdminView && isAuthUser ? (
              <>
                <Button onClick={() => setShowCartModal(true)} size="sm" variant="ghost">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="ml-2 text-sm font-bold">{cartItems?.length}</span>
                  <span className="sr-only">Cart</span>
                </Button>
              </>
            ) : null}
            {isAuthUser && (
              <NavItems
                router={router}
                options={accountOptions(isAdminView, isAuthUser)}
                button={
                  <Button size="sm" variant="ghost">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </nav>
      <CartModal />
    </>
  );
};

export default Navbar;
