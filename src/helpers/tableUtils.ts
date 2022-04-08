// @ts-ignore
import tmpl from 'tmpl';

// eslint-disable-next-line import/prefer-default-export
export const getTableResultText = (size: number, page: number, total: number, template: string) => {
  const from = total ? ((page - 1) * size) + 1 : total;
  const to = page * size > total ? total : page * size;
  return tmpl(template, { from, to, total });
};

export const getTotalPages = (size: number, total: number): number => {
  if (total === 0) return 0;
  return Math.ceil(total / size);
};

export const buildUrl = (params: Record<string, string>, baseUrl: string = ''): string => {
  const searchParams = new URLSearchParams(params);
  return baseUrl + searchParams.toString();
};
