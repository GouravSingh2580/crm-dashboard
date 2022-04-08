import { ReactNode } from 'react';

export type IconStatusType = 'green' | 'yellow' | 'red';

export interface IHealthStatus {
  status: IconStatusType;
  title: string;
  description: string;
  showTooltip?: boolean;
  tooltipNode?: ReactNode;
}
