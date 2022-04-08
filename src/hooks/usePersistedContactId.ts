import createPersistedState from 'use-persisted-state';

const usePersistedContactId = createPersistedState('contactid');

const useContactId = () => {
  const [contactId, setContactId] = usePersistedContactId<string | null>(null);

  const saveContactId = (data: string) => {
    if (data && typeof data === 'string') {
      setContactId(data);
    }
  };

  const resetContactId = () => {
    setContactId(null);
  };

  return {
    contactId,
    saveContactId,
    resetContactId,
  };
};

export default useContactId;
