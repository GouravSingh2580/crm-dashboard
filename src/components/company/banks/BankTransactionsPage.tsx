import { withFeatureFlag, FLAGS } from 'hooks/useFeatureFlag';
import { useEffect } from 'react';
import { useBookkeepingStore } from 'states/bookkeeping';
import { BankTransactionsContent } from 'views/bank/BankTransactions';

interface Props {
  accountId: string;
}

const BankTransactionsAdmin = ({ accountId }: Props) => {
  const bookKeepingStore = useBookkeepingStore(
    (state) => state.setIsBookkeeper,
  );

  useEffect(() => {
    bookKeepingStore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BankTransactionsContent accountId={accountId} disableQueryUrl />
    </>
  );
};

export const BankTransactionsPage = withFeatureFlag(FLAGS.BOOKKEEPING)(
  BankTransactionsAdmin,
);
