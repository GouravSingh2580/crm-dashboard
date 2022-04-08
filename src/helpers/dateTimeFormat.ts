import moment, { isMoment, Moment } from 'moment';

const DEFAULT_FORMAT = 'MMM D, H:mm';
export const MOMENT_DATE_FORMAT = 'MM/DD/YYYY';

export const getPrettyDateTime = (data: Moment | string, format = DEFAULT_FORMAT): string => {
  const datetime = isMoment(data) ? data : moment(data);
  // test
  if (datetime.diff(new Date(), 'days') > 0) {
    return datetime.fromNow();
  }
  return datetime.format(format);
};

export const UIDateFormat = (date: string) => {
  try {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${mo}/${da}/${ye}`;
  } catch {
    return 'N/A';
  }
};

export const getISOFormatTime = (date: string): string => {
  try {
    const res = moment(date);
    return res.startOf('day').toISOString();
  } catch {
    return '';
  }
};

export const formatDate = (date: string | Moment | undefined, defaultOutput: string = ''): string => {
  try {
    if (date) {
      return moment(date).format(MOMENT_DATE_FORMAT);
    }
    return defaultOutput;
  } catch {
    return defaultOutput;
  }
};
