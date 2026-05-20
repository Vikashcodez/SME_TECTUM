// components/steps/ReviewStep.jsx
import React from 'react';

const ReviewStep = ({ formData }) => {
  const revenueNum = Number(formData.revenue || 0);
  const expensesNum = Number(formData.expenses || 0);
  const netProfit = revenueNum - expensesNum;

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    const num = Number(value);
    if (Number.isNaN(num)) return 'Not provided';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl mb-2 text-slate-900">Ready to Save</h3>
        <p className="text-slate-500 mb-6">You have completed all stages. Click Save to submit this entry.</p>
        
        <div className="bg-slate-50 rounded-xl p-6 text-left max-w-lg mx-auto border border-slate-200">
          <h4 className="font-semibold mb-3 text-slate-800">Summary</h4>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Month:</span>
              <span className="font-medium">{formData.month || 'Not selected'} {formData.fiscal_year || ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Revenue:</span>
              <span className="font-medium">{formatMoney(formData.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expenses:</span>
              <span className="font-medium">{formatMoney(formData.expenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Net Profit:</span>
              <span className="font-medium">{formatMoney(netProfit)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;