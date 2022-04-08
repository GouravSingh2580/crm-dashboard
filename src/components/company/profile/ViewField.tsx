import { IconButton, ListItem, ListItemSecondaryAction } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';

import { BANK_ACCOUNT_TYPES } from 'enums';
import { ENTITY_OPTIONS } from 'constants/common';

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    paddingRight: theme.spacing(15),
    minHeight: theme.spacing(10),
  },
  listItemLabel: {
    fontWeight: 'bold',
    margin: theme.spacing(1, 0),
  },
  listItemValue: {
    margin: theme.spacing(1, 0),
  },
  listItemText: {},
  listItemLinkValue: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(1, 0),
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

interface Props {
  label: string;
  value: any;
  name: string;
  editMode: string | false;
  isEditable: boolean;
  href: string;
  setEditMode: (editMode: string | false) => void;
  setEditField: (field: {
    value: any;
    label: string;
    name: string;
    isValid: boolean;
  }) => void;
}

export const ViewField = ({
  label,
  value,
  name: fieldName,
  editMode,
  isEditable,
  href,
  setEditMode,
  setEditField,
}: Props) => {
  const classes = useStyles();
  const isSuggested = fieldName === 'suggested';

  let showValue = '';

  if (isSuggested) {
    showValue = value.suggested ? value.suggested.join(', ') : '';
  } else if (fieldName === 'gustoCompanyUUID') {
    showValue = value?.name || 'N/A';
  } else if (typeof value === 'object' && value != null) {
    showValue = value.join(', ');
  } else if (typeof value === 'boolean') {
    String(value);
  } else if (fieldName === 'bankAccountType') {
    showValue = BANK_ACCOUNT_TYPES.get(value) ?? 'N/A';
  } else if (!value) {
    showValue = 'N/A';
  } else if (fieldName === 'entityType') {
    showValue = ENTITY_OPTIONS.find((item) => item.id === value)?.name || 'N/A';
  } else {
    showValue = value;
  }

  return (
    <ListItem
      className={classes.listItem}
      key={label}
      divider
      data-testid={`field-${fieldName}`}
    >
      <div className={classes.listItemText}>
        <div className={classes.listItemLabel}>{label}</div>
        {href ? (
          <a
            href={href}
            target="_blank"
            referrerPolicy="no-referrer"
            className={classes.listItemLinkValue}
            data-testid="field-value"
            rel="noreferrer"
          >
            {showValue}
          </a>
        ) : (
          <div className={classes.listItemValue} data-testid="field-value">
            {showValue}
          </div>
        )}
      </div>
      {!editMode && isEditable && (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="edit"
            data-testid={`btn-edit-${fieldName}`}
            onClick={() => {
              setEditMode(label);
              setEditField({ value, label, name: fieldName, isValid: true });
            }}
            size="large"
          >
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};
