'use client';

import { useRouter } from 'next/navigation';
import ProductButton from './ProductButtons';
import ProductTile from './ProductTile';
import { useEffect } from 'react';
import Notification from '../Notification';

export default function CommonListing({ data }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <section className="py-4 sm:py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-4">
          {data && data.length
            ? data.map(item => (
                <article className="relative flex flex-col overflow-hidden cursor-pointer" key={item._id}>
                  <ProductTile item={item} />
                  <ProductButton item={item} />
                </article>
              ))
            : null}
        </div>
      </div>
      <Notification />
    </section>
  );
}
