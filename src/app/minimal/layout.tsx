import MinimalLayout from '@/layouts/minimal/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MinimalLayout>{children}</MinimalLayout>;
}
