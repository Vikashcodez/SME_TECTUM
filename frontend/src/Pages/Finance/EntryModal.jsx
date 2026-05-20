// components/EntryModal.jsx
import React, { useState } from 'react';
import FinancialDataStep from './FinancialDataStep';
import GSTFormsStep from './GSTFormsStep';
import ReviewStep from './ReviewStep';

const apiUrl = 'http://localhost:5000/api/financials';

// Initial state strictly matching DB columns
const initialState = {
  // Core Identification
  company_id: '1', // Should be dynamic from auth
  fiscal_year: '',
  month: '',
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

const EntryModal = ({ isOpen = true, onClose, pageMode = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const steps = ['Financial Data', 'GST Forms', 'Review & Save'];

  if (!pageMode && !isOpen) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSave = async () => {
    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to save financial entry');
      }

      alert('Financial entry saved successfully');
      onClose();
      setFormData(initialState);
      setCurrentStep(1);
    } catch (error) {
      setSubmitError(error.message || 'Unable to save financial entry');
    } finally {
      setLoading(false);
    }
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
    <div className={pageMode ? 'min-h-screen bg-slate-50 p-6 lg:p-8' : 'fixed inset-0 z-50 flex items-start justify-center pt-10'}>
      {!pageMode && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>}
      <div className={pageMode ? 'relative mx-auto bg-white rounded-2xl w-full max-w-6xl min-h-[calc(100vh-4rem)] overflow-hidden shadow-xl border border-slate-200 flex flex-col animate-slideUp' : 'relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp'}>
        {/* Header (same as before) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-teal-500 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-white">Add Financial Entry</h3>
              <p className="text-sm text-teal-100 mt-1">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          <div className="mt-5 rounded-xl border border-white/20 bg-white/10 px-4 py-4">
            <div className="relative">
              <div className="absolute left-4 right-4 top-4 h-[2px] bg-white/30"></div>
              <div
                className="absolute left-4 top-4 h-[2px] bg-white transition-all duration-500"
                style={{
                  width: steps.length > 1 ? `calc((100% - 2rem) * ${(currentStep - 1) / (steps.length - 1)})` : '0%'
                }}
              ></div>

              <div className="relative grid grid-cols-3 gap-2">
                {steps.map((label, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isActive = stepNumber === currentStep;

                  return (
                    <div key={label} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-white text-teal-700 border-white shadow-sm'
                            : isActive
                              ? 'bg-teal-700 text-white border-white shadow-sm ring-2 ring-white/40'
                              : 'bg-white/10 text-white border-white/40'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <p className={`mt-2 text-xs sm:text-sm font-semibold ${isCompleted || isActive ? 'text-white' : 'text-teal-100'}`}>
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-6">
          {submitError && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          )}
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
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;