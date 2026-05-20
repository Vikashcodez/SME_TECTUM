// components/steps/GSTFormsStep.jsx
import React, { useState } from 'react';

// Configuration mapping exactly to SQL Tables
const gstStages = [
  {
    name: 'B2B Sales',
    arrays: ['gst_b2b_sales'],
    schemas: {
      gst_b2b_sales: [
        { name: 'invoice_no', label: 'Invoice No', type: 'text' },
        { name: 'invoice_date', label: 'Date', type: 'date' },
        { name: 'gstin_no', label: 'GSTIN', type: 'text' },
        { name: 'party_name', label: 'Party Name', type: 'text' },
        { name: 'taxable_value', label: 'Taxable Val', type: 'number' },
        { name: 'gst_tax_rate', label: 'Rate %', type: 'number' },
        { name: 'igst', label: 'IGST', type: 'number' },
        { name: 'cgst', label: 'CGST', type: 'number' },
        { name: 'sgst', label: 'SGST', type: 'number' },
        { name: 'cess', label: 'Cess', type: 'number' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'hsn_sac_code', label: 'HSN/SAC', type: 'text' },
      ]
    }
  },
  {
    name: 'B2C Sales',
    arrays: ['gst_b2c_inter_state_sales', 'gst_b2c_intra_state_sales'],
    schemas: {
      gst_b2c_inter_state_sales: [
        { name: 'invoice_no', label: 'Invoice No', type: 'text' },
        { name: 'invoice_date', label: 'Date', type: 'date' },
        { name: 'place_of_supply', label: 'Place of Supply', type: 'text' },
        { name: 'taxable_value', label: 'Taxable Val', type: 'number' },
        { name: 'igst', label: 'IGST', type: 'number' }
      ],
      gst_b2c_intra_state_sales: [
        { name: 'place_of_supply', label: 'Place of Supply', type: 'text' },
        { name: 'taxable_value', label: 'Taxable Val', type: 'number' },
        { name: 'cgst', label: 'CGST', type: 'number' },
        { name: 'sgst', label: 'SGST', type: 'number' }
      ]
    }
  },
  {
    name: 'Exports & Others',
    arrays: ['gst_exports', 'gst_credit_debit_notes'],
    objects: ['gst_nil_exempt_sales'],
    schemas: {
      gst_exports: [
        { name: 'invoice_no', label: 'Invoice No', type: 'text' },
        { name: 'invoice_date', label: 'Date', type: 'date' },
        { name: 'export_value', label: 'Export Value', type: 'number' },
        { name: 'igst', label: 'IGST', type: 'number' },
        { name: 'port_code', label: 'Port Code', type: 'text' },
        { name: 'shipping_bill', label: 'Shipping Bill', type: 'text' }
      ],
      gst_credit_debit_notes: [
        { name: 'gstin_no', label: 'GSTIN', type: 'text' },
        { name: 'note_no', label: 'Note No', type: 'text' },
        { name: 'note_date', label: 'Note Date', type: 'date' },
        { name: 'note_value', label: 'Value', type: 'number' }
      ]
    }
  },
  {
    name: 'HSN & Docs',
    arrays: ['gst_hsn_summary', 'gst_advances_received'],
    objects: ['gst_documents_issued'],
    schemas: {
      gst_hsn_summary: [
        { name: 'hsn_code', label: 'HSN Code', type: 'text' },
        { name: 'total_qty', label: 'Total Qty', type: 'number' },
        { name: 'total_taxable_value', label: 'Taxable Val', type: 'number' },
        { name: 'rate', label: 'Rate %', type: 'number' },
        { name: 'igst', label: 'IGST', type: 'number' },
        { name: 'cgst', label: 'CGST', type: 'number' },
        { name: 'sgst', label: 'SGST', type: 'number' }
      ],
      gst_advances_received: [
        { name: 'place_of_supply', label: 'Place of Supply', type: 'text' },
        { name: 'gross_advance_received', label: 'Gross Advance', type: 'number' }
      ]
    }
  }
];

const GSTFormsStep = ({ formData, setFormData }) => {
  const [activeStage, setActiveStage] = useState(0);
  const stage = gstStages[activeStage];

  const handleAddRow = (arrayName, schema) => {
    const emptyObj = schema.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyObj]
    }));
  };

  const handleArrayChange = (arrayName, index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = { ...updatedArray[index], [name]: value };
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleObjectChange = (objectName, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [objectName]: { ...prev[objectName], [name]: value }
    }));
  };

  return (
    <div className="flex gap-6 min-h-[500px]">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-slate-200 pr-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">GST Sections</h4>
        <div className="space-y-1">
          {gstStages.map((s, idx) => (
            <button key={s.name} onClick={() => setActiveStage(idx)}
              className={`w-full text-left p-2.5 rounded-lg transition-colors ${idx === activeStage ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${idx === activeStage ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {idx + 1}
                </span>
                <span className={`font-medium text-sm ${idx === activeStage ? 'text-teal-700' : 'text-slate-700'}`}>
                  {s.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        
        {/* Render Array Forms */}
        {stage.arrays && stage.arrays.map(arrayName => {
          const schema = stage.schemas[arrayName];
          return (
            <div key={arrayName} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-800 text-sm capitalize">
                  {arrayName.replace(/gst_/g, '').replace(/_/g, ' ')}
                </h4>
                <button 
                  onClick={() => handleAddRow(arrayName, schema)} 
                  className="text-xs bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add
                </button>
              </div>
              
              {formData[arrayName].length === 0 && (
                <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed border-slate-300 rounded-lg bg-white">
                  No records found. Click "Add" to create one.
                </p>
              )}

              <div className="space-y-3">
                {formData[arrayName].map((item, index) => (
                  <div key={index} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                    <div className={`grid gap-3 ${schema.length > 6 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                      {schema.map(field => (
                        <div key={field.name}>
                          <label className="block text-xs text-slate-500 mb-0.5">{field.label}</label>
                          <input 
                            type={field.type}
                            name={field.name} 
                            value={item[field.name]} 
                            onChange={(e) => handleArrayChange(arrayName, index, e)}
                            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Render Object Forms (Single Entry Forms) */}
        {stage.objects && stage.objects.map(objectName => (
           <div key={objectName} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
             <h4 className="font-semibold text-slate-800 text-sm mb-3 capitalize">
               {objectName.replace(/gst_/g, '').replace(/_/g, ' ')}
             </h4>
             <div className="bg-white border border-slate-200 p-4 rounded-lg">
               <div className="grid grid-cols-2 gap-4">
                 {Object.keys(formData[objectName]).map(key => (
                   <div key={key}>
                     <label className="block text-xs text-slate-500 mb-0.5 capitalize">{key.replace(/_/g, ' ')}</label>
                     <input 
                       type="number" 
                       name={key} 
                       value={formData[objectName][key]} 
                       onChange={(e) => handleObjectChange(objectName, e)}
                       className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                     />
                   </div>
                 ))}
               </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default GSTFormsStep;