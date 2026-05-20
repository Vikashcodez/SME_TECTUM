// components/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = ({ onAddClick }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('');

  const handleAdd = () => {
    if (onAddClick) return onAddClick();
    navigate('/financial/new');
  };

  const fetchFinancials = async () => {
    setLoading(true);
    setError('');

    try {
      const companyId = user?.company_id || user?.companyId;
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(companyId && { company_id: String(companyId) }),
        ...(selectedFiscalYear && { fiscal_year: selectedFiscalYear })
      });

      const response = await axios.get(`http://localhost:5000/api/financials?${queryParams.toString()}`);
      const rows = response?.data?.data || [];
      setEntries(Array.isArray(rows) ? rows : []);
    } catch (fetchError) {
      console.error('Error fetching dashboard financials:', fetchError);
      setError('Unable to load financial dashboard data. Please try again.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, [selectedFiscalYear, user?.company_id, user?.companyId]);

  const formatCurrency = (value) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCompactCurrency = (value) => {
    const num = Number(value || 0);
    if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return formatCurrency(num);
  };

  const metrics = useMemo(() => {
    const totalRevenue = entries.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
    const totalExpenses = entries.reduce((sum, row) => sum + Number(row.expenses || 0), 0);
    const totalCashBalance = entries.reduce((sum, row) => sum + Number(row.cash_balance || 0), 0);
    const totalNetProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      totalNetProfit,
      totalCashBalance
    };
  }, [entries]);

  const availableFiscalYears = useMemo(() => {
    const years = [...new Set(entries.map((row) => row.fiscal_year).filter(Boolean))];
    return years.sort((a, b) => String(b).localeCompare(String(a)));
  }, [entries]);
  
  const getStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    const styles = {
      approved: 'bg-emerald-100 text-emerald-700',
      submitted: 'bg-amber-100 text-amber-700',
      draft: 'bg-slate-200 text-slate-700',
      rejected: 'bg-rose-100 text-rose-700'
    };
    return styles[normalized] || 'bg-gray-100 text-gray-700';
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
                <p className="text-sm font-semibold">{selectedFiscalYear || 'All Years'}</p>
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
            { title: 'Total Revenue', val: formatCompactCurrency(metrics.totalRevenue), change: `${entries.length} entries`, color: 'text-emerald-600', bg: 'bg-teal-50' },
            { title: 'Total Expenses', val: formatCompactCurrency(metrics.totalExpenses), change: 'From selected period', color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: 'Net Profit', val: formatCompactCurrency(metrics.totalNetProfit), change: metrics.totalNetProfit >= 0 ? 'Positive margin' : 'Negative margin', color: metrics.totalNetProfit >= 0 ? 'text-teal-700' : 'text-rose-700', bg: 'bg-emerald-50' },
            { title: 'Cash Balance', val: formatCompactCurrency(metrics.totalCashBalance), change: 'Closing cash total', color: 'text-blue-600', bg: 'bg-blue-50' }
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
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="">All Fiscal Years</option>
              {availableFiscalYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
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
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">Loading dashboard data...</td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-rose-600 font-medium">{error}</td>
                  </tr>
                )}

                {!loading && !error && entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">No financial entries found.</td>
                  </tr>
                )}

                {!loading && !error && entries.map((entry) => {
                  const profit = Number(entry.revenue || 0) - Number(entry.expenses || 0);
                  return (
                    <tr key={entry.financial_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{entry.month} {entry.fiscal_year}</td>
                      <td className="px-6 py-4 font-display font-medium text-slate-700">{formatCurrency(entry.revenue)}</td>
                      <td className="px-6 py-4 font-display font-medium text-slate-700">{formatCurrency(entry.expenses)}</td>
                      <td className={`px-6 py-4 font-display font-bold ${profit >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>{formatCurrency(profit)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(entry.status)}`}>
                          {entry.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => navigate(`/financial/${entry.financial_id}/edit`)} className="text-teal-600 hover:underline text-sm font-semibold">Edit</button>
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