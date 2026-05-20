// components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyEntries } from './constants';

const Dashboard = ({ onAddClick }) => {
  const navigate = useNavigate();

  const handleAdd = () => {
    if (onAddClick) return onAddClick();
    navigate('/financial/new');
  };

  const formatCurrency = (val) => `₹${(val / 100000).toFixed(1)}L`;
  
  const getStatusBadge = (status) => {
    const styles = {
      filed: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      draft: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900">FinanceFlow</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Financial Year</p>
                <p className="text-sm font-semibold">2026-27</p>
              </div>
              <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { title: 'Total Revenue', val: '₹2.45 Cr', change: '+12.5%', color: 'text-emerald-600', bg: 'bg-teal-50' },
            { title: 'Total Expenses', val: '₹1.82 Cr', change: '+8.2%', color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: 'Net Profit', val: '₹63.2 L', change: '+22.1% margin', color: 'text-teal-700', bg: 'bg-emerald-50' },
            { title: 'Cash Balance', val: '₹48.5 L', change: '3.2 months runway', color: 'text-blue-600', bg: 'bg-blue-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                <span className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
              </div>
              <p className="font-display font-bold text-2xl text-slate-900">{stat.val}</p>
              <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-slate-900">Monthly Entries</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500">
              <option>FY 2026-27</option>
              <option>FY 2025-26</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Month', 'Revenue', 'Expenses', 'Net Profit', 'GST Status', 'Action'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyEntries.map((entry) => {
                  const profit = entry.revenue - entry.expenses;
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{entry.month}</td>
                      <td className="px-6 py-4 font-display font-medium text-slate-700">{formatCurrency(entry.revenue)}</td>
                      <td className="px-6 py-4 font-display font-medium text-slate-700">{formatCurrency(entry.expenses)}</td>
                      <td className="px-6 py-4 font-display font-bold text-teal-700">{formatCurrency(profit)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(entry.status)}`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-teal-600 hover:underline text-sm font-semibold">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;