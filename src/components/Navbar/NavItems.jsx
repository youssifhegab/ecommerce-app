'use client';
import { adminNavOptions, navOptions } from '@/utils';

function NavItems({ isModalView = false, isAdminView, router }) {
  return (
    <div className={`w-full items-center justify-between md:flex md:w-auto ${isModalView ? '' : 'hidden'}`} id="nav-items">
      <ul
        className={`mt-4 flex flex-col rounded-lg bg-white p-4  font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 ${
          isModalView ? 'border-none' : 'border border-gray-100'
        }`}
      >
        {isAdminView
          ? adminNavOptions.map(item => (
              <li
                className="block cursor-pointer rounded py-2 pl-3 pr-4 text-gray-900 md:p-0"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))
          : navOptions.map(item => (
              <li
                className="block cursor-pointer rounded py-2 pl-3 pr-4 text-gray-900 md:p-0"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default NavItems;
