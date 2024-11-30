import cn from '@/utils/cn';
import Sidebar from '@/layouts/sidebar/_retro-left';
import SidebarTwo from '@/layouts/sidebar/_retro-right';
import { RetroHeader } from '@/layouts/header/header';

export default function RetroLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  return (
    <>
      <RetroHeader className="ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-[320px] rtl:2xl:pr-[320px] ltr:3xl:pl-80 rtl:3xl:pr-80" />
      <Sidebar className="z-40 hidden xl:block" />
      <main
        className={cn(
          'min-h-[100vh] pb-16 pt-4 sm:pb-20 ltr:lg:pr-80 rtl:lg:pl-80 xl:pb-24 ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80 3xl:pt-0.5 ltr:3xl:pr-[350px] rtl:3xl:pl-[350px]',
          contentClassName,
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 3xl:px-10">{children}</div>
      </main>
      <SidebarTwo className="ltr:left-auto ltr:right-0 rtl:left-0 rtl:right-auto  xl:block" />
    </>
  );
}
