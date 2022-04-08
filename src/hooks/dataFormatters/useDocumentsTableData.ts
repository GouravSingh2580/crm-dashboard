import moment from 'moment';
import { AuthService } from 'services';
import { FormationsDocument } from 'services/documentTypes';
import { FormationsTableDocument } from 'components/common/tables/DocumentsTable';

export enum EDocumentStatus {
  'Approved' = 'Approved',
  'Submitted' = 'Submitted',
  'Rejected' = 'Rejected',
}

export type { FormationsDocument };

export const useDocumentsTableData = (documents: FormationsDocument[]): FormationsTableDocument[] =>
  documents.map((item: FormationsDocument) => {
    const getName = () => {
      let result = `${item.uploader?.name?.first} ${item.uploader?.name?.last}`;

      if (!AuthService.isAdmin() && item.uploader.role === 'Admin') {
        result = 'Formations';
      }

      return result;
    };

    const canEditVisibility = () => {
      if (!AuthService.isAdmin()) return false;

      return item.uploader.role === 'Admin';
    };

    return {
      id: item.id,
      title: item.title,
      forYear: item.forYear,
      department: item.documentCategory?.department,
      category: item.documentCategory?.category,
      subcategory: item.documentCategory?.subcategory,
      visibleToCustomer: item.visibleToCustomer || false,
      isVisibilityEditable: canEditVisibility(),
      uploaded: `${moment
        .utc(item.uploadedAt)
        .local()
        .format('MMM DD, YYYY')} by ${getName()}`,
      role: item.uploader.role,
      status: item.status,
      statusReason: item?.statusReason,
    };
  });
