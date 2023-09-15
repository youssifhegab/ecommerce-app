'use client';

import ComponentLevelLoader from '@/components/Loader';
import { Button } from '@/components/UIComponents/Button';
import { GlobalContext } from '@/context/GlobalState';
import { addToCart } from '@/services/cart';
import { deleteAProduct } from '@/services/product';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'react-toastify';

export default function ProductButton({ item }) {
  const pathName = usePathname();
  const { setCurrentUpdatedProduct, setComponentLevelLoader, componentLevelLoader, user, setShowCartModal } =
    useContext(GlobalContext);
  const router = useRouter();

  const isAdminView = pathName.includes('admin-view');

  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id });

    const res = await deleteAProduct(item._id);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
    }
  }

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });

    const res = await addToCart({ productID: getItem._id, userID: user._id });
    console.log({ res });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      localStorage.setItem('cartItems', JSON.stringify(res.cartProducts));
      setShowCartModal(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      setShowCartModal(true);
    }
  }

  return isAdminView ? (
    <>
      <Button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push('/admin-view/add-product');
        }}
        type="button"
        className="w-full bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        Update
      </Button>
      <Button
        onClick={() => handleDeleteProduct(item)}
        type="button"
        className="w-full bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {componentLevelLoader && componentLevelLoader.loading && item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={'Deleting Product'}
            color={'#ffffff'}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          'DELETE'
        )}
      </Button>
    </>
  ) : (
    <>
      <Button
        onClick={() => handleAddToCart(item)}
        type="button"
        className="w-full bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={'Adding to cart'}
            color={'#ffffff'}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          'Add To Cart'
        )}
      </Button>
    </>
  );
}
