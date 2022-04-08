import { Typography, Box, TypographyTypeMap } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactElement, useMemo } from 'react';
import { transformTextForKey } from 'helpers/text-transformer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    maxWidth: '100%',
  },
  item: {
    marginTop: theme.spacing(2),
  },
  ellipsisOverFlow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  breakLineOverFlow: {
    lineBreak: 'anywhere',
  },
  hiddenOverFlow: {
    overflow: 'hidden',
  },
}));

export type ReadOnlyItemType = {
  title: string;
  value: number | string | string[] | ReactElement | undefined;
};

export type TTextOverFlowType = 'ellipsis' | 'breakLine' | 'hidden';

interface TParams {
  items: ReadOnlyItemType[];
  overFlowType?: TTextOverFlowType;
  titleVariant?: TypographyTypeMap['props']['variant'];
}

export const ReadOnlyForm = ({
  items,
  titleVariant,
  overFlowType,
}: TParams) => {
  const classes = useStyles();
  const textOverFlowClass = useMemo(() => {
    switch (overFlowType) {
      case 'ellipsis':
        return classes.ellipsisOverFlow;
      case 'hidden':
        return classes.hiddenOverFlow;
      case 'breakLine':
        return classes.breakLineOverFlow;
      default:
        return undefined;
    }
  }, [classes, overFlowType]);

  return (
    <Box className={classes.root}>
      {items.map((item) => (
        <Box className={classes.item} key={item.title}>
          <Typography
            variant={titleVariant || 'body2'}
            data-testid={`field-label-${transformTextForKey(item.title)}`}
          >
            {item.title}
          </Typography>
          {Array.isArray(item.value) ? (
            item.value.map((val, index) => (
              <Typography
                variant="body2B"
                component="h6"
                key={`${item.title}-${val}`}
                data-testid={`field-label-${transformTextForKey(
                  item.title,
                )}-${index}`}
                className={textOverFlowClass}
              >
                {val}
              </Typography>
            ))
          ) : (
            <Typography
              variant="body2B"
              component="h6"
              data-testid={`field-value-${transformTextForKey(item.title)}`}
              className={textOverFlowClass}
            >
              {item.value || 'N/A'}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
