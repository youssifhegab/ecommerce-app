'use client';
import * as Menubar from '@radix-ui/react-menubar';

function NavItems({ router, options, button }) {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>{button}</Menubar.Trigger>
        <Menubar.Portal className={`w-full items-center justify-between`} id="nav-items">
          <Menubar.Content className={`mt-4 flex flex-col rounded-lg bg-secondary p-4 shadow-lg font-medium`}>
            {options.map(
              item =>
                !item.disable && (
                  <Menubar.Item
                    className="block cursor-pointer rounded py-2 pl-3 pr-4 font-bold"
                    key={item.id}
                    onClick={() => (item.onClick ? item.onClick() : router.push(item.path))}
                  >
                    {item.label}
                  </Menubar.Item>
                ),
            )}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

export default NavItems;
