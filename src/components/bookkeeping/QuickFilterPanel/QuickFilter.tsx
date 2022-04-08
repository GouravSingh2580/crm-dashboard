import { Badge, Chip, ChipProps } from '@mui/material';
import { withStyles } from '@mui/styles';

interface Props extends ChipProps {
  label: string;
  selected?: boolean;
  count?: number;
  onClick: () => void;
}

const FilterChip = withStyles((theme) => ({
  filled: {
    backgroundColor: theme.palette.yellow.light,
    '&:hover': {
      backgroundColor: theme.palette.yellow.main,
    },
  },
}))(Chip);

export const QuickFilter = ({
  label, onClick, count = 0, selected, ...rest
}: Props) => {
  const chip = (
    <FilterChip
      label={label}
      variant={selected ? 'filled' : 'outlined'}
      onClick={onClick}
      {...rest}
    />
  );
  return count > 0
    ? <Badge data-testid="quick-filter-badge" badgeContent={count} color="primary">{chip}</Badge>
    : chip;
};

QuickFilter.defaultProps = {
  selected: false,
  count: 0,
};
