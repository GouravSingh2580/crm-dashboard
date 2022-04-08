import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';
import { Theme, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { MAIN_COLOR } from 'theme/constant';

interface IProps {
  title: string;
  url: string;
  width: string;
  placement?:
    | 'right-start'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'top-end'
    | 'top-start';
  hypertext?: string;
  children: React.ReactElement;
}

interface StyleProps {
  width: string;
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  infoIcon: {
    color: MAIN_COLOR,
  },
  popoverInfo: {
    marginLeft: theme.spacing(3),
  },
  tooltip: {
    color: theme.palette.primary.contrastText,
    backgroundColor: MAIN_COLOR,
    fontSize: '12px',
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    maxWidth: ({ width }) => width,
    fontWeight: 500,
  },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: MAIN_COLOR,
  },
}));

export const TooltipInfoWithLink = ({
  title,
  url,
  width,
  hypertext = 'Learn More',
  placement = 'right-start',
  children,
}: IProps) => {
  const classes = useStyles({ width });
  return (
    <div className={classes.popoverInfo}>
      <HtmlTooltip
        className={classes.tooltip}
        title={
          <div>
            {title}
            <span>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <u style={{ fontSize: '12px' }}>{hypertext}</u>{' '}
              </a>
            </span>
          </div>
        }
        arrow
        placement={placement}
      >
        {children}
      </HtmlTooltip>
    </div>
  );
};
