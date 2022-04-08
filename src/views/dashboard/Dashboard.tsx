import { FLAGS, useFeatureFlag } from 'hooks/useFeatureFlag';
import useUserData from '../../hooks/useUserData';
import { Loading } from '../../components/common';
import { Insight } from './insight/Insight';
import Welcome from './Welcome';

export const Dashboard = () => {
  // Redirect to onboarding or subscription if not completed
  const { isLoading } = useUserData();
  const isInsightFlagEnabled = useFeatureFlag(FLAGS.INSIGHT);

  if (isLoading) {
    return <Loading />;
  }

  if (isInsightFlagEnabled) {
    return <Insight />;
  }

  return <Welcome />;
};
