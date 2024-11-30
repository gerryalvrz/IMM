import ClassicLayout from '@/layouts/classic/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClassicLayout>{children}</ClassicLayout>;
}
