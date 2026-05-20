// data/constants.js

export const dummyEntries = [
  { id: 1, month: 'May 2026', revenue: 5200000, expenses: 4100000, status: 'filed' },
  { id: 2, month: 'June 2026', revenue: 5800000, expenses: 4500000, status: 'pending' },
  { id: 3, month: 'July 2026', revenue: 4950000, expenses: 4200000, status: 'filed' },
  { id: 4, month: 'August 2026', revenue: 6100000, expenses: 4800000, status: 'draft' },
  { id: 5, month: 'September 2026', revenue: 5500000, expenses: 4300000, status: 'filed' },
];

export const gstStages = [
  {
    name: 'Outward Supplies',
    forms: [
      { id: '4', title: '4A, 4B, 6B, 6C', subtitle: 'B2B/SEZ/DE Supplies', fields: ['Taxable Value', 'IGST', 'CGST', 'SGST'] },
      { id: '5', title: '5', subtitle: 'B2C Large Invoices', fields: ['Taxable Value', 'IGST', 'CGST', 'SGST'] },
      { id: '6A', title: '6A', subtitle: 'Exports Invoices', fields: ['Taxable Value', 'Export Type', 'Shipping Bill'] },
      { id: '7', title: '7', subtitle: 'B2C Others', fields: ['Taxable Value', 'IGST', 'CGST', 'SGST'] }
    ]
  },
  {
    name: 'Exemptions & Credits',
    forms: [
      { id: '8', title: '8A-8D', subtitle: 'Nil Rated Supplies', fields: ['Nil Rated', 'Exempted', 'Non-GST'] },
      { id: '9B-Reg', title: '9B (Registered)', subtitle: 'Debit/Credit Notes', fields: ['Note Type', 'Note No.', 'Value', 'Tax'] },
      { id: '9B-Unreg', title: '9B (Unregistered)', subtitle: 'Debit/Credit Notes', fields: ['Note Type', 'Note No.', 'Value', 'Tax'] }
    ]
  },
  {
    name: 'Liability & Adj.',
    forms: [
      { id: '11A', title: '11A(1), (2)', subtitle: 'Tax Liability on Advance', fields: ['Advance', 'Rate', 'Tax'] },
      { id: '11B', title: '11B(1), (2)', subtitle: 'Adjustment for Advance', fields: ['Adjustment', 'Rate', 'Tax'] }
    ]
  },
  {
    name: 'Reporting',
    forms: [
      { id: '12', title: '12', subtitle: 'HSN Summary', fields: ['HSN Code', 'Description', 'Qty', 'Value', 'Tax'] },
      { id: '13', title: '13', subtitle: 'Documents Issued', fields: ['Doc Type', 'Sr From', 'Sr To', 'Total', 'Cancelled'] },
      { id: '14', title: '14', subtitle: 'ECO Supplies', fields: ['Operator', 'Value', 'Tax'] },
      { id: '15', title: '15', subtitle: 'Supplies U/s 9(5)', fields: ['Type', 'Value', 'Tax'] }
    ]
  }
];