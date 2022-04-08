import {
  Status,
  ProgressTrackerGroup,
  ProgressTrackerStages,
  ProgressTrackerStatus,
  StatusResp,
} from 'models/account';

export type findByProps = {
  group: string;
  stage: string;
};

export const getLatestStatus = (data: Status[] | StatusResp[] | undefined) => {
  if (!data) {
    return null;
  }
  if (data.length === 0) {
    return null
  }
  // take last status from array which always new
  return data[data.length - 1];
};

export const findByGroupAndStage = (
  data: ProgressTrackerGroup[],
  props: findByProps,
) =>
  data.find((item) => item.group === props.group && item.stage === props.stage);

export const isStageComplete = (
  stage: ProgressTrackerStages,
  data: ProgressTrackerGroup[],
): boolean => {
  const currentStage = data?.find((item) => item.stage === stage);
  const latestStatus = getLatestStatus(currentStage?.status);
  return latestStatus?.status === ProgressTrackerStatus.Completed;
};
