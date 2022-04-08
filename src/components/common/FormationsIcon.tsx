import { ReactComponent as Incorporated } from 'icons/incorporated.svg';
import { ReactComponent as NotIncorporated } from 'icons/not-incorporated.svg';
import { ReactComponent as LLC } from 'icons/llc.svg';
import { ReactComponent as CCorp } from 'icons/c-corp.svg';
import { ReactComponent as SCorp } from 'icons/s-corp.svg';
import { ReactComponent as Chair } from 'icons/chair.svg';
import { ReactComponent as PiggyBank } from 'icons/piggy-bank.svg';
import { ReactComponent as HealthSavings } from 'icons/first-aid.svg';
import { ReactComponent as NoBefinits } from 'icons/no-benefits.svg';
import { ReactComponent as Health } from 'icons/medkit.svg';
import { ReactComponent as Dental } from 'icons/tooth.svg';
import { ReactComponent as Vision } from 'icons/eye.svg';
import { ReactComponent as Partner } from 'icons/partner.svg';
import { useMediaBreakpoints } from 'hooks';

type TProps = {
  name: string;
  size?: number;
};

export const FormationsIcon = ({ name, size }: TProps) => {
  const { isDesktop } = useMediaBreakpoints();
  const dimension = size || (isDesktop ? 96 : 72);
  switch (name) {
    case 'incorporated':
      return <Incorporated width={dimension} height={dimension} />;
    case 'not-incorporated':
      return <NotIncorporated width={dimension} height={dimension} />;
    case 'llc':
      return <LLC width={dimension} height={dimension} />;
    case 'c-corp':
      return <CCorp width={dimension} height={dimension} />;
    case 's-corp':
      return <SCorp width={dimension} height={dimension} />;
    case 'chair':
      return <Chair width={dimension} height={dimension} />;
    case 'piggyBank':
      return <PiggyBank width={dimension} height={dimension} />;
    case 'healthSavings':
      return <HealthSavings width={dimension} height={dimension} />;
    case 'noBenefits':
      return <NoBefinits width={dimension} height={dimension} />;
    case 'health':
      return <Health width={dimension} height={dimension} />;
    case 'dental':
      return <Dental width={dimension} height={dimension} />;
    case 'vision':
      return <Vision width={dimension} height={dimension} />;
    case 'partner':
      return <Partner width={dimension} height={dimension} />;
    default:
      return null;
  }
};
