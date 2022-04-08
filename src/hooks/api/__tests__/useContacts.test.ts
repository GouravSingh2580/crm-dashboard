import { act, renderHook } from '@testing-library/react-hooks';
import { HubspotService } from 'services/hubspot';
import createQueryWrapper, {
  mockedQueryClient,
} from '../__testMock__/TestComponent';
import useContacts, { emptyContact } from '../useContacts';

const fakeContactData = {
  id: '1234',
  hubspotId: '45678',
};

jest.mock('services/hubspot', () => ({
  __esModule: true,
  HubspotService: {
    updateContact: jest.fn(),
    getHubSpotUserProperties: jest.fn(),
  },
}));

describe('useContacts test', () => {
  const contactId = '1234';
  let wrapper: any;

  beforeEach(() => {
    wrapper = createQueryWrapper();
    mockedQueryClient.resetQueries();
  });

  describe('GetContact test', () => {
    it('should have GetContacts', () => {
      expect(useContacts.GetContact).not.toBeUndefined();
    });

    it('should return empty contact data if data is not fetched', async () => {
      (HubspotService.getHubSpotUserProperties as jest.Mock).mockResolvedValue(
        fakeContactData,
      );
      const { result, waitFor } = renderHook(
        () => useContacts.GetContact(contactId),
        { wrapper },
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toStrictEqual(emptyContact);
    });

    it('should return empty contact data if contactId is not provided', async () => {
      (HubspotService.getHubSpotUserProperties as jest.Mock).mockResolvedValue(
        fakeContactData,
      );
      const { result, waitFor } = renderHook(() => useContacts.GetContact(''), {
        wrapper,
      });
      await waitFor(() => result.current.isFetched);
      expect(result.current.data).toStrictEqual(emptyContact);
    });

    it('should successfully fetch data', async () => {
      (HubspotService.getHubSpotUserProperties as jest.Mock).mockResolvedValue(
        fakeContactData,
      );
      const { result, waitFor } = renderHook(
        () => useContacts.GetContact(contactId),
        { wrapper },
      );
      await waitFor(() => result.current.isFetched);
      expect(result.current.data).toStrictEqual(fakeContactData);
    });

    it('should resolve an error if fetching fails', async () => {
      (HubspotService.getHubSpotUserProperties as jest.Mock).mockRejectedValue(
        new Error('SERVER_ERROR'),
      );
      const { result, waitFor } = renderHook(
        () => useContacts.GetContact(contactId),
        { wrapper },
      );
      await waitFor(() => result.current.isError);
      expect(result.current.data).toBe(undefined);
      expect(result.current.error).toHaveProperty('message', 'SERVER_ERROR');
    });
  });

  describe('UpdateContact test', () => {
    it('should have UpdateContact', () => {
      expect(useContacts.UpdateContact).not.toBeUndefined();
    });

    it('should successfully update contact data', async () => {
      (HubspotService.updateContact as jest.Mock).mockResolvedValue({});
      const { result, waitFor } = renderHook(
        () => useContacts.UpdateContact({}),
        { wrapper },
      );
      await act(() =>
        (result.current as any).mutateAsync({
          id: contactId,
          data: fakeContactData,
        }),
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.isError).toBe(false);
    });
  });
});
