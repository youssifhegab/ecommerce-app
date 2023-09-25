'use client';

import { useContext } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

import SlideOver from '../CommonModal';
import { GlobalContext } from '@/context/GlobalState';
import { deleteFromCart } from '@/services/cart';
import ComponentLevelLoader from '../Loader';
import { useRouter } from 'next/navigation';
import { Button } from '../UIComponents/Button';

export default function CartModal() {
  const { showCartModal, setShowCartModal, setComponentLevelLoader, componentLevelLoader, user } = useContext(GlobalContext);
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const router = useRouter();

  async function handleDeleteCartItem(getCartItemID) {
    setComponentLevelLoader({ loading: true, id: getCartItemID });
    const res = await deleteFromCart(getCartItemID, user._id);

    if (res?.success) {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.success(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      localStorage.setItem('cartItems', JSON.stringify(res.cartProducts));
    } else {
      toast.error(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: getCartItemID });
    }
  }

  return (
    <SlideOver open={showCartModal} setOpen={setShowCartModal}>
      <div className="bg-background flex flex-col-reverse justify-between h-full p-4">
        <div className="flex flex-col gap-3 items-center">
          <Button
            className="w-full"
            onClick={() => {
              router.push('/cart');
              setShowCartModal(false);
            }}
          >
            Go To Cart
          </Button>
          <Button
            className="w-full"
            disabled={cartItems && cartItems.length === 0}
            onClick={() => {
              router.push('/checkout');
              setShowCartModal(false);
            }}
          >
            Checkout
          </Button>
          <Button type="button" variant="ghost" className="gap-1 flex w-fit" onClick={() => setShowCartModal(false)}>
            Continue Shopping
            <span> &rarr;</span>
          </Button>
        </div>
        {!!cartItems && !!cartItems.length && (
          <ul role="list" className="-my-6 divide-y divide-gray-300">
            {cartItems.map(cartItem => (
              <li key={cartItem.id} className="flex py-6 justify-between">
                <div className="flex gap-2">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                    <img
                      src={cartItem && cartItem.productID && cartItem.productID.imageUrl}
                      alt="Cart Item"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-bold">
                      <h3>
                        <a>{cartItem && cartItem.productID && cartItem.productID.name}</a>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm">{cartItem && cartItem.productID && cartItem.productID.price} EGP</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteCartItem(cartItem._id)}>
                  {componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === cartItem._id ? (
                    <ComponentLevelLoader text={'Removing'} loading={componentLevelLoader && componentLevelLoader.loading} />
                  ) : (
                    <X />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SlideOver>
  );
}
