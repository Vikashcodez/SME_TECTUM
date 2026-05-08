import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import { AlertTriangle, Info } from 'lucide-react';

const industryQuestions = {
    'Agro-based & Food Processing': [
        { id: 'q1', label: 'Food Safety', question: 'What is your primary food safety certification status?', options: ['None', 'Applied', 'FSSAI Basic', 'FSSAI Advanced', 'HACCP/GFSI'] },
        { id: 'q2', label: 'Wastage Management', question: 'What is your average raw material wastage percentage?', options: ['>12%', '8–12%', '5–8%', '2–5%', '<2%'] },
        { id: 'q3', label: 'Supply Chain', question: 'How well do you manage seasonal raw material availability?', options: ['Frequent shortages', 'Single source', 'Reactive buying', 'Multiple suppliers', 'Long-term contracts & buffer stock'] },
        { id: 'q4', label: 'Shelf Life', question: 'What is the average shelf life of your primary finished product?', options: ['Perishable within days', '<1 month', '1–3 months', '3–6 months', '>6 months'] },
        { id: 'q5', label: 'Technology', question: 'What is the level of automation in your processing line?', options: ['Fully manual', 'Mostly manual', 'Semi-automated', 'Mostly automated', 'Fully automated'] }
    ],
    'Pharmaceuticals': [
        { id: 'q1', label: 'Compliance', question: 'What was the outcome of your last GMP audit?', options: ['Shutdown notice', 'Warning letter', 'Formal action required', 'Minor observations', 'No major observations'] },
        { id: 'q2', label: 'Innovation (R&D)', question: 'What is your R&D spending as a percentage of revenue?', options: ['<1%', '1–2%', '2–5%', '5–8%', '>8%'] },
        { id: 'q3', label: 'Product Portfolio', question: 'What percentage of revenue comes from products launched in the last 3 years?', options: ['<5%', '5–10%', '10–20%', '20–30%', '>30%'] },
        { id: 'q4', label: 'Quality Control', question: 'What is your batch rejection rate?', options: ['>2%', '1–2%', '0.5–1%', '0.1–0.5%', '<0.1%'] },
        { id: 'q5', label: 'Regulatory', question: 'Do you have necessary approvals for key markets (USFDA, EU-GMP)?', options: ['None', 'Only domestic', 'Applied', 'Yes, one key market', 'Yes, multiple'] }
    ],
    'Automobile & Auto Components': [
        { id: 'q1', label: 'Quality', question: 'What is your defect rate measured in PPM?', options: ['>500 PPM', '250–500 PPM', '100–250 PPM', '50–100 PPM', '<50 PPM'] },
        { id: 'q2', label: 'Certification', question: 'Are you IATF 16949 certified?', options: ['No certification', 'Not certified but ISO 9001', 'In process', 'Certified, minor issues', 'Certified, no issues'] },
        { id: 'q3', label: 'Customer Dependency', question: 'What percentage of revenue comes from your top 2 customers?', options: ['>80%', '65–80%', '50–65%', '30–50%', '<30%'] },
        { id: 'q4', label: 'Scalability', question: 'How well can you handle a 25% sudden increase in order volume?', options: ['Cannot handle it', 'With significant strain', 'With overtime/outsourcing', 'With minor adjustments', 'Easily, with existing capacity'] },
        { id: 'q5', label: 'Technology', question: 'Have you adopted Industry 4.0 technologies (IoT, automation)?', options: ['Not considered', 'Planning to', 'Pilot projects', 'In key areas', 'Extensively'] }
    ],
    'Textiles & Handlooms': [
        { id: 'q1', label: 'Design Innovation', question: 'How many new designs do you launch per quarter?', options: ['None', '1–5', '5–10', '10–20', '>20'] },
        { id: 'q2', label: 'Artisan Skill', question: 'Do you have a formal program for artisan training/upskilling?', options: ['None', 'Planned, not started', 'Ad-hoc training', 'Yes, occasional', 'Yes, continuous'] },
        { id: 'q3', label: 'Market Access', question: 'What percentage of sales comes from modern channels?', options: ['<5%', '5–15%', '15–30%', '30–50%', '>50%'] },
        { id: 'q4', label: 'Quality & Certification', question: 'Do you have certifications like OEKO-TEX or GOTS?', options: ['None', 'In-house standard only', 'Applied', 'One key', 'Multiple'] },
        { id: 'q5', label: 'Inventory', question: 'What is your inventory turnover ratio for finished goods?', options: ['<2x', '2–4x', '4–6x', '6–8x', '>8x/year'] }
    ],
    'Metallurgical & Mineral-based': [
        { id: 'q1', label: 'Environmental Compliance', question: 'What is the status of your pollution control board clearances?', options: ['Expired/Closed', 'Show-cause notice', 'Under renewal', 'Valid, minor pending', 'Valid, no issues'] },
        { id: 'q2', label: 'Safety', question: 'What was your Lost Time Injury Frequency Rate (LTIFR) in the last year?', options: ['>3', '2–3', '1–2', '<1', '0'] },
        { id: 'q3', label: 'Energy Efficiency', question: 'What is your energy consumption per unit of production?', options: ['Poor', 'Above average', 'Industry average', 'Below average', 'Industry best'] },
        { id: 'q4', label: 'Raw Material Security', question: 'How secure is your long-term linkage for raw materials?', options: ['Insecure', 'Market-based volatile', 'Market-based stable', 'Strong supplier contracts', 'Captive/long-term PPA'] },
        { id: 'q5', label: 'Value Addition', question: 'What percentage of output is finished products vs intermediate?', options: ['<20%', '20–40%', '40–60%', '60–80%', '>80% finished'] }
    ],
    'Seafood & Marine Processing': [
        { id: 'q1', label: 'Export Certification', question: 'Which key export certifications do you hold?', options: ['None', 'Applied', 'Other major (BRC, etc.)', 'One of EU/USFDA', 'EU & USFDA'] },
        { id: 'q2', label: 'Traceability', question: 'How robust is your “catch-to-plate” traceability system?', options: ['Non-existent', 'Partial', 'Manual but complete', 'Digital with gaps', 'Fully digital (blockchain/ERP)'] },
        { id: 'q3', label: 'Buyer Rejection', question: 'What is your container/batch rejection rate by buyers?', options: ['>4%', '2–4%', '1–2%', '0.5–1%', '<0.5%'] },
        { id: 'q4', label: 'Cold Chain', question: 'What is the average annual downtime of your cold storage?', options: ['>8%', '4–8%', '2–4%', '1–2%', '<1%'] },
        { id: 'q5', label: 'Sustainability', question: 'Are you certified for sustainable aquaculture/fishing (ASC, MSC)?', options: ['No focus', 'Following practices, not certified', 'In process', 'Yes, one', 'Yes, multiple'] }
    ],
    'Handlooms & Handicrafts': [
        { id: 'q1', label: 'Geographical Indication (GI)', question: 'Is your product registered with a GI tag?', options: ['Not applicable', 'Eligible not applied', 'Applied', 'Yes, passive', 'Yes, actively promoted'] },
        { id: 'q2', label: 'Artisan Welfare', question: 'Do you provide benefits beyond wages?', options: ['Only wages', 'Planning', 'Some benefits', 'Key benefits', 'Comprehensive program'] },
        { id: 'q3', label: 'Design Uniqueness', question: 'How unique are your designs compared to competitors?', options: ['Common', 'Follower', 'Similar to others', 'Unique', 'Highly unique/trendsetter'] },
        { id: 'q4', label: 'Market Linkage', question: 'Do you participate in national/international exhibitions?', options: ['Never', 'Rarely', 'Occasionally', 'Annually', 'Regularly'] },
        { id: 'q5', label: 'Digital Presence', question: 'How active is your online sales and marketing presence?', options: ['No online presence', 'Listing only', 'Basic social media', 'Active on marketplaces', 'Own e-commerce + social media'] }
    ],
    'IT & ITeS': [
        { id: 'q1', label: 'Employee Attrition', question: 'What is your annual employee attrition rate?', options: ['>40%', '30–40%', '20–30%', '10–20%', '<10%'] },
        { id: 'q2', label: 'Data Security', question: 'Are you certified for information security (ISO 27001)?', options: ['No formal process', 'Best practices followed', 'In process', 'Certified not audited', 'Certified & audited'] },
        { id: 'q3', label: 'Client Satisfaction', question: 'What is your average client satisfaction score (CSAT/NPS)?', options: ['<60%', '60–70%', '70–80%', '80–90%', '>90%'] },
        { id: 'q4', label: 'Domain Expertise', question: 'What percentage of revenue comes from core domain expertise?', options: ['<20%', '20–40%', '40–60%', '60–80%', '>80%'] },
        { id: 'q5', label: 'Financial Health', question: 'What is your average revenue per employee?', options: ['Poor', 'Below average', 'Industry average', 'Above average', 'Industry leading'] }
    ],
    'Tourism & Hospitality': [
        { id: 'q1', label: 'Online Reputation', question: 'What is your average rating on platforms like Google?', options: ['<3.0', '3.0–3.5', '3.5–4.0', '4.0–4.5', '>4.5 stars'] },
        { id: 'q2', label: 'Occupancy Rate', question: 'What is your average annual occupancy rate?', options: ['<30%', '30–45%', '45–60%', '60–75%', '>75%'] },
        { id: 'q3', label: 'Seasonality', question: 'How much does your occupancy fluctuate between peak/off-season?', options: ['>80% difference', '60–80%', '40–60%', '20–40%', '<20% difference'] },
        { id: 'q4', label: 'Hygiene & Safety', question: 'Do you have recognized hygiene or safety certifications?', options: ['Poor', 'Basic compliance', 'Follow guidelines not certified', 'Yes, one', 'Yes, multiple'] },
        { id: 'q5', label: 'USP', question: 'How strong is your USP (location, heritage, eco-tourism)?', options: ['No clear USP', 'Weak', 'Moderate', 'Strong', 'Very strong differentiator'] }
    ]
};

export default function IndustrySpecificForm() {
    const [industryType, setIndustryType] = useState('Agro-based & Food Processing');

    const [form, setForm] = useState({
        q1: '1', q2: '1', q3: '1', q4: '1', q5: '1'
    });

    const questions = industryQuestions[industryType] || null;

    if (!industryType || industryType === 'Other' || !questions) {
        return (
            <div className="form-container">
                <div className="onboarding-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
                    <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '20px' }} />
                    <h2>Industry Not Selected</h2>
                    <p>Please select a specific Industry Type in your <strong>Business Profile</strong> to access industry-specific questions.</p>
                    <button className="btn-primary" onClick={() => window.location.hash = '/forms/business-profile'}>
                        Update Profile
                    </button>
                </div>
            </div>
        );
    }

    const totalScore = Object.values(form).reduce((a, b) => a + Number(b), 0);
    const getInterpretation = (score) => {
        if (score >= 21) return { text: 'Strong', color: '#10b981' };
        if (score >= 16) return { text: 'Good', color: '#3b82f6' };
        if (score >= 11) return { text: 'Needs Improvement', color: '#f59e0b' };
        return { text: 'High Risk', color: '#ef4444' };
    };
    const interpretation = getInterpretation(totalScore);

    return (
        <FormWrapper title={`Industry Specific: ${industryType}`} subtitle="Sector-specific risk assessment (12th Form)" dataType="industry"
            getFormData={() => ({ ...form, totalScore, industryType })} setFormData={d => setForm(f => ({ ...f, ...d }))}>

            <div className="form-section">
                <h4 className="form-section-title">Industry Type</h4>
                <select className="form-input" value={industryType} onChange={(e) => setIndustryType(e.target.value)}>
                    {Object.keys(industryQuestions).map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 className="form-section-title" style={{ margin: 0 }}>📋 Sector Parameters</h4>
                    <div style={{ padding: '8px 16px', borderRadius: '8px', background: `${interpretation.color}15`, border: `1px solid ${interpretation.color}` }}>
                        <span style={{ fontSize: '0.9rem', color: interpretation.color, fontWeight: 700 }}>
                            Score: {totalScore}/25 — {interpretation.text}
                        </span>
                    </div>
                </div>

                {questions.map((q, idx) => (
                    <div className="form-group" key={q.id} style={{ marginBottom: idx === questions.length - 1 ? 0 : '24px' }}>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {idx + 1}. {q.label}
                            <Info size={14} color="#64748b" title={q.question} />
                        </label>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>{q.question}</p>
                        <select className="form-input" value={form[q.id]} onChange={e => setForm({ ...form, [q.id]: e.target.value })}>
                            {q.options.map((opt, i) => (
                                <option key={i} value={i + 1}>{opt} (Score: {i + 1})</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="form-section" style={{ background: '#f8fafc' }}>
                <h4 className="form-section-title">💡 Interpretation Guide</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#10b981' }}>21–25</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Strong</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#3b82f6' }}>16–20</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Good</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#f59e0b' }}>11–15</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Needs Improvement</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#ef4444' }}>&lt;11</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>High Risk</div>
                    </div>
                </div>
            </div>
        </FormWrapper>
    );
}
