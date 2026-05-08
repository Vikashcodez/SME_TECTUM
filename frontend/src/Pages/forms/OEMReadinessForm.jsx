import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function OEMReadinessForm() {
    const [form, setForm] = useState({
        productionCapacity: '', currentUtilization: '', qualityCertification: '',
        majorCustomers: '', yearsInOperation: '', skilledWorkforce: '',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

    return (
        <FormWrapper title="OEM Readiness Entry" subtitle="Periodic OEM vendor readiness assessment" dataType="oemReadiness" isOneTime={true}
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">🏆 OEM Readiness Assessment</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Production Capacity (units/month)</label><input className="form-input" type="number" value={form.productionCapacity} onChange={e => u('productionCapacity', e.target.value)} placeholder="e.g. 10000" /></div>
                    <div className="form-group"><label className="form-label">Current Utilization (%)</label><input className="form-input" type="number" value={form.currentUtilization} onChange={e => u('currentUtilization', e.target.value)} placeholder="e.g. 75" /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Quality Certification (ISO etc.)</label><input className="form-input" value={form.qualityCertification} onChange={e => u('qualityCertification', e.target.value)} placeholder="e.g. ISO 9001:2015, IATF 16949" /></div>
                    <div className="form-group"><label className="form-label">Major Customers (count)</label><input className="form-input" type="number" value={form.majorCustomers} onChange={e => u('majorCustomers', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Years in Operation</label><input className="form-input" type="number" value={form.yearsInOperation} onChange={e => u('yearsInOperation', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Skilled Workforce Count</label><input className="form-input" type="number" value={form.skilledWorkforce} onChange={e => u('skilledWorkforce', e.target.value)} /></div>
                </div>
            </div>
        </FormWrapper>
    );
}
