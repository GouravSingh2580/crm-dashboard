import useMediaQuery from '@mui/material/useMediaQuery';

export const useMediaBreakpoints = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.between('sm', 'md'));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return {
    isDesktop,
    isTablet,
    isMobile,
  };
};
