import { useState } from 'react';
import { FiCalendar, FiCheckCircle, FiFileText, FiShield, FiAlertTriangle, FiClock, FiDownload } from 'react-icons/fi';
import FormWrapper from '../../components/FormWrapper';

export default function ComplianceForm() {
    const [form, setForm] = useState({
        gstFilingStatus: 'On-time', gstDueDate: '', gstFilingDate: '', gstPaymentDelay: '0',
        pfFiled: 'Yes', esiFiled: 'Yes', tdsFiled: 'Yes',
        itFiled: 'Yes', auditCompleted: 'Yes', licenseValid: 'Yes',
        regulatoryNotices: 'None', licenseName: '', licenseExpiry: '',
        environmentalCompliance: 'Yes', laborLawCompliance: 'Yes',
        filingDiscipline: 'High', consentRenewalsPending: 'No',
        // Statutory Filing History
        pfFilings: Array(12).fill({ month: '', dueDate: '', filedDate: '', payDate: '', employer: '', employee: '' }),
        esiFilings: Array(12).fill({ month: '', dueDate: '', filedDate: '', payDate: '', employer: '', employee: '' }),
        tdsPayments: Array(12).fill({ month: '', dueDate: '', payDate: '', amount: '' }),
        tdsReturns: Array(4).fill({ qtr: '', form24Due: '', form24Filed: '', form26Due: '', form26Filed: '' }),
    });

    const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
    
    const updateTable = (field, i, key, val) => {
        const list = [...form[field]];
        list[i] = { ...list[i], [key]: val };
        u(field, list);
    };

    const gstComplianceScore = form.gstFilingStatus === 'On-time' ? 'Fully Compliant' : form.gstFilingStatus === 'Delayed' ? 'Partially Compliant' : 'Non-Compliant';

    // --- Professional Toggle Component ---
    const Toggle = ({ label, field, options }) => (
        <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">{label}</label>
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                {options.map(o => (
                    <button
                        key={o}
                        type="button"
                        onClick={() => u(field, o)}
                        className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none ${
                            form[field] === o 
                            ? 'bg-white text-blue-700 shadow-sm border border-slate-200' 
                            : 'text-slate-500 hover:text-slate-700 border border-transparent'
                        }`}
                    >
                        {o}
                    </button>
                ))}
            </div>
        </div>
    );

    // --- Shared Table Styles ---
    const tableInputClass = "w-full px-2 py-1.5 text-xs text-slate-700 bg-transparent border-b border-slate-200 focus:border-blue-500 focus:ring-0 focus:bg-blue-50/30 outline-none transition-colors";
    const staticCellClass = "px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap";

    return (
        <FormWrapper 
            title="Compliance Entry" 
            subtitle="Monthly statutory compliance status" 
            dataType="compliance"
            getFormData={() => ({ ...form, gstComplianceScore })} 
            setFormData={d => setForm(f => ({ ...f, ...d }))}
        >
            <div className="space-y-6 bg-slate-50/50 p-1">
                
                {/* ===== SECTION 1: GST COMPLIANCE ===== */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-md text-blue-600"><FiFileText /></div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">GST Filing Compliance</h3>
                            <p className="text-xs text-slate-500">Goods and Services Tax return status</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">GST Filing Status</label>
                                <select 
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={form.gstFilingStatus} 
                                    onChange={e => u('gstFilingStatus', e.target.value)}
                                >
                                    {['On-time', 'Delayed', 'Not Filed'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Auto Compliance Score</label>
                                <div className={`px-3 py-2 rounded-md text-sm font-bold flex items-center gap-2 border ${
                                    gstComplianceScore === 'Fully Compliant' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : gstComplianceScore === 'Partially Compliant' 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {gstComplianceScore === 'Fully Compliant' ? <FiCheckCircle /> : <FiAlertTriangle />}
                                    {gstComplianceScore}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Filing Discipline</label>
                                <select 
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={form.filingDiscipline} 
                                    onChange={e => u('filingDiscipline', e.target.value)}
                                >
                                    {['High', 'Medium', 'Low'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Payment Delay (Days)</label>
                                <input 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    type="number" min="0" value={form.gstPaymentDelay} onChange={e => u('gstPaymentDelay', e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Due Date</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" type="date" value={form.gstDueDate} onChange={e => u('gstDueDate', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Actual Filing Date</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" type="date" value={form.gstFilingDate} onChange={e => u('gstFilingDate', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== SECTION 2: STATUTORY FILINGS ===== */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-md text-indigo-600"><FiCalendar /></div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Detailed Statutory Filing Tracker</h3>
                            <p className="text-xs text-slate-500">PF, ESI, and TDS monthly records</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        
                        {/* PF Table */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 border-l-4 border-blue-500 pl-2">I. PF Filings</h4>
                            <div className="overflow-x-auto rounded-md border border-slate-200">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase w-20">Month</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Filed Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Pay Due</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Paid Date</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Employer (₹)</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Employee (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map((m, i) => (
                                            <tr key={m} className="hover:bg-slate-50 transition-colors">
                                                <td className={staticCellClass}>{m}</td>
                                                <td className="p-0"><input type="text" className={tableInputClass} placeholder="DD/MM" value={form.pfFilings[i]?.dueDate} onChange={e => updateTable('pfFilings', i, 'dueDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="date" className={tableInputClass} value={form.pfFilings[i]?.filedDate} onChange={e => updateTable('pfFilings', i, 'filedDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="text" className={tableInputClass} placeholder="DD/MM" value={form.pfFilings[i]?.payDueDate} onChange={e => updateTable('pfFilings', i, 'payDueDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="date" className={tableInputClass} value={form.pfFilings[i]?.payDate} onChange={e => updateTable('pfFilings', i, 'payDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="number" className={`${tableInputClass} text-right`} placeholder="0.00" value={form.pfFilings[i]?.employer} onChange={e => updateTable('pfFilings', i, 'employer', e.target.value)} /></td>
                                                <td className="p-0"><input type="number" className={`${tableInputClass} text-right`} placeholder="0.00" value={form.pfFilings[i]?.employee} onChange={e => updateTable('pfFilings', i, 'employee', e.target.value)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ESI Table */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 border-l-4 border-purple-500 pl-2">II. ESI Filings</h4>
                            <div className="overflow-x-auto rounded-md border border-slate-200">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase w-20">Month</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Filed Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Pay Due</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Paid Date</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Employer (₹)</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Employee (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map((m, i) => (
                                            <tr key={m} className="hover:bg-slate-50 transition-colors">
                                                <td className={staticCellClass}>{m}</td>
                                                <td className="p-0"><input type="text" className={tableInputClass} value={form.esiFilings[i]?.dueDate} onChange={e => updateTable('esiFilings', i, 'dueDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="date" className={tableInputClass} value={form.esiFilings[i]?.filedDate} onChange={e => updateTable('esiFilings', i, 'filedDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="text" className={tableInputClass} value={form.esiFilings[i]?.payDueDate} onChange={e => updateTable('esiFilings', i, 'payDueDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="date" className={tableInputClass} value={form.esiFilings[i]?.payDate} onChange={e => updateTable('esiFilings', i, 'payDate', e.target.value)} /></td>
                                                <td className="p-0"><input type="number" className={`${tableInputClass} text-right`} value={form.esiFilings[i]?.employer} onChange={e => updateTable('esiFilings', i, 'employer', e.target.value)} /></td>
                                                <td className="p-0"><input type="number" className={`${tableInputClass} text-right`} value={form.esiFilings[i]?.employee} onChange={e => updateTable('esiFilings', i, 'employee', e.target.value)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* TDS Table */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 border-l-4 border-green-500 pl-2">III. TDS Payments & Returns</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Monthly Payments */}
                                <div className="overflow-x-auto rounded-md border border-slate-200">
                                    <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                                        <h5 className="text-xs font-bold text-slate-600">Monthly Payments</h5>
                                    </div>
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 w-20">Month</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Due Date</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Paid Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100">
                                            {['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map((m, i) => (
                                                <tr key={m} className="hover:bg-slate-50 transition-colors">
                                                    <td className={staticCellClass}>{m}</td>
                                                    <td className="p-0"><input type="text" className={tableInputClass} value={form.tdsPayments[i]?.dueDate} onChange={e => updateTable('tdsPayments', i, 'dueDate', e.target.value)} /></td>
                                                    <td className="p-0"><input type="date" className={tableInputClass} value={form.tdsPayments[i]?.payDate} onChange={e => updateTable('tdsPayments', i, 'payDate', e.target.value)} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Quarterly Returns */}
                                <div className="overflow-x-auto rounded-md border border-slate-200">
                                    <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                                        <h5 className="text-xs font-bold text-slate-600">Quarterly Returns</h5>
                                    </div>
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Qtr</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">24Q Due</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">24Q Filed</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">26Q Due</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">26Q Filed</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100">
                                            {['Apr-Jun', 'Jul-Sep', 'Oct-Dec', 'Jan-Mar'].map((q, i) => (
                                                <tr key={q} className="hover:bg-slate-50 transition-colors">
                                                    <td className={staticCellClass}>{q}</td>
                                                    <td className="p-0"><input type="text" className={tableInputClass} value={form.tdsReturns[i]?.form24Due} onChange={e => updateTable('tdsReturns', i, 'form24Due', e.target.value)} /></td>
                                                    <td className="p-0"><input type="date" className={tableInputClass} value={form.tdsReturns[i]?.form24Filed} onChange={e => updateTable('tdsReturns', i, 'form24Filed', e.target.value)} /></td>
                                                    <td className="p-0"><input type="text" className={tableInputClass} value={form.tdsReturns[i]?.form26Due} onChange={e => updateTable('tdsReturns', i, 'form26Due', e.target.value)} /></td>
                                                    <td className="p-0"><input type="date" className={tableInputClass} value={form.tdsReturns[i]?.form26Filed} onChange={e => updateTable('tdsReturns', i, 'form26Filed', e.target.value)} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ===== SECTION 3: LICENSES & COMPLIANCE ===== */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-md text-green-600"><FiShield /></div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Licenses & Environmental</h3>
                            <p className="text-xs text-slate-500">Validations and regulatory notices</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Toggle label="License/Certification Valid?" field="licenseValid" options={['Yes', 'Expiring Soon', 'Expired']} />
                            <Toggle label="Regulatory Notices?" field="regulatoryNotices" options={['None', 'Minor', 'Major']} />
                            <Toggle label="Consent Renewals Pending?" field="consentRenewalsPending" options={['Yes', 'No']} />
                        </div>

                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">License Name</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.licenseName} onChange={e => u('licenseName', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">License Expiry Date</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" type="date" value={form.licenseExpiry} onChange={e => u('licenseExpiry', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Toggle label="Environmental Compliance?" field="environmentalCompliance" options={['Yes', 'No']} />
                            <Toggle label="Labor Law Compliance?" field="laborLawCompliance" options={['Yes', 'No']} />
                        </div>
                    </div>
                </section>

            </div>
        </FormWrapper>
    );
}