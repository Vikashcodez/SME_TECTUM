import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FinancialForm from '../components/FinancialForm';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const FinancialFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      fetchFinancial();
    }
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

  const handleSuccess = () => {
    navigate('/FinacleReport');
  };

  const handleClose = () => {
    navigate('/FinacleReport');
  };

  return (
    <Layout title={id ? 'Edit Financial Report' : 'New Financial Report'}>
      <div className="w-full">
        <div className="mb-8">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Reports
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading financial record...</p>
            </div>
          </div>
        ) : (
          <FinancialForm
            financial={financial || null}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default FinancialFormPage;
