import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';

export default function InventoryForm() {
    const [form, setForm] = useState({
        // Raw Material
        rmOpening: '', rmUsed: '', rmClosing: '',
        // WIP
        wipOpening: '', wipClosing: '',
        // Finished Goods
        fgOpening: '', fgClosing: '',
        stockOutIncidents: '', rawMaterialLeadTime: '',
    });
    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

    const autoRmClosing = (Number(form.rmOpening) || 0) - (Number(form.rmUsed) || 0);

    return (
        <FormWrapper title="Inventory & Supply Entry" subtitle="Monthly inventory and material flow data" dataType="inventory"
            getFormData={() => form} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">📦 Inventory Tiers (₹)</h4>
                
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '10px' }}>Raw Material</h5>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Opening Stock</label><input className="form-input" type="number" value={form.rmOpening} onChange={e => u('rmOpening', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Used in Manufacturing</label><input className="form-input" type="number" value={form.rmUsed} onChange={e => u('rmUsed', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Closing Stock</label><input className="form-input" type="number" value={form.rmClosing} onChange={e => u('rmClosing', e.target.value)} placeholder={`Auto: ${autoRmClosing}`} /></div>
                    </div>
                </div>

                <div style={{ background: '#fdfcfb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '10px' }}>Work In Progress (WIP)</h5>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Opening Stock</label><input className="form-input" type="number" value={form.wipOpening} onChange={e => u('wipOpening', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Closing Stock</label><input className="form-input" type="number" value={form.wipClosing} onChange={e => u('wipClosing', e.target.value)} /></div>
                    </div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '10px' }}>Finished Goods</h5>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Opening Stock</label><input className="form-input" type="number" value={form.fgOpening} onChange={e => u('fgOpening', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Closing Stock</label><input className="form-input" type="number" value={form.fgClosing} onChange={e => u('fgClosing', e.target.value)} /></div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4 className="form-section-title">⚠️ Supply Risk Indicators</h4>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Stock-out Incidents</label><input className="form-input" type="number" value={form.stockOutIncidents} onChange={e => u('stockOutIncidents', e.target.value)} placeholder="Number of incidents" /></div>
                    <div className="form-group"><label className="form-label">Raw Material Lead Time (days)</label><input className="form-input" type="number" value={form.rawMaterialLeadTime} onChange={e => u('rawMaterialLeadTime', e.target.value)} /></div>
                </div>
            </div>
        </FormWrapper>
    );
}
