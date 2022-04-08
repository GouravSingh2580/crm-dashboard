import { FormationsDocument } from 'hooks/dataFormatters/useDocumentsTableData';
import { DocumentCategory } from 'services/documentTypes';

export const findCategoryByName = ({
  categories,
  name,
  subcategory,
  department,
}: {
  categories: DocumentCategory[] | undefined;
  name: string;
  subcategory: string;
  department: string;
}) => {
  if (
    !categories ||
    !Array.isArray(categories) ||
    categories.length <= 0 ||
    !name ||
    typeof name !== 'string'
  ) {
    return null;
  }

  const category = categories.find(
    (f) =>
      f.category === name &&
      f.subcategory === subcategory &&
      f.department === department,
  );
  return category?.id;
};

export const getDocumentAvailableForCategory = ({
  documents,
  name,
  subcategory,
  department,
}: {
  documents: FormationsDocument[];
  name: string;
  subcategory: string;
  department: string;
}) => documents.filter(
    (d: any) =>
      d.documentCategory &&
      d.documentCategory.category === name &&
      d.documentCategory.subcategory === subcategory &&
      d.documentCategory.department === department,
  );

export const isDocumentAvailableForCategory = ({
  documents,
  name,
  subcategory,
  department,
}: {
  documents: FormationsDocument[];
  name: string;
  subcategory: string;
  department: string;
}) => {
  const documentsForCategory = getDocumentAvailableForCategory({
    documents,
    name,
    subcategory,
    department,
  });

  return documentsForCategory.length > 0;
};
