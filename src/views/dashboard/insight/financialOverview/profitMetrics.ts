export interface IProfitMetric {
  name: string;
  amount: number;
  key: 'ytdGrossProfit' | 'ytdExpense' | 'ytdNetProfit';
}

export const profitMetrics: IProfitMetric[] = [
  {
    name: 'Income',
    amount: 0,
    key: 'ytdGrossProfit',
  },
  {
    name: 'Expenses',
    amount: 0,
    key: 'ytdExpense',
  },
  {
    name: 'Net Income',
    amount: 0,
    key: 'ytdNetProfit',
  },
];
