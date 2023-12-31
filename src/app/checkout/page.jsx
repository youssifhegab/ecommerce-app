'use client';

import Notification from '@/components/Notification';
import { Button } from '@/components/UIComponents/Button';
import { GlobalContext } from '@/context/GlobalState';
import { fetchAllAddresses } from '@/services/address';
import { createNewOrder } from '@/services/order';
import { callStripeSession } from '@/services/stripe';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { user, addresses, setAddresses } = useContext(GlobalContext);
  const [checkoutFormData, setCheckoutFormData] = useState({
    shippingAddress: {},
    paymentMethod: '',
    totalPrice: 0,
    isPaid: false,
    paidAt: new Date(),
    isProcessing: true,
  });

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const publishableKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const stripePromise = loadStripe(publishableKey);

  async function getAllAddresses() {
    const res = await fetchAllAddresses(user?._id);

    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem('stripe'));

      if (isStripe && params.get('status') === 'success' && cartItems && cartItems.length > 0) {
        setIsOrderProcessing(true);
        const getCheckoutFormData = JSON.parse(localStorage.getItem('checkoutFormData'));

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getCheckoutFormData.shippingAddress,
          orderItems: cartItems.map(item => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod: 'Stripe',
          totalPrice: cartItems.reduce((total, item) => item.productID.price + total, 0),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };

        const res = await createNewOrder(createFinalCheckoutFormData);

        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setIsOrderProcessing(false);
          setOrderSuccess(false);
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }

    createFinalOrder();
  }, [params.get('status'), cartItems]);

  function handleSelectedAddress(getAddress) {
    if (getAddress._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckoutFormData({
        ...checkoutFormData,
        shippingAddress: {},
      });

      return;
    }

    setSelectedAddress(getAddress._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: getAddress.fullName,
        city: getAddress.city,
        country: getAddress.country,
        postalCode: getAddress.postalCode,
        address: getAddress.address,
      },
    });
  }

  async function handleCheckout() {
    const stripe = await stripePromise;

    const createLineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount: item.productID.price * 100,
      },
      quantity: 1,
    }));

    const res = await callStripeSession(createLineItems);
    setIsOrderProcessing(true);
    localStorage.setItem('stripe', true);
    localStorage.setItem('checkoutFormData', JSON.stringify(checkoutFormData));

    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    console.log(error);
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        // setOrderSuccess(false);
        router.push('/orders');
      }, [2000]);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
            <div className="bg-background shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg">
                  Your payment is successful and you will be redirected to orders page in 2 seconds!
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader color={'#000000'} loading={isOrderProcessing} size={30} data-testid="loader" />
      </div>
    );
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col-reverse lg:px-32 px-6 mb-4">
        <div className="px-4 pt-8 w-full lg:w-1/2 gap-3 flex flex-col">
          <p className="font-medium text-xl">Cart Summary</p>
          <div className="mt-8rounded-lg border bg-background px-2 py-4 sm:px-5">
            {cartItems && cartItems.length ? (
              cartItems.map(item => (
                <div className="flex flex-col rounded-lg bg-background sm:flex-row" key={item._id}>
                  <img
                    src={item && item.productID && item.productID.imageUrl}
                    alt="Cart Item"
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-bold">{item && item.productID && item.productID.name}</span>
                    <span className="font-semibold">{item && item.productID && item.productID.price} EGP</span>
                  </div>
                </div>
              ))
            ) : (
              <div>Your cart is empty</div>
            )}
          </div>
          <div className="mt-6 border-t border-b py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Subtotal</p>
              <p className="text-lg font-bold">
                {cartItems && cartItems.length ? cartItems.reduce((total, item) => item.productID.price + total, 0) : '0'} EGP
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Shipping</p>
              <p className="text-lg font-bold">Free</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total</p>
              <p className="text-lg font-bold">
                {cartItems && cartItems.length ? cartItems.reduce((total, item) => item.productID.price + total, 0) : '0'} EGP
              </p>
            </div>
            <Button
              disabled={(cartItems && cartItems.length === 0) || Object.keys(checkoutFormData.shippingAddress).length === 0}
              onClick={handleCheckout}
              size="lg"
              className="bg-violet-600 text-white mt-2 w-full hover:bg-violet-800"
            >
              Checkout
            </Button>
          </div>
        </div>
        <div className="mt-10 px-4 pt-8 lg:mt-0 gap-2 flex flex-col w-full lg:w-1/2">
          <p className="text-xl font-medium">Shipping address details</p>
          <p className="font-bold">Complete your order by selecting address below</p>
          <div className="w-full mt-6 mr-0 mb-4 ml-0 space-y-6">
            {addresses && addresses.length ? (
              addresses.map(item => (
                <div
                  onClick={() => handleSelectedAddress(item)}
                  key={item._id}
                  className={`border p-6 gap-2 flex flex-col ${item._id === selectedAddress ? 'border-violet-600' : ''}`}
                >
                  <p>Name : {item.fullName}</p>
                  <p>Address : {item.address}</p>
                  <p>City : {item.city}</p>
                  <p>Country : {item.country}</p>
                  <p>PostalCode : {item.postalCode}</p>
                  <Button className={item._id === selectedAddress ? 'bg-violet-600 text-white hover:bg-violet-800' : null}>
                    {item._id === selectedAddress ? 'Selected Address' : 'Select Address'}
                  </Button>
                </div>
              ))
            ) : (
              <p>No addresses added</p>
            )}
          </div>
          <Button onClick={() => router.push('/account')}>Add new address</Button>
        </div>
      </div>
      <Notification />
    </>
  );
}
