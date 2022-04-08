import { useQuery } from 'react-query';

import { AuthService, UsersService, HubspotService } from 'services';
import { getDocumentsByCompany, getDocumentsByCategoryAndSubcategory } from 'hooks/api';
import { get } from 'lodash';
import UserData from '../models/UserData';

const useUserData = (userId?: string) => useQuery<UserData, Error>(['userData', userId], async () => {
  let userIdInner = userId;
  try {
    if (!userIdInner) {
      userIdInner = AuthService.userId()!;
    }
    const userInfo = await UsersService.getUser(userIdInner);
    let hubspotUserData = null;

    try {
      // Fix for existing customers who doesn't have contactId
      if (!userInfo.contactId) {
        const data = await HubspotService.upsertContactProperties({
          email: userInfo.email,
        });
        const { contactId } = data;
        userInfo.contactId = contactId;
      }

      hubspotUserData = await HubspotService.getHubSpotUserProperties(
        userInfo.contactId!,
      );
    } catch (hubspotErr) {
      /**
         * Not throwing error because we need next call to work smoothly and
         *  hubspot call doesn't have
         * any dependency on next call
         */
      // eslint-disable-next-line no-console
      console.error(hubspotErr);
    }

    try {
      const userCompany = await UsersService.getUserCompanies(userIdInner);

      try {
        // Hotfix to get all the documents to filter for category and subcategory
        // To do: change this to get only as per category and subcategory when API is updated
        const { data: kycDocuments } = await getDocumentsByCategoryAndSubcategory(
          get(userCompany[0], 'id', ''),
          '1',
          'Miscellaneous',
          'Biographical Information',
        );
        const { data: userDocuments } = await getDocumentsByCompany(
          get(userCompany[0], 'id', ''),
          '1',
          '10',
        );
        return new UserData(
          userInfo,
          userCompany[0] || null,
          hubspotUserData || null,
          userDocuments,
          kycDocuments,
        );
      } catch (getDocumentErr) {
        return new UserData(
          userInfo,
          userCompany[0] || null,
          hubspotUserData || null,
          [],
          [],
        );
      }
    } catch (companyError) {
      return new UserData(userInfo, null, hubspotUserData || null);
    }
  } catch (userError: unknown) {
    if (userError instanceof Error){
      throw userError;
    }
    throw new Error(get(userError, 'message'));
  }
});

export default useUserData;
