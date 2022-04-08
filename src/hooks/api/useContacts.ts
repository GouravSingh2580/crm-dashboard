import { useMutation, useQuery } from 'react-query';
import { HubspotService, HubspotUserData } from 'services/hubspot';
import { UsersService, UserInfo } from 'services/users';

export type Contact = HubspotUserData;

export const emptyContact: Contact = {
  id: '',
  hubspotId: '',
  email: '',
};

export const getContactById = async (contactId: string) => {
  if (!contactId) {
    return emptyContact;
  }
  return HubspotService.getHubSpotUserProperties(contactId);
};

export const updateContact = async (
  contactId: string,
  data: Record<string, any>,
) => {
  const result = await HubspotService.updateContact(contactId, data);
  return result.data;
};

/**
 * This attempts to upsert a contact record based on the email
 * address of the user and then link it to the user record.
 *
 * Makes an extra HTTP request that I'm not sure is neccessary, and can
 * be optimized if needed
 *
 * @param user UserInfo
 * @returns HubspotUserData
 */
export const upsertContact = async (user: UserInfo) => {
  const { contactId } = await HubspotService.upsertContactProperties({
    email: user.email,
  });

  await UsersService.updateUserById(user.id, { contactId });

  return contactId;
};

const contact = {
  UpsertContact: (queryProps?: any) =>
    useMutation(({ user }: any) => upsertContact(user), queryProps),
  GetContact: (id: string) =>
    useQuery<Contact, unknown>(['contact', id], () => getContactById(id), {
      placeholderData: emptyContact,
    }),
  UpdateContact: (queryProps?: any) =>
    useMutation(({ id, data }: any) => updateContact(id, data), queryProps),
};

export default contact;
