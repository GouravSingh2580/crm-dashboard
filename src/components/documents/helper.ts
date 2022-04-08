import { ICategoryState } from 'components/documents/CategorizeSelectors';
import { DocumentCategory } from 'services/documentTypes';
import { useAppSettingsStore } from 'stores';

export interface UseCategoryData {
  yearOptions: string[],
  departmentOptions: string[],
  categoryOptions: string[],
  subCategoryOptions: string[],
}

export const useDocumentDataOptions = (
  value: ICategoryState,
  categoriesData: DocumentCategory[],
): UseCategoryData => {
  const minDocumentAssociatedYear = useAppSettingsStore((state) => state.minDocumentAssociatedYear);

  const getYears = () => {
    const startYear = minDocumentAssociatedYear;
    let currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    // we add next year into system pass October
    // for example we show 2022 after oct 1st 2021
    if (currentMonth > 8) {
      currentYear += 1;
    }
    const yearsOptions = ['Permanent'];

    while (startYear <= currentYear) {
      yearsOptions.push(`${currentYear}`);
      currentYear -= 1;
    }
    return [...new Set(yearsOptions)];
  };

  const getDepartments = () => [...new Set(categoriesData.map(item => item.department))];

  const getCategories = () => [...new Set(
      categoriesData
        .filter((item) => item.department === value.department)
        .map((item) => item.category),
    )];

  const getSubcategories = () => [...new Set(
      categoriesData
        .filter(
          (item) =>
            item.department === value.department &&
            item.category === value.category
        )
        .map((item) => item.subcategory)
        .filter(
          (item) => item !== undefined && !!item
        )
    )];

  return {
    yearOptions: getYears(),
    departmentOptions: getDepartments(),
    categoryOptions: getCategories(),
    subCategoryOptions: getSubcategories(),
  } as const;
};
