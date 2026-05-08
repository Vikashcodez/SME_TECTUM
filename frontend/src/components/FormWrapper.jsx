import { motion } from 'framer-motion';
import Layout from './layout/Layout';

export default function FormWrapper({ title, subtitle, children }) {
    return (
        <Layout title={title}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                </div>

                <div className="card" style={{ opacity: 1, pointerEvents: 'auto' }}>
                    {children}
                </div>
            </motion.div>
        </Layout>
    );
}
