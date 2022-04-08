import { useState } from 'react';
import moment, { Moment } from 'moment';
import makeStyles from '@mui/styles/makeStyles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Drawer,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import { CompletionStatusToLabel } from 'enums';
import { ENTITY_OPTIONS } from 'constants/common';
import { IFilters, initFilterState } from 'views/accounts';

const useStyles = makeStyles((theme) => ({
  drawer: {
    minWidth: 380,
    padding: theme.spacing(4),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(2, 0),
  },
  drawerButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawerButton: {
    marginBottom: theme.spacing(2),
  },
  drawerCloseIcon: {
    cursor: 'pointer',
  },
  drawerInputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
  },
}));
interface Props {
  open: boolean;
  filters: IFilters;
  onChange: (data: IFilters) => void;
  onClose: () => void;
  currentFilterCount: number;
}

export const Filters = ({ open, filters, onChange, onClose, currentFilterCount }: Props) => {
  const classes = useStyles();

  const [filterProp, setFilterProp] = useState<IFilters>(filters);
  const { entityType, assignedCSM, from, to, completionStatus } = filterProp;
  // TODO: hide CSM filter until we have CSM data in the system
  const displayCSMFilter = false;

  const updateFilter = (key: string, value: string | Moment | null) => {
    setFilterProp({
      ...filterProp,
      [key]: value,
    });
  };

  const onApply = () => {
    const fromD = from ? moment(from).format('YYYY-MM-DD') : null;
    const toD = to ? moment(to).format('YYYY-MM-DD') : null;

    if (fromD === 'Invalid date' || toD === 'Invalid date') {
      return;
    }
    onChange({
      entityType,
      assignedCSM,
      from: fromD,
      to: toD,
      completionStatus,
    });
    onClose();
  };

  const onResetFilter = () => {
    setFilterProp(initFilterState);
  };

  const onCancel = () => {
    setFilterProp(filters);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onCancel}>
      <div className={classes.drawer}>
        <div className={classes.drawerHeader}>
          <Typography variant="h4" component="h4">
            Filters
          </Typography>
          <CloseIcon className={classes.drawerCloseIcon} onClick={onClose} />
        </div>
        <div className={classes.drawerHeader}>
          <Typography variant="body2S" component="body">
            {currentFilterCount} Selected
          </Typography>

          <Button onClick={onResetFilter} data-testid="reset-filter">
            <Typography variant="body2S">Clear All</Typography>
          </Button>
        </div>

        <div className={classes.drawerInputsContainer}>
          <Stack spacing={2}>
            <FormControl variant="outlined">
              <InputLabel id="filter-entity-type">Entity type</InputLabel>
              <Select
                labelId="filter-entity-type"
                label="Entity type"
                id="filterEntityType"
                name="filterEntityType"
                value={entityType}
                onChange={(e) => updateFilter('entityType', e.target.value)}
              >
                {ENTITY_OPTIONS.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {displayCSMFilter && (
              <FormControl variant="outlined">
                <InputLabel id="filter-assigned-csm">
                  Assigned Manager
                </InputLabel>
                <Select
                  labelId="filter-assigned-csm"
                  label="Assigned Manager"
                  id="filterAssignedCSM"
                  name="filterAssignedCSM"
                  value={assignedCSM}
                  onChange={(e) => updateFilter('assignedCSM', e.target.value)}
                >
                  <MenuItem key="unassigned" value="unassigned">
                    Unassigned
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            <DatePicker
              renderInput={(props) => (
                <TextField data-testid="filter-from-date-input" {...props} />
              )}
              inputFormat="MM/DD/yyyy"
              label="Registration Date from"
              value={from}
              onChange={(v) =>
                updateFilter('from', moment(v).format('YYYY-MM-DD'))
              }
            />
            <DatePicker
              renderInput={(props) => (
                <TextField data-testid="filter-to-date-input" {...props} />
              )}
              inputFormat="MM/DD/yyyy"
              label="Registration Date to"
              value={to}
              onChange={(v) =>
                updateFilter('to', moment(v).format('YYYY-MM-DD'))
              }
            />
            <FormControl variant="outlined">
              <InputLabel id="form-completion-status">
                End of Year Survey Status
              </InputLabel>
              <Select
                labelId="form-completion-status"
                label="End of Year Survey Status"
                id="formCompletionStatus"
                name="formCompletionStatus"
                value={completionStatus}
                onChange={(e) =>
                  updateFilter('completionStatus', e.target.value)
                }
              >
                {Object.entries(CompletionStatusToLabel).map(
                  ([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Stack>
        </div>

        <div className={classes.drawerButtonsContainer}>
          <Button
            className={classes.drawerButton}
            type="button"
            size="large"
            variant="contained"
            color="secondary"
            onClick={onApply}
            data-testid="apply-filter"
          >
            Apply
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
