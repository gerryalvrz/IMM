'use client';

import { Fragment } from 'react';
import Logo from '@/components/ui/logo';
import Button from '@/components/ui/button';
import ActiveLink from '@/components/ui/links/active-link';
import { Close } from '@/components/icons/close';
import { useDrawer } from '@/components/drawer-views/context';
import { ChevronDown } from '@/components/icons/chevron-down';
import { MenuItem } from '@/components/ui/collapsible-menu';
import {
  MinimalMenuItems,
  defaultMenuItems,
} from '@/layouts/sidebar/_menu-items';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { ChevronRight } from '@/components/icons/chevron-right';
import WalletConnect from '@/components/nft/wallet-connect';

const layoutOption = '';
const minimalMenuItems = MinimalMenuItems.map((item) => ({
  name: item.name,
  icon: item.icon,
  href: '/' + LAYOUT_OPTIONS.MINIMAL + (item.href === '/' ? '' : item.href),
  ...(item.dropdownItems && {
    dropdownItems: item?.dropdownItems?.map((dropdownItem: any) => ({
      name: dropdownItem.name,
      ...(dropdownItem?.icon && { icon: dropdownItem.icon }),
      href:
        dropdownItem.name === 'Authentication'
          ? layoutOption + dropdownItem.href
          : '/' + LAYOUT_OPTIONS.MINIMAL + dropdownItem.href,
      ...(item.dropdownItems && {
        dropdownItems: dropdownItem?.dropdownItems?.map((subItem: any) => ({
          name: subItem.name,
          ...(subItem?.icon && { icon: subItem.icon }),
          href:
            dropdownItem.name === 'Authentication'
              ? layoutOption + subItem.href
              : '/' + LAYOUT_OPTIONS.MINIMAL + subItem.href,
        })),
      }),
    })),
  }),
}));

export function MenuItems() {
  return (
    <div className="flex items-center xl:px-9 2xl:px-14 3xl:px-16">
      <ul className="relative flex items-center gap-4 2xl:gap-6">
        {minimalMenuItems.map((item, index) => (
          <Fragment key={'layout' + item.name + index}>
            {item.dropdownItems ? (
              <>
                <li className="group/parent relative">
                  <a
                    href="#"
                    className="flex items-center text-sm font-medium uppercase text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {item.name}
                    <span className="z-[1] transition-transform duration-200 ltr:ml-3 rtl:mr-3">
                      <ChevronDown />
                    </span>
                  </a>
                  <ul className="invisible absolute right-0 top-[130%] mt-2 w-64 rounded-lg bg-white p-3 opacity-0 shadow-large transition-all group-hover/parent:visible group-hover/parent:top-full group-hover/parent:opacity-100 dark:bg-gray-800 ltr:right-0 rtl:left-0">
                    {item.dropdownItems.map((dropDownItem, index) => (
                      <li
                        className="group relative"
                        key={dropDownItem.name + index}
                      >
                        {dropDownItem.dropdownItems ? (
                          <>
                            <a
                              href="#"
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white"
                            >
                              {dropDownItem.name}
                              <span className="z-[1] -mt-1 transition-transform duration-200 ltr:ml-3 rtl:mr-3">
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </a>
                            <ul className="invisible absolute left-[107%] right-0 top-[130%] w-64 rounded-lg bg-white p-3 opacity-0 shadow-large transition-all group-hover:visible group-hover/parent:top-0 group-hover:opacity-100 dark:bg-gray-800 ltr:right-0 rtl:left-0">
                              {dropDownItem.dropdownItems.map(
                                (subMenu: any, index: string) => (
                                  <li key={subMenu.name + index}>
                                    <ActiveLink
                                      href={subMenu.href}
                                      className="block rounded-lg px-3 py-2 text-sm font-medium uppercase !text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:!text-white dark:hover:bg-gray-700/50"
                                      activeClassName="!bg-gray-100 dark:!bg-gray-700 my-1 last:mb-0 first:mt-0 !text-gray-900 dark:!text-white"
                                    >
                                      {subMenu.name}
                                    </ActiveLink>
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        ) : (
                          <ActiveLink
                            href={dropDownItem.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium uppercase !text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:!text-white dark:hover:bg-gray-700/50"
                            activeClassName="!bg-gray-100 dark:!bg-gray-700 my-1 last:mb-0 first:mt-0 !text-gray-900 dark:!text-white"
                          >
                            {dropDownItem.name}
                          </ActiveLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              </>
            ) : (
              <li>
                <ActiveLink
                  href={item.href}
                  className="mx-2 text-[13px] font-medium uppercase text-gray-600 transition first:ml-0 last:mr-0 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 2xl:mx-3 2xl:text-sm 3xl:mx-4"
                  activeClassName="!text-gray-900 dark:!text-white"
                >
                  {item.name}
                </ActiveLink>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

// export function MenuItemsOthers() {
//   return (
//     <>
//       {otherPagesMenuItems.map((item, index) => (
//         <Fragment key={'layout' + item.name + index}>
//           {item.dropdownItems ? (
//             <div className="relative mx-4 first:ml-0 last:mr-0">
//               <Menu>
//                 <Menu.Button className="flex items-center text-sm font-medium uppercase text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
//                   {item.name}
//                   <span className="z-[1] transition-transform duration-200 ltr:ml-3 rtl:mr-3">
//                     <ChevronDown />
//                   </span>
//                 </Menu.Button>
//                 <Transition
//                   as={Fragment}
//                   enter="ease-out duration-300"
//                   enterFrom="opacity-0 translate-y-4"
//                   enterTo="opacity-100 translate-y-0"
//                   leave="ease-in duration-300"
//                   leaveFrom="opacity-100 translate-y-0"
//                   leaveTo="opacity-0 translate-y-4"
//                 >
//                   <Menu.Items className="absolute mt-5 w-64 origin-top-right rounded-lg bg-white p-3 shadow-large ltr:right-0 rtl:left-0 dark:bg-gray-800">
//                     {item.dropdownItems.map((dropDownItem, index) => (
//                       <Menu.Item key={dropDownItem.name + index}>
//                         <div>
//                           <ActiveLink
//                             href={dropDownItem.href}
//                             className="block rounded-lg px-3 py-2 text-sm font-medium uppercase !text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:!text-white dark:hover:bg-gray-700/50"
//                             activeClassName="!bg-gray-100 dark:!bg-gray-700 my-1 last:mb-0 first:mt-0 !text-gray-900 dark:!text-white"
//                           >
//                             {dropDownItem.name}
//                           </ActiveLink>
//                         </div>
//                       </Menu.Item>
//                     ))}
//                   </Menu.Items>
//                 </Transition>
//               </Menu>
//             </div>
//           ) : (
//             <ActiveLink
//               href={item.href}
//               className="mx-2 text-[13px] font-medium uppercase text-gray-600 transition first:ml-0 last:mr-0 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 2xl:mx-3 2xl:text-sm 3xl:mx-4"
//               activeClassName="!text-gray-900 dark:!text-white"
//             >
//               {item.name}
//             </ActiveLink>
//           )}
//         </Fragment>
//       ))}
//     </>
//   );
// }

interface DrawerMenuProps {
  layoutOption?: string;
  menuItems?: any[];
}

export default function DrawerMenu({
  layoutOption = `/${LAYOUT_OPTIONS.MINIMAL}`,
  menuItems = defaultMenuItems,
}: DrawerMenuProps) {
  const { closeDrawer } = useDrawer();
  const drawerMenuItems = menuItems.map((item) => ({
    name: item.name,
    icon: item.icon,
    href: layoutOption + (item.href === '/' ? '' : item.href),
    ...(item.dropdownItems && {
      dropdownItems: item?.dropdownItems?.map((dropdownItem: any) => ({
        name: dropdownItem.name,
        ...(dropdownItem?.icon && { icon: dropdownItem.icon }),
        href: layoutOption + dropdownItem.href,
      })),
    }),
  }));
  return (
    <div className="relative w-full max-w-full bg-white dark:bg-dark xs:w-80">
      <div className="flex h-24 items-center justify-between overflow-hidden px-6 py-4">
        <Logo />
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>
      <div className="custom-scrollbar h-[calc(100%-180px)] overflow-hidden overflow-y-auto">
        <div className="px-6 pb-14 2xl:px-8">
          <div className="mt-2 sm:mt-4">
            {drawerMenuItems?.map((item, index) => (
              <MenuItem
                key={'drawer' + item.name + index}
                name={item.name}
                href={item.href}
                icon={item.icon}
                dropdownItems={item.dropdownItems}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-0 z-10 w-full px-6">
        <WalletConnect anchorClassName="w-full" btnClassName="!w-full !h-11" />
      </div>
    </div>
  );
}
