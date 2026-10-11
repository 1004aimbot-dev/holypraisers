import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, setDoc, query, orderBy } from 'firebase/firestore';
import './Home.css';
import { ChevronDown, Music, Megaphone, Info, UserPlus, Heart, BookOpen, Users, Edit, Trash, Plus } from 'lucide-react';
import heroCalligraphy from '../assets/hero-calligraphy.png';
import Modal from '../components/ui/Modal';
import NewsEditModal from '../components/ui/NewsEditModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SingleInputModal from '../components/ui/SingleInputModal';

// Default Data
const DEFAULT_PRAISE_LINK = "https://www.youtube.com/results?search_query=홀리프레이저스";
// const DEFAULT_NEWS = [
//     { id: 1, date: '2026.01.07', content: '1월 찬양대 연습 일정 안내' },
//     { id: 2, date: '2026.01.01', content: '신년 감사 주일 찬양 준비' },
//     { id: 3, date: '2025.12.25', content: '성탄 축하 예배 찬양 (완료)' },
//     { id: 4, date: '2025.12.31', content: '송구영신예배 특송 공지' },
// ];

const Home = () => {
    const navigate = useNavigate();
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // Admin & Data State
    const [isAdmin, setIsAdmin] = useState(false);
    const [praiseLink, setPraiseLink] = useState(DEFAULT_PRAISE_LINK);
    const [newsList, setNewsList] = useState<any[]>([]); // Initialize empty, wait for DB

    // Modal States
    const [editModal, setEditModal] = useState({ isOpen: false, isEditing: false, targetId: 0, date: '', content: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: 0 });
    const [linkModal, setLinkModal] = useState({ isOpen: false });

    useEffect(() => {
        // Load Admin Status (Session Storage)
        setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

        // 1. Praise Link Listener
        const linkUnsub = onSnapshot(doc(db, "settings", "praise_config"), (doc) => {
            if (doc.exists() && doc.data().url) {
                setPraiseLink(doc.data().url);
            }
        });

        // 2. News/Notices Listener
        const newsQuery = query(collection(db, "notices"), orderBy("created", "desc"));
        const newsUnsub = onSnapshot(newsQuery, (snapshot) => {
            const loadedNews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If empty (first time), allow showing defaults or just empty
            // Use default only if strictly needed, but better to allow empty state or rely on seed
            if (loadedNews.length > 0) {
                setNewsList(loadedNews);
            } else {
                setNewsList([]);
            }
        });

        // Event Listener for Header "Worship Guide" Click
        const handleOpenJoinModal = () => setShowJoinModal(true);
        window.addEventListener('open-join-modal', handleOpenJoinModal);

        return () => {
            window.removeEventListener('open-join-modal', handleOpenJoinModal);
            linkUnsub();
            newsUnsub();
        };
    }, []);

    const openEditPraiseLink = () => {
        setLinkModal({ isOpen: true });
    };

    const handleSavePraiseLink = async (newLink: string) => {
        if (newLink) {
            try {
                await setDoc(doc(db, "settings", "praise_config"), {
                    url: newLink,
                    updatedAt: Date.now()
                }, { merge: true });
                setPraiseLink(newLink); // Optimistic update
            } catch (error) {
                console.error("Failed to save link:", error);
                alert("저장 실패: 관리자 권한을 확인하세요.");
            }
        }
    };

    // --- News Handler Wrappers ---
    const openAddNews = () => {
        setEditModal({ isOpen: true, isEditing: false, targetId: 0, date: '', content: '' });
    };

    const openEditNews = (item: any) => {
        setEditModal({ isOpen: true, isEditing: true, targetId: item.id, date: item.date, content: item.content });
    };

    const confirmDeleteNews = (id: number) => {
        setDeleteModal({ isOpen: true, targetId: id });
    };

    // --- Actual Actions ---
    const handleSaveNews = async (date: string, content: string) => {
        try {
            if (editModal.isEditing) {
                // Update
                const newsRef = doc(db, "notices", editModal.targetId.toString());
                await updateDoc(newsRef, {
                    date,
                    content
                });
            } else {
                // Create
                await addDoc(collection(db, "notices"), {
                    date,
                    content,
                    created: Date.now()
                });
            }
        } catch (error) {
            console.error("Error saving news:", error);
            alert("공지 저장에 실패했습니다.");
        }
    };

    const handleExecuteDelete = async () => {
        if (deleteModal.targetId) {
            try {
                await deleteDoc(doc(db, "notices", deleteModal.targetId.toString()));
                setDeleteModal({ isOpen: false, targetId: 0 }); // Close locally
            } catch (error) {
                console.error("Error deleting news:", error);
                alert("삭제 실패");
            }
        }
    };
    return (
        <div className="home-container">
            {isAdmin && (
                <div style={{
                    backgroundColor: '#333333',
                    color: 'white',
                    padding: '10px 20px',
                    fontWeight: '500',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔒 관리자 모드로 접속 중입니다</span>
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('isAdmin');
                            window.location.reload();
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            )}
            {/* ① 메인 문구 (HERO) */}
            <section className="section hero-section" id="home">
                <div className="hero-bg-overlay"></div>
                <div className="hero-content fade-in-up">
                    <span className="hero-pretitle">남성 찬양단</span>
                    <h1 className="hero-title">
                        <span className="text-serif">HOLY PRAISERS</span>
                    </h1>
                    <img
                        src={heroCalligraphy}
                        alt="날마다 주 안에 거하며 은혜로 살게 하옵소서"
                        className="hero-calligraphy-img"
                    />
                    <p className="hero-subtitle text-serif">
                        하나님을 향한 깊은 울림,<br />
                        믿음의 고백을 찬양으로<br />
                        올려드립니다
                    </p>
                    <div className="hero-description keep-all">
                        남성의 깊고 웅장한 화음으로 마음을 모아<br />
                        예배의 문을 열고 하나님의 임재를 찬양합니다.
                    </div>
                    <div className="hero-scroll-indicator" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                        <ChevronDown size={24} className="animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ② 글로리아 소개 */}
            <section className="section intro-section" id="about">
                <div className="container text-center">
                    <span className="section-tag">INTRODUCTION</span>
                    <h2 className="section-title text-serif">홀리프레이저스 소개</h2>
                    <div className="divider-gold"></div>

                    <p className="intro-text keep-all">
                        홀리프레이저스는<br />
                        <strong>하나님을 찬양하는 남성 찬양단</strong>으로서<br />
                        찬양으로 <strong>예배와 은혜를 섬기는 공동체</strong>입니다.
                    </p>
                    <p className="intro-subtext keep-all">
                        남성의 깊고 힘 있는 목소리로 함께 드리는 고백을 통해<br />
                        성도들의 마음이 하나님께 향하도록 겸손히 섬기고 있습니다.
                    </p>
                </div>
            </section>

            {/* ③ 사명 선언문 (Mission) */}
            <section className="section mission-section bg-ivory">
                <div className="container">
                    <div className="mission-content text-center">
                        <h2 className="section-title text-serif">사명 선언문</h2>
                        <div className="divider-gold"></div>

                        <p className="mission-main-text keep-all">
                            홀리프레이저스 찬양단은 하나님께서 주신 은사와 열정을 모아<br />
                            <strong>남성의 깊은 화음으로 하나님을 찬양하는 공동체</strong>입니다.
                        </p>

                        <div className="mission-values">
                            <div className="value-item">
                                <Heart size={32} strokeWidth={1.5} />
                                <p>소리보다 <strong>마음</strong>을</p>
                            </div>
                            <div className="value-item">
                                <Users size={32} strokeWidth={1.5} />
                                <p>완성도보다 <strong>헌신</strong>을</p>
                            </div>
                            <div className="value-item">
                                <BookOpen size={32} strokeWidth={1.5} />
                                <p>무대보다 <strong>예배</strong>를</p>
                            </div>
                        </div>

                        <p className="mission-footer-text keep-all">
                            모든 찬양이 사람을 드러내는 시간이 아닌,<br />
                            <strong>하나님의 영광을 높이는 고백</strong>이 되기를 소망합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* ④ 비전 (Vision) */}
            <section className="section vision-section">
                <div className="container text-center">
                    <h2 className="section-title text-serif">비전 (Vision)</h2>
                    <div className="divider-gold"></div>

                    <div className="vision-grid">
                        <div className="vision-card">
                            <h3>01</h3>
                            <p>영으로 찬양하는 남성찬양단</p>
                        </div>
                        <div className="vision-card">
                            <h3>02</h3>
                            <p>기도로 하나 되는 동역자</p>
                        </div>
                        <div className="vision-card">
                            <h3>03</h3>
                            <p>삶으로 헌신하는 찬양 사역자</p>
                        </div>
                    </div>

                    <p className="vision-summary keep-all">
                        우리는 깊은 울림으로 하나님을 높이는 남성찬양단으로서<br />
                        늘 깨어 준비하며, 함께 자라가는 공동체가 되고자 합니다.
                    </p>
                </div>
            </section>

            {/* ⑤ 예배와 찬양 & ⑥ 찬양대 소식 */}
            <section className="section news-section bg-ivory" id="news">
                <div className="container">
                    <div className="grid-2-cols">

                        {/* 5. 예배와 찬양 */}
                        <div className="content-block">
                            <div className="icon-header">
                                <Music size={28} />
                                <h3 className="block-title text-serif">예배와 찬양</h3>
                            </div>
                            <p className="block-desc keep-all">
                                홀리프레이저스 찬양단은 예배와 절기,<br />
                                특별 집회 속에서 드려진 찬양을 기록하고 나눕니다.
                            </p>
                            <p className="block-subdesc keep-all">
                                이 찬양의 기록이 성도들에게는 은혜의 나눔이 되고,<br />
                                다음 세대에게는 믿음의 발자취로 남기를 소망합니다.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link
                                    to="/praise"
                                    className="btn-text"
                                >
                                    찬양 다시보기 &rarr;
                                </Link>
                                {isAdmin && (
                                    <button onClick={openEditPraiseLink} className="btn-admin-edit" title="링크 수정">
                                        <Edit size={14} /> 수정
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 6. 찬양대 소식 */}
                        <div className="content-block">
                            <div className="icon-header">
                                <Megaphone size={28} />
                                <h3 className="block-title text-serif">찬양단 소식</h3>
                            </div>
                            <p className="block-desc keep-all">
                                홀리프레이저스 찬양단의 연습 일정과 공지,<br />
                                사역의 소식을 전합니다.
                            </p>
                            <p className="block-subdesc keep-all">
                                함께 예배를 준비하는 과정 속에서<br />
                                필요한 안내를 이곳에서 확인하실 수 있습니다.
                            </p>
                            <button
                                className="btn-text"
                                onClick={() => navigate('/calendar')}
                            >
                                소식 확인 &rarr;
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* ⑦ 대원 안내 & ⑧ 새 단원 안내 */}
            <section className="section member-section" id="join">
                <div className="container">
                    <div className="member-grid">

                        {/* 7. 대원 안내 */}
                        <div className="member-card guide">
                            <Info size={32} className="card-icon-main" />
                            <h3>홀리프레이저스 찬양단 소개</h3>
                            <p className="member-text keep-all">
                                이 공간은 홀리프레이저스 찬양단원들을 위한 안내 공간입니다.<br />
                                <strong>• 정기 연습: 매주 월요일 19:00 ~ 21:00</strong><br />
                                연습 일정과 장소, 찬양 사역을 위한 자료들을 함께 공유합니다.
                            </p>
                            <Link to="/people" className="btn-text" style={{ marginTop: '1rem', display: 'inline-block' }}>
                                섬기는 분들 보기 &rarr;
                            </Link>
                        </div>

                        {/* 8. 새 단원 안내 */}
                        <div className="member-card new fade-in-up">
                            <UserPlus size={32} className="card-icon-main" />
                            <h3>새 단원 안내</h3>
                            <p className="member-text keep-all">
                                찬양으로 함께 예배하고 싶은 남성 성도님들을 기쁨으로 초대합니다.<br />
                                홀리프레이저스는 완벽한 기교보다<br />
                                <strong>예배를 사모하는 마음</strong>을 귀하게 여깁니다.
                            </p>
                            <div className="action-area">
                                <p>관심 있는 분들은 부담 없이 문의해 주시기 바랍니다.</p>
                                <button
                                    className="btn-gold"
                                    onClick={() => setShowJoinModal(true)}
                                >
                                    새 단원 문의하기
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Modal
                isOpen={showNewsModal}
                onClose={() => setShowNewsModal(false)}
                title="홀리프레이저스 찬양단 소식"
            >
                <div className="modal-body-content">
                    <div className="modal-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span></span>
                        {isAdmin && (
                            <button onClick={openAddNews} className="btn-admin-add">
                                <Plus size={14} /> 공지 추가
                            </button>
                        )}
                    </div>
                    <ul className="coming-soon-list">
                        {newsList.map(item => (
                            <li key={item.id}>
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span className="date">{item.date}</span>
                                        <span className="content" style={{ marginLeft: '10px' }}>{item.content}</span>
                                    </div>
                                    {isAdmin && (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => openEditNews(item)} className="btn-admin-edit-small" title="수정">
                                                <Edit size={12} />
                                            </button>
                                            <button onClick={() => confirmDeleteNews(item.id)} className="btn-admin-delete" title="삭제">
                                                <Trash size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="modal-note">* 자세한 내용은 찬양단 밴드/단톡방을 참고해주세요.</p>
                </div>
            </Modal>

            <Modal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                title="새 단원 입단 문의"
            >
                <div className="modal-body-content text-start" style={{ marginTop: '-1rem' }}>
                    <p><strong>홀리프레이저스 남성찬양단</strong>은 하나님을 찬양하고<br />예배를 섬기고 싶은 모든 남성 성도님들을 환영합니다.</p>
                    <hr className="modal-divider" />
                    <div className="contact-info">
                        <p><strong>🎵 자격 요건</strong></p>
                        <ul>
                            <li>세례교인 (남성 성도)</li>
                            <li>새신자 교육 이수자</li>
                            <li>정기 연습 및 찬양 사역 참석 가능하신 분</li>
                            <li>연습 시간
                                <ul style={{ marginTop: '4px', paddingLeft: '1rem', listStyle: 'none', color: 'var(--color-text-muted)', fontSize: '0.95em' }}>
                                    <li>• 월요일 19:00~21:00</li>
                                </ul>
                            </li>
                        </ul>
                        <br />
                        <p><strong>📞 문의 및 신청</strong></p>
                        <div className="modal-actions" style={{ display: 'flex', flexDirection: 'column' }}>
                            <a href="tel:010-8814-8844" className="btn-action-primary">
                                📞 유용길 안수집사 대장 (010-8814-8844)
                            </a>
                            <a href="https://forms.google.com/" target="_blank" rel="noopener noreferrer" className="btn-action-secondary">
                                📝 온라인 입단 신청서 작성
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* --- Management Modals --- */}
            <NewsEditModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ ...editModal, isOpen: false })}
                onSave={handleSaveNews}
                initialDate={editModal.date}
                initialContent={editModal.content}
                isEditing={editModal.isEditing}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleExecuteDelete}
                title="공지사항 삭제"
                message="정말로 이 공지사항을 삭제하시겠습니까?"
            />

            <SingleInputModal
                isOpen={linkModal.isOpen}
                onClose={() => setLinkModal({ ...linkModal, isOpen: false })}
                onSave={handleSavePraiseLink}
                title="찬양 다시보기 링크 수정"
                label="YouTube URL"
                initialValue={praiseLink}
                placeholder="https://youtube.com/..."
            />
        </div>
    );
};

export default Home;
