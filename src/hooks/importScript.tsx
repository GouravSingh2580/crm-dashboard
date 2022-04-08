import { useEffect } from 'react';

interface Props {
  url: string;
  id: string;
  type: string;
}

export const useScript = ({ url, id, type }: Props) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.id = id;
    script.type = type;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export const useHubspotScript = () =>
  useScript({
    url: '//js.hs-scripts.com/6637631.js',
    id: 'hs-script-loader',
    type: 'text/javascript',
  });

