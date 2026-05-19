import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FinancialDetails from '../components/FinancialDetails';
import Layout from '../components/layout/Layout';
import axios from 'axios';

const FinancialDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancial();
  }, [id]);

  const fetchFinancial = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/financials/${id}`);
      setFinancial(response?.data?.data || response?.data || null);
    } catch (error) {
      console.error('Error fetching financial record:', error);
      setFinancial(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/FinacleReport');
  };

  if (loading) {
    return (
      <Layout title="Financial Details">
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading financial record...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!financial) {
    return (
      <Layout title="Financial Details">
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 font-medium">Financial record not found</p>
            <button
              onClick={handleClose}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Reports
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Financial Details">
      <div className="min-h-screen bg-slate-50/50">
        <div className="mb-8">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Reports
          </button>
        </div>

        <FinancialDetails
          financial={financial}
          onClose={handleClose}
        />
      </div>
    </Layout>
  );
};

export default FinancialDetailsPage;
