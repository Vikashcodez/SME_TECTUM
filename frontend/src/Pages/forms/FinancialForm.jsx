import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FormWrapper from '../../components/FormWrapper';

export default function FinancialForm() {
    const [form, setForm] = useState({
        // Revenue & Expenses
        revenue: '', expenses: '', cashBalance: '', accountsReceivable: '', accountsPayable: '',
        inventoryValue: '', totalDebt: '', equity: '', shortTermDebt: '', interestExpense: '',
        // Updated Ageing (Receivables)
        recNotDue: '', recLt30: '', rec30_60: '', rec60_90: '', rec90_180: '', recGt180: '',
        // Updated Ageing (Payables)
        payNotDue: '', payLt30: '', pay30_60: '', pay60_90: '', pay90_180: '', payGt180: '',
        // Working Capital Working
        currentAssets: '', currentLiabilities: '', wcUsed: '', wcLimit: '', revenueGrowth: '',
        // GST Data (Extended GSTR)
        b2bInvoices: '', b2clInvoices: '', exportInvoices: '', b2csOthers: '', nilRated: '',
        creditNotesReg: '', creditNotesUnreg: '', taxLiabilityAdvances: '', adjAdvances: '',
        hsnSummary: '', docsIssued: '', suppliesEco: '', supplies9_5: '',
        gstLiability: '', inputTaxCredit: '', gstPaid: '',
        // Loan / Debt Details
        existingLoanAmount: '', loanType: 'Term Loan', emiAmount: '', interestRate: '', loanTenure: '',
        emiStartDate: '', loanCollateral: 'Property', overdueAmount: '', creditScore: '', bankName: '',
        emiDelays: '0', loanRestructuring: 'None',
        // Detailed Cash Flow
        cfRecFromCust: '', cfPaidToSupp: '', cfPaidToEmp: '', cfOverheads: '', cfIncomeTax: '',
        cfPurchasePPE: '', cfSalePPE: '', cfShareCapital: '', cfLoanRepaid: '', cfDebentures: '',
        cfDividendsPaid: '', cfOpenCash: '', cfCloseCash: '',
        // Legacy/Misc
        avgMonthlyInflows: '', avgMonthlyOutflows: '', cashShortageMonths: 'None',
    });

    const netProfit = (Number(form.revenue) || 0) - (Number(form.expenses) || 0);
    const wcCalculated = (Number(form.currentAssets) || 0) - (Number(form.currentLiabilities) || 0);
    const currentRatio = (Number(form.currentLiabilities) > 0) ? (Number(form.currentAssets) / Number(form.currentLiabilities)).toFixed(2) : '—';
    const itcUtilization = Number(form.gstLiability) > 0 ? ((Number(form.inputTaxCredit) || 0) / Number(form.gstLiability) * 100).toFixed(1) : '—';
    const taxToRevenue = Number(form.revenue) > 0 ? ((Number(form.gstPaid) || 0) / Number(form.revenue) * 100).toFixed(2) : '—';
    const emiBurden = netProfit > 0 ? ((Number(form.emiAmount) || 0) / netProfit * 100).toFixed(1) : '—';
    const debtToEquity = Number(form.equity) > 0 ? (Number(form.totalDebt) / Number(form.equity)).toFixed(2) : '—';
    const cashSurplus = (Number(form.avgMonthlyInflows) || 0) - (Number(form.avgMonthlyOutflows) || 0);
    const autoCashReserve = Number(form.avgMonthlyOutflows) > 0 ? (Number(form.cashBalance) / Number(form.avgMonthlyOutflows)).toFixed(1) : '—';

    const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

    return (
        <FormWrapper title="Financial Entry" subtitle="Monthly financial data" dataType="financial"
            getFormData={() => ({ ...form, netProfit, wcCalculated, currentRatio, itcUtilization, taxToRevenue, emiBurden, debtToEquity, cashSurplus, autoCashReserve })}
            setFormData={d => setForm(f => ({ ...f, ...d }))}>

            {/* ===== REVENUE & EXPENSES ===== */}
            <div className="form-section">
                <h4 className="form-section-title">💰 Revenue & Expenses</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Total Revenue (₹) <span className="required">*</span></label>
                        <input className="form-input" type="number" value={form.revenue} onChange={e => u('revenue', e.target.value)} placeholder="e.g. 5000000" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Total Expenses (₹) <span className="required">*</span></label>
                        <input className="form-input" type="number" value={form.expenses} onChange={e => u('expenses', e.target.value)} placeholder="e.g. 4200000" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Net Profit (₹) — Auto Calculated</label>
                        <input className="form-input" type="number" value={netProfit} readOnly style={{ background: '#f0fdf4', fontWeight: 600, color: netProfit >= 0 ? '#2ECC71' : '#E74C3C' }} />
                        <span className="form-hint">Revenue − Expenses</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Cash Balance (₹)</label>
                        <input className="form-input" type="number" value={form.cashBalance} onChange={e => u('cashBalance', e.target.value)} placeholder="e.g. 1500000" />
                    </div>
                </div>
            </div>

            {/* ===== DETAILED GST DATA (GSTR) ===== */}
            <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="form-section-title" style={{ margin: 0 }}>🧾 Detailed GST Data (GSTR)</h4>
                    <NavLink to="/forms/gst-data" style={{ padding: '6px 12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                        Open Detailed GST Form →
                    </NavLink>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                        { label: '4A,4B,6B,6C (B2B/SEZ/DE)', field: 'b2bInvoices' },
                        { label: '5 (B2C Large Invoices)', field: 'b2clInvoices' },
                        { label: '6A (Exports Invoices)', field: 'exportInvoices' },
                        { label: '7 (B2C Others)', field: 'b2csOthers' },
                        { label: '8A,8B,8C,8D (Nil Rated)', field: 'nilRated' },
                        { label: '9B (Debit/Credit Reg)', field: 'creditNotesReg' },
                        { label: '9B (Debit/Credit Unreg)', field: 'creditNotesUnreg' },
                        { label: '11A(1),(2) (Tax Liab Adv)', field: 'taxLiabilityAdvances' },
                        { label: '11B(1),(2) (Adj Adv)', field: 'adjAdvances' },
                        { label: '12 (HSN Summary)', field: 'hsnSummary' },
                        { label: '13 (Documents Issued)', field: 'docsIssued' },
                        { label: '14 (ECO Supplies)', field: 'suppliesEco' },
                        { label: '15 (Supplies U/s 9(5))', field: 'supplies9_5' },
                    ].map(b => (
                        <div key={b.field} className="form-group" style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{b.label}</label>
                            <input className="form-input" type="number" value={form[b.field]} onChange={e => u(b.field, e.target.value)} />
                        </div>
                    ))}
                </div>
                <div className="form-row" style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Total GST Liability (₹)</label>
                        <input className="form-input" type="number" value={form.gstLiability} onChange={e => u('gstLiability', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Input Tax Credit – ITC (₹)</label>
                        <input className="form-input" type="number" value={form.inputTaxCredit} onChange={e => u('inputTaxCredit', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Monthly GST Tax Paid (₹)</label>
                        <input className="form-input" type="number" value={form.gstPaid} onChange={e => u('gstPaid', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">ITC Utilization Ratio — Auto</label>
                        <input className="form-input" value={`${itcUtilization}%`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">ITC ÷ GST Liability</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tax to Revenue Ratio — Auto</label>
                        <input className="form-input" value={`${taxToRevenue}%`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">GST Paid ÷ Sales</span>
                    </div>
                </div>
            </div>

            {/* ===== DETAILED AGEING: RECEIVABLES & PAYABLES ===== */}
            <div className="form-section">
                <h4 className="form-section-title">📊 Granular Ageing Analysis</h4>
                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '10px' }}>Receivables Ageing (₹)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                        {[
                            { label: 'Not Due', f: 'recNotDue' }, { label: '< 30 Days', f: 'recLt30' },
                            { label: '30-60 Days', f: 'rec30_60' }, { label: '60-90 Days', f: 'rec60_90' },
                            { label: '90-180 Days', f: 'rec90_180' }, { label: '> 180 Days', f: 'recGt180' },
                        ].map(b => (
                            <div key={b.f} className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem' }}>{b.label}</label>
                                <input className="form-input" type="number" value={form[b.f]} onChange={e => u(b.f, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label className="form-label">Total Accounts Receivable (₹)</label>
                        <input className="form-input" type="number" value={form.accountsReceivable} onChange={e => u('accountsReceivable', e.target.value)} placeholder="Total outstanding" />
                    </div>
                </div>

                <div>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '10px' }}>Payables Ageing (₹)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                        {[
                            { label: 'Not Due', f: 'payNotDue' }, { label: '< 30 Days', f: 'payLt30' },
                            { label: '30-60 Days', f: 'pay30_60' }, { label: '60-90 Days', f: 'pay60_90' },
                            { label: '90-180 Days', f: 'pay90_180' }, { label: '> 180 Days', f: 'payGt180' },
                        ].map(b => (
                            <div key={b.f} className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem' }}>{b.label}</label>
                                <input className="form-input" type="number" value={form[b.f]} onChange={e => u(b.f, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label className="form-label">Total Accounts Payable (₹)</label>
                        <input className="form-input" type="number" value={form.accountsPayable} onChange={e => u('accountsPayable', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* ===== DEBT & WORKING CAPITAL WORKING ===== */}
            <div className="form-section">
                <h4 className="form-section-title">🏦 Debt & Working Capital Analysis</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Current Assets (₹)</label>
                        <input className="form-input" type="number" value={form.currentAssets} onChange={e => u('currentAssets', e.target.value)} placeholder="Short-term assets" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current Liabilities (₹)</label>
                        <input className="form-input" type="number" value={form.currentLiabilities} onChange={e => u('currentLiabilities', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Working Capital (₹) — Auto</label>
                        <input className="form-input" value={`₹${wcCalculated.toLocaleString()}`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">Current Assets − Current Liabilities</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current Ratio — Auto</label>
                        <input className="form-input" value={currentRatio} readOnly style={{ background: Number(currentRatio) < 1.0 ? '#fef2f2' : '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">CA ÷ CL (Ideal {'>'} 1.2)</span>
                    </div>
                </div>
                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Total Debt (₹)</label>
                        <input className="form-input" type="number" min="0" value={form.totalDebt} onChange={e => u('totalDebt', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">WC Utilization Used (₹)</label>
                        <input className="form-input" type="number" value={form.wcUsed} onChange={e => u('wcUsed', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Working Capital Limit (₹)</label>
                        <input className="form-input" type="number" value={form.wcLimit} onChange={e => u('wcLimit', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Short-Term Debt (₹)</label>
                        <input className="form-input" type="number" value={form.shortTermDebt} onChange={e => u('shortTermDebt', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Equity (₹)</label>
                        <input className="form-input" type="number" value={form.equity} onChange={e => u('equity', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Interest Expense (₹)</label>
                        <input className="form-input" type="number" value={form.interestExpense} onChange={e => u('interestExpense', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* ===== LOAN DETAILS ===== */}
            <div className="form-section">
                <h4 className="form-section-title">📋 Loan & EMI Details</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Existing Loan Amount (₹)</label>
                        <input className="form-input" type="number" value={form.existingLoanAmount} onChange={e => u('existingLoanAmount', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Loan Type</label>
                        <select className="form-input" value={form.loanType} onChange={e => u('loanType', e.target.value)}>
                            {['Term Loan', 'Working Capital Loan', 'OD', 'Others'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">EMI Amount (₹/month)</label>
                        <input className="form-input" type="number" value={form.emiAmount} onChange={e => u('emiAmount', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Interest Rate (%)</label>
                        <input className="form-input" type="number" step="0.1" value={form.interestRate} onChange={e => u('interestRate', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Loan Tenure (months)</label>
                        <input className="form-input" type="number" value={form.loanTenure} onChange={e => u('loanTenure', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">EMI Start Date</label>
                        <input className="form-input" type="date" value={form.emiStartDate} onChange={e => u('emiStartDate', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Loan Security / Collateral</label>
                        <select className="form-input" value={form.loanCollateral} onChange={e => u('loanCollateral', e.target.value)}>
                            {['Property', 'Machinery', 'Stock', 'Others', 'None'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Overdue Amount (₹)</label>
                        <input className="form-input" type="number" value={form.overdueAmount} onChange={e => u('overdueAmount', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Credit Score (if available)</label>
                        <input className="form-input" type="number" value={form.creditScore} onChange={e => u('creditScore', e.target.value)} placeholder="e.g. 750" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bank / NBFC Name</label>
                        <input className="form-input" value={form.bankName} onChange={e => u('bankName', e.target.value)} placeholder="e.g. SBI" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">EMI Delays (last 12 months)</label>
                        <select className="form-input" value={form.emiDelays} onChange={e => u('emiDelays', e.target.value)}>
                            {['0', '1', '2', '3', '4', '5+'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Loan Restructuring History</label>
                        <select className="form-input" value={form.loanRestructuring} onChange={e => u('loanRestructuring', e.target.value)}>
                            {['None', '3+ years ago', '1-3 years ago', 'Recent', 'Ongoing'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">EMI Burden (%) — Auto</label>
                        <input className="form-input" value={`${emiBurden}%`} readOnly style={{ background: Number(emiBurden) > 40 ? '#fef2f2' : '#f0fdf4', fontWeight: 600, color: Number(emiBurden) > 40 ? '#E74C3C' : '#2ECC71' }} />
                        <span className="form-hint">EMI ÷ Net Profit {Number(emiBurden) > 40 ? '⚠️ Risk Flag (>40%)' : ''}</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Debt to Equity Ratio — Auto</label>
                        <input className="form-input" value={debtToEquity} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">Total Debt ÷ Equity</span>
                    </div>
                </div>
            </div>

            {/* ===== DETAILED CASH FLOW STATEMENT ===== */}
            <div className="form-section">
                <h4 className="form-section-title">💸 Detailed Cash Flow Statement</h4>
                <div className="form-row">
                    <div style={{ flex: 1, background: '#f0f9ff', padding: '15px', borderRadius: '8px' }}>
                        <h5 style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '10px' }}>Operating Activities</h5>
                        {[
                            { label: 'Rec from Receivables', f: 'cfRecFromCust' },
                            { label: 'Paid for Payables', f: 'cfPaidToSupp' },
                            { label: 'Paid to Employees', f: 'cfPaidToEmp' },
                            { label: 'Other Overheads', f: 'cfOverheads' },
                            { label: 'Income Tax Paid', f: 'cfIncomeTax' },
                        ].map(x => (
                            <div key={x.f} className="form-group" style={{ marginBottom: '8px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>{x.label}</label>
                                <input className="form-input input-sm" type="number" value={form[x.f]} onChange={e => u(x.f, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1, background: '#fdf2f8', padding: '15px', borderRadius: '8px' }}>
                        <h5 style={{ fontSize: '0.85rem', color: '#be185d', marginBottom: '10px' }}>Investing & Financing</h5>
                        {[
                            { label: 'Purchase of PPE', f: 'cfPurchasePPE' },
                            { label: 'Sale of PPE', f: 'cfSalePPE' },
                            { label: 'Share Capital Issued', f: 'cfShareCapital' },
                            { label: 'Bank Loan Repaid', f: 'cfLoanRepaid' },
                            { label: 'Debentures Redeemed', f: 'cfDebentures' },
                            { label: 'Dividends Paid', f: 'cfDividendsPaid' },
                        ].map(x => (
                            <div key={x.f} className="form-group" style={{ marginBottom: '8px' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>{x.label}</label>
                                <input className="form-input input-sm" type="number" value={form[x.f]} onChange={e => u(x.f, e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-row" style={{ marginTop: '15px', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div className="form-group">
                        <label className="form-label">Cash at Beginning (₹)</label>
                        <input className="form-input" type="number" value={form.cfOpenCash} onChange={e => u('cfOpenCash', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Cash at End (₹)</label>
                        <input className="form-input" type="number" value={form.cfCloseCash} onChange={e => u('cfCloseCash', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* ===== CASH RESERVE & LIQUIDITY ===== */}
            <div className="form-section">
                <h4 className="form-section-title">💵 Cash Reserve & Shortage</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Avg Monthly Inflows (₹)</label>
                        <input className="form-input" type="number" value={form.avgMonthlyInflows} onChange={e => u('avgMonthlyInflows', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Avg Monthly Outflows (₹)</label>
                        <input className="form-input" type="number" value={form.avgMonthlyOutflows} onChange={e => u('avgMonthlyOutflows', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Months with Cash Shortage (last 6 months)</label>
                        <select className="form-input" value={form.cashShortageMonths} onChange={e => u('cashShortageMonths', e.target.value)}>
                            {['None', '1-2', '3 or more'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Cash Reserve (Months) — Auto</label>
                        <input className="form-input" value={`${autoCashReserve} months`} readOnly style={{ background: '#f0fdf4', fontWeight: 600 }} />
                        <span className="form-hint">Cash Balance ÷ Outflows</span>
                    </div>
                </div>
            </div>

        </FormWrapper>
    );
}
