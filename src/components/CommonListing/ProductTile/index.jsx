'use client';

import { useRouter } from 'next/navigation';

export default function ProductTile({ item }) {
  const router = useRouter();

  return (
    <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0" onClick={() => router.push(`/product/${item._id}`)}>
      <div className="w-full overflow-hidden sm:h-80 h-60 rounded-lg group-hover:opacity-75 dark:border-gray-800">
        <img src={item.imageUrl} alt={'product image'} className="h-full w-full object-cover" />
      </div>
      <h3 className="mt-4 font-medium">{item.name}</h3>
      <p className="my-2 font-medium">{`${item.price} EGP`}</p>
    </div>
  );
}
