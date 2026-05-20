// components/steps/FinancialDataStep.jsx
import React from 'react';

const FinancialDataStep = ({ formData, setFormData }) => {
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const parseAmount = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.-]/g, '')) || 0;
  };

  const revenue = parseAmount(formData.totalRevenue || '0');
  const expenses = parseAmount(formData.totalExpenses || '0');
  const netProfit = revenue - expenses;

  return (
    <div className="grid lg:grid-cols-2 gap-8 p-6">
      {/* Left Col */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-800">Select Month & Year</label>
          <div className="grid grid-cols-2 gap-3">
            <select id="month" value={formData.month} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="number" id="year" value={formData.year} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">₹</span>
            Revenue & Expenses
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">Total Revenue (₹)</label>
              <input type="text" id="totalRevenue" value={formData.totalRevenue} onChange={handleChange} placeholder="e.g. 5000000" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">Total Expenses (₹)</label>
              <input type="text" id="totalExpenses" value={formData.totalExpenses} onChange={handleChange} placeholder="e.g. 4200000" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-teal-300 bg-teal-50/50">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Net Profit (Auto)</span>
                <span>Revenue − Expenses</span>
              </div>
              <p className={`font-display font-bold text-xl ${netProfit >= 0 ? 'text-teal-700' : 'text-red-600'}`}>
                ₹{netProfit.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">Cash Balance (₹)</label>
              <input type="text" id="cashBalance" value={formData.cashBalance} onChange={handleChange} placeholder="e.g. 1500000" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">GST Summary</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GST Liability</label>
              <input type="text" id="gstLiability" value={formData.gstLiability} onChange={handleChange} placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">ITC</label>
              <input type="text" id="itc" value={formData.itc} onChange={handleChange} placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GST Paid</label>
              <input type="text" id="gstPaid" value={formData.gstPaid} onChange={handleChange} placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Col */}
      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Receivables Ageing</h4>
          <div className="grid grid-cols-2 gap-3">
            {['Not Due', '< 30 Days', '30-60 Days', '60-90 Days', '90-180 Days', '> 180 Days'].map(label => (
              <div key={label}>
                <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
                <input type="text" placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Working Capital</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Current Assets</label>
              <input type="text" placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Current Liabilities</label>
              <input type="text" placeholder="₹0" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDataStep;