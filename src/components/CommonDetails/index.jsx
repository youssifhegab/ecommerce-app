'use client';

import { GlobalContext } from '@/context/GlobalState';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import ComponentLevelLoader from '../Loader';
import { addToCart } from '@/services/cart';
import Notification from '../Notification';
import { Button } from '../UIComponents/Button';
import { getSizeName } from '@/lib/utils';

export default function CommonDetails({ item }) {
  const { setComponentLevelLoader, componentLevelLoader, user, setShowCartModal } = useContext(GlobalContext);
  console.log({ item });
  const [chosenSize, setChosenSize] = useState(item.sizes[0].id);

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: '' });

    const res = await addToCart({ productID: getItem._id, userID: user._id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      console.log({ res });
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

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-6 mt-4">
      <div className="flex px-52 w-full gap-36">
        <div className="h-f h-[32rem] flex flex-shrink-0">
          <img src={item.imageUrl} className="h-full w-full max-w-full object-cover rounded-md" alt="Product Details" />
        </div>
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 w-full">
          <h1 className="text-3xl font-bold tracking-tight">{item && item.name}</h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight">{item && item.price} EGP</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base">{item && item.description}</div>
          </div>

          <div className="mt-4">
            <p>
              Size: <strong>{getSizeName(chosenSize)}</strong>
            </p>
            {item?.sizes?.map(size => (
              <Button
                key={size.id}
                variant={chosenSize === size.id ? 'default' : 'outline'}
                onClick={() => setChosenSize(size.id)}
                className="mr-2 mt-4"
              >
                {getSizeName(size.id)}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => handleAddToCart(item)}
            type="button"
            className="w-full mt-6 bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={'Adding to Cart'}
                color={'#ffffff'}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
      <Notification />
    </section>
  );
}
