// src/components/FinacleReport.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Calendar, DollarSign, TrendingUp, TrendingDown, AlertCircle, FileText } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const FinacleReport = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [financials, setFinancials] = useState([]);
  const [allFinancials, setAllFinancials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    fiscal_year: '',
    month: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    fetchAllFinancials();
  }, []);

  useEffect(() => {
    fetchFinancials();
  }, [pagination.page, filters]);

  // Fetch all financials for KPIs and Monthly Cards
  const fetchAllFinancials = async () => {
    try {
      const userCompanyId = user?.company_id || user?.companyId;
      const queryParams = new URLSearchParams({
        limit: 1000, // Get all for stats
        ...(userCompanyId && { company_id: userCompanyId })
      });
      
      const response = await axios.get(`http://localhost:5000/api/financials?${queryParams}`);
      const data = response?.data?.data || response?.data || [];
      setAllFinancials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching all financials:', error);
      setAllFinancials([]);
    }
  };

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const userCompanyId = user?.company_id || user?.companyId;
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(userCompanyId && { company_id: userCompanyId }),
        ...(filters.fiscal_year && { fiscal_year: filters.fiscal_year }),
        ...(filters.month && { month: filters.month }),
        ...(filters.status && { status: filters.status })
      });
      
      const response = await axios.get(`http://localhost:5000/api/financials?${queryParams}`);
      const data = response?.data?.data || response?.data || [];
      const paginationData = response?.data?.pagination || { total: 0, totalPages: 0 };
      
      setFinancials(Array.isArray(data) ? data : []);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching financials:', error);
      setFinancials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/financials/${id}`);
        fetchFinancials();
        fetchAllFinancials(); // Refresh stats
      } catch (error) {
        console.error('Error deleting financial:', error);
      }
    }
  };

  const handleViewDetails = (financial) => {
    navigate(`/financial/${financial.financial_id}`);
  };

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const calculateWorkingCapital = (financial) => {
    return (financial.current_assets || 0) - (financial.current_liabilities || 0);
  };

  // New Logic: Generate Monthly Summary Cards
  const getMonthlySummaries = () => {
    if (!Array.isArray(allFinancials) || allFinancials.length === 0) return [];

    const grouped = {};

    allFinancials.forEach(f => {
      // Create a key like "January 2024"
      const key = `${f.month} ${f.fiscal_year}`;
      if (!grouped[key]) {
        grouped[key] = {
          month: f.month,
          year: f.fiscal_year,
          revenue: 0,
          expenses: 0,
          net_profit: 0,
          b2b_sales: 0,
          b2c_sales: 0,
          gst_liability: 0,
          entries: 0
        };
      }
      grouped[key].revenue += f.revenue || 0;
      grouped[key].expenses += f.expenses || 0;
      grouped[key].net_profit += f.net_profit || 0;
      grouped[key].b2b_sales += f.b2b_sales || 0;
      grouped[key].b2c_sales += f.b2c_sales || 0;
      grouped[key].gst_liability += f.total_gst_liability || 0;
      grouped[key].entries += 1;
    });

    // Convert to array and sort by date (newest first)
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`);
      const dateB = new Date(`${b.month} 1, ${b.year}`);
      return dateB - dateA;
    });
  };

  const monthlySummaries = getMonthlySummaries();

  // Calculate Global KPIs
  const totalRevenue = allFinancials.reduce((sum, f) => sum + (f.revenue || 0), 0);
  const totalExpenses = allFinancials.reduce((sum, f) => sum + (f.expenses || 0), 0);
  const totalProfit = allFinancials.reduce((sum, f) => sum + (f.net_profit || 0), 0);
  const totalWorkingCapital = allFinancials.reduce((sum, f) => sum + calculateWorkingCapital(f), 0);

  return (
    <Layout title="Financial Reports">
      <div className="min-h-screen bg-slate-50/50">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
              </div>
              <p className="text-slate-500 text-sm font-medium ml-14">Real-time financial performance tracking</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/financial/new')}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Report
              </button>
            </div>
          </div>
        </div>

        {/* Filters Card - Clean & Flat */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Fiscal Year</label>
              <select
                value={filters.fiscal_year}
                onChange={(e) => { setFilters({...filters, fiscal_year: e.target.value}); setPagination({...pagination, page: 1}); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
              >
                <option value="">All Years</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Month</label>
              <select
                value={filters.month}
                onChange={(e) => { setFilters({...filters, month: e.target.value}); setPagination({...pagination, page: 1}); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
              >
                <option value="">All Months</option>
                {months.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Status</label>
              <select
                value={filters.status}
                onChange={(e) => { setFilters({...filters, status: e.target.value}); setPagination({...pagination, page: 1}); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => { setFilters({search: '', fiscal_year: '', month: '', status: ''}); setPagination({...pagination, page: 1}); }}
                className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors text-sm border border-transparent hover:border-slate-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Data Cards - Dynamic Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-900">Monthly Reports</h2>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
              {monthlySummaries.length} Months
            </span>
          </div>

          {monthlySummaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {monthlySummaries.map((summary, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <h3 className="font-bold text-slate-800">{summary.month}</h3>
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{summary.year}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {summary.entries} {summary.entries > 1 ? 'Entries' : 'Entry'}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-50">
                    {/* Revenue */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Revenue</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(summary.revenue)}</span>
                    </div>

                    {/* B2B Sales */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">B2B Sales</span>
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(summary.b2b_sales)}</span>
                    </div>

                    {/* B2C Sales */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">B2C Sales</span>
                      <span className="text-sm font-bold text-emerald-600">{formatCurrency(summary.b2c_sales)}</span>
                    </div>

                    {/* GST Liability */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">GST 6A</span>
                      <span className="text-sm font-bold text-amber-600">{formatCurrency(summary.gst_liability)}</span>
                    </div>

                    {/* Expenses */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Expenses</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(summary.expenses)}</span>
                    </div>

                    {/* Net Profit */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                      <span className="text-xs font-semibold text-slate-600">Net Profit</span>
                      <span className={`text-sm font-bold ${summary.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.net_profit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No Monthly Data Available</p>
              <p className="text-sm text-slate-400 mt-1">Create a report to see monthly summaries here.</p>
            </div>
          )}
        </div>

        {/* Financial Records Table - Minimalist Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Transaction Records</h3>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {pagination.total} Total Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-slate-500">Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : financials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-600">No records found</p>
                        <p className="text-sm text-slate-400">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  financials.map((financial) => (
                    <tr key={financial.financial_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800">{financial.company_name || `Company ${financial.company_id}`}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium">{financial.month} {financial.fiscal_year}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-800">{formatCurrency(financial.revenue)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${(financial.net_profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {formatCurrency(financial.net_profit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          financial.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                          financial.status === 'Submitted' ? 'bg-blue-50 text-blue-700' :
                          financial.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {financial.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewDetails(financial)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/financial/${financial.financial_id}/edit`)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(financial.financial_id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && financials.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <p className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-bold text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                  {pagination.page}
                </div>
                <button
                  onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FinacleReport;