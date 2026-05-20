// components/steps/GSTFormsStep.jsx
import React, { useState } from 'react';
import { gstStages } from './constants';

const GSTFormsStep = () => {
  const [activeStage, setActiveStage] = useState(0);

  const currentForms = gstStages[activeStage].forms;

  return (
    <div className="flex gap-6 p-6 min-h-[500px]">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 pr-6">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">GST Stages</h4>
        <div className="space-y-2">
          {gstStages.map((stage, idx) => (
            <button
              key={stage.name}
              onClick={() => setActiveStage(idx)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                idx === activeStage 
                ? 'bg-teal-50 border border-teal-200' 
                : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  idx === activeStage ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <span className={`font-medium text-sm ${
                  idx === activeStage ? 'text-teal-700' : 'text-slate-700'
                }`}>
                  {stage.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="font-display font-bold text-lg mb-4 text-slate-900">{gstStages[activeStage].name}</h3>
        <div className="space-y-4">
          {currentForms.map(form => (
            <div key={form.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-slate-900">{form.title}</h4>
                  <p className="text-xs text-slate-500">{form.subtitle}</p>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">GSTR Section</span>
              </div>
              <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(form.fields.length, 4)} gap-3`}>
                {form.fields.map(field => (
                  <div key={field}>
                    <label className="block text-xs text-slate-500 mb-1">{field}</label>
                    <input 
                      type="text" 
                      placeholder="Enter value" 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GSTFormsStep;