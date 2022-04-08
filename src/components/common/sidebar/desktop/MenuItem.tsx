import { Link, useLocation } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  List,
  Collapse,
  SvgIcon,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { useMemo, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useFlags } from 'hooks/useFeatureFlag';
import { useSidebarOpen } from 'components/common/sidebar/desktop/sidebarContext';
import { filterEnabledActions } from '../helpers';
import { IAction, ISubAction } from '../constant';

const MenuItemText = withStyles((theme: Theme) => ({
  primary: {
    ...theme.typography.body2,
    color: theme.palette.text.primary,
  },
}))(ListItemText) as typeof ListItemText;
const SidebarMenuItem = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    opacity: '70%',
    backgroundColor: 'transparent',
  },
  selected: {
    opacity: '100%',
    '&.MuiListItemButton-root': {
      backgroundColor: 'transparent',
    },
    '&.MuiListItemButton-root:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '8px',
      height: '60%',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '8px',
      left: '0px',
    },
  },
}))(ListItemButton) as typeof ListItemButton;

type MenuItemProps = Omit<IAction, 'Icon' | 'subActions'> & {
  Icon?: typeof SvgIcon;
  subActions?: ISubAction[];
  active?: boolean;
};

export const MenuItem = ({
  id,
  path,
  Icon,
  text,
  subActions = [],
}: MenuItemProps) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(true);
  const sidebarOpen = useSidebarOpen();

  const flags = useFlags();
  const filteredSubActions = useMemo(
    () => filterEnabledActions(subActions || [], flags),
    [subActions],
  );
  const hasSubActions =
    Array.isArray(filteredSubActions) && filteredSubActions.length > 0;
  const isActive = path !== '' && path != null && pathname.endsWith(path);
  let buttonProps: Partial<typeof ListItemButton> = {
    component: Link,
    to: path,
  };
  let expandButton = null;
  if (hasSubActions) {
    buttonProps = { onClick: () => setOpen(!open) };
    expandButton = open ? <ExpandLess /> : <ExpandMore />;
  }
  return (
    <>
      <SidebarMenuItem
        key={id}
        data-testid={`menu_item_${id}`}
        selected={isActive}
        {...buttonProps}
      >
        <ListItemIcon sx={{ minWidth: 50 }}>
          {Icon && <Icon color="primary" fontSize="medium" />}
        </ListItemIcon>
        <MenuItemText sx={{ opacity: sidebarOpen ? 1 : 0 }}>{text}</MenuItemText>
        {expandButton}
      </SidebarMenuItem>
      {hasSubActions && (
        <Collapse in={open} timeout="auto">
          <List>
            {filteredSubActions.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};
