import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function DeliveryForm() {
    const [form, setForm] = useState({
        totalOrders: '', onTimeOrders: '', delayedOrders: '', avgLeadTime: '', delayReason: '',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
    const otd = form.totalOrders > 0 ? ((Number(form.onTimeOrders) || 0) / Number(form.totalOrders) * 100).toFixed(1) : '—';
    const showDelay = Number(form.delayedOrders) > 0;

    return (
        <FormWrapper title="Delivery Performance Entry" subtitle="Monthly delivery and logistics data" dataType="delivery"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">📦 Order Delivery</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Total Orders Received <span className="required">*</span></label><input className="form-input" type="number" value={form.totalOrders} onChange={e => u('totalOrders', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Orders Delivered On Time</label><input className="form-input" type="number" value={form.onTimeOrders} onChange={e => u('onTimeOrders', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Orders Delayed</label><input className="form-input" type="number" value={form.delayedOrders} onChange={e => u('delayedOrders', e.target.value)} /></div>
                    <div className="form-group">
                        <label className="form-label">On-Time Delivery % — Auto</label>
                        <input className="form-input" value={`${otd}%`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Average Lead Time (days)</label><input className="form-input" type="number" value={form.avgLeadTime} onChange={e => u('avgLeadTime', e.target.value)} /></div>
                    {showDelay && (
                        <div className="form-group">
                            <label className="form-label">Delay Reason</label>
                            <select className="form-input" value={form.delayReason} onChange={e => u('delayReason', e.target.value)}>
                                <option value="">Select reason...</option>
                                {['Raw material delay', 'Machine breakdown', 'Labour shortage', 'Power issues', 'Planning/scheduling issues', 'Transportation delay', 'Other'].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </FormWrapper>
    );
}
