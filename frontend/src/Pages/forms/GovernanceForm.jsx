import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function GovernanceForm() {
    const [form, setForm] = useState({
        sopAvailable: 'No', internalAudit: 'No', financialReview: 'No',
        documentSystem: 'No', insuranceAvailable: 'No',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

    const Toggle = ({ label, field, hint }) => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className="toggle-group">
                {['Yes', 'No'].map(o => <button key={o} type="button" className={`toggle-btn ${form[field] === o ? 'active' : ''}`} onClick={() => u(field, o)}>{o}</button>)}
            </div>
            {hint && <span className="form-hint">{hint}</span>}
        </div>
    );

    const yesCount = Object.values(form).filter(v => v === 'Yes').length;
    const maturity = yesCount >= 4 ? 'Advanced' : yesCount >= 2 ? 'Moderate' : 'Basic';

    return (
        <FormWrapper title="Governance Entry" subtitle="Quarterly governance and control assessment" dataType="governance"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">🏛️ Governance Controls</h4>
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: maturity === 'Advanced' ? 'var(--success-bg)' : maturity === 'Moderate' ? 'var(--warning-bg)' : 'var(--danger-bg)', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 500 }}>
                    Governance Maturity Level: <strong>{maturity}</strong> ({yesCount}/5 controls in place)
                </div>
                <div className="form-row">
                    <Toggle label="Standard Operating Procedures (SOP) Available?" field="sopAvailable" hint="Documented processes for key operations" />
                    <Toggle label="Internal Audit Done?" field="internalAudit" hint="Regular internal audits conducted" />
                </div>
                <div className="form-row">
                    <Toggle label="Financial Review Done?" field="financialReview" hint="Periodic financial review by management" />
                    <Toggle label="Document Control System Available?" field="documentSystem" hint="System for managing documentation" />
                </div>
                <div className="form-row">
                    <Toggle label="Insurance Available?" field="insuranceAvailable" hint="Business/asset insurance in place" />
                </div>
            </div>
        </FormWrapper>
    );
}
