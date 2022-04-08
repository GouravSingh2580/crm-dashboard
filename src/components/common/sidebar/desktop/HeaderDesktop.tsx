import { List, Box, Typography } from '@mui/material';
import { useFlags } from 'hooks/useFeatureFlag';
import { ReactComponent as Logo } from 'icons/logo-text.svg';
import { useCurrentUser } from 'hooks/api';
import { useCompanyByUserId } from 'hooks/api/useCompanies';
import { IAction } from '../constant';
import { filterEnabledActions } from '../helpers';
import { MenuItem } from './MenuItem';
import { useSidebarOpen } from './sidebarContext';

interface Props {
  actions: IAction[];
}

export const HeaderDesktop = ({ actions }: Props) => {
  const { currentUser } = useCurrentUser();
  const fullName = [currentUser?.name?.first, currentUser?.name?.last].join(
    ' ',
  );

  const { company } = useCompanyByUserId(currentUser?.id);

  // feature flags
  const flags = useFlags();
  const enabledActions = filterEnabledActions(actions, flags);
  const open = useSidebarOpen();

  return (
    <Box>
      <Box p={4} mb={4} sx={{ opacity: open ? 1 : 0 }}>
        <Box data-testid="logo">
          <Logo width={150} />
        </Box>
        <Box mt={1}>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {fullName}
          </Typography>
          <Typography variant="subtitle2" component="p">
            {company?.entityType}
          </Typography>
        </Box>
      </Box>
      <List>
        {enabledActions.map((action) => (
          <MenuItem
            key={action.id}
            {...action}
            active={action.id === 'welcome'}
          />
        ))}
      </List>
    </Box>
  );
};
