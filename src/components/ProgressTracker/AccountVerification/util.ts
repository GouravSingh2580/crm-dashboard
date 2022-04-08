import { Status } from 'services/account';

export type findByProps = {
  group: string;
  stage: string;
};

const sort = (data: Status[]) =>
  data.slice().sort((a: Status, b: Status) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateA > dateB ? -1 : 1;
  });

export const getCurrentStatusByUpdatedAt = (data: Status[] | undefined) => {
  if (!data) {
    return null;
  }
  const sortedData = sort(data);
  return sortedData[0] ? sortedData[0].status : null;
};

export const getCurrentCommentByUpdatedAt = (data: Status[] | undefined) => {
  if (!data) {
    return null;
  }
  const sortedData = sort(data);
  return sortedData[0] ? sortedData[0].comment : null;
};
  