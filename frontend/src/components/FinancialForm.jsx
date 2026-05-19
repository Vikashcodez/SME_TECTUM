// src/components/FinancialForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import { X, Save, AlertCircle, TrendingUp, TrendingDown, DollarSign, Calendar, Building, Percent } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FinancialForm = ({ financial, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const companyIdFromAuth = user?.company_id || user?.companyId;

  const [formData, setFormData] = useState({
    company_id: financial?.company_id ? String(financial.company_id) : String(companyIdFromAuth || ''),
    fiscal_year: financial?.fiscal_year || new Date().getFullYear().toString(),
    month: financial?.month || 'January',
    status: financial?.status || 'Draft',
    revenue: financial?.revenue || 0,
    expenses: financial?.expenses || 0,
    b2b_sales: financial?.b2b_sales || 0,
    b2c_sales: financial?.b2c_sales || 0,
    cash_balance: financial?.cash_balance || 0,
    total_gst_liability: financial?.total_gst_liability || 0,
    input_tax_credit: financial?.input_tax_credit || 0,
    monthly_gst_tax_paid: financial?.monthly_gst_tax_paid || 0,
    recv_not_due: financial?.recv_not_due || 0,
    recv_less_30: financial?.recv_less_30 || 0,
    recv_30_60: financial?.recv_30_60 || 0,
    recv_60_90: financial?.recv_60_90 || 0,
    recv_90_180: financial?.recv_90_180 || 0,
    recv_above_180: financial?.recv_above_180 || 0,
    pay_not_due: financial?.pay_not_due || 0,
    pay_less_30: financial?.pay_less_30 || 0,
    pay_30_60: financial?.pay_30_60 || 0,
    pay_60_90: financial?.pay_60_90 || 0,
    pay_90_180: financial?.pay_90_180 || 0,
    pay_above_180: financial?.pay_above_180 || 0,
    current_assets: financial?.current_assets || 0,
    current_liabilities: financial?.current_liabilities || 0,
    total_debt: financial?.total_debt || 0,
    wc_utilization_used: financial?.wc_utilization_used || 0,
    working_capital_limit: financial?.working_capital_limit || 0,
    short_term_debt: financial?.short_term_debt || 0,
    equity: financial?.equity || 0,
    interest_expense: financial?.interest_expense || 0,
    existing_loan_amount: financial?.existing_loan_amount || 0,
    loan_type: financial?.loan_type || '',
    emi_amount: financial?.emi_amount || 0,
    interest_rate: financial?.interest_rate || 0,
    loan_tenure_months: financial?.loan_tenure_months || 0,
    emi_start_date: financial?.emi_start_date || '',
    loan_security_collateral: financial?.loan_security_collateral || '',
    overdue_amount: financial?.overdue_amount || 0,
    credit_score: financial?.credit_score || 0,
    bank_nbfc_name: financial?.bank_nbfc_name || '',
    emi_delays_last_12_months: financial?.emi_delays_last_12_months || 0,
    loan_restructuring_history: financial?.loan_restructuring_history || '',
    rec_from_receivables: financial?.rec_from_receivables || 0,
    paid_for_payables: financial?.paid_for_payables || 0,
    paid_to_employees: financial?.paid_to_employees || 0,
    other_overheads: financial?.other_overheads || 0,
    income_tax_paid: financial?.income_tax_paid || 0,
    purchase_of_ppe: financial?.purchase_of_ppe || 0,
    sale_of_ppe: financial?.sale_of_ppe || 0,
    share_capital_issued: financial?.share_capital_issued || 0,
    bank_loan_repaid: financial?.bank_loan_repaid || 0,
    debentures_redeemed: financial?.debentures_redeemed || 0,
    dividends_paid: financial?.dividends_paid || 0,
    cash_at_beginning: financial?.cash_at_beginning || 0,
    cash_at_end: financial?.cash_at_end || 0,
    avg_monthly_inflows: financial?.avg_monthly_inflows || 0,
    avg_monthly_outflows: financial?.avg_monthly_outflows || 0,
    months_with_cash_shortage: financial?.months_with_cash_shortage || 0,
    created_by: financial?.created_by || null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['revenue', 'expenses', 'b2b_sales', 'b2c_sales', 'cash_balance', 'total_gst_liability', 'input_tax_credit', 'monthly_gst_tax_paid',
      'recv_not_due', 'recv_less_30', 'recv_30_60', 'recv_60_90', 'recv_90_180', 'recv_above_180',
      'pay_not_due', 'pay_less_30', 'pay_30_60', 'pay_60_90', 'pay_90_180', 'pay_above_180',
      'current_assets', 'current_liabilities', 'total_debt', 'wc_utilization_used', 'working_capital_limit', 
      'short_term_debt', 'equity', 'interest_expense', 'existing_loan_amount', 'emi_amount', 'interest_rate',
      'loan_tenure_months', 'overdue_amount', 'credit_score', 'emi_delays_last_12_months',
      'rec_from_receivables', 'paid_for_payables', 'paid_to_employees', 'other_overheads', 'income_tax_paid',
      'purchase_of_ppe', 'sale_of_ppe', 'share_capital_issued', 'bank_loan_repaid', 'debentures_redeemed',
      'dividends_paid', 'cash_at_beginning', 'cash_at_end', 'avg_monthly_inflows', 'avg_monthly_outflows', 'months_with_cash_shortage'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_id) newErrors.company_id = 'Company ID is required';
    if (!formData.fiscal_year) newErrors.fiscal_year = 'Fiscal year is required';
    if (!formData.month) newErrors.month = 'Month is required';
    if (formData.revenue < 0) newErrors.revenue = 'Revenue cannot be negative';
    if (formData.expenses < 0) newErrors.expenses = 'Expenses cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (financial?.financial_id) {
        await axios.put(`http://localhost:5000/api/financials/${financial.financial_id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/financials', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving financial:', error);
      setSubmitError(error?.response?.data?.message || 'Error saving financial record');
    } finally {
      setLoading(false);
    }
  };

  const netProfit = formData.revenue - formData.expenses;
  const currentRatio = formData.current_liabilities > 0 ? (formData.current_assets / formData.current_liabilities).toFixed(2) : 0;
  const debtToEquity = formData.equity > 0 ? (formData.total_debt / formData.equity).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 pointer-events-auto z-40" onClick={onClose}></div>
      <div className="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl mx-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {financial ? 'Edit Financial Report' : 'Add New Financial Report'}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Enter financial details for the selected period
                </p>
              </div>
              <button onClick={onClose} className="text-white hover:text-blue-200 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
            {submitError && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}
            <div className="px-6 py-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Basic Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company ID
                    </label>
                    <input
                      type="number"
                      name="company_id"
                      value={formData.company_id}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                      placeholder="Auto-filled from your company"
                    />
                    {errors.company_id && <p className="text-red-500 text-xs mt-1">{errors.company_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiscal Year *
                    </label>
                    <select
                      name="fiscal_year"
                      value={formData.fiscal_year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month *
                    </label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Revenue & Profitability */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Revenue & Profitability</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue (₹)
                    </label>
                    <input
                      type="number"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expenses (₹)
                    </label>
                    <input
                      type="number"
                      name="expenses"
                      value={formData.expenses}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      B2B Sales (₹)
                    </label>
                    <input
                      type="number"
                      name="b2b_sales"
                      value={formData.b2b_sales}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      B2C Sales (₹)
                    </label>
                    <input
                      type="number"
                      name="b2c_sales"
                      value={formData.b2c_sales}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Net Profit (Auto-calculated)
                  </label>
                  <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{netProfit.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Balance Sheet Items */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Balance Sheet</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Assets (₹)
                    </label>
                    <input
                      type="number"
                      name="current_assets"
                      value={formData.current_assets}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Liabilities (₹)
                    </label>
                    <input
                      type="number"
                      name="current_liabilities"
                      value={formData.current_liabilities}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Current Ratio (Auto)
                    </label>
                    <p className="text-lg font-bold text-purple-600">{currentRatio}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Debt (₹)
                    </label>
                    <input
                      type="number"
                      name="total_debt"
                      value={formData.total_debt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equity (₹)
                    </label>
                    <input
                      type="number"
                      name="equity"
                      value={formData.equity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Debt to Equity (Auto)
                    </label>
                    <p className="text-lg font-bold text-purple-600">{debtToEquity}</p>
                  </div>
                </div>
              </div>

              {/* GST & Tax Information */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Percent className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">GST & Tax Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total GST Liability (₹)
                    </label>
                    <input
                      type="number"
                      name="total_gst_liability"
                      value={formData.total_gst_liability}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Input Tax Credit (₹)
                    </label>
                    <input
                      type="number"
                      name="input_tax_credit"
                      value={formData.input_tax_credit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly GST Paid (₹)
                    </label>
                    <input
                      type="number"
                      name="monthly_gst_tax_paid"
                      value={formData.monthly_gst_tax_paid}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Building className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Loan Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Loan Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="existing_loan_amount"
                      value={formData.existing_loan_amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMI Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="emi_amount"
                      value={formData.emi_amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Cash Position */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-indigo-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Cash Position</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cash Balance (₹)
                  </label>
                  <input
                    type="number"
                    name="cash_balance"
                    value={formData.cash_balance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Receivables Aging */}
              <div className="bg-cyan-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-cyan-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Receivables Aging (₹)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Not Due</label>
                    <input type="number" name="recv_not_due" value={formData.recv_not_due} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">0-30 Days</label>
                    <input type="number" name="recv_less_30" value={formData.recv_less_30} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">30-60 Days</label>
                    <input type="number" name="recv_30_60" value={formData.recv_30_60} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">60-90 Days</label>
                    <input type="number" name="recv_60_90" value={formData.recv_60_90} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">90-180 Days</label>
                    <input type="number" name="recv_90_180" value={formData.recv_90_180} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Above 180 Days</label>
                    <input type="number" name="recv_above_180" value={formData.recv_above_180} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Payables Aging */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Payables Aging (₹)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Not Due</label>
                    <input type="number" name="pay_not_due" value={formData.pay_not_due} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">0-30 Days</label>
                    <input type="number" name="pay_less_30" value={formData.pay_less_30} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">30-60 Days</label>
                    <input type="number" name="pay_30_60" value={formData.pay_30_60} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">60-90 Days</label>
                    <input type="number" name="pay_60_90" value={formData.pay_60_90} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">90-180 Days</label>
                    <input type="number" name="pay_90_180" value={formData.pay_90_180} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Above 180 Days</label>
                    <input type="number" name="pay_above_180" value={formData.pay_above_180} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Extended Balance Sheet */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Working Capital Details (₹)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WC Utilization Used</label>
                    <input type="number" name="wc_utilization_used" value={formData.wc_utilization_used} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Capital Limit</label>
                    <input type="number" name="working_capital_limit" value={formData.working_capital_limit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Term Debt</label>
                    <input type="number" name="short_term_debt" value={formData.short_term_debt} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Expense</label>
                    <input type="number" name="interest_expense" value={formData.interest_expense} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Extended Loan Details */}
              <div className="bg-rose-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Building className="w-5 h-5 text-rose-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Extended Loan Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                    <input type="text" name="loan_type" value={formData.loan_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (Months)</label>
                    <input type="number" name="loan_tenure_months" value={formData.loan_tenure_months} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">EMI Start Date</label>
                    <input type="date" name="emi_start_date" value={formData.emi_start_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Security Collateral</label>
                    <input type="text" name="loan_security_collateral" value={formData.loan_security_collateral} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Credit Information */}
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Credit Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overdue Amount (₹)</label>
                    <input type="number" name="overdue_amount" value={formData.overdue_amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
                    <input type="number" name="credit_score" value={formData.credit_score} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank/NBFC Name</label>
                    <input type="text" name="bank_nbfc_name" value={formData.bank_nbfc_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">EMI Delays (Last 12 Months)</label>
                    <input type="number" name="emi_delays_last_12_months" value={formData.emi_delays_last_12_months} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Restructuring History</label>
                    <input type="text" name="loan_restructuring_history" value={formData.loan_restructuring_history} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Cash Flow Items */}
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Cash Flow Items (₹)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Received from Receivables</label>
                    <input type="number" name="rec_from_receivables" value={formData.rec_from_receivables} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid for Payables</label>
                    <input type="number" name="paid_for_payables" value={formData.paid_for_payables} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid to Employees</label>
                    <input type="number" name="paid_to_employees" value={formData.paid_to_employees} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Overheads</label>
                    <input type="number" name="other_overheads" value={formData.other_overheads} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Income Tax Paid</label>
                    <input type="number" name="income_tax_paid" value={formData.income_tax_paid} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase of PPE</label>
                    <input type="number" name="purchase_of_ppe" value={formData.purchase_of_ppe} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale of PPE</label>
                    <input type="number" name="sale_of_ppe" value={formData.sale_of_ppe} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share Capital Issued</label>
                    <input type="number" name="share_capital_issued" value={formData.share_capital_issued} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Loan Repaid</label>
                    <input type="number" name="bank_loan_repaid" value={formData.bank_loan_repaid} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Debentures Redeemed</label>
                    <input type="number" name="debentures_redeemed" value={formData.debentures_redeemed} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dividends Paid</label>
                    <input type="number" name="dividends_paid" value={formData.dividends_paid} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              {/* Cash Flow Statement */}
              <div className="bg-lime-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <TrendingDown className="w-5 h-5 text-lime-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Cash Flow Statement (₹)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cash at Beginning</label>
                    <input type="number" name="cash_at_beginning" value={formData.cash_at_beginning} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cash at End</label>
                    <input type="number" name="cash_at_end" value={formData.cash_at_end} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Monthly Inflows</label>
                    <input type="number" name="avg_monthly_inflows" value={formData.avg_monthly_inflows} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Monthly Outflows</label>
                    <input type="number" name="avg_monthly_outflows" value={formData.avg_monthly_outflows} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Months with Cash Shortage</label>
                    <input type="number" name="months_with_cash_shortage" value={formData.months_with_cash_shortage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Financial Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default FinancialForm;