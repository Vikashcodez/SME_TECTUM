// components/EntryModal.jsx
import React, { useState } from 'react';
import FinancialDataStep from './steps/FinancialDataStep';
import GSTFormsStep from './steps/GSTFormsStep';
import ReviewStep from './steps/ReviewStep';

// Initial state strictly matching DB columns
const initialState = {
  // Core Identification
  company_id: '1', // Should be dynamic from auth
  fiscal_year: '2026-27',
  month: 'May',
  status: 'Draft',

  // Revenue & Expenses (financials table)
  revenue: '', expenses: '', b2b_sales: '', b2c_sales: '', cash_balance: '',

  // GST Totals (financials table)
  total_gst_liability: '', input_tax_credit: '', monthly_gst_tax_paid: '',

  // Receivables Ageing (financials table)
  recv_not_due: '', recv_less_30: '', recv_30_60: '', recv_60_90: '', recv_90_180: '', recv_above_180: '',

  // Payables Ageing (financials table)
  pay_not_due: '', pay_less_30: '', pay_30_60: '', pay_60_90: '', pay_90_180: '', pay_above_180: '',

  // Working Capital (financials table)
  current_assets: '', current_liabilities: '', total_debt: '', wc_utilization_used: '', 
  working_capital_limit: '', short_term_debt: '', equity: '', interest_expense: '',

  // Loan Details (financials table)
  existing_loan_amount: '', loan_type: '', emi_amount: '', interest_rate: '',
  loan_tenure_months: '', emi_start_date: '', loan_security_collateral: '', 
  overdue_amount: '', credit_score: '', bank_nbfc_name: '', 
  emi_delays_last_12_months: '', loan_restructuring_history: '',

  // Cash Flow (financials table)
  rec_from_receivables: '', paid_for_payables: '', paid_to_employees: '', other_overheads: '',
  income_tax_paid: '', purchase_of_ppe: '', sale_of_ppe: '', share_capital_issued: '',
  bank_loan_repaid: '', debentures_redeemed: '', dividends_paid: '', 
  cash_at_beginning: '', cash_at_end: '', avg_monthly_inflows: '', avg_monthly_outflows: '',
  months_with_cash_shortage: '',
  
  created_by: '1', // Should be dynamic from auth

  // GST Arrays (Child Tables)
  gst_b2b_sales: [],
  gst_b2c_inter_state_sales: [],
  gst_b2c_intra_state_sales: [],
  gst_exports: [],
  gst_nil_exempt_sales: { inter_state_sales: '', intra_state_sales: '' },
  gst_credit_debit_notes: [],
  gst_advances_received: [],
  gst_hsn_summary: [],
  gst_documents_issued: { total_invoices_issued: '', invoices_cancelled: '' }
};

const EntryModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialState);

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSave = () => {
    console.log("Payload for Backend:", formData);
    alert('Data prepared for backend. Check console.');
    onClose();
    setFormData(initialState);
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <FinancialDataStep formData={formData} setFormData={setFormData} />;
      case 2: return <GSTFormsStep formData={formData} setFormData={setFormData} />;
      case 3: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp">
        {/* Header (same as before) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-teal-500 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-white">Add Financial Entry</h3>
              <p className="text-sm text-teal-100 mt-1">Step {currentStep} of 3</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            {[1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-white' : 'bg-white/30'}`}></div>)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-6">
          {renderStep()}
        </div>

        {/* Footer (same as before) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={prevStep} className={`px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors ${currentStep === 1 ? 'invisible' : ''}`}>
            ← Back
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700">Cancel</button>
            {currentStep < 3 ? (
              <button onClick={nextStep} className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-sm">Next Step</button>
            ) : (
              <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">Save Entry</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;