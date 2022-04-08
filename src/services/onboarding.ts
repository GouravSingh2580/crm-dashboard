import { Company } from 'models/company';
import { AuthService } from './auth';
import { getCompanyByUserId, updateCompanyById, upsertCompanyByUserId } from './companies';

const createAndUpdateCompany = async (params: Company) => {
  const userId = AuthService.userId() || undefined;
  if (!userId) throw new Error('User is not logged in'); // userId must not null
  try {
    const userCompanies = await getCompanyByUserId(userId);
    if (userCompanies?.length) {
      const { id } = userCompanies[0];
      await updateCompanyById(id!, params);
    } else {
      await upsertCompanyByUserId(userId, params);
    }
  } catch (error) {
    await upsertCompanyByUserId(userId, params);
    const userCompanies = await getCompanyByUserId(userId);
    if (userCompanies?.length) {
      const { id } = userCompanies[0];
      await updateCompanyById(id!, params);
    }
  }
};
export const OnboardingService = {
  createAndUpdateCompany,
};
