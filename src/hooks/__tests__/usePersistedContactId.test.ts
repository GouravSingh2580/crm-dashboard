import { renderHook, act } from '@testing-library/react-hooks';
import useContactId from '../usePersistedContactId';

describe('usePersistedContactId test', () => {
  it('useContactId saveContactId', () => {
    const { result } = renderHook(() => useContactId());
    act(() => {
      result.current.saveContactId('test_id');
    });
    expect(result.current.contactId).toBe('test_id');
  });

  it('useContactId resetContactId', () => {
    const { result } = renderHook(() => useContactId());
    act(() => {
      result.current.resetContactId();
    });
    expect(result.current.contactId).toBeNull();
  });
});
