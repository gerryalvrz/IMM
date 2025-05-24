
/* eslint-disable */

import Image from '@/components/ui/image';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import lightLogo from '@/assets/images/refmx.svg';
import darkLogo from '@/assets/images/refmx.svg';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();

  return (
    <div className="flex cursor-pointer outline-none" {...props}>
      <span className="relative flex overflow-hidden">
        {isMounted && isDarkMode && (
          <Image src={darkLogo} alt="Criptic" priority width={40} />
        )}
        {isMounted && !isDarkMode && (
          <Image src={lightLogo} alt="Criptic" priority width={40} />
        )}
      </span>
    </div>
  );
};

export default Logo;
