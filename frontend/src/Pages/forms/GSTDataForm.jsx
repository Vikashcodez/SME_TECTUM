import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FormWrapper from '../../components/FormWrapper';
import { FileText, ArrowLeft } from 'lucide-react';

export default function GSTDataForm() {
    const [form, setForm] = useState({
        b2bSales: [{ invoiceNo: '', invoiceDate: '', gstin: '', partyName: '', taxableValue: '', igst: '', cgst: '', sgst: '', cess: '', taxRate: '18%', category: '', hsnCode: '' }],
        b2cInter: [{ invoiceNo: '', invoiceDate: '', placeOfSupply: '', taxableValue: '', igst: '' }],
        b2cIntra: [{ placeOfSupply: '', taxableValue: '', cgst: '', sgst: '' }],
        exportsData: [{ invoiceNo: '', invoiceDate: '', exportValue: '', igst: '', portCode: '', shippingBillNo: '' }],
        nilRatedInter: '', nilRatedIntra: '',
        creditDebitNotes: [{ gstin: '', noteNo: '', noteDate: '', noteValue: '' }],
        advancesReceived: [{ placeOfSupply: '', grossAdvance: '' }],
        hsnSummary: [{ hsnCode: '', totalQty: '', totalTaxableValue: '', rate: '18%', igst: '', cgst: '', sgst: '' }],
        docsIssuedTotal: '', docsIssuedCancelled: '',
    });

    const updateArr = (arrName, i, field, val) => {
        const arr = [...form[arrName]];
        arr[i] = { ...arr[i], [field]: val };
        setForm(f => ({ ...f, [arrName]: arr }));
    };
    const addArr = (arrName, defaultObj) => setForm(f => ({ ...f, [arrName]: [...f[arrName], defaultObj] }));
    const rmArr = (arrName, i) => setForm(f => ({ ...f, [arrName]: f[arrName].filter((_, idx) => idx !== i) }));

    const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

    return (
        <FormWrapper title="Detailed GST Data (GSTR)" subtitle="Monthly detailed GST returns data" dataType="gstData"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div style={{ marginBottom: '20px' }}>
                <NavLink to="/forms/financial" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '6px', color: '#0f172a', textDecoration: 'none', fontWeight: '500', fontSize: '0.85rem' }}>
                    <ArrowLeft size={16} /> Back to Financial Form
                </NavLink>
            </div>

            {/* B2B Sales */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (i) B2B Sales</h4>
                {form.b2bSales.map((x, i) => (
                    <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e3e8ee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>B2B Invoice {i + 1}</strong>
                            {form.b2bSales.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => rmArr('b2bSales', i)}>Remove</button>}
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Invoice No.</label><input className="form-input" value={x.invoiceNo} onChange={e => updateArr('b2bSales', i, 'invoiceNo', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Invoice Date</label><input type="date" className="form-input" value={x.invoiceDate} onChange={e => updateArr('b2bSales', i, 'invoiceDate', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">GSTIN No.</label><input className="form-input" value={x.gstin} onChange={e => updateArr('b2bSales', i, 'gstin', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Party Name</label><input className="form-input" value={x.partyName} onChange={e => updateArr('b2bSales', i, 'partyName', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Taxable Value (₹)</label><input type="number" className="form-input" value={x.taxableValue} onChange={e => updateArr('b2bSales', i, 'taxableValue', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">IGST (₹)</label><input type="number" className="form-input" value={x.igst} onChange={e => updateArr('b2bSales', i, 'igst', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">CGST (₹)</label><input type="number" className="form-input" value={x.cgst} onChange={e => updateArr('b2bSales', i, 'cgst', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">SGST (₹)</label><input type="number" className="form-input" value={x.sgst} onChange={e => updateArr('b2bSales', i, 'sgst', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Cess (₹)</label><input type="number" className="form-input" value={x.cess} onChange={e => updateArr('b2bSales', i, 'cess', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">GST Tax Rate</label>
                                <select className="form-input" value={x.taxRate} onChange={e => updateArr('b2bSales', i, 'taxRate', e.target.value)}>{['0%', '5%', '12%', '18%', '28%'].map(o => <option key={o}>{o}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={x.category} onChange={e => updateArr('b2bSales', i, 'category', e.target.value)} placeholder="Product/Service" /></div>
                            <div className="form-group"><label className="form-label">HSN/SAC Code</label><input className="form-input" value={x.hsnCode} onChange={e => updateArr('b2bSales', i, 'hsnCode', e.target.value)} /></div>
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('b2bSales', { invoiceNo: '', invoiceDate: '', gstin: '', partyName: '', taxableValue: '', igst: '', cgst: '', sgst: '', cess: '', taxRate: '18%', category: '', hsnCode: '' })}>+ Add B2B Sales Invoice</button>
            </div>

            {/* B2C Sales */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (ii) B2C Sales</h4>
                
                <h5 style={{ fontSize: '0.85rem', color: 'var(--navy)', marginBottom: '8px' }}>Inter State Sales {'>'} 1L</h5>
                {form.b2cInter.map((x, i) => (
                    <div key={`inter-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">Invoice No.</label><input className="form-input" value={x.invoiceNo} onChange={e => updateArr('b2cInter', i, 'invoiceNo', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Invoice Date</label><input type="date" className="form-input" value={x.invoiceDate} onChange={e => updateArr('b2cInter', i, 'invoiceDate', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Place of Supply</label><input className="form-input" value={x.placeOfSupply} onChange={e => updateArr('b2cInter', i, 'placeOfSupply', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Taxable Value</label><input type="number" className="form-input" value={x.taxableValue} onChange={e => updateArr('b2cInter', i, 'taxableValue', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">IGST (₹)</label><input type="number" className="form-input" value={x.igst} onChange={e => updateArr('b2cInter', i, 'igst', e.target.value)} /></div>
                        {form.b2cInter.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('b2cInter', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" style={{ marginBottom: '20px' }} onClick={() => addArr('b2cInter', { invoiceNo: '', invoiceDate: '', placeOfSupply: '', taxableValue: '', igst: '' })}>+ Add Inter State Sale</button>

                <h5 style={{ fontSize: '0.85rem', color: 'var(--navy)', marginBottom: '8px' }}>Intra State Sales</h5>
                {form.b2cIntra.map((x, i) => (
                    <div key={`intra-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">Place of Supply</label><input className="form-input" value={x.placeOfSupply} onChange={e => updateArr('b2cIntra', i, 'placeOfSupply', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Taxable Value</label><input type="number" className="form-input" value={x.taxableValue} onChange={e => updateArr('b2cIntra', i, 'taxableValue', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">CGST (₹)</label><input type="number" className="form-input" value={x.cgst} onChange={e => updateArr('b2cIntra', i, 'cgst', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">SGST (₹)</label><input type="number" className="form-input" value={x.sgst} onChange={e => updateArr('b2cIntra', i, 'sgst', e.target.value)} /></div>
                        {form.b2cIntra.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('b2cIntra', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('b2cIntra', { placeOfSupply: '', taxableValue: '', cgst: '', sgst: '' })}>+ Add Intra State Sale</button>
            </div>

            {/* Exports */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (iii) Exports</h4>
                {form.exportsData.map((x, i) => (
                    <div key={`exp-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">Invoice No.</label><input className="form-input" value={x.invoiceNo} onChange={e => updateArr('exportsData', i, 'invoiceNo', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Invoice Date</label><input type="date" className="form-input" value={x.invoiceDate} onChange={e => updateArr('exportsData', i, 'invoiceDate', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Export Value</label><input type="number" className="form-input" value={x.exportValue} onChange={e => updateArr('exportsData', i, 'exportValue', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">IGST (₹)</label><input type="number" className="form-input" value={x.igst} onChange={e => updateArr('exportsData', i, 'igst', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Port Code</label><input className="form-input" value={x.portCode} onChange={e => updateArr('exportsData', i, 'portCode', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Shipping Bill</label><input className="form-input" value={x.shippingBillNo} onChange={e => updateArr('exportsData', i, 'shippingBillNo', e.target.value)} /></div>
                        {form.exportsData.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('exportsData', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('exportsData', { invoiceNo: '', invoiceDate: '', exportValue: '', igst: '', portCode: '', shippingBillNo: '' })}>+ Add Export Record</button>
            </div>

            {/* Nil Rated / Exempted */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (iv) Nil Rated or Exempted Sales</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Inter State Sales (Invoice Amount ₹)</label>
                        <input className="form-input" type="number" value={form.nilRatedInter} onChange={e => u('nilRatedInter', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Intra State Sales (Invoice Amount ₹)</label>
                        <input className="form-input" type="number" value={form.nilRatedIntra} onChange={e => u('nilRatedIntra', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Credit / Debit Notes */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (v) Credit Notes / Debit Notes</h4>
                {form.creditDebitNotes.map((x, i) => (
                    <div key={`cd-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">GSTIN No.</label><input className="form-input" value={x.gstin} onChange={e => updateArr('creditDebitNotes', i, 'gstin', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Note No.</label><input className="form-input" value={x.noteNo} onChange={e => updateArr('creditDebitNotes', i, 'noteNo', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Note Date</label><input type="date" className="form-input" value={x.noteDate} onChange={e => updateArr('creditDebitNotes', i, 'noteDate', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Note Value (₹)</label><input type="number" className="form-input" value={x.noteValue} onChange={e => updateArr('creditDebitNotes', i, 'noteValue', e.target.value)} /></div>
                        {form.creditDebitNotes.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('creditDebitNotes', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('creditDebitNotes', { gstin: '', noteNo: '', noteDate: '', noteValue: '' })}>+ Add Note</button>
            </div>

            {/* Advances Received */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (vi) Advances Received</h4>
                {form.advancesReceived.map((x, i) => (
                    <div key={`adv-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">Place of Supply</label><input className="form-input" value={x.placeOfSupply} onChange={e => updateArr('advancesReceived', i, 'placeOfSupply', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Gross Advance Received (₹)</label><input type="number" className="form-input" value={x.grossAdvance} onChange={e => updateArr('advancesReceived', i, 'grossAdvance', e.target.value)} /></div>
                        {form.advancesReceived.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('advancesReceived', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('advancesReceived', { placeOfSupply: '', grossAdvance: '' })}>+ Add Advance Record</button>
            </div>

            {/* HSN Wise Summary */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (vii) HSN Wise Summary</h4>
                {form.hsnSummary.map((x, i) => (
                    <div key={`hsn-${i}`} className="form-row" style={{ alignItems: 'flex-end', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                        <div className="form-group"><label className="form-label">HSN Code</label><input className="form-input" value={x.hsnCode} onChange={e => updateArr('hsnSummary', i, 'hsnCode', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Total Qty</label><input type="number" className="form-input" value={x.totalQty} onChange={e => updateArr('hsnSummary', i, 'totalQty', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Total Taxable Value (₹)</label><input type="number" className="form-input" value={x.totalTaxableValue} onChange={e => updateArr('hsnSummary', i, 'totalTaxableValue', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Rate (%)</label>
                            <select className="form-input" value={x.rate} onChange={e => updateArr('hsnSummary', i, 'rate', e.target.value)}>{['0%', '5%', '12%', '18%', '28%'].map(o => <option key={o}>{o}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">IGST (₹)</label><input type="number" className="form-input" value={x.igst} onChange={e => updateArr('hsnSummary', i, 'igst', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">CGST (₹)</label><input type="number" className="form-input" value={x.cgst} onChange={e => updateArr('hsnSummary', i, 'cgst', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">SGST (₹)</label><input type="number" className="form-input" value={x.sgst} onChange={e => updateArr('hsnSummary', i, 'sgst', e.target.value)} /></div>
                        {form.hsnSummary.length > 1 && <button type="button" className="btn btn-sm btn-danger" style={{ marginBottom: '5px' }} onClick={() => rmArr('hsnSummary', i)}>X</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => addArr('hsnSummary', { hsnCode: '', totalQty: '', totalTaxableValue: '', rate: '18%', igst: '', cgst: '', sgst: '' })}>+ Add HSN Record</button>
            </div>

            {/* Documents Issued */}
            <div className="form-section">
                <h4 className="form-section-title"><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> (viii) Documents Issued</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Total No. of Invoices Issued</label>
                        <input className="form-input" type="number" value={form.docsIssuedTotal} onChange={e => u('docsIssuedTotal', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Invoices cancelled</label>
                        <input className="form-input" type="number" value={form.docsIssuedCancelled} onChange={e => u('docsIssuedCancelled', e.target.value)} />
                    </div>
                </div>
            </div>

        </FormWrapper>
    );
}
