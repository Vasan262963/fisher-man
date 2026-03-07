import React from 'react';

const GovernmentSchemes: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const schemes = [
        {
            id: 'pmmsy',
            title: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
            category: 'Infrastructure & Growth',
            description: 'This is the flagship scheme for the holistic development of the fisheries sector, providing financial assistance for boats, nets, and infrastructure.',
            bestFor: 'Subsidies on boats, nets, and aquaculture, and for forming Fishermen Producer Organizations (FFPOs).',
            benefits: 'Up to 40-60% subsidy for fishermen and cooperatives.',
            link: 'https://www.pmmsy.dof.gov.in/'
        },
        {
            id: 'kcc',
            title: 'Kisan Credit Card (KCC) for Fishermen',
            category: 'Credit & Finance',
            description: 'Extended to fishers, this provides short-term credit and working capital for fishery operations.',
            bestFor: 'Working capital for daily needs, purchasing feed, and operating expenses.',
            benefits: 'Interest subvention and credit up to ₹2 Lakhs.',
            link: 'https://www.jansamarth.in'
        },
        {
            id: 'fidf',
            title: 'Fisheries and Aquaculture Infrastructure Development Fund (FIDF)',
            category: 'Infrastructure',
            description: 'Provides concessional finance for infrastructure projects like fishing harbors, fish landing centers, and cold chains.',
            bestFor: 'Cooperative societies, federations, and entrepreneurs setting up large-scale fisheries projects.',
            benefits: 'Interest subvention up to 3%, loan up to 80% of project cost.',
            link: 'https://dof.gov.in/'
        },
        {
            id: 'group-insurance',
            title: 'Group Accident Insurance for Active Fishermen',
            category: 'Social Security',
            description: 'Provides insurance coverage for accidental death or permanent disability (up to ₹5 lakh) and hospitalization (up to ₹25,000).',
            bestFor: 'Security of active fishermen while on duty.',
            benefits: '₹5 Lakh for death/permanent total disability, ₹2.5 Lakh for partial disability.',
            link: 'https://www.fisheries.tn.gov.in/WelfareSchemes.html'
        },
        {
            id: 'saving-cum-relief',
            title: 'National Saving-cum-Relief Scheme (NFSRS)',
            category: 'Social Security',
            description: 'Provides financial assistance during the fishing ban or lean period to marine fishermen, often 50:50 share between Centre and State.',
            bestFor: 'Livelihood support during non-fishing months.',
            benefits: 'Accumulated relief distribution during lean months.',
            link: 'https://www.fisheries.tn.gov.in/WelfareSchemes.html'
        },
        {
            id: 'vcs',
            title: 'Vessel Communication and Support System (Under PMMSY)',
            category: 'Safety & Technology',
            description: 'Installation of transponders on 1,00,000 fishing vessels to provide safe communication, free of cost to the boat owners.',
            bestFor: 'Sea safety and emergency communication in coastal areas.',
            benefits: 'Real-time weather alerts and emergency distress messaging.',
            link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2099606'
        },
        {
            id: 'nfdb',
            title: 'National Fisheries Development Board (NFDB) Schemes',
            category: 'Financial Assistance',
            description: 'The NFDB provides training and financial support for modern aquaculture, such as Cage Culture and Biofloc technology.',
            bestFor: 'Technology adoption, training, and capacity building.',
            benefits: 'Subsidies ranging from 20% to 40% (up to 60% for SC/ST/Women).',
            link: 'https://nfdb.gov.in/'
        },
        {
            id: 'pmmkssy',
            title: 'Pradhan Mantri Matsya Kisan Samridhi Sah-Yojana (PMMKSSY)',
            category: 'Business & Growth',
            description: 'A new sub-scheme under PMMSY aimed at supporting fish farmers with financial aid and technology to improve income.',
            bestFor: 'Enhancing micro and small enterprise capabilities in fisheries.',
            benefits: 'Performance grants, insurance incentives, and institutional credit access.',
            link: 'https://ciba.res.in/?page_id=16672'
        },
        {
            id: 'housing',
            title: 'Housing for Fishermen (Central Scheme)',
            category: 'Welfare',
            description: 'Provides financial assistance for constructing houses (e.g., ₹1,20,000 per house) for fishermen.',
            bestFor: 'Improving living standards and providing safe, permanent housing.',
            benefits: 'Grant for house construction and basic amenities.',
            link: 'https://www.fisheries.tn.gov.in/WelfareSchemes.html'
        },
        {
            id: 'nfdp',
            title: 'National Fisheries Development Platform (NFDP)',
            category: 'Digital Services',
            description: 'A digital portal to integrate fishers, allowing them to access, apply, and monitor schemes.',
            bestFor: 'Easy access to government benefits and digital registration.',
            benefits: 'Seamless access to credit, insurance, and direct benefit transfer.',
            link: 'https://nfdb.gov.in/'
        }
    ];

    return (
        <div className="schemes-module animate-fade-in" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Government Schemes</h1>
            </header>

            <div className="grid-container">
                {schemes.map((scheme) => (
                    <div key={scheme.id} className="premium-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem', lineHeight: '1.3', fontSize: '1.25rem' }}>{scheme.title}</h3>
                                <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{scheme.category}</span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                            {scheme.description}
                        </p>

                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Best For</strong>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>{scheme.bestFor}</span>
                            </div>

                            {scheme.benefits && (
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Key Benefits</strong>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{scheme.benefits}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                Official Link ↗
                            </a>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.open(scheme.link, '_blank')}
                                style={{ flex: 1 }}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card" style={{ marginTop: '3rem', padding: '2.5rem', background: 'var(--ocean-gradient)', color: 'white', borderRadius: '16px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Stay Updated on New Schemes</h2>
                <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', marginInline: 'auto' }}>
                    Subscribe to receive automatic notifications about new government subsidies, deadline reminders, and seasonal welfare benefits tailored for you.
                </p>
                <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', marginInline: 'auto' }}>
                    <input
                        type="email"
                        placeholder="Enter your email or phone"
                        style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
                    />
                    <button className="btn btn-secondary" style={{ paddingInline: '2rem', fontWeight: 600 }}>Subscribe</button>
                </div>
            </div>
        </div>
    );
};

export default GovernmentSchemes;
