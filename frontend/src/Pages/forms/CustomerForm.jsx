import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiPlus, FiTrash2, FiExternalLink, FiDollarSign, FiCalendar, FiPercent, FiAlertCircle } from 'react-icons/fi';
import FormWrapper from '../../components/FormWrapper';

export default function CustomerForm() {
    const [form, setForm] = useState({
        customers: [{ name: '', salesValue: '', outstandingAmount: '', outstandingDays: '', creditDays: '' }],
        totalSales: '', customerLoss: '0', avgPaymentDelay: '',
        orderVisibilityMonths: '', revenueGrowth: '', repeatOrderRatio: '',
        contractCoverage: '', industryRiskLevel: 'Medium',
    });

    // Helper for top-level state updates
    const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

    // Helper for nested customer array updates
    const updateCustomer = (i, field, val) => {
        const c = [...form.customers];
        c[i] = { ...c[i], [field]: val };
        setForm(f => ({ ...f, customers: c }));
    };

    const addCustomer = () => setForm(f => ({ 
        ...f, 
        customers: [...f.customers, { name: '', salesValue: '', outstandingAmount: '', outstandingDays: '', creditDays: '' }] 
    }));

    const removeCustomer = (i) => setForm(f => ({ 
        ...f, 
        customers: f.customers.filter((_, idx) => idx !== i) 
    }));

    // Shared Input Classes for consistency
    const inputClass = "block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1";

    return (
        <FormWrapper 
            title="Customer Sales Entry" 
            subtitle="Monthly customer and sales data" 
            dataType="customer"
            getFormData={() => form} 
            setFormData={d => setForm(f => ({ ...f, ...d }))}
        >
            <div className="space-y-6 bg-slate-50/50 p-1">
                
                {/* ===== SECTION 1: CUSTOMER DETAILS ===== */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-md text-indigo-600"><FiUsers /></div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Customer Details</h3>
                                <p className="text-xs text-slate-500">Add individual customer records</p>
                            </div>
                        </div>
                        <NavLink 
                            to="/forms/financial" 
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            Granular Ageing Analysis <FiExternalLink className="w-3.5 h-3.5" />
                        </NavLink>
                    </div>

                    {/* Customer List */}
                    <div className="p-6 space-y-4">
                        {form.customers.map((c, i) => (
                            <div 
                                key={i} 
                                className="relative p-4 bg-slate-50 rounded-lg border border-slate-200 transition-all hover:border-slate-300"
                            >
                                {/* Customer Card Header */}
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-slate-200">
                                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">{i + 1}</span>
                                        Customer Entry
                                    </h4>
                                    {form.customers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCustomer(i)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                            title="Remove Customer"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Customer Inputs Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-1">
                                        <label className={labelClass}>Customer Name</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={c.name} 
                                            onChange={e => updateCustomer(i, 'name', e.target.value)} 
                                            placeholder="Enter name or ID" 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Sales Value (₹)</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <FiDollarSign className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="number" 
                                                className={`${inputClass} pl-8`} 
                                                value={c.salesValue} 
                                                onChange={e => updateCustomer(i, 'salesValue', e.target.value)} 
                                                placeholder="0.00" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Outstanding Amount (₹)</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <FiDollarSign className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="number" 
                                                className={`${inputClass} pl-8`} 
                                                value={c.outstandingAmount} 
                                                onChange={e => updateCustomer(i, 'outstandingAmount', e.target.value)} 
                                                placeholder="0.00" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Outstanding Days</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <FiCalendar className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="number" 
                                                className={`${inputClass} pl-8`} 
                                                value={c.outstandingDays} 
                                                onChange={e => updateCustomer(i, 'outstandingDays', e.target.value)} 
                                                placeholder="Days" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Credit Days Allowed</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <FiCalendar className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="number" 
                                                className={`${inputClass} pl-8`} 
                                                value={c.creditDays} 
                                                onChange={e => updateCustomer(i, 'creditDays', e.target.value)} 
                                                placeholder="Days" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Customer Button */}
                        <button
                            type="button"
                            onClick={addCustomer}
                            className="w-full flex justify-center items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                        >
                            <FiPlus className="w-4 h-4" />
                            Add New Customer Row
                        </button>
                    </div>
                </section>

                {/* ===== SECTION 2: GROWTH & RISK METRICS ===== */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-md text-emerald-600"><FiTrendingUp /></div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Growth & Risk Metrics</h3>
                            <p className="text-xs text-slate-500">Aggregate business performance indicators</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>Total Sales (₹)</label>
                                <input 
                                    type="number" 
                                    className={inputClass} 
                                    value={form.totalSales} 
                                    onChange={e => u('totalSales', e.target.value)} 
                                    placeholder="Total monthly sales" 
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Customers Lost (Last 12 M)</label>
                                <select 
                                    className={inputClass} 
                                    value={form.customerLoss} 
                                    onChange={e => u('customerLoss', e.target.value)}
                                >
                                    {['0', '1', '2', '3', '4', '5+'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Avg Payment Delay (Days)</label>
                                <input 
                                    type="number" 
                                    className={inputClass} 
                                    value={form.avgPaymentDelay} 
                                    onChange={e => u('avgPaymentDelay', e.target.value)} 
                                    placeholder="Average delay" 
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Order Visibility (Months)</label>
                                <input 
                                    type="number" 
                                    className={inputClass} 
                                    value={form.orderVisibilityMonths} 
                                    onChange={e => u('orderVisibilityMonths', e.target.value)} 
                                    placeholder="Forecast visibility" 
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <label className={labelClass}>Revenue Growth Rate (%)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className={`${inputClass} pr-8`} 
                                        value={form.revenueGrowth} 
                                        onChange={e => u('revenueGrowth', e.target.value)} 
                                        placeholder="e.g. 12.5" 
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <FiPercent className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Repeat Order Ratio (%)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className={`${inputClass} pr-8`} 
                                        value={form.repeatOrderRatio} 
                                        onChange={e => u('repeatOrderRatio', e.target.value)} 
                                        placeholder="e.g. 45" 
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <FiPercent className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Contract Coverage (%)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className={`${inputClass} pr-8`} 
                                        value={form.contractCoverage} 
                                        onChange={e => u('contractCoverage', e.target.value)} 
                                        placeholder="Long-term %" 
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <FiPercent className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Level */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className={labelClass}>Customer Industry Risk Level</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                                {['Low', 'Medium', 'High', 'Critical'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => u('industryRiskLevel', level)}
                                        className={`px-3 py-2 text-xs font-semibold rounded-md border transition-all w-full ${
                                            form.industryRiskLevel === level 
                                            ? level === 'Low' ? 'bg-green-50 text-green-700 border-green-200' 
                                              : level === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                              : level === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                              : 'bg-red-50 text-red-700 border-red-200'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </FormWrapper>
    );
}