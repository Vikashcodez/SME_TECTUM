// components/EntryModal.jsx
import React, { useState } from 'react';
import FinancialDataStep from './FinancialDataStep';
import GSTFormsStep from './GSTFormsStep';
import ReviewStep from './ReviewStep';

const EntryModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    month: 'May',
    year: '2026',
    totalRevenue: '',
    totalExpenses: '',
    cashBalance: '',
    gstLiability: '',
    itc: '',
    gstPaid: ''
  });

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSave = () => {
    alert('Entry Saved Successfully!');
    onClose();
    setCurrentStep(1); // Reset for next open
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <FinancialDataStep formData={formData} setFormData={setFormData} />;
      case 2: return <GSTFormsStep />;
      case 3: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-teal-500 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-white">Add Financial Entry</h3>
              <p className="text-sm text-teal-100 mt-1">Step {currentStep} of 3</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button 
            onClick={prevStep} 
            className={`px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700">
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button onClick={nextStep} className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-sm">
                Next Step
              </button>
            ) : (
              <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                Save Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;