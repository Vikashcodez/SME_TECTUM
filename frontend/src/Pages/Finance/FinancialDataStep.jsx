// components/steps/FinancialDataStep.jsx
import React from 'react';

const FinancialDataStep = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const InputField = ({ id, label, placeholder, type = "text" }) => (
    <div>
      <label className="block text-xs text-slate-500 mb-1 font-medium">{label}</label>
      <input 
        type={type} 
        id={id} 
        value={formData[id]} 
        onChange={handleChange} 
        placeholder={placeholder} 
        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Revenue & Expenses</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField id="revenue" label="Total Revenue (₹)" placeholder="e.g. 5000000" />
              <InputField id="expenses" label="Total Expenses (₹)" placeholder="e.g. 4200000" />
            </div>
            {/* New Fields based on Schema */}
            <div className="grid grid-cols-2 gap-4">
              <InputField id="b2b_sales" label="B2B Sales (₹)" placeholder="Auto or Manual" />
              <InputField id="b2c_sales" label="B2C Sales (₹)" placeholder="Auto or Manual" />
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-teal-300">
              <p className="text-xs text-slate-500 mb-1">Net Profit (Auto Calculated in DB)</p>
              <p className="font-bold text-slate-800">
                ₹{(parseFloat(formData.revenue || 0) - parseFloat(formData.expenses || 0)).toLocaleString('en-IN')}
              </p>
            </div>
            <InputField id="cash_balance" label="Cash Balance (₹)" placeholder="Current cash" />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">GST Summary</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField id="total_gst_liability" label="GST Liability" placeholder="₹0" />
            <InputField id="input_tax_credit" label="ITC" placeholder="₹0" />
            <InputField id="monthly_gst_tax_paid" label="GST Paid" placeholder="₹0" />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Receivables Ageing (₹)</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField id="recv_not_due" label="Not Due" placeholder="₹0" />
            <InputField id="recv_less_30" label="< 30 Days" placeholder="₹0" />
            <InputField id="recv_30_60" label="30-60 Days" placeholder="₹0" />
            <InputField id="recv_60_90" label="60-90 Days" placeholder="₹0" />
            <InputField id="recv_90_180" label="90-180 Days" placeholder="₹0" />
            <InputField id="recv_above_180" label="> 180 Days" placeholder="₹0" />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Payables Ageing (₹)</h4>
          <div className="grid grid-cols-3 gap-3">
            <InputField id="pay_not_due" label="Not Due" placeholder="₹0" />
            <InputField id="pay_less_30" label="< 30 Days" placeholder="₹0" />
            <InputField id="pay_30_60" label="30-60 Days" placeholder="₹0" />
            <InputField id="pay_60_90" label="60-90 Days" placeholder="₹0" />
            <InputField id="pay_90_180" label="90-180 Days" placeholder="₹0" />
            <InputField id="pay_above_180" label="> 180 Days" placeholder="₹0" />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold mb-4 text-slate-800">Working Capital & Debt</h4>
          <div className="grid grid-cols-2 gap-3">
            <InputField id="current_assets" label="Current Assets" placeholder="₹0" />
            <InputField id="current_liabilities" label="Current Liabilities" placeholder="₹0" />
            <InputField id="total_debt" label="Total Debt" placeholder="₹0" />
            <InputField id="equity" label="Equity" placeholder="₹0" />
            <InputField id="wc_utilization_used" label="WC Utilized" placeholder="₹0" />
            <InputField id="working_capital_limit" label="WC Limit" placeholder="₹0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDataStep;