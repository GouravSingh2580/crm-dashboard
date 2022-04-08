import { render } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { BrowserRouter as Router } from 'react-router-dom';
import { useFeatureFlag, applyFeatureFlag, withFeatureFlag } from '../useFeatureFlag';

jest.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: jest.fn(),
}));

describe.skip('feature flag test', () => {
  const mockFlag = (key: string, value: boolean) => {
    (useFlags as jest.Mock).mockReturnValue({
      [key]: value,
    });
  };
  describe('useFeatureFlag test', () => {
    it('should return true', () => {
      mockFlag('bookkeeping', true);
      expect(useFeatureFlag('bookkeeping')).toBe(true);
    });
    it('should return false', () => {
      mockFlag('bookkeeping', false);
      expect(useFeatureFlag('bookkeeping')).toBe(false);
    });
  });

  describe('applyFeatureFlag test', () => {
    const SampleComponent = () => (<div>render sample component</div>);
    it('should return null', () => {
      mockFlag('bookkeeping', false);
      expect(applyFeatureFlag('bookkeeping', <SampleComponent />)).toBeNull();
    });
    it('should return component', () => {
      mockFlag('bookkeeping', true);
      const { getByText } = render(<>{applyFeatureFlag('bookkeeping', <SampleComponent />)}</>);
      expect(getByText('render sample component')).toBeTruthy();
    });
  });

  describe('wrapFeatureFlagComponent test', () => {
    const SampleComponent = ({ text }: {text: string}) => (
      <div>
        <p>render sample component</p>
        <p>{text}</p>
      </div>
    );
    const WrappedComponent = withFeatureFlag('bookkeeping')(SampleComponent);
    it('should not render component', () => {
      mockFlag('bookkeeping', false);
      const { queryByText } = render(<Router><WrappedComponent text="render this" /></Router>);
      expect(queryByText('render sample component')).toBeNull();
      expect(queryByText('Page not found')).toBeTruthy();
    });

    it('should render component', () => {
      mockFlag('bookkeeping', true);
      const { queryByText } = render(<Router><WrappedComponent text="render this" /></Router>);
      expect(queryByText(/render sample component/)).toBeTruthy();
      expect(queryByText(/render this/)).toBeTruthy();
    });
  });
});
