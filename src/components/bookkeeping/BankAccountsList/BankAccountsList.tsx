import React, { useState } from 'react';
import { showErrorToast, showSuccessToast } from 'components/toast/showToast';
import { IBank } from 'hooks/dataFormatters/useBankAccountForDashboard';
import { useConnectionDeleting } from 'hooks/api/useBankAccount';
import { sendBankDelete } from 'helpers/heap/bookkeepingEvent';
import { BankAccountItem } from './BankAccountItem';
import { DeleteAccountModal } from './DeleteAccountModal';

interface Props {
  accountId: string;
  bankAccounts: IBank[];
}

interface ICurrentConnection {
  name: string;
  bankId: string;
  accountCount: number;
}

export const BankAccountsList = ({ accountId, bankAccounts }: Props) => {
  // delete connection
  const { deleteConnection } = useConnectionDeleting(accountId);
  const [currentConnection, setCurrentConnection] = useState<
    ICurrentConnection | undefined
  >(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);
  const handleDelete = async (keepData: boolean) => {
    // TODO: handle keepData with backend
    console.log('keep data', keepData);
    if (currentConnection == null) return;
    const { bankId, name, accountCount } = currentConnection;
    try {
      await deleteConnection(bankId);
      showSuccessToast(`${name} has been disconnected`);
      // sending heap event
      sendBankDelete({
        bankName: name,
        status: 'Success',
        accountCount,
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? `Error: ${e.message}` : '';
      showErrorToast(`${name} cannot be disconnected. ${errorMessage}`);
      // sending heap event
      sendBankDelete({
        bankName: name,
        status: 'Failed',
        accountCount,
      });
    } finally {
      onClose();
    }
  };

  const onDelete = ({ bankId, name, accounts }: IBank) => {
    setCurrentConnection({
      name,
      bankId,
      accountCount: accounts.length,
    });
    setOpen(true);
  };

  return (
    <>
      {bankAccounts.map((bankAccount) => (
        <BankAccountItem
          key={bankAccount.bankId}
          bankAccount={bankAccount}
          accountId={accountId}
          onDelete={onDelete}
        />
      ))}
      <DeleteAccountModal
        name={currentConnection?.name}
        open={open}
        onClose={onClose}
        onConfirm={handleDelete}
      />
    </>
  );
};
