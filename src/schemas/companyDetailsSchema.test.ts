import { adminCompanyDetailSchema } from './companyDetailsSchema';

const getErrorMessages = ({ path, message, inner }) => {
  if (inner && inner.length) {
    return inner.reduce((acc, { path:innerPath, message:innerMessage }) => {
      acc[innerPath] = innerMessage;
      return acc;
    }, {});
  }
  return { [path]: message };
};

describe('schema: Sole-Prop company details ', () => {
  it('should validate company names not starting with 0', () => {
    const testFormData = {
      suggested: ['0123456'],
    };
    const validationOptions = {
      context: {
        isSoleProp: true,
      },
    };
    let errors = [];
    try {
      adminCompanyDetailSchema.validateSync(testFormData, validationOptions);
    } catch (err) {
      errors.push(getErrorMessages(err));
    }
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].suggested).toBe(
      "Names starting with '0' are not accepted by the IRS. Please choose a different name.",
    );
  });

  it('should validate 3 company name option required', () => {
    const testFormData = {
      suggested: ['123456', '123456'],
    };
    const validationOptions = {
      context: {
        isSoleProp: true,
      },
    };
    let errors = [];
    try {
      adminCompanyDetailSchema.validateSync(testFormData, validationOptions);
    } catch (err) {
      errors.push(getErrorMessages(err));
    }
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].suggested).toBe(
      'Three company name options are required.',
    );
  });

  it('should validate company name options are not duplicate', () => {
    const testFormData = {
      suggested: ['123456', '123456', 'hello'],
    };
    const validationOptions = {
      context: {
        isSoleProp: true,
      },
    };
    let errors = [];
    try {
      adminCompanyDetailSchema.validateSync(testFormData, validationOptions);
    } catch (err) {
      errors.push(getErrorMessages(err));
    }
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].suggested).toBe(
      'Company name options cannot be duplicates.',
    );
  });

  it('should validate company details errors', () => {
    const testFormData = {};
    const validationOptions = {
      abortEarly: false,
      context: {
        isSoleProp: true,
      },
    };
    let errors = [];
    try {
      adminCompanyDetailSchema.validateSync(testFormData, validationOptions);
    } catch (err) {
      errors.push(getErrorMessages(err));
    }
    expect(errors[0].stateOfIncorporation).toBe(
      'Please enter a state of incorporation.',
    );
    expect(errors[0].industry).toBe('Please enter a business industry.');
    expect(errors[0].description).toBe('Please enter business description.');
    expect(errors[0].suggested).toBe(
      'Three company name options are required.',
    );
  });

  it('should validate company details success', () => {
    const testFormData = {
      suggested: ['123', '456', '678'],
      incorporationDate: new Date(),
      ein: '',
      stateOfIncorporation: { code: 'Dentist', name: 'Dentist' },
      industry: { code: 'AL', name: 'Alabama' },
      description: 'business description',
    };
    const validationOptions = {
      context: {
        isSoleProp: true,
      },
    };
    let errors = [];
    try {
      adminCompanyDetailSchema.validateSync(testFormData, validationOptions);
    } catch (err) {
      errors.push(getErrorMessages(err));
    }
    expect(errors.length).toBe(0);
  });
});
