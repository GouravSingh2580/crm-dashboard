import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import createPersistedState from 'use-persisted-state';
import { useContactId } from '../hooks';

/**
 * Local data
 */
const CalDataContext = createContext();

export const CalDataProvider = ({ children }) => {
  const [data, setData] = useState({});

  const setValues = (values) => {
    setData((prevData) => ({
      ...prevData,
      ...values,
    }));
  };

  return (
    <CalDataContext.Provider value={{ data, setValues }}>
      {children}
    </CalDataContext.Provider>
  );
};

CalDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(CalDataContext);

/**
 * Persisted data
 */
const usePersistedCalculatorState = createPersistedState('calculatorform');

export const useSavedCalculatorState = () => {
  const [persistedData, setPersistedData] = usePersistedCalculatorState({});
  const { resetContactId } = useContactId();

  const persist = (data) => {
    if (data && typeof data === 'object') {
      setPersistedData(data);
    }
  };

  const reset = ({ all = true } = {}) => {
    if (all) {
      setPersistedData({});
      resetContactId();
    } else {
      setPersistedData({});
    }
  };

  return {
    persistedData,
    persist,
    reset,
    isSoleProp:
      persistedData && persistedData.legalEntity
        ? persistedData.legalEntity === 'sole_prop'
        : null,
    isLLC: persistedData && persistedData.legalEntity === 'llc',
  };
};
