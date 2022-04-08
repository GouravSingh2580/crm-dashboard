import { ChangeEvent, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DropResult,
} from 'react-beautiful-dnd';
import { TextField, Chip } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { TextTransformer } from 'helpers';

interface InputItem {
  content: string;
  id: string;
}

const getItems = (values: string[]) =>
  values.map((k) => ({
    id: `item-${k}`,
    content: k,
  }));

// a little function to help us with reordering the result
const reorder = (list: InputItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => ({
  userSelect: 'none',
  // background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = () => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  flexDirection: 'column',
  padding: grid,
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  chip: {
    cursor: 'pointer',
    margin: theme.spacing(0, 1, 1, 1),
  },
}));

interface Props {
  value: string[];
  onChange?: (value: string[]) => void;
  inputProps?: object;
  readMode: boolean;
}

const voidFunction = () => {
  /** do nothing */
};

export const ChipInput = ({
  value,
  onChange = voidFunction,
  inputProps = {},
  readMode = false,
}: Props) => {
  const classes = useStyles();

  const [currentText, setCurrentText] = useState('');
  const [sn, setSn] = useState<InputItem[]>(getItems(value));

  useEffect(() => {
    setSn(getItems(value));
  }, [value]);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentText(event.target.value);
  };

  const handleChange = (v: InputItem[]) => {
    if (readMode) return;

    const newValue = v.map((item) => item.content);
    onChange(newValue);
    setSn(v);
  };

  const onChipDelete = (v: string) => {
    const newValue = sn.filter((item) => item.id !== v);
    handleChange(newValue);
  };

  const addNewValue = () => {
    if (!currentText) {
      return;
    }

    if (sn.find((item) => item.content === currentText)) {
      setCurrentText('');
      return;
    }

    const newValue = [
      ...sn,
      {
        id: `item-${sn.length}`,
        content: TextTransformer.capitalizeFirstLetter(currentText),
      },
    ];
    setCurrentText('');
    handleChange(newValue);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Alt') {
      addNewValue();
      e.preventDefault();
    }
  };

  const onBlur = () => {
    addNewValue();
  };

  const getChipDeleteProp = (item: InputItem) =>
    readMode ? {} : { onDelete: () => onChipDelete(item.id) };

  const getSuperList = () =>
    sn.map((item, index) => (
      <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}
        isDragDisabled={!!readMode}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            // @ts-ignore
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
          >
            <div>
              <span>{index + 1}.</span>
              <Chip
                className={classes.chip}
                // color="primary"
                label={item.content}
                avatar={<DragIndicator color="secondary" />}
                {...getChipDeleteProp(item)}
              />
            </div>
          </div>
        )}
      </Draggable>
    ));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(sn, result.source.index, result.destination.index);
    handleChange(items);
  };

  return (
    <div className={classes.container}>
      {!readMode && (
        <TextField
          {...inputProps}
          inputProps={{
            style: { textTransform: 'capitalize' },
            autoCapitalize: 'on',
          }}
          value={currentText}
          onChange={onTextChange}
          // @ts-ignore
          onKeyDown={onKeyPress}
          onBlur={onBlur}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // @ts-ignore
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {getSuperList()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
