import moment from 'moment';

/**
 * unix timestamp of current date converted to UTC.
 * unix time stamp is midnight time is set to 00:00:000
 */
const getUnixTimestamp = () => {
  const m = moment().utcOffset(0);
  m.set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
  });
  return m.valueOf().toString();
};

export default getUnixTimestamp;
