import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Paper,
  Checkbox,
  Button,
  ButtonBase,
} from '@mui/material';
import {
  InsertDriveFile as InsertDriveFileIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import clsx from 'clsx';
import Pagination from '@mui/material/Pagination';
import makeStyles from '@mui/styles/makeStyles';
import { DocumentYear } from 'services/documentTypes';

import { AuthService } from 'services';
import { downloadDocument } from 'services/document';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'column',
    minHeight: 100,
  },
  paper: {
    width: '100%',
    overflow: 'auto',
  },
  table: {
    minWidth: 320,
  },
  pagination: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    flex: '0 1 auto',
  },
  fileCell: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  fileIcon: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  visibilityDisabled: {
    color: theme.palette.gray.main,
  },
  visibility: {
    color: theme.palette.primary.main,
  },
  visibilityOff: {
    color: theme.palette.gray.main,
  },
}));

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  temp: {
    height: theme.spacing(8),
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.background,
  },
  button: {
    marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
}));

export interface FormationsTableDocument {
  category?: string;
  id: string;
  title: string;
  forYear: DocumentYear;
  department?: string;
  subcategory?: string;
  visibleToCustomer?: boolean;
  isVisibilityEditable?: boolean;
  uploaded?: string;
  role?: string;
  status: string;
}

export type DocumentKey =
  | 'id'
  | 'category'
  | 'title'
  | 'forYear'
  | 'department'
  | 'subcategory'
  | 'visibleToCustomer'
  | 'isVisibilityEditable'
  | 'uploaded'
  | 'role'
  | 'status';
interface ToolbarProps {
  data: FormationsTableDocument[];
  selected: string[];
  onDelete: (ids: string[]) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onRecategorize: (id: string) => void;
}
const EnhancedTableToolbar = ({
  data,
  selected,
  setLoading,
  onRecategorize,
  onDelete,
}: ToolbarProps) => {
  const classes = useToolbarStyles();
  const numSelected = selected.length;

  const onDownload = async () => {
    setLoading(true);

    selected.forEach(async (selectedRowId) => {
      const fileRow = data.find((item) => item.id === selectedRowId);
      if (fileRow != null) {
        const blob = await downloadDocument(selectedRowId);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileRow.title);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        window.URL.revokeObjectURL(url);
        // @ts-ignore
        link.parentNode.removeChild(link);
      }
    });
  };

  const handleRecategorize = () => {
    const selectedRowId = selected[0];
    onRecategorize(selectedRowId);
  };

  const handleDelete = () => {
    if (selected.length > 0) {
      onDelete(selected);
    }
  };

  const RenderDelete = () => (
    <Tooltip title="Delete">
      <Button
        className={classes.button}
        size="large"
        variant="outlined"
        color="secondary"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </Tooltip>
  );
  const RenderDownload = () => (
    <Tooltip title="Download">
      <Button
        className={classes.button}
        size="large"
        variant="outlined"
        color="secondary"
        onClick={onDownload}
      >
        Download
      </Button>
    </Tooltip>
  );

  if (!selected.length) {
    return <div className={classes.temp} />;
  }

  if (selected.length > 1) {
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <RenderDownload />
        <RenderDelete />
      </Toolbar>
    );
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <>
        <RenderDownload />
        <RenderDelete />
        {AuthService.isAdmin() ? (
          <>
            <Tooltip title="Recategorize">
              <Button
                className={classes.button}
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleRecategorize}
                data-testid="categorize-btn"
              >
                Recategorize
              </Button>
            </Tooltip>
          </>
        ) : null}
      </>
    </Toolbar>
  );
};

interface TableHeadProps {
  headers: Array<{
    key: DocumentKey;
    title: string;
  }>;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  numSelected: number;
  rowCount: number;
}

const EnhancedTableHead = ({
  rowCount,
  headers,
  onSelectAllClick,
  numSelected,
}: TableHeadProps) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={rowCount > 0 && numSelected === rowCount}
          onChange={onSelectAllClick}
          inputProps={{ 'aria-label': 'select all desserts' }}
        />
      </TableCell>
      {headers.map((item) => (
        <TableCell key={item.key} component="th" scope="row">
          {item.title}
        </TableCell>
      ))}
      <TableCell />
    </TableRow>
  </TableHead>
);

interface Props {
  data: FormationsTableDocument[];
  headers: Array<{
    key: DocumentKey;
    title: string;
  }>;
  numberOfPages: number;
  selected: string[];
  page: number;
  onPageChange: (page: number) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSelected: (selected: string[]) => void;
  onRecategorize: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onChangeVisibility: (id: string, visibility: boolean) => void;
  onFileNameClick: (row: FormationsTableDocument) => Promise<void>;
}

export const DocumentsTable = ({
  data,
  headers,
  page,
  numberOfPages,
  setLoading,
  selected,
  setSelected,
  onPageChange,
  onRecategorize,
  onDelete,
  onChangeVisibility,
  onFileNameClick,
}: Props) => {
  const classes = useStyles();

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(selected.length === 0 ? newSelected : []);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <div className={classes.tableContainer}>
      <EnhancedTableToolbar
        data={data}
        selected={selected}
        setLoading={setLoading}
        onRecategorize={onRecategorize}
        onDelete={onDelete}
      />
      <TableContainer component={Paper} className={classes.paper}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="documents table"
          data-testid="table-documents"
        >
          <EnhancedTableHead
            rowCount={data.length}
            headers={headers}
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
          />

          <TableBody>
            {data.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              let VisibilityIcon = (
                <Visibility className={classes.visibilityDisabled} />
              );

              if (row.isVisibilityEditable) {
                VisibilityIcon = row.visibleToCustomer ? (
                  <Visibility
                    className={classes.visibility}
                    onClick={() => onChangeVisibility(row.id, false)}
                  />
                ) : (
                  <VisibilityOff
                    className={classes.visibilityOff}
                    onClick={() => onChangeVisibility(row.id, true)}
                  />
                );
              }

              return (
                <TableRow
                  hover
                  key={row.id}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                      onClick={() => handleClick(row.id)}
                    />
                  </TableCell>
                  {headers.map((item, i) => (
                    <TableCell key={item.key} component="td" scope="row">
                      {i === 0 ? (
                        // todo: fix this to use action/icon flag instead of index in later implementation
                        <ButtonBase
                          className={classes.fileCell}
                          onClick={() => onFileNameClick(row)}
                        >
                          <InsertDriveFileIcon className={classes.fileIcon} />
                          {row[item.key]}
                        </ButtonBase>
                      ) : (
                        <span>{row[item.key]}</span>
                      )}
                    </TableCell>
                  ))}
                  {AuthService.isAdmin() ? (
                    <TableCell>{VisibilityIcon}</TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        className={classes.pagination}
        page={page}
        onChange={handlePageChange}
        count={numberOfPages}
      />
    </div>
  );
};
