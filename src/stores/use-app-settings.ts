import create from 'zustand';

const useAppSettings = create(() => ({
  numberOfTableRows: 10,
  minDocumentAssociatedYear: 2000,
}));

export default useAppSettings;
