import { createState, useState } from '@hookstate/core';

const AlertsState = createState({
  showUploadingDocument: false,
  showUploadedDocument: false,
  showUpdatingDocument: false,
  showUpdatedDocument: false,
  showDeletingDocument: false,
  showDeletedDocument: false,
});

export function useAlertsState() {
  const state = useState(AlertsState);

  return {
    get isUploadingDocument() {
      return state.showUploadingDocument.get();
    },
    setUploadingDocument(v: boolean) {
      state.showUploadingDocument.set(v);
    },
    get isUploadedDocument() {
      return state.showUploadedDocument.get();
    },
    setUploadedDocument(v: boolean) {
      state.showUploadedDocument.set(v);
    },
    get isUpdatingDocument() {
      return state.showUpdatingDocument.get();
    },
    setUpdatingDocument(v: boolean) {
      state.showUpdatingDocument.set(v);
    },
    get isUpdatedDocument() {
      return state.showUpdatedDocument.get();
    },
    setUpdatedDocument(v: boolean) {
      state.showUpdatedDocument.set(v);
    },
    get isDeletingDocument() {
      return state.showDeletingDocument.get();
    },
    setDeletingDocument(v: boolean) {
      state.showDeletingDocument.set(v);
    },
    get isDeletedDocument() {
      return state.showDeletedDocument.get();
    },
    setDeletedDocument(v: boolean) {
      state.showDeletedDocument.set(v);
    },
  };
}
