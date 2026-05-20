// components/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, TrendingUp, TrendingDown, DollarSign, Wallet, Activity, Shield, ChevronRight, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Minus, Eye, Edit3, Filter, Calendar, RefreshCw } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  Legend, ComposedChart, Line
} from 'recharts';
 
const Dashboard = ({ onAddClick }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);

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

  useEffect(() => { fetchFinancials(); }, [selectedFiscalYear, user?.company_id, user?.companyId]);

  const formatCurrency = (value) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
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
    return { totalRevenue, totalExpenses, totalNetProfit, totalCashBalance };
  }, [entries]);

  const availableFiscalYears = useMemo(() => {
    const years = [...new Set(entries.map((row) => row.fiscal_year).filter(Boolean))];
    return years.sort((a, b) => String(b).localeCompare(String(a)));
  }, [entries]);

  const monthOrder = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
  const monthShort = { january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May', june: 'Jun', july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec' };

  const latestEntry = useMemo(() => {
    if (!entries.length) return null;
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
    if (!latestEntry) return { financialScore: 0, liquidityScore: 0, currentRatio: null, receivableDays: null, liquidityRatio: 0, wcUtilization: 0, cashReserveMonths: 0, debtToRevenue: null, interestCoverage: null, workingCapitalRatio: null, over60DaysPercent: 0, over90DaysPercent: 0 };
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
    const receivablesTotal = Number(latestEntry.recv_not_due || 0) + Number(latestEntry.recv_less_30 || 0) + Number(latestEntry.recv_30_60 || 0) + Number(latestEntry.recv_60_90 || 0) + Number(latestEntry.recv_90_180 || 0) + Number(latestEntry.recv_above_180 || 0);
    const over60Days = Number(latestEntry.recv_60_90 || 0) + Number(latestEntry.recv_90_180 || 0) + Number(latestEntry.recv_above_180 || 0);
    const over90Days = Number(latestEntry.recv_90_180 || 0) + Number(latestEntry.recv_above_180 || 0);
    const over60DaysPercent = receivablesTotal > 0 ? (over60Days / receivablesTotal) * 100 : 0;
    const over90DaysPercent = receivablesTotal > 0 ? (over90Days / receivablesTotal) * 100 : 0;
    const receivableDays = revenue > 0 ? (receivablesTotal / revenue) * 30 : null;
    const liquidityRatio = currentLiabilities > 0 ? cashBalance / currentLiabilities : 0;
    const wcUtilization = Number(latestEntry.working_capital_limit || 0) > 0 ? (Number(latestEntry.wc_utilization_used || 0) / Number(latestEntry.working_capital_limit || 1)) * 100 : 0;
    let financialScore = 0;
    if (currentRatio !== null) { if (currentRatio >= 1.5 && currentRatio <= 2) financialScore += 12; else if (currentRatio >= 1.2 && currentRatio < 1.5) financialScore += 9; else if (currentRatio > 2 && currentRatio <= 3) financialScore += 8; else if (currentRatio > 0.8 && currentRatio < 1.2) financialScore += 5; }
    if (liquidityRatio >= 1) financialScore += 10; else if (liquidityRatio >= 0.5) financialScore += 6; else financialScore += 2;
    if (cashReserveMonths >= 3) financialScore += 8; else if (cashReserveMonths >= 2) financialScore += 6; else if (cashReserveMonths >= 1) financialScore += 4;
    if (debtToRevenue !== null) { if (debtToRevenue <= 0.5) financialScore += 5; else if (debtToRevenue <= 1) financialScore += 3; else financialScore += 1; }
    if (over60DaysPercent <= 10) financialScore += 5; else if (over60DaysPercent <= 25) financialScore += 3; else financialScore += 1;
    financialScore = Math.min(40, financialScore);
    let liquidityScore = 0;
    if (cashReserveMonths >= 3) liquidityScore += 8; else if (cashReserveMonths >= 2) liquidityScore += 6; else if (cashReserveMonths >= 1) liquidityScore += 4;
    if (liquidityRatio >= 1) liquidityScore += 6; else if (liquidityRatio >= 0.5) liquidityScore += 4; else liquidityScore += 1;
    if (currentRatio !== null) { if (currentRatio >= 1.5 && currentRatio <= 2.0) liquidityScore += 6; else if (currentRatio >= 1.2 && currentRatio < 1.5) liquidityScore += 4; else liquidityScore += 1; }
    if (over90DaysPercent <= 10) liquidityScore += 0; else if (over90DaysPercent <= 25) liquidityScore -= 1; else liquidityScore -= 2;
    liquidityScore = Math.max(0, Math.min(20, liquidityScore));
    return { financialScore, liquidityScore, currentRatio, receivableDays, liquidityRatio, wcUtilization, cashReserveMonths, debtToRevenue, interestCoverage, workingCapitalRatio, over60DaysPercent, over90DaysPercent };
  }, [latestEntry]);

  // ─── Chart Data ─────────────────────────────────────────
  const revenueExpenseChartData = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      const yA = Number(String(a.fiscal_year || '0').split('-')[0]) || 0;
      const yB = Number(String(b.fiscal_year || '0').split('-')[0]) || 0;
      if (yA !== yB) return yA - yB;
      return (monthOrder[String(a.month || '').toLowerCase()] || 0) - (monthOrder[String(b.month || '').toLowerCase()] || 0);
    });
    return sorted.map(e => ({
      name: `${monthShort[String(e.month || '').toLowerCase()] || e.month || ''} ${String(e.fiscal_year || '').slice(-2)}`,
      revenue: Number(e.revenue || 0),
      expenses: Number(e.expenses || 0),
      profit: Number(e.revenue || 0) - Number(e.expenses || 0),
      cash: Number(e.cash_balance || 0)
    }));
  }, [entries]);

  const profitChartData = useMemo(() => {
    return revenueExpenseChartData.map(d => ({ name: d.name, profit: d.profit, margin: d.revenue > 0 ? ((d.profit / d.revenue) * 100) : 0 }));
  }, [revenueExpenseChartData]);

  const receivablesAgingData = useMemo(() => {
    if (!latestEntry) return [];
    const data = [
      { name: 'Not Due', value: Number(latestEntry.recv_not_due || 0), color: '#10b981' },
      { name: '< 30 Days', value: Number(latestEntry.recv_less_30 || 0), color: '#14b8a6' },
      { name: '30-60 Days', value: Number(latestEntry.recv_30_60 || 0), color: '#f59e0b' },
      { name: '60-90 Days', value: Number(latestEntry.recv_60_90 || 0), color: '#f97316' },
      { name: '90-180 Days', value: Number(latestEntry.recv_90_180 || 0), color: '#ef4444' },
      { name: '> 180 Days', value: Number(latestEntry.recv_above_180 || 0), color: '#991b1b' },
    ];
    return data.filter(d => d.value > 0);
  }, [latestEntry]);

  const healthGaugeData = useMemo(() => {
    const score = healthMetrics.financialScore + healthMetrics.liquidityScore;
    return [{ name: 'Score', value: score, fill: score >= 45 ? '#10b981' : score >= 30 ? '#f59e0b' : '#ef4444' }];
  }, [healthMetrics]);

  const scoreBandData = useMemo(() => {
    const total = healthMetrics.financialScore + healthMetrics.liquidityScore;
    return [
      { name: 'Financial', value: healthMetrics.financialScore, max: 40, color: '#6366f1' },
      { name: 'Liquidity', value: healthMetrics.liquidityScore, max: 20, color: '#06b6d4' },
    ];
  }, [healthMetrics]);

  // ─── Helpers ────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    const styles = { approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20', submitted: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20', draft: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20', rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20' };
    return styles[normalized] || 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20';
  };

  const getScoreColor = (score, max) => {
    const pct = score / max;
    if (pct >= 0.75) return '#10b981';
    if (pct >= 0.5) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score, max) => {
    const pct = score / max;
    if (pct >= 0.75) return 'Excellent';
    if (pct >= 0.5) return 'Good';
    if (pct >= 0.25) return 'Fair';
    return 'Needs Attention';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-sm">
        <p className="font-semibold mb-2 text-slate-300">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }}></span>
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-semibold">{p.name === 'margin' ? `${p.value.toFixed(1)}%` : formatCompactCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const totalScore = healthMetrics.financialScore + healthMetrics.liquidityScore;

  // ─── KPI Cards Config ───────────────────────────────────
  const kpiCards = [
    { title: 'Total Revenue', value: formatCompactCurrency(metrics.totalRevenue), subtitle: `${entries.length} entries`, icon: TrendingUp, trend: metrics.totalRevenue > metrics.totalExpenses ? 'up' : 'down', gradient: 'from-emerald-500 to-teal-600', bgGlow: 'bg-emerald-500/10', iconBg: 'bg-emerald-500/15' },
    { title: 'Total Expenses', value: formatCompactCurrency(metrics.totalExpenses), subtitle: 'Selected period', icon: TrendingDown, trend: 'neutral', gradient: 'from-rose-500 to-pink-600', bgGlow: 'bg-rose-500/10', iconBg: 'bg-rose-500/15' },
    { title: 'Net Profit', value: formatCompactCurrency(metrics.totalNetProfit), subtitle: metrics.totalNetProfit >= 0 ? 'Positive margin' : 'Negative margin', icon: DollarSign, trend: metrics.totalNetProfit >= 0 ? 'up' : 'down', gradient: metrics.totalNetProfit >= 0 ? 'from-teal-500 to-cyan-600' : 'from-rose-500 to-red-600', bgGlow: metrics.totalNetProfit >= 0 ? 'bg-teal-500/10' : 'bg-rose-500/10', iconBg: metrics.totalNetProfit >= 0 ? 'bg-teal-500/15' : 'bg-rose-500/15' },
    { title: 'Cash Balance', value: formatCompactCurrency(metrics.totalCashBalance), subtitle: 'Closing total', icon: Wallet, trend: 'neutral', gradient: 'from-indigo-500 to-violet-600', bgGlow: 'bg-indigo-500/10', iconBg: 'bg-indigo-500/15' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
          <p className="text-slate-400 text-sm mt-1">Fetching your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="FinanceFlow">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top toolbar: fiscal year, refresh, record button */}
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">{selectedFiscalYear || 'All Years'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchFinancials} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25 active:scale-[0.98]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* ─── Error Banner ──────────────────────────────── */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-rose-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* ─── KPI Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => {
            const Icon = card.icon;
            const TrendIcon = card.trend === 'up' ? ArrowUpRight : card.trend === 'down' ? ArrowDownRight : Minus;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 transition-all duration-300 ${hoveredCard === i ? 'shadow-xl shadow-slate-200/50 -translate-y-1 border-slate-300/80' : 'shadow-sm'}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgGlow} rounded-full blur-3xl -translate-y-8 translate-x-8 transition-opacity duration-300 ${hoveredCard === i ? 'opacity-100' : 'opacity-50'}`}></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : card.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                      <TrendIcon className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                  <p className="font-display text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Charts Row ────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Revenue vs Expenses Area Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Revenue vs Expenses</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monthly trend comparison</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>Expenses</span>
              </div>
            </div>
            <div className="px-4 py-4 h-[300px]">
              {revenueExpenseChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueExpenseChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(0)}Cr` : v >= 100000 ? `${(v / 100000).toFixed(0)}L` : v} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#gradRevenue)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gradExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available for chart</div>
              )}
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Health Score</h3>
              <p className="text-xs text-slate-400 mt-0.5">Overall financial wellness</p>
            </div>
            <div className="px-4 py-6 flex flex-col items-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={healthGaugeData} startAngle={180} endAngle={0} barSize={18}>
                    <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-4xl font-bold text-slate-900">{totalScore}</span>
                  <span className="text-xs text-slate-400 font-medium">/60</span>
                </div>
              </div>
              <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold ${totalScore >= 45 ? 'bg-emerald-50 text-emerald-700' : totalScore >= 30 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                {getScoreLabel(totalScore, 60)}
              </div>
              <div className="w-full mt-6 space-y-3 px-2">
                {scoreBandData.map((band) => (
                  <div key={band.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-500 font-medium">{band.name}</span>
                      <span className="font-bold text-slate-900">{band.value}<span className="text-slate-400 font-normal">/{band.max}</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(band.value / band.max) * 100}%`, backgroundColor: band.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Second Charts Row ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Profit Trend */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Profit & Margin Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Net profit with margin percentage</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>Profit</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Margin %</span>
              </div>
            </div>
            <div className="px-4 py-4 h-[280px]">
              {profitChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={profitChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(0)}Cr` : v >= 100000 ? `${(v / 100000).toFixed(0)}L` : v} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="profit" name="Profit" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradProfit)" />
                    <Line yAxisId="right" type="monotone" dataKey="margin" name="Margin" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} activeDot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
              )}
            </div>
          </div>

          {/* Receivables Aging Donut */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Receivables Aging</h3>
              <p className="text-xs text-slate-400 mt-0.5">Outstanding by aging bucket</p>
            </div>
            <div className="px-4 py-4">
              {receivablesAgingData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={receivablesAgingData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {receivablesAgingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCompactCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', fontSize: '13px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No receivables data</div>
              )}
              <div className="mt-3 space-y-2 px-1">
                {receivablesAgingData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-500 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-700">{formatCompactCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Financial Health Detail ───────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Financial Health Report</h2>
                <p className="text-xs text-slate-400 mt-0.5">{latestEntry ? `${latestEntry.month} ${latestEntry.fiscal_year}` : 'No data yet'}</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[
                { label: 'Current Ratio', value: healthMetrics.currentRatio !== null ? healthMetrics.currentRatio.toFixed(2) : '—', target: '1.5 – 2.0', score: healthMetrics.currentRatio ? Math.min(100, (healthMetrics.currentRatio / 2) * 100) : 0, color: '#6366f1' },
                { label: 'Liquidity Ratio', value: healthMetrics.liquidityRatio.toFixed(2), target: '≥ 1.0', score: Math.min(100, (healthMetrics.liquidityRatio / 1) * 100), color: '#06b6d4' },
                { label: 'Cash Reserve', value: `${healthMetrics.cashReserveMonths.toFixed(1)} mo`, target: '≥ 3 months', score: Math.min(100, (healthMetrics.cashReserveMonths / 3) * 100), color: '#10b981' },
                { label: 'Debt/Revenue', value: healthMetrics.debtToRevenue !== null ? healthMetrics.debtToRevenue.toFixed(2) : '—', target: '≤ 0.5', score: healthMetrics.debtToRevenue !== null ? Math.max(0, 100 - (healthMetrics.debtToRevenue / 1) * 100) : 0, color: '#f59e0b' },
                { label: 'Interest Cover', value: healthMetrics.interestCoverage !== null ? `${healthMetrics.interestCoverage.toFixed(1)}x` : '—', target: '≥ 3x', score: healthMetrics.interestCoverage ? Math.min(100, (healthMetrics.interestCoverage / 3) * 100) : 0, color: '#8b5cf6' },
                { label: 'WC Ratio', value: healthMetrics.workingCapitalRatio !== null ? healthMetrics.workingCapitalRatio.toFixed(2) : '—', target: '≥ 0.2', score: healthMetrics.workingCapitalRatio ? Math.min(100, (healthMetrics.workingCapitalRatio / 0.3) * 100) : 0, color: '#ec4899' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                    <span className="text-[10px] text-slate-300 font-medium">Target: {metric.target}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-3">{metric.value}</p>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, metric.score))}%`, backgroundColor: metric.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional health metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              {[
                { label: 'Receivable Days', value: healthMetrics.receivableDays !== null ? `${healthMetrics.receivableDays.toFixed(0)} days` : '—', icon: Activity },
                { label: 'WC Utilization', value: `${healthMetrics.wcUtilization.toFixed(0)}%`, icon: BarChart3 },
                { label: 'Over 60 Days', value: `${healthMetrics.over60DaysPercent.toFixed(0)}%`, icon: TrendingDown },
                { label: 'Over 90 Days', value: `${healthMetrics.over90DaysPercent.toFixed(0)}%`, icon: PieChartIcon },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Entries Table ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Monthly Entries</h2>
                <p className="text-xs text-slate-400 mt-0.5">{entries.length} records found</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedFiscalYear}
                  onChange={(e) => setSelectedFiscalYear(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none cursor-pointer"
                >
                  <option value="">All Fiscal Years</option>
                  {availableFiscalYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  {['Period', 'Revenue', 'Expenses', 'Net Profit', 'Cash Balance', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!error && entries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                          <BarChart3 className="w-7 h-7 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-semibold">No financial entries found</p>
                        <p className="text-sm text-slate-400 mt-1">Add your first entry to get started</p>
                        <button onClick={handleAdd} className="mt-4 px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                          Add Entry
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {entries.map((entry) => {
                  const profit = Number(entry.revenue || 0) - Number(entry.expenses || 0);
                  return (
                    <tr key={entry.financial_id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{String(entry.month || '').slice(0, 3)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{entry.month}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{entry.fiscal_year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-display font-semibold text-slate-800 text-sm">{formatCurrency(entry.revenue)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-display font-semibold text-slate-800 text-sm">{formatCurrency(entry.expenses)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {profit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
                          <span className={`font-display font-bold text-sm ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(profit)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-display font-semibold text-slate-800 text-sm">{formatCurrency(entry.cash_balance)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${getStatusBadge(entry.status)}`}>
                          {entry.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/financial/${entry.financial_id}/edit`)} className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {entries.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Showing {entries.length} of {entries.length} entries</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">1</button>
              </div>
            </div>
          )}
        </div>
    </div>
    </Layout>
  );
};

export default Dashboard;