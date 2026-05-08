import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function ProductionForm() {
    const [form, setForm] = useState({
        installedCapacity: '', actualProduction: '', maxMonthlyCapacity: '',
        machineHoursAvailable: '', downtimeHours: '', workforceCount: '',
        machineBreakdownFreq: 'Rare', workersSkilled: 'Yes',
        delayReasons: [], otherDelayReason: '',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
    const toggleDelay = (r) => {
        const current = form.delayReasons || [];
        const next = current.includes(r) ? current.filter(x => x !== r) : [...current, r];
        u('delayReasons', next);
    };

    const capUtil = form.installedCapacity > 0 ? ((Number(form.actualProduction) || 0) / Number(form.installedCapacity) * 100).toFixed(1) : '—';
    const downtimeRatio = form.machineHoursAvailable > 0 ? ((Number(form.downtimeHours) || 0) / Number(form.machineHoursAvailable) * 100).toFixed(1) : '—';

    const delayOptions = ['Raw material delay', 'Machine breakdown', 'Labour shortage', 'Power issues', 'Planning/scheduling issues'];

    return (
        <FormWrapper title="Production Entry" subtitle="Monthly production and capacity data" dataType="production"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">🏭 Capacity & Output</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Installed Capacity (units/month) <span className="required">*</span></label><input className="form-input" type="number" value={form.installedCapacity} onChange={e => u('installedCapacity', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Actual Production (units) <span className="required">*</span></label><input className="form-input" type="number" value={form.actualProduction} onChange={e => u('actualProduction', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Capacity Utilization — Auto</label>
                        <input className="form-input" value={`${capUtil}%`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                    </div>
                    <div className="form-group"><label className="form-label">Max Monthly Capacity</label><input className="form-input" type="number" value={form.maxMonthlyCapacity} onChange={e => u('maxMonthlyCapacity', e.target.value)} /></div>
                </div>
            </div>

            <div className="form-section">
                <h4 className="form-section-title">⚙️ Machine & Labor Stability</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Machine Breakdown Frequency</label>
                        <select className="form-input" value={form.machineBreakdownFreq} onChange={e => u('machineBreakdownFreq', e.target.value)}>
                            {['Frequent', 'Occasional', 'Rare'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Workers Adequately Skilled?</label>
                        <div className="toggle-group">
                            {['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${form.workersSkilled === o ? 'active' : ''}`} onClick={() => u('workersSkilled', o)}>{o}</button>)}
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Workforce Count</label><input className="form-input" type="number" value={form.workforceCount} onChange={e => u('workforceCount', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Machine Downtime Hours</label><input className="form-input" type="number" value={form.downtimeHours} onChange={e => u('downtimeHours', e.target.value)} /></div>
                </div>
            </div>

            <div className="form-section">
                <h4 className="form-section-title">🕒 Production Delays</h4>
                <label className="form-label">Reasons for delays (Select all that apply)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                    {delayOptions.map(r => (
                        <div key={r} onClick={() => toggleDelay(r)} style={{ 
                            padding: '10px', background: form.delayReasons?.includes(r) ? '#e0f2fe' : '#f8fafc', 
                            border: `1px solid ${form.delayReasons?.includes(r) ? '#0ea5e9' : '#e2e8f0'}`,
                            borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                        }}>
                             <input type="checkbox" checked={form.delayReasons?.includes(r)} readOnly style={{ marginRight: '8px' }} />
                             {r}
                        </div>
                    ))}
                </div>
                <div className="form-group" style={{ marginTop: '15px' }}>
                    <label className="form-label">Other Reasons</label>
                    <input className="form-input" value={form.otherDelayReason} onChange={e => u('otherDelayReason', e.target.value)} placeholder="Please specify..." />
                </div>
            </div>
        </FormWrapper>
    );
}
