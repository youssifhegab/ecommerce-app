'use client';
import React, { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { GlobalContext } from '@/context';
import NavItems from './NavItems';
import CommonModal from '../CommonModal';
// import CartModal from '../CartModal';

const Navbar = () => {
  const {
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    setShowCartModal,
    showNavModal,
    // showCartModal,
    setShowNavModal,
  } = useContext(GlobalContext);

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
  return (
    <>
      <nav className="bg-white sticky w-full z-20 top-0 left-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div onClick={() => router.push('/')} className="flex items-center cursor-pointer">
            <span className="slef-center text-2xl font-semibold whitespace-nowrap">Ecommercery</span>
          </div>
          <div className="flex md:order-2 gap-2">
            {!isAdminView && isAuthUser ? (
              <>
                <button
                  className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
                  onClick={() => router.push('/account')}
                >
                  Account
                </button>
                <button
                  className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
                  onClick={() => setShowCartModal(true)}
                >
                  Cart
                </button>
              </>
            ) : null}
            {user?.role === 'admin' ? (
              isAdminView ? (
                <button
                  className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
                  onClick={() => router.push('/')}
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={() => router.push('/admin-view')}
                  className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
                >
                  Admin View
                </button>
              )
            ) : null}
            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className={'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white'}
              >
                Login
              </button>
            )}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={() => setShowNavModal(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <NavItems router={router} isAdminView={isAdminView} />
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        mainContent={<NavItems router={router} isModalView={true} isAdminView={isAdminView} />}
        show={showNavModal}
        setShow={setShowNavModal}
      />
      {/* {showCartModal && <CartModal />} */}
    </>
  );
};

export default Navbar;
