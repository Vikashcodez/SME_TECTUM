import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function QualityForm() {
    const [form, setForm] = useState({
        totalProductionQuantity: '', rejectedQuantity: '', reworkQuantity: '',
        customerComplaints: '', reworkCost: '', qualityCertification: '', traceability: 'No',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
    const rejRate = form.totalProductionQuantity > 0 ? ((Number(form.rejectedQuantity) || 0) / Number(form.totalProductionQuantity) * 100).toFixed(2) : '—';

    return (
        <FormWrapper title="Quality Entry" subtitle="Monthly quality and defect data" dataType="quality"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">🔍 Quality Metrics</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Total Production Quantity <span className="required">*</span></label><input className="form-input" type="number" value={form.totalProductionQuantity} onChange={e => u('totalProductionQuantity', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Rejected Quantity</label><input className="form-input" type="number" value={form.rejectedQuantity} onChange={e => u('rejectedQuantity', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Rework Quantity</label><input className="form-input" type="number" value={form.reworkQuantity} onChange={e => u('reworkQuantity', e.target.value)} /></div>
                    <div className="form-group">
                        <label className="form-label">Rejection Rate — Auto</label>
                        <input className="form-input" value={`${rejRate}%`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Customer Complaints (count)</label><input className="form-input" type="number" value={form.customerComplaints} onChange={e => u('customerComplaints', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Rework Cost (₹)</label><input className="form-input" type="number" value={form.reworkCost} onChange={e => u('reworkCost', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Quality Certification (ISO etc.)</label><input className="form-input" value={form.qualityCertification} onChange={e => u('qualityCertification', e.target.value)} placeholder="e.g. ISO 9001:2015" /></div>
                    <div className="form-group"><label className="form-label">Traceability System?</label>
                        <div className="toggle-group">{['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${form.traceability === o ? 'active' : ''}`} onClick={() => u('traceability', o)}>{o}</button>)}</div>
                    </div>
                </div>
            </div>
        </FormWrapper>
    );
}
