// src/components/FinancialDetails.jsx
import React from 'react';
import { X, Calendar, TrendingUp, TrendingDown, DollarSign, Building, Percent, CreditCard, Activity } from 'lucide-react';

const FinancialDetails = ({ financial, onClose }) => {
  // Calculate derived values if not provided by backend
  const workingCapital = financial.working_capital !== null && financial.working_capital !== undefined 
    ? financial.working_capital 
    : (financial.current_assets || 0) - (financial.current_liabilities || 0);
  
  const currentRatio = financial.current_ratio !== null && financial.current_ratio !== undefined
    ? financial.current_ratio
    : financial.current_liabilities > 0 ? (financial.current_assets || 0) / (financial.current_liabilities || 1) : 0;
  
  const debtToEquityRatio = financial.debt_to_equity_ratio !== null && financial.debt_to_equity_ratio !== undefined
    ? financial.debt_to_equity_ratio
    : financial.equity > 0 ? (financial.total_debt || 0) / (financial.equity || 1) : 0;
  
  const totalReceivables = financial.total_accounts_receivable !== null && financial.total_accounts_receivable !== undefined
    ? financial.total_accounts_receivable
    : (financial.recv_not_due || 0) + (financial.recv_less_30 || 0) + (financial.recv_30_60 || 0) + 
      (financial.recv_60_90 || 0) + (financial.recv_90_180 || 0) + (financial.recv_above_180 || 0);
  
  const totalPayables = financial.total_accounts_payable !== null && financial.total_accounts_payable !== undefined
    ? financial.total_accounts_payable
    : (financial.pay_not_due || 0) + (financial.pay_less_30 || 0) + (financial.pay_30_60 || 0) + 
      (financial.pay_60_90 || 0) + (financial.pay_90_180 || 0) + (financial.pay_above_180 || 0);
  
  const isuRatio = financial.itc_utilization_ratio !== null && financial.itc_utilization_ratio !== undefined
    ? financial.itc_utilization_ratio
    : financial.total_gst_liability > 0 ? ((financial.input_tax_credit || 0) / (financial.total_gst_liability || 1)) * 100 : 0;
  
  const taxToRevenueRatio = financial.tax_to_revenue_ratio !== null && financial.tax_to_revenue_ratio !== undefined
    ? financial.tax_to_revenue_ratio
    : financial.revenue > 0 ? ((financial.monthly_gst_tax_paid || 0) / (financial.revenue || 1)) * 100 : 0;
  
  const emiBurdenPercent = financial.emi_burden_percent !== null && financial.emi_burden_percent !== undefined
    ? financial.emi_burden_percent
    : (financial.revenue - financial.expenses) > 0 ? ((financial.emi_amount || 0) / (financial.revenue - financial.expenses)) * 100 : 0;
  
  const cashReserveMonths = financial.cash_reserve_months !== null && financial.cash_reserve_months !== undefined
    ? financial.cash_reserve_months
    : financial.avg_monthly_outflows > 0 ? (financial.cash_balance || 0) / (financial.avg_monthly_outflows || 1) : 0;
  
  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const formatPercentage = (value) => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    return `${numValue.toFixed(2)}%`;
  };

  const InfoCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  const DetailItem = ({ label, value, format = 'currency' }) => {
    let displayValue = 'N/A';
    
    if (value !== null && value !== undefined && value !== '') {
      if (format === 'currency') {
        displayValue = formatCurrency(value);
      } else if (format === 'percentage') {
        displayValue = formatPercentage(value);
      } else if (format === 'decimal') {
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        displayValue = numValue.toFixed(2);
      } else {
        displayValue = value;
      }
    }
    
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-900">{displayValue}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 pointer-events-auto z-40" onClick={onClose}></div>
      <div className="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl mx-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Financial Report Details
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  {financial.month} {financial.fiscal_year}
                </p>
              </div>
              <button onClick={onClose} className="text-white hover:text-indigo-200 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <InfoCard 
                title="Total Revenue" 
                value={formatCurrency(financial.revenue)}
                icon={TrendingUp}
                color="text-green-600"
              />
              <InfoCard 
                title="Net Profit" 
                value={formatCurrency(financial.net_profit)}
                icon={Activity}
                color={financial.net_profit >= 0 ? "text-green-600" : "text-red-600"}
              />
              <InfoCard 
                title="Cash Balance" 
                value={formatCurrency(financial.cash_balance)}
                icon={DollarSign}
                color="text-blue-600"
              />
              <InfoCard 
                title="Working Capital" 
                value={formatCurrency(workingCapital)}
                icon={Building}
                color="text-purple-600"
              />
            </div>

            {/* Basic Info */}
            <Section title="Basic Information">
              <DetailItem label="Company ID" value={financial.company_id} format="text" />
              <DetailItem label="Fiscal Year" value={financial.fiscal_year} format="text" />
              <DetailItem label="Month" value={financial.month} format="text" />
              <DetailItem label="Status" value={financial.status} format="text" />
            </Section>

            {/* Profitability */}
            <Section title="Profitability Metrics">
              <DetailItem label="Revenue" value={financial.revenue} />
              <DetailItem label="B2B Sales" value={financial.b2b_sales} />
              <DetailItem label="B2C Sales" value={financial.b2c_sales} />
              <DetailItem label="Expenses" value={financial.expenses} />
              <DetailItem label="Net Profit" value={financial.net_profit} />
            </Section>

            {/* Balance Sheet */}
            <Section title="Balance Sheet">
              <DetailItem label="Current Assets" value={financial.current_assets} />
              <DetailItem label="Current Liabilities" value={financial.current_liabilities} />
              <DetailItem label="Working Capital" value={workingCapital} />
              <DetailItem label="Current Ratio" value={currentRatio} format="percentage" />
              <DetailItem label="Total Debt" value={financial.total_debt} />
              <DetailItem label="Equity" value={financial.equity} />
              <DetailItem label="Debt to Equity Ratio" value={debtToEquityRatio} format="percentage" />
            </Section>

            {/* Receivables Aging */}
            <Section title="Receivables Aging">
              <DetailItem label="Not Due" value={financial.recv_not_due} />
              <DetailItem label="0-30 Days" value={financial.recv_less_30} />
              <DetailItem label="30-60 Days" value={financial.recv_30_60} />
              <DetailItem label="60-90 Days" value={financial.recv_60_90} />
              <DetailItem label="90-180 Days" value={financial.recv_90_180} />
              <DetailItem label="180+ Days" value={financial.recv_above_180} />
              <DetailItem label="Total Receivables" value={totalReceivables} />
            </Section>

            {/* Payables Aging */}
            <Section title="Payables Aging">
              <DetailItem label="Not Due" value={financial.pay_not_due} />
              <DetailItem label="0-30 Days" value={financial.pay_less_30} />
              <DetailItem label="30-60 Days" value={financial.pay_30_60} />
              <DetailItem label="60-90 Days" value={financial.pay_60_90} />
              <DetailItem label="90-180 Days" value={financial.pay_90_180} />
              <DetailItem label="180+ Days" value={financial.pay_above_180} />
              <DetailItem label="Total Payables" value={totalPayables} />
            </Section>

            {/* GST Information */}
            <Section title="GST & Tax Information">
              <DetailItem label="Total GST Liability" value={financial.total_gst_liability} />
              <DetailItem label="Input Tax Credit" value={financial.input_tax_credit} />
              <DetailItem label="Monthly GST Paid" value={financial.monthly_gst_tax_paid} />
              <DetailItem label="ITC Utilization Ratio" value={isuRatio} format="percentage" />
              <DetailItem label="Tax to Revenue Ratio" value={taxToRevenueRatio} format="percentage" />
            </Section>

            {/* Loan Details */}
            {(financial.existing_loan_amount > 0 || financial.emi_amount > 0) && (
              <Section title="Loan Details">
                <DetailItem label="Existing Loan Amount" value={financial.existing_loan_amount} />
                <DetailItem label="Loan Type" value={financial.loan_type || 'N/A'} format="text" />
                <DetailItem label="EMI Amount" value={financial.emi_amount} />
                <DetailItem label="Interest Rate" value={financial.interest_rate} format="percentage" />
                <DetailItem label="EMI Burden %" value={emiBurdenPercent} format="percentage" />
              </Section>
            )}

            {/* Cash Flow */}
            <Section title="Cash Flow Statement">
              <DetailItem label="Cash at Beginning" value={financial.cash_at_beginning} />
              <DetailItem label="Cash at End" value={financial.cash_at_end} />
              <DetailItem label="Avg Monthly Inflows" value={financial.avg_monthly_inflows} />
              <DetailItem label="Avg Monthly Outflows" value={financial.avg_monthly_outflows} />
              <DetailItem label="Cash Reserve Months" value={cashReserveMonths} format="decimal" />
            </Section>
          </div>
        </div>
    </div>
  );
};

export default FinancialDetails;