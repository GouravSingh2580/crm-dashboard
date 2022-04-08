import { ReactNode, useMemo, useState } from 'react';

export interface FilterItem<T extends any> {
  id: string;
  label: string;
  count?: number;
  data: T;
}

export interface QuickFilterState<T extends FilterItem<any>> {
  quickFilter: T | undefined;
  quickFilterId: string | undefined;
  setQuickFilterId: (id: string | undefined) => void;
}

export interface FilterProps<T extends FilterItem<any>>{
  items: T[];
  renderItem: (
    item: T,
  ) => ReactNode;
}

// eslint-disable-next-line max-len
export const createQuickFilterState = <T extends FilterItem<any>>(items: T[]) => (defaultId?: string): QuickFilterState<T> => {
  // const defaultQuickFilter = items.find((item) => item.id === defaultId);
  const [quickFilterId, setQuickFilterId] = useState<undefined | string>(defaultId);
  // eslint-disable-next-line max-len
  const quickFilter:T | undefined = useMemo(() => items.find((item) => item.id === quickFilterId), [quickFilterId]);
  return {
    quickFilter,
    quickFilterId,
    setQuickFilterId,
  };
};

// eslint-disable-next-line max-len
export const GenericQuickFilter = <T extends FilterItem<any>>({ items, renderItem }: FilterProps<T>) => (
  <>
    {
      items.map(renderItem)
    }
  </>
);
