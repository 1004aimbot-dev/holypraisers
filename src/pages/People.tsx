import './People.css';
import { Music, Users, Crown, Mic2 } from 'lucide-react';

const People = () => {
    const executives = [
        { role: '대장', name: '유용길', title: '안수집사', phone: '010-8814-8844' },
        { role: '총무', name: '', title: '', phone: '' },
        { role: '서기', name: '', title: '', phone: '' },
        { role: '회계', name: '', title: '', phone: '' },
        { role: '친교부장', name: '', title: '', phone: '' },
    ];

    const partLeaders = [
        { role: '테너 파트장', name: '', title: '', phone: '' },
        { role: '베이스 파트장', name: '', title: '', phone: '' },
    ];

    const musicians = [
        { role: '지휘자', name: '함서현', title: '', phone: '010-2435-5877' },
        { role: '반주자', name: '', title: '', phone: '' },
    ];

    const tenors = [
        { name: '김영길', title: '청년', phone: '010-8712-2085' },
        { name: '김일규', title: '안수집사', phone: '010-3237-1919' },
        { name: '손병태', title: '장로', phone: '010-4735-8488' },
        { name: '유용길', title: '안수집사', phone: '010-8814-8844' },
        { name: '이강우', title: '장로', phone: '010-5325-2448' },
    ];

    const basses = [
        { name: '곽정기', title: '집사', phone: '010-3994-3977' },
        { name: '김문', title: '청년', phone: '010-7705-0191' },
        { name: '김용수', title: '집사', phone: '010-8886-2825' },
        { name: '손은익', title: '장로', phone: '010-3757-6178' },
        { name: '송인수', title: '집사', phone: '010-4488-0139' },
        { name: '엄웅섭', title: '장로', phone: '010-2763-9907' },
        { name: '여성구', title: '장로', phone: '010-2575-9176' },
        { name: '조규창', title: '장로', phone: '010-6343-1021' },
        { name: '최현철', title: '장로', phone: '010-4234-3479' },
        { name: '홍영식', title: '집사', phone: '010-2944-4640' },
    ];

    return (
        <div className="people-page">
            <div className="people-header">
                <div className="container">
                    <h1 className="people-title text-serif">섬기는 분들</h1>
                    <p className="people-subtitle">홀리프레이저스 남성찬양단을 섬기는 임원과 사역자를 소개합니다</p>
                </div>
            </div>

            <main className="container people-content">
                <section className="people-section">
                    <div className="section-header">
                        <Music size={28} className="section-icon" />
                        <h2 className="text-serif">지휘 및 반주</h2>
                    </div>
                    <div className="people-grid">
                        {musicians.map((person, index) => (
                            <div key={index} className="person-card musician">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name || '-'}</span>
                                    {person.title && <span className="person-title">{person.title}</span>}
                                </div>
                                {person.phone && (
                                    <a href={`tel:${person.phone}`} className="person-phone">
                                        📞 {person.phone}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="divider-wide"></div>

                <section className="people-section">
                    <div className="section-header">
                        <Crown size={28} className="section-icon" />
                        <h2 className="text-serif">임원진</h2>
                    </div>
                    <div className="people-grid">
                        {executives.map((person, index) => (
                            <div key={index} className="person-card">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name || '-'}</span>
                                    {person.title && <span className="person-title">{person.title}</span>}
                                </div>
                                {person.phone && (
                                    <a href={`tel:${person.phone}`} className="person-phone">
                                        📞 {person.phone}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="divider-wide"></div>

                <section className="people-section">
                    <div className="section-header">
                        <Mic2 size={28} className="section-icon" />
                        <h2 className="text-serif">파트장</h2>
                    </div>
                    <div className="people-grid">
                        {partLeaders.map((person, index) => (
                            <div key={index} className="person-card">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name || '-'}</span>
                                    {person.title && <span className="person-title">{person.title}</span>}
                                </div>
                                {person.phone && (
                                    <a href={`tel:${person.phone}`} className="person-phone">
                                        📞 {person.phone}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="divider-wide"></div>

                <section className="people-section">
                    <div className="section-header">
                        <Users size={28} className="section-icon" />
                        <h2 className="text-serif">전체 찬양단원</h2>
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>Tenor (테너)</h3>
                    <div className="people-grid compact">
                        {tenors.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2.5rem' }}>Bass (베이스)</h3>
                    <div className="people-grid compact">
                        {basses.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default People;
