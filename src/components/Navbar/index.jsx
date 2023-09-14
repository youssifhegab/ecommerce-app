'use client';
import React, { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useMediaQuery } from 'react-responsive';
import { ShoppingBag, User, Menu } from 'lucide-react';

import { GlobalContext } from '@/context/GlobalState';
import NavItems from './NavItems';
import CartModal from '../CartModal';
import { ThemeToggle } from '../ThemeToggle';
import { MainNav } from '../MainNav';
import { Button } from '../UIComponents/Button';
import { accountOptions, adminNavOptions, navOptions } from '@/utils';

const Navbar = () => {
  const {
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    setShowCartModal,
    showCartModal,
  } = useContext(GlobalContext);

  const pathName = usePathname();
  const router = useRouter();

  const isMobile = useMediaQuery({
    query: `(max-width: 992px)`,
  });

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
            {!isMobile && (
              <>
                {user?.role === 'admin' ? (
                  isAdminView ? (
                    <Button onClick={() => router.push('/')}>
                      <span className="font-bold">Client View</span>
                    </Button>
                  ) : (
                    <Button onClick={() => router.push('/admin-view')}>
                      <span className="font-bold">Admin View</span>
                    </Button>
                  )
                ) : null}
                {isAuthUser ? (
                  <Button onClick={handleLogout}>
                    <span className="font-bold">Logout</span>
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/login')}>
                    <span className="font-bold">Login</span>
                  </Button>
                )}
              </>
            )}
            {!isAdminView && isAuthUser ? (
              <>
                <Button onClick={() => setShowCartModal(true)} size="sm" variant="ghost">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="ml-2 text-sm font-bold">0</span>
                  <span className="sr-only">Cart</span>
                </Button>
              </>
            ) : null}
            {isAuthUser && (
              <NavItems
                router={router}
                options={accountOptions(isAdminView)}
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
      {showCartModal && <CartModal />}
    </>
  );
};

export default Navbar;
