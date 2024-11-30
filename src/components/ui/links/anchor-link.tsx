import NextLink, { LinkProps } from 'next/link';

const AnchorLink: React.FC<
  LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ ...props }) => {
  return <NextLink {...props} />;
};

export default AnchorLink;
