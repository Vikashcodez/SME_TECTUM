// src/components/FinancialForm.jsx
import React, { useState } from 'react';
import { X, Save, AlertCircle, TrendingUp, TrendingDown, DollarSign, Calendar, Building, Percent } from 'lucide-react';
import axios from 'axios';

const FinancialForm = ({ financial, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_id: financial?.company_id ? String(financial.company_id) : '',
    fiscal_year: financial?.fiscal_year || new Date().getFullYear().toString(),
    month: financial?.month || 'January',
    status: financial?.status || 'Draft',
    revenue: financial?.revenue || 0,
    expenses: financial?.expenses || 0,
    cash_balance: financial?.cash_balance || 0,
    total_gst_liability: financial?.total_gst_liability || 0,
    input_tax_credit: financial?.input_tax_credit || 0,
    monthly_gst_tax_paid: financial?.monthly_gst_tax_paid || 0,
    current_assets: financial?.current_assets || 0,
    current_liabilities: financial?.current_liabilities || 0,
    total_debt: financial?.total_debt || 0,
    equity: financial?.equity || 0,
    existing_loan_amount: financial?.existing_loan_amount || 0,
    emi_amount: financial?.emi_amount || 0,
    interest_rate: financial?.interest_rate || 0
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'company_id' ? parseInt(value) : 
              (name.includes('revenue') || name.includes('expenses') || name.includes('balance') ||
               name.includes('liability') || name.includes('credit') || name.includes('assets') ||
               name.includes('debt') || name.includes('equity') || name.includes('loan') ||
               name.includes('emi') || name.includes('rate')) ? parseFloat(value) || 0 : value
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
        await axios.put(`/api/financials/${financial.financial_id}`, formData);
      } else {
        await axios.post('/api/financials', formData);
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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
                      Company ID *
                    </label>
                    <input
                      type="number"
                      name="company_id"
                      value={formData.company_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company ID"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Net Profit (Auto-calculated)
                    </label>
                    <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{netProfit.toLocaleString()}
                    </p>
                  </div>
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
    </div>
  );
};

export default FinancialForm;