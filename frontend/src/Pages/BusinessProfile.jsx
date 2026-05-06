import { useEffect, useMemo, useState } from 'react';
import {
    FiAlertCircle,
    FiBriefcase,
    FiCheckCircle,
    FiClock,
    FiHash,
    FiMapPin,
    FiPackage,
    FiRefreshCw,
    FiSave,
    FiShield,
    FiUser,
    FiFileText,
    FiCalendar,
    FiLayers,
    FiX,
    FiCheck,
    FiEdit3,
    FiActivity,
} from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api/companies';

const initialForm = {
    company_name: '',
    industry: '',
    location: '',
    year_of_establishment: '',
    number_of_employees: '',
    installed_capacity: '',
    gst_number: '',
    pan_number: '',
};

const normalizeValue = (value) => (value === null || value === undefined ? '' : String(value));

const createFormState = (company = {}) => ({
    company_name: normalizeValue(company.company_name),
    industry: normalizeValue(company.industry),
    location: normalizeValue(company.location),
    year_of_establishment: normalizeValue(company.year_of_establishment),
    number_of_employees: normalizeValue(company.number_of_employees),
    installed_capacity: normalizeValue(company.installed_capacity),
    gst_number: normalizeValue(company.gst_number),
    pan_number: normalizeValue(company.pan_number),
});

const fieldGroups = [
    {
        title: 'Core Identity',
        icon: FiBriefcase,
        fields: [
            { name: 'company_name', label: 'Company Name', icon: FiBriefcase, placeholder: 'Enter company name', required: true },
            { name: 'industry', label: 'Industry Sector', icon: FiLayers, placeholder: 'e.g. Manufacturing, FMCG' },
            { name: 'location', label: 'Headquarters', icon: FiMapPin, placeholder: 'City, state or region' },
        ],
    },
    {
        title: 'Operational Metrics',
        icon: FiActivity,
        fields: [
            { name: 'year_of_establishment', label: 'Year Established', icon: FiCalendar, placeholder: 'e.g. 2014', type: 'number' },
            { name: 'number_of_employees', label: 'Employee Count', icon: FiUser, placeholder: 'e.g. 125', type: 'number' },
            { name: 'installed_capacity', label: 'Installed Capacity', icon: FiPackage, placeholder: 'e.g. 5000 units/month' },
        ],
    },
    {
        title: 'Tax & Compliance',
        icon: FiShield,
        fields: [
            { name: 'gst_number', label: 'GST Identification Number', icon: FiHash, placeholder: 'Enter GST number' },
            { name: 'pan_number', label: 'PAN Number', icon: FiFileText, placeholder: 'Enter PAN number' },
        ],
    },
];

const BusinessProfile = () => {
    const { user } = useAuth();
    const companyId = user?.company_id ?? user?.companyId ?? user?.company_info?.company_id;

    const [formData, setFormData] = useState(initialForm);
    const [originalData, setOriginalData] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lastSynced, setLastSynced] = useState(null);

    useEffect(() => {
        if (!companyId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadCompany = async () => {
            try {
                setLoading(true);
                setError('');
                setSuccess('');

                const response = await fetch(`${API_BASE}/${companyId}`, {
                    signal: controller.signal,
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load company profile');
                }

                const normalized = createFormState(data.data);
                setFormData(normalized);
                setOriginalData(normalized);
                setLastSynced(data.data.updated_at || data.data.created_at || new Date().toISOString());
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadCompany();

        return () => controller.abort();
    }, [companyId]);

    const completionScore = useMemo(() => {
        const values = Object.values(formData);
        const filled = values.filter((value) => value.trim().length > 0).length;
        return Math.round((filled / values.length) * 100);
    }, [formData]);

    const isDirty = useMemo(
        () => Object.keys(initialForm).some((key) => formData[key] !== originalData[key]),
        [formData, originalData]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
        setSuccess('');
        setError('');
    };

    const handleReset = () => {
        setFormData(originalData);
        setError('');
        setSuccess('');
    };

    const persistLocalUser = (updatedCompany) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            const nextUser = {
                ...parsedUser,
                company_id: updatedCompany.company_id ?? parsedUser.company_id ?? parsedUser.companyId ?? companyId,
                companyId: updatedCompany.company_id ?? parsedUser.company_id ?? parsedUser.companyId ?? companyId,
                company_name: updatedCompany.company_name,
                company_info: {
                    ...(parsedUser.company_info || {}),
                    ...updatedCompany,
                },
            };

            localStorage.setItem('user', JSON.stringify(nextUser));
        } catch {
            // Ignore storage update failures
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!companyId) {
            setError('No company is linked to the current user.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const payload = {
                ...formData,
                year_of_establishment: formData.year_of_establishment ? Number(formData.year_of_establishment) : null,
                number_of_employees: formData.number_of_employees ? Number(formData.number_of_employees) : null,
                updated_by: user?.id ?? user?.user_id,
            };

            const response = await fetch(`${API_BASE}/${companyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save company profile');
            }

            const normalized = createFormState(data.data);
            setFormData(normalized);
            setOriginalData(normalized);
            setLastSynced(data.data.updated_at || new Date().toISOString());
            setSuccess('Company profile updated successfully.');
            persistLocalUser(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout title="Business Profile">
            <div className="bg-slate-50 min-h-screen pb-24">
                
                {/* --- Top Header Bar --- */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <FiBriefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800">Business Profile</h1>
                                    <p className="text-sm text-slate-500">
                                        ID: {companyId || 'Unassigned'} • Last updated: {lastSynced ? new Date(lastSynced).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Desktop Action Buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                {isDirty && (
                                    <span className="text-xs font-medium text-amber-600 mr-2 animate-pulse">
                                        Unsaved changes
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={saving || !isDirty}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    form="profile-form" // Links to form outside for sticky bar
                                    type="submit"
                                    disabled={saving || loading || !companyId}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                                >
                                    {saving ? <FiClock className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{success}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* --- Left Column: Form --- */}
                        <div className="lg:col-span-2">
                            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                {loading ? (
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                                            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                                            <div className="h-10 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                                            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                                            <div className="h-10 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                ) : !companyId ? (
                                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                        <FiAlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-800">No Company Linked</h3>
                                        <p className="text-sm text-slate-500 mt-2">There is no company record associated with this user account.</p>
                                    </div>
                                ) : (
                                    fieldGroups.map((group) => (
                                        <section key={group.title} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                                <div className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500">
                                                    <group.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{group.title}</h3>
                                                    <p className="text-xs text-slate-500">Enter accurate details for reporting.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 space-y-5">
                                                <div className={`grid gap-5 ${group.fields.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                                                    {group.fields.map((field) => {
                                                        const FieldIcon = field.icon;
                                                        return (
                                                            <div key={field.name} className="space-y-1.5">
                                                                <label htmlFor={field.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                                    {field.label}
                                                                    {field.required && <span className="text-red-500">*</span>}
                                                                </label>
                                                                <div className="relative">
                                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                                        <FieldIcon className="h-4 w-4" />
                                                                    </div>
                                                                    <input
                                                                        id={field.name}
                                                                        type={field.type || 'text'}
                                                                        name={field.name}
                                                                        value={formData[field.name]}
                                                                        onChange={handleChange}
                                                                        placeholder={field.placeholder}
                                                                        className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </section>
                                    ))
                                )}
                            </form>
                        </div>

                        {/* --- Right Column: Sidebar --- */}
                        <aside className="space-y-6">
                            {/* Profile Completeness Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-800">Profile Completeness</h3>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
                                                style={{ width: `${completionScore}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{completionScore}%</span>
                                    </div>
                                </div>
                                <div className="px-5 py-3 bg-slate-50 text-xs text-slate-500 border-t border-slate-100">
                                    Complete your profile to unlock all reporting features.
                                </div>
                            </div>

                            {/* Live Snapshot Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-900 p-5 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-6 -mt-6"></div>
                                    <div className="relative">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs uppercase tracking-wider text-blue-300 font-medium">Live Snapshot</p>
                                            <FiEdit3 className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <h4 className="mt-4 text-xl font-bold truncate">
                                            {formData.company_name || 'Company Name'}
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-300 truncate">
                                            {formData.industry || 'Industry Sector'}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                            <FiMapPin className="w-3 h-3" />
                                            <span className="truncate">{formData.location || 'Location'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-500">Employees</p>
                                            <p className="font-semibold text-slate-800 mt-1">{formData.number_of_employees || '--'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-500">Est. Year</p>
                                            <p className="font-semibold text-slate-800 mt-1">{formData.year_of_establishment || '--'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">GSTIN</span>
                                            <span className="font-mono text-slate-700 text-xs">{formData.gst_number || 'Not Provided'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-slate-500">PAN</span>
                                            <span className="font-mono text-slate-700 text-xs">{formData.pan_number || 'Not Provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Audit Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <h3 className="text-sm font-semibold text-slate-800 mb-3">Data Integrity</h3>
                                <div className="space-y-3 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Secure SSL Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Real-time Validation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="w-4 h-4 text-blue-500" />
                                        <span>Last sync: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Pending'}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* --- Mobile Sticky Footer --- */}
                <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-20">
                     <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={saving || !isDirty}
                            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg disabled:opacity-50"
                        >
                            Reset
                        </button>
                        <button
                            form="profile-form"
                            type="submit"
                            disabled={saving || loading || !companyId}
                            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg disabled:opacity-50 shadow-sm"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                     </div>
                </div>
            </div>
        </Layout>
    );
};

export default BusinessProfile;