type ModifyPointFn = (point: number) => void;

interface PointBySpendTimeVariables {
  spendTime: number;
  addValue: ModifyPointFn;
  removeValue: ModifyPointFn;
  addSavingsCalculation: ModifyPointFn;
}

interface PointByManagementCostVariables {
  managementCosts: number;
  addValue: ModifyPointFn;
  removeValue: ModifyPointFn;
  addSavingsCalculation: ModifyPointFn;
}

interface PointByIncomeAndExpenseVariables {
  annualIncome?: number;
  businessExpenses: number;
  addValue: ModifyPointFn;
  removeValue: ModifyPointFn;
  addSavingsCalculation: ModifyPointFn;
}

interface PointByBenefitsVariables {
  benefits: string[];
  addValue: ModifyPointFn;
}

interface PointByHealthCoverageVariables {
  healthCoverage: string[];
  addValue: ModifyPointFn;
}

interface BusinessExpensesVariables {
  annualIncome: number;
  businessExpenses: number;
}

class AnalysisService {
  calulatePointBySpendTime = ({
    spendTime,
    addValue,
    removeValue,
    addSavingsCalculation,
  }: PointBySpendTimeVariables) => {
    if (spendTime === 10) {
      addValue(12);
    } else if (spendTime > 10 && spendTime <= 20) {
      addValue(7);
      addSavingsCalculation(1800);
    } else if (spendTime > 20 && spendTime < 40) {
      addValue(0);
      addSavingsCalculation(3600);
    } else if (spendTime >= 40) {
      removeValue(3);
      addSavingsCalculation(5400);
    }
  };

  calculatePointByManagementCost = ({
    managementCosts,
    addValue,
    removeValue,
    addSavingsCalculation,
  }: PointByManagementCostVariables) => {
    if (managementCosts >= 0 && managementCosts < 1250) {
      addValue(5);
    } else if (managementCosts >= 1250 && managementCosts < 2500) {
      addValue(7);
    } else if (managementCosts >= 2500 && managementCosts < 3750) {
      addValue(10);
    } else if (managementCosts >= 3750 && managementCosts < 6250) {
      addValue(12);
    } else if (managementCosts >= 6250 && managementCosts < 7500) {
      addValue(0);
      addSavingsCalculation(2000);
    } else if (managementCosts >= 7500) {
      removeValue(3);
      addSavingsCalculation(3000);
    }
  };

  calculatePointByIncomeAndExpense = ({
    annualIncome = 0,
    businessExpenses,
    addValue,
  }: PointByIncomeAndExpenseVariables) => {
    if (annualIncome === 40000) {
      addValue(3);
      if (businessExpenses === 10000) {
        addValue(12);
      }
    } else if (annualIncome > 40000 && annualIncome < 80000) {
      addValue(5);
      if (businessExpenses >= 19000 && businessExpenses < 30000) {
        addValue(12);
      } else if (
        businessExpenses === 10000 ||
        (businessExpenses >= 30000 && businessExpenses < 40000)
      ) {
        addValue(7);
      }
    } else if (annualIncome >= 80000 && annualIncome < 150000) {
      addValue(7);
      if (businessExpenses >= 30000 && businessExpenses < 50000) {
        addValue(12);
      } else if (
        (businessExpenses >= 20000 && businessExpenses < 30000) ||
        (businessExpenses >= 50000 && businessExpenses < 60000)
      ) {
        addValue(7);
      }
    } else if (annualIncome >= 150000) {
      addValue(12);
      if (businessExpenses >= 40000 && businessExpenses < 70000) {
        addValue(12);
      }
    }
  };

  calculatePointByBenefits = ({
    benefits,
    addValue,
  }: PointByBenefitsVariables) => {
    benefits.forEach((item) => {
      switch (item) {
        case 'retirement_savings':
          addValue(5);
          break;
        case 'flexible_savings_account':
        case 'health_savings_account':
          addValue(2);
          break;
        case 'retirement_savings' &&
          'flexible_savings_account' &&
          'health_savings_account':
          addValue(3);
          break;
        default:
          break;
      }
    });
  };

  calculatePointByHealthCoverage = ({
    healthCoverage,
    addValue,
  }: PointByHealthCoverageVariables) => {
    // @ts-ignore
    healthCoverage.forEach((item = []) => {
      switch (item) {
        case 'health':
          addValue(7);
          break;
        case 'dental':
          addValue(3);
          break;
        case 'vision':
          addValue(2);
          break;
        default:
          break;
      }
    });
  };

  calculateBusinessExpenses = ({
    annualIncome,
    businessExpenses,
  }: BusinessExpensesVariables) => {
    if (annualIncome === 40000) {
      if (businessExpenses === 10000) {
        return false;
      }
    } else if (annualIncome > 40000 && annualIncome < 80000) {
      if (businessExpenses >= 19000 && businessExpenses < 30000) {
        return false;
      }
    } else if (annualIncome >= 80000 && annualIncome < 150000) {
      if (businessExpenses >= 30000 && businessExpenses < 50000) {
        return false;
      }
    } else if (annualIncome >= 150000) {
      if (businessExpenses >= 40000 && businessExpenses < 70000) {
        return false;
      }
    }
    return true;
  };

  analysis(calculatorData: any) {
    let point = 0;
    let savingsCalculation = 0;

    function addSavingsCalculation(num: number) {
      savingsCalculation += num;
      return savingsCalculation;
    }

    function addValue(num: number) {
      point += num;
      return point;
    }

    function removeValue(num: number) {
      point -= num;
      return point;
    }

    let savingsCalculationDiapason = '';
    let savingsCalculationEnd = 0;
    let businessExpensesCalculation = true;

    const recommendation: any[] = [];

    /**
     * If not legalentity then nothing to show.
     */
    if (calculatorData.legalEntity === '') {
      return { point, recommendation, redirect: true };
    }

    const annualIncome = calculatorData.revenue;
    const spendTime = calculatorData.timeSpend;
    const managementCosts = calculatorData.totalAnnualCost;
    const businessExpenses = calculatorData.expense;
    const valueInsurance = calculatorData.insurance;
    const { taxes } = calculatorData;

    this.calulatePointBySpendTime({
      spendTime,
      addSavingsCalculation,
      addValue,
      removeValue,
    });

    this.calculatePointByManagementCost({
      managementCosts,
      addSavingsCalculation,
      addValue,
      removeValue,
    });

    this.calculatePointByIncomeAndExpense = {
      // @ts-ignore
      annualIncome,
      businessExpenses,
      addValue,
      removeValue,
      addSavingsCalculation,
    };

    if (taxes > 0) {
      addValue(12);
    }

    this.calculatePointByBenefits({
      benefits: calculatorData.benefits,
      addValue,
    });

    this.calculatePointByHealthCoverage({
      healthCoverage: calculatorData.healthCoverage,
      addValue,
    });

    if (valueInsurance) {
      addValue(10);
    }

    const legalEntity = {
      s_corp: {
        points: 12,
      },
      llc: {
        points: 7,
      },
      c_corp: {
        points: 5,
      },
      sole_prop: {
        points: 0,
      },
      '': {
        points: 0,
      },
    };

    // @ts-ignore
    addValue(legalEntity[calculatorData.legalEntity].points);

    businessExpensesCalculation = this.calculateBusinessExpenses({
      annualIncome,
      businessExpenses,
    });

    if (calculatorData.benefits.indexOf('retirement_savings') === -1) {
      if (annualIncome > 40000 && annualIncome < 80000) {
        addSavingsCalculation(7800);
      } else if (annualIncome >= 80000 && annualIncome < 150000) {
        addSavingsCalculation(9600);
      } else if (annualIncome >= 150000) {
        addSavingsCalculation(22750);
      }
    }

    if (calculatorData.benefits.indexOf('flexible_savings_account') === -1) {
      if (annualIncome > 40000) {
        addSavingsCalculation(1500);
      }
    }

    if (calculatorData.benefits.indexOf('health_savings_account') === -1) {
      if (annualIncome > 40000) {
        addSavingsCalculation(1050);
      }
    }

    if (annualIncome <= 40000) {
      if (businessExpensesCalculation === false) {
        savingsCalculationDiapason = savingsCalculation;
        savingsCalculationEnd = savingsCalculation;
      } else {
        savingsCalculationDiapason = `${savingsCalculation + 2000} - ${
          savingsCalculation + 5000
        }`;
        savingsCalculationEnd = 5000 + savingsCalculation;
      }
    } else if (annualIncome > 40000 && annualIncome < 80000) {
      if (businessExpensesCalculation === false) {
        savingsCalculationDiapason = `${savingsCalculation + 4463} - ${
          savingsCalculation + 7142
        }`;
        savingsCalculationEnd = 7142 + savingsCalculation;
      } else {
        savingsCalculationDiapason = `${savingsCalculation + 4463 + 2000} - ${
          savingsCalculation + 7142 + 5000
        }`;
        savingsCalculationEnd = 7142 + 5000 + savingsCalculation;
      }
    } else if (annualIncome >= 80000 && annualIncome < 150000) {
      if (businessExpensesCalculation === false) {
        savingsCalculationDiapason = `${savingsCalculation + 7142} - ${
          savingsCalculation + 13302
        }`;
        savingsCalculationEnd = 13302 + savingsCalculation;
      } else {
        savingsCalculationDiapason = `${savingsCalculation + 7142 + 2000} - ${
          savingsCalculation + 13302 + 5000
        }`;
        savingsCalculationEnd = 13302 + 5000 + savingsCalculation;
      }
    } else if (annualIncome >= 150000) {
      if (businessExpensesCalculation === false) {
        savingsCalculationDiapason = `${savingsCalculation + 13302} - ${
          savingsCalculation + 14507
        }`;
        savingsCalculationEnd = 14507 + savingsCalculation;
      } else {
        savingsCalculationDiapason = `${savingsCalculation + 13302 + 2000} - ${
          savingsCalculation + 14507 + 5000
        }`;
        savingsCalculationEnd = 14507 + 5000 + savingsCalculation;
      }
    }

    return {
      point,
      recommendation,
      savingsCalculationEnd,
      savingsCalculationDiapason,
      redirect: false,
    };
  }
}

export default new AnalysisService();
