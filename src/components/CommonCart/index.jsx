'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import ComponentLevelLoader from '../Loader';
import { Button } from '../UIComponents/Button';

export default function CommonCart({ handleDeleteCartItem, componentLevelLoader }) {
  const router = useRouter();
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  return (
    <section className="mb-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="bg-background shadow">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {cartItems && cartItems.length ? (
                  <ul className="-my-8">
                    {cartItems.map(cartItem => (
                      <li className="flex py-6 text-left gap-2 flex-row" key={cartItem.id}>
                        <div className="h-24 w-24 flex flex-shrink-0">
                          <img
                            src={cartItem && cartItem.productID && cartItem.productID.imageUrl}
                            alt="Product image"
                            className="h-full w-full rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex flex-1 justify-between">
                          <div className="pr-8 sm:pr-4 flex flex-col gap-1">
                            <p className="text-base font-bold">{cartItem && cartItem.productID && cartItem.productID.name}</p>
                            <p className="shrink-0 w-20 text-base font-semibold">
                              {cartItem && cartItem.productID && cartItem.productID.price} EGP
                            </p>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteCartItem(cartItem._id)}>
                            {componentLevelLoader &&
                            componentLevelLoader.loading &&
                            componentLevelLoader.id === cartItem._id ? (
                              <ComponentLevelLoader
                                text={'Removing'}
                                loading={componentLevelLoader && componentLevelLoader.loading}
                              />
                            ) : (
                              <X />
                            )}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h1 className="font-bold text-lg">Your cart is Empty !</h1>
                )}
              </div>
              <div className="mt-6 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Subtotal</p>
                  <p className="text-lg font-semibold">
                    {cartItems && cartItems.length ? cartItems.reduce((total, item) => item.productID.price + total, 0) : '0'}
                    EGP
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Shipping</p>
                  <p className="text-lg font-semibold">0 EGP</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Total</p>
                  <p className="text-lg font-semibold">
                    {cartItems && cartItems.length ? cartItems.reduce((total, item) => item.productID.price + total, 0) : '0'}
                    EGP
                  </p>
                </div>
                <div className="mt-5 text-center w-full flex">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/checkout')}
                    disabled={cartItems && cartItems.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
