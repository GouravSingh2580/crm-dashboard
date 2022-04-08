import { useLocation } from 'react-router-dom';
import { GetQueryParameterValue } from '../useQueryParameters';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

const useLocationMock = useLocation as jest.MockedFunction<any>;

describe('useQueryParameter test', () => {
  it('should return null', () => {
    useLocationMock.mockReturnValueOnce({ search: '' }).mockReturnValueOnce('id=1');
    expect(GetQueryParameterValue('test')).toBeNull();
    expect(GetQueryParameterValue('test')).toBeNull();
  });
  it('should return correct params', () => {
    useLocationMock.mockReturnValue({ search: 'id=1' });
    expect(GetQueryParameterValue('id')).toBe('1');
  });
});
