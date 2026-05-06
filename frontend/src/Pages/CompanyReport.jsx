import Layout from '../components/layout/Layout';

const CompanyReport = () => {
  return (
    <Layout title="Company Report">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Final report module</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Company Report</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            This section is ready for your company-level reporting views. You can later connect charts, compliance summaries,
            exports, and period-based analytics here.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Profile health', '92%'],
            ['Compliance status', 'Ready'],
            ['Report export', 'Pending'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyReport;