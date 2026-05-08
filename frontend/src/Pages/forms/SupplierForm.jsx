import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FormWrapper from '../../components/FormWrapper';

export default function SupplierForm() {
    const [form, setForm] = useState({
        suppliers: [{ name: '', purchaseValue: '', invoiceDate: '', paidAmount: '', paymentDate: '', outstandingAmount: '', deliveryDelay: 'No', priceChange: 'No', alternateAvailable: 'No' }],
        totalPurchase: '', alternateAvailable: 'Yes', supplierOnTimeDelivery: '',
        paymentDiscipline: 'Good', priceVolatility: 'Low', geoConcentration: 'Regional',
        importDependency: '', leadTimeVariability: '', supplierFinancialStability: 'Good',
        emergencyBackup: 'Yes', delayFrequency: 'Rare',
    });

    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
    const updateSupplier = (i, field, val) => {
        const s = [...form.suppliers]; s[i] = { ...s[i], [field]: val };
        setForm(f => ({ ...f, suppliers: s }));
    };
    const addSupplier = () => setForm(f => ({ ...f, suppliers: [...f.suppliers, { name: '', purchaseValue: '', invoiceDate: '', paidAmount: '', paymentDate: '', outstandingAmount: '', deliveryDelay: 'No', priceChange: 'No', alternateAvailable: 'No' }] }));
    const removeSupplier = (i) => setForm(f => ({ ...f, suppliers: f.suppliers.filter((_, idx) => idx !== i) }));

    return (
        <FormWrapper title="Supplier Entry" subtitle="Monthly supplier and procurement data" dataType="supplier"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">🚚 Supplier Details</h4>
                {form.suppliers.map((s, i) => (
                    <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e3e8ee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supplier {i + 1}</strong>
                            {form.suppliers.length > 1 && <button className="btn btn-sm btn-danger" onClick={() => removeSupplier(i)}>Remove</button>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Supplier Name</label>
                                <input className="form-input" value={s.name} onChange={e => updateSupplier(i, 'name', e.target.value)} placeholder="Supplier name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Purchase Value (₹)</label>
                                <input className="form-input" type="number" value={s.purchaseValue} onChange={e => updateSupplier(i, 'purchaseValue', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Invoice Date</label><input type="date" className="form-input" value={s.invoiceDate} onChange={e => updateSupplier(i, 'invoiceDate', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Paid Amount (₹)</label><input type="number" className="form-input" value={s.paidAmount} onChange={e => updateSupplier(i, 'paidAmount', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Payment Date</label><input type="date" className="form-input" value={s.paymentDate} onChange={e => updateSupplier(i, 'paymentDate', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Outstanding Amount (₹)</label><input type="number" className="form-input" value={s.outstandingAmount} onChange={e => updateSupplier(i, 'outstandingAmount', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Delivery Delay?</label>
                                <div className="toggle-group">
                                    {['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${s.deliveryDelay === o ? 'active' : ''}`} onClick={() => updateSupplier(i, 'deliveryDelay', o)}>{o}</button>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price Change?</label>
                                <div className="toggle-group">
                                    {['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${s.priceChange === o ? 'active' : ''}`} onClick={() => updateSupplier(i, 'priceChange', o)}>{o}</button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button className="btn btn-outline btn-sm" onClick={addSupplier}>+ Add Supplier</button>
            </div>

            <div className="form-section">
                <h4 className="form-section-title">📊 Overall Supplier Metrics</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Total Purchase (₹)</label><input className="form-input" type="number" value={form.totalPurchase} onChange={e => u('totalPurchase', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Supplier On-Time Delivery (%)</label><input className="form-input" type="number" value={form.supplierOnTimeDelivery} onChange={e => u('supplierOnTimeDelivery', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Alternate Suppliers Available?</label>
                        <div className="toggle-group">{['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${form.alternateAvailable === o ? 'active' : ''}`} onClick={() => u('alternateAvailable', o)}>{o}</button>)}</div>
                    </div>
                    <div className="form-group"><label className="form-label">Payment Discipline</label>
                        <select className="form-input" value={form.paymentDiscipline} onChange={e => u('paymentDiscipline', e.target.value)}>{['Excellent', 'Good', 'Average', 'Poor'].map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Price Volatility</label>
                        <select className="form-input" value={form.priceVolatility} onChange={e => u('priceVolatility', e.target.value)}>{['None', 'Low', 'Medium', 'High'].map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                    <div className="form-group"><label className="form-label">Geographic Concentration</label>
                        <select className="form-input" value={form.geoConcentration} onChange={e => u('geoConcentration', e.target.value)}>{['Diversified', 'Regional', 'Concentrated'].map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="form-section-title" style={{ margin: 0 }}>📉 Sundry Creditors Ageing (₹)</h4>
                    <NavLink to="/forms/financial" style={{ padding: '6px 12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                        Go to Financial tab for Ageing Setup →
                    </NavLink>
                </div>
                <div className="form-row" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {[
                        { label: 'Less than 6m', f: 'credLt6m' },
                        { label: '6m – 1 Year', f: 'cred6m_1y' },
                        { label: '1 – 2 Years', f: 'cred1_2y' },
                        { label: '2 – 3 Years', f: 'cred2_3y' },
                        { label: '> 3 Years', f: 'credGt3y' },
                    ].map(x => (
                        <div key={x.f} className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>{x.label}</label>
                            <input className="form-input" type="number" value={form[x.f]} onChange={e => u(x.f, e.target.value)} />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '15px' }}>
                    <label className="form-label">Total Creditors Payable (₹)</label>
                    <input className="form-input" type="number" value={form.totalCreditors} onChange={e => u('totalCreditors', e.target.value)} />
                </div>
            </div>

            <div className="form-section">
                <h4 className="form-section-title">🛡️ Risk & Stability</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Import Dependency (%)</label><input className="form-input" type="number" value={form.importDependency} onChange={e => u('importDependency', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Lead Time Variability (days)</label><input className="form-input" type="number" value={form.leadTimeVariability} onChange={e => u('leadTimeVariability', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Emergency Backup Plan?</label>
                        <div className="toggle-group">{['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${form.emergencyBackup === o ? 'active' : ''}`} onClick={() => u('emergencyBackup', o)}>{o}</button>)}</div>
                    </div>
                    <div className="form-group"><label className="form-label">Supplier Financial Stability</label>
                        <select className="form-input" value={form.supplierFinancialStability} onChange={e => u('supplierFinancialStability', e.target.value)}>{['Strong', 'Good', 'Average', 'Weak'].map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                </div>
            </div>
        </FormWrapper>
    );
}
