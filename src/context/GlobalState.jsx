'use client';

import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext(null);

const protectedRoutes = ['cart', 'checkout', 'account', 'orders', 'admin-view'];

const protectedAdminRoutes = ['/admin-view', '/admin-view/add-product', '/admin-view/all-products'];

export default function GlobalStateProvider({ children }) {
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: '',
  });
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (Cookies.get('token') !== undefined) {
      setIsAuthUser(true);
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      setUser(userData);
    } else {
      setIsAuthUser(false);
      setUser({}); //unauthenticated user
    }
  }, [Cookies]);

  useEffect(() => {
    if (
      pathName !== '/register' &&
      !pathName.includes('product') &&
      pathName !== '/' &&
      user &&
      Object.keys(user).length === 0 &&
      protectedRoutes.includes(pathName) > -1
    )
      router.push('/login');
  }, [user, pathName]);

  useEffect(() => {
    if (
      user !== null &&
      user &&
      Object.keys(user).length > 0 &&
      user?.role !== 'admin' &&
      protectedAdminRoutes.indexOf(pathName) > -1
    )
      router.push('/unauthorized-page');
  }, [user, pathName]);

  return (
    <GlobalContext.Provider
      value={{
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        showCartModal,
        setShowCartModal,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
