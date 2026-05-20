// components/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react';
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

  const latestEntry = useMemo(() => {
    if (!entries.length) return null;

    const monthOrder = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12
    };

    const parseYear = (value) => {
      if (!value) return 0;
      const yearText = String(value);
      const firstPart = Number(yearText.split('-')[0]);
      return Number.isNaN(firstPart) ? Number(yearText) || 0 : firstPart;
    };

    return [...entries].sort((a, b) => {
      const yearDiff = parseYear(b.fiscal_year) - parseYear(a.fiscal_year);
      if (yearDiff !== 0) return yearDiff;

      const monthDiff = (monthOrder[String(b.month || '').toLowerCase()] || 0) - (monthOrder[String(a.month || '').toLowerCase()] || 0);
      if (monthDiff !== 0) return monthDiff;

      return Number(b.financial_id || 0) - Number(a.financial_id || 0);
    })[0];
  }, [entries]);

  const healthMetrics = useMemo(() => {
    if (!latestEntry) {
      return {
        financialScore: 0,
        liquidityScore: 0,
        currentRatio: null,
        receivableDays: null,
        liquidityRatio: 0,
        wcUtilization: 0,
        cashReserveMonths: 0,
        debtToRevenue: null,
        interestCoverage: null,
        workingCapitalRatio: null,
        over60DaysPercent: 0,
        over90DaysPercent: 0,
      };
    }

    const currentAssets = Number(latestEntry.current_assets || 0);
    const currentLiabilities = Number(latestEntry.current_liabilities || 0);
    const revenue = Number(latestEntry.revenue || 0);
    const expenses = Number(latestEntry.expenses || 0);
    const cashBalance = Number(latestEntry.cash_balance || 0);
    const totalDebt = Number(latestEntry.total_debt || 0);
    const interestExpense = Number(latestEntry.interest_expense || 0);
    const workingCapital = currentAssets - currentLiabilities;
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : null;
    const cashReserveMonths = Number(latestEntry.avg_monthly_outflows || 0) > 0 ? cashBalance / Number(latestEntry.avg_monthly_outflows || 1) : 0;
    const debtToRevenue = revenue > 0 ? totalDebt / revenue : null;
    const interestCoverage = interestExpense > 0 ? Math.max(0, (revenue - expenses) / interestExpense) : null;
    const workingCapitalRatio = revenue > 0 ? workingCapital / revenue : null;

    const receivablesTotal = Number(latestEntry.recv_not_due || 0)
      + Number(latestEntry.recv_less_30 || 0)
      + Number(latestEntry.recv_30_60 || 0)
      + Number(latestEntry.recv_60_90 || 0)
      + Number(latestEntry.recv_90_180 || 0)
      + Number(latestEntry.recv_above_180 || 0);

    const over60Days = Number(latestEntry.recv_60_90 || 0) + Number(latestEntry.recv_90_180 || 0) + Number(latestEntry.recv_above_180 || 0);
    const over90Days = Number(latestEntry.recv_90_180 || 0) + Number(latestEntry.recv_above_180 || 0);
    const over60DaysPercent = receivablesTotal > 0 ? (over60Days / receivablesTotal) * 100 : 0;
    const over90DaysPercent = receivablesTotal > 0 ? (over90Days / receivablesTotal) * 100 : 0;

    const receivableDays = revenue > 0 ? (receivablesTotal / revenue) * 30 : null;
    const liquidityRatio = currentLiabilities > 0 ? cashBalance / currentLiabilities : 0;
    const wcUtilization = Number(latestEntry.working_capital_limit || 0) > 0 ? (Number(latestEntry.wc_utilization_used || 0) / Number(latestEntry.working_capital_limit || 1)) * 100 : 0;

    let financialScore = 0;
    if (currentRatio !== null) {
      if (currentRatio >= 1.5 && currentRatio <= 2) financialScore += 12;
      else if (currentRatio >= 1.2 && currentRatio < 1.5) financialScore += 9;
      else if (currentRatio > 2 && currentRatio <= 3) financialScore += 8;
      else if (currentRatio > 0.8 && currentRatio < 1.2) financialScore += 5;
    }
    if (liquidityRatio >= 1) financialScore += 10;
    else if (liquidityRatio >= 0.5) financialScore += 6;
    else financialScore += 2;

    if (cashReserveMonths >= 3) financialScore += 8;
    else if (cashReserveMonths >= 2) financialScore += 6;
    else if (cashReserveMonths >= 1) financialScore += 4;

    if (debtToRevenue !== null) {
      if (debtToRevenue <= 0.5) financialScore += 5;
      else if (debtToRevenue <= 1) financialScore += 3;
      else financialScore += 1;
    }

    if (over60DaysPercent <= 10) financialScore += 5;
    else if (over60DaysPercent <= 25) financialScore += 3;
    else financialScore += 1;

    financialScore = Math.min(40, financialScore);

    let liquidityScore = 0;
    if (cashReserveMonths >= 3) liquidityScore += 8;
    else if (cashReserveMonths >= 2) liquidityScore += 6;
    else if (cashReserveMonths >= 1) liquidityScore += 4;

    if (liquidityRatio >= 1) liquidityScore += 6;
    else if (liquidityRatio >= 0.5) liquidityScore += 4;
    else liquidityScore += 1;

    if (currentRatio !== null) {
      if (currentRatio >= 1.5 && currentRatio <= 2.0) liquidityScore += 6;
      else if (currentRatio >= 1.2 && currentRatio < 1.5) liquidityScore += 4;
      else liquidityScore += 1;
    }

    if (over90DaysPercent <= 10) liquidityScore += 0;
    else if (over90DaysPercent <= 25) liquidityScore -= 1;
    else liquidityScore -= 2;

    liquidityScore = Math.max(0, Math.min(20, liquidityScore));

    return {
      financialScore,
      liquidityScore,
      currentRatio,
      receivableDays,
      liquidityRatio,
      wcUtilization,
      cashReserveMonths,
      debtToRevenue,
      interestCoverage,
      workingCapitalRatio,
      over60DaysPercent,
      over90DaysPercent,
    };
  }, [latestEntry]);
  
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

        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900">Financial Health Report</h2>
              </div>
              <p className="text-sm text-slate-500 ml-4">Data for {latestEntry ? `${latestEntry.month} ${latestEntry.fiscal_year}` : 'latest available period'}</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Financial Score</p>
                  <p className="text-4xl font-bold text-slate-900 mt-1">{healthMetrics.financialScore}<span className="text-xl text-slate-400">/40</span></p>
                </div>
                <div className="h-16 w-16 rounded-full border-8 border-slate-100 border-t-indigo-600"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Current Ratio</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{healthMetrics.currentRatio !== null ? healthMetrics.currentRatio.toFixed(2) : '—'}</p>
                </div>
                <div className="rounded-xl bg-cyan-50 p-4">
                  <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">Liquidity Score</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{healthMetrics.liquidityScore}<span className="text-sm text-slate-400">/20</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Receivable Days</span>
                  <span className="font-semibold text-slate-900">{healthMetrics.receivableDays !== null ? `${healthMetrics.receivableDays.toFixed(0)} days` : '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Cash Reserve</span>
                  <span className="font-semibold text-slate-900">{healthMetrics.cashReserveMonths.toFixed(1)} months</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Current Ratio Target</span>
                  <span className="font-semibold text-slate-900">1.5 - 2.0</span>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Liquidity</h3>
                  <span className="text-sm font-semibold text-slate-500">Ratio {healthMetrics.liquidityRatio.toFixed(2)}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-500">Liquidity Score</span>
                      <span className="font-semibold text-slate-900">{healthMetrics.liquidityScore}/20</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(healthMetrics.liquidityScore / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-500">WC Utilization</span>
                      <span className="font-semibold text-slate-900">{healthMetrics.wcUtilization.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, healthMetrics.wcUtilization)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-500">Current Ratio</span>
                      <span className="font-semibold text-slate-900">{healthMetrics.currentRatio !== null ? healthMetrics.currentRatio.toFixed(2) : '—'}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${healthMetrics.currentRatio ? Math.min(100, (healthMetrics.currentRatio / 2.5) * 100) : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Financial Stability Breakdown</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Liquidity</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{healthMetrics.liquidityScore}/20</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Debt & Repayment</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{healthMetrics.financialScore}/40</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Debt-to-Revenue</span>
                    <span className="font-semibold text-slate-900">{healthMetrics.debtToRevenue !== null ? healthMetrics.debtToRevenue.toFixed(2) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Interest Coverage</span>
                    <span className="font-semibold text-slate-900">{healthMetrics.interestCoverage !== null ? healthMetrics.interestCoverage.toFixed(2) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Working Capital Ratio</span>
                    <span className="font-semibold text-slate-900">{healthMetrics.workingCapitalRatio !== null ? healthMetrics.workingCapitalRatio.toFixed(2) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Over 60 Days %</span>
                    <span className="font-semibold text-slate-900">{healthMetrics.over60DaysPercent.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Over 90 Days %</span>
                    <span className="font-semibold text-slate-900">{healthMetrics.over90DaysPercent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Detailed Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'Cash Reserve', value: `${healthMetrics.cashReserveMonths.toFixed(1)} months` },
                    { label: 'Debt-to-Revenue', value: healthMetrics.debtToRevenue !== null ? healthMetrics.debtToRevenue.toFixed(2) : '—' },
                    { label: 'Interest Coverage', value: healthMetrics.interestCoverage !== null ? healthMetrics.interestCoverage.toFixed(2) : '—' },
                    { label: 'Working Capital Ratio', value: healthMetrics.workingCapitalRatio !== null ? healthMetrics.workingCapitalRatio.toFixed(2) : '—' },
                    { label: 'Over 60 Days %', value: `${healthMetrics.over60DaysPercent.toFixed(0)}%` },
                    { label: 'Over 90 Days %', value: `${healthMetrics.over90DaysPercent.toFixed(0)}%` },
                    { label: 'Liquidity Score', value: `${healthMetrics.liquidityScore}/20` },
                    { label: 'Financial Score', value: `${healthMetrics.financialScore}/40` }
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{metric.label}</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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