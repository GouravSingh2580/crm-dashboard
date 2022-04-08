import { useLocation } from 'react-router-dom';

export const useQueryParameter = () => new URLSearchParams(useLocation().search);

export const GetQueryParameterValue = (paramterName: string) => {
  const queryParamters = useQueryParameter();
  if (queryParamters.has(paramterName) && queryParamters.get(paramterName)) {
    return queryParamters.get(paramterName);
  }
  return null;
};
