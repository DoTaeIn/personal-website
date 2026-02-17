import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Activity,
    MessageSquare,
    Trash2,
    Plus,
    Search,
    MoreVertical,
    CheckCircle2,
    AlertTriangle,
    Server,
    Terminal,
    Cpu,
    Database,
    RefreshCw,
    Play,
    LogOut,
    ChevronRight,
    Filter,
    Eye,
    Edit3,
    UserCheck,
    UserX,
    ArrowUpRight,
    Clock,
    Check
} from 'lucide-react';
import {createClient} from "@/app/_utils/supabase/client";

// --- Mock Data ---
const MOCK_POSTS = [
    { id: 1, title: "Next.js 14 App Router Deep Dive", category: "Web", status: "published", updated_at: "2024-03-20", views: 1240 },
    { id: 2, title: "Building a Private Cloud with Proxmox", category: "Infra", status: "draft", updated_at: "2024-03-18", views: 0 },
    { id: 3, title: "Unity Shader Graph Masterclass", category: "GameDev", status: "published", updated_at: "2024-03-15", views: 856 },
    { id: 4, title: "Automating CI/CD with Jenkins", category: "DevOps", status: "published", updated_at: "2024-03-10", views: 2100 },
];

const MOCK_USERS = [
    { id: 'u1', name: 'Ahn Jin', email: 'jin@example.com', role: 'Admin', status: 'Active', provider: 'Github', last_login: '2 mins ago' },
    { id: 'u2', name: 'Kim Editor', email: 'kim@example.com', role: 'Editor', status: 'Active', provider: 'Google', last_login: '1 hour ago' },
    { id: 'u3', name: 'Bad User', email: 'bad@example.com', role: 'User', status: 'Banned', provider: 'Email', last_login: '2 days ago' },
];

const MOCK_LOGS = [
    "[14:20:05] GET /api/posts - 200 OK",
    "[14:21:30] Jenkins Pipeline #42 started",
    "[14:22:12] Error: Supabase Storage limit reached (Simulated)",
    "[14:25:00] User 'jin' logged in from 192.168.0.1",
];

// --- Sub-Components ---

const CustomCheckbox = ({ checked, onChange }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
        }}
        className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
            checked
                ? 'bg-cyan-600 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-950 border-slate-700 hover:border-slate-500'
        }`}
    >
        {checked && <Check size={14} className="text-white stroke-[3]" />}
    </button>
);

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-950 rounded-lg text-cyan-400 border border-slate-800">
                <Icon size={20} />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {change}
      </span>
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
);

const ProgressBar = ({ label, value, colorClass }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-200">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default function AdminPage({ initialUsers, initialPosts, adminInfo }) {
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isBuilding, setIsBuilding] = useState(false);
    const [users, setUsers] = useState(initialUsers);
    const [posts, setPosts] = useState(initialPosts);

    // --- [IAM] 유저 권한 변경 핸들러 ---
    const handleRoleChange = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) {
            // 로컬 상태 업데이트
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    };

    // Selection States
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // --- Handlers ---
    const handleJenkinsTrigger = () => {
        setIsBuilding(true);
        setTimeout(() => setIsBuilding(false), 3000);
    };

    const togglePostSelection = (id) => {
        setSelectedPosts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleAllPosts = () => {
        if (selectedPosts.length === MOCK_POSTS.length) setSelectedPosts([]);
        else setSelectedPosts(MOCK_POSTS.map(p => p.id));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Views" value="45,231" change="+12.5%" icon={Eye} trend="up" />
                            <StatCard title="Active Users" value="12" change="+2" icon={Users} trend="up" />
                            <StatCard title="Server Load" value="24%" change="-2.1%" icon={Activity} trend="down" />
                            <StatCard title="Storage Used" value="1.2 GB" change="+50MB" icon={Database} trend="up" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <Activity size={18} className="text-cyan-400" />
                                        조회수 트렌드
                                    </h3>
                                    <select className="bg-slate-950 border border-slate-800 text-xs text-slate-400 px-2 py-1 rounded">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="h-48 w-full flex items-end justify-between gap-2">
                                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                        <div key={i} className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 transition-all rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {h * 100} views
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-wider">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Plus size={18} className="text-cyan-400" />
                                    기술 스택 비중
                                </h3>
                                <div className="space-y-4">
                                    <ProgressBar label="Next.js" value={45} colorClass="bg-cyan-500" />
                                    <ProgressBar label="DevOps/Infra" value={30} colorClass="bg-blue-500" />
                                    <ProgressBar label="Unity/Game" value={15} colorClass="bg-indigo-500" />
                                    <ProgressBar label="AI/Python" value={10} colorClass="bg-violet-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'cms':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-cyan-400" /> 콘텐츠 관리
                            </h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition-colors">
                                    <Trash2 size={16} /> 휴지통
                                </button>
                                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm flex items-center gap-2 transition-all">
                                    <Plus size={16} /> 새 포스트 작성
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        className="bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 w-64"
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    {selectedPosts.length > 0 && (
                                        <span className="text-xs text-cyan-400 font-medium animate-in fade-in slide-in-from-right-2">
                      {selectedPosts.length}개 선택됨
                    </span>
                                    )}
                                    <div className="flex gap-2">
                                        <button className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"><Filter size={18}/></button>
                                        <button className={`text-xs px-3 py-2 rounded-lg transition-all ${selectedPosts.length > 0 ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20' : 'text-slate-600 cursor-not-allowed'}`}>일괄 삭제</button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4 w-10">
                                            <CustomCheckbox
                                                checked={selectedPosts.length === MOCK_POSTS.length && MOCK_POSTS.length > 0}
                                                onChange={toggleAllPosts}
                                            />
                                        </th>
                                        <th className="px-6 py-4">제목</th>
                                        <th className="px-6 py-4">상태</th>
                                        <th className="px-6 py-4">조회수</th>
                                        <th className="px-6 py-4">최종 수정일</th>
                                        <th className="px-6 py-4 text-right">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {MOCK_POSTS.map(post => (
                                        <tr
                                            key={post.id}
                                            onClick={() => togglePostSelection(post.id)}
                                            className={`hover:bg-slate-800/30 transition-colors group cursor-pointer ${selectedPosts.includes(post.id) ? 'bg-cyan-500/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <CustomCheckbox
                                                    checked={selectedPosts.includes(post.id)}
                                                    onChange={() => togglePostSelection(post.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-200">
                                                {post.title}
                                                <span className="block text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">{post.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${post.status === 'published' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-500'}`}>
                            {post.status}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">{post.views.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{post.updated_at}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400 transition-colors"><Edit3 size={16}/></button>
                                                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-rose-400 transition-colors"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'iam':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="text-cyan-400" /> 사용자 및 권한 관리
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4 w-10">
                                            <CustomCheckbox
                                                checked={selectedUsers.length === MOCK_USERS.length && MOCK_USERS.length > 0}
                                                onChange={() => {
                                                    if (selectedUsers.length === MOCK_USERS.length) setSelectedUsers([]);
                                                    else setSelectedUsers(MOCK_USERS.map(u => u.id));
                                                }}
                                            />
                                        </th>
                                        <th className="px-6 py-4">사용자</th>
                                        <th className="px-6 py-4">역할</th>
                                        <th className="px-6 py-4">상태</th>
                                        <th className="px-6 py-4">최근 접속</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {MOCK_USERS.map(user => (
                                        <tr
                                            key={user.id}
                                            onClick={() => setSelectedUsers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                                            className={`text-sm cursor-pointer hover:bg-slate-800/30 transition-colors ${selectedUsers.includes(user.id) ? 'bg-cyan-500/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <CustomCheckbox
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => {}}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-slate-700">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-200 font-medium">{user.name}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.provider} Auth</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'Admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {user.role}
                          </span>
                                            </td>
                                            <td className="px-6 py-4">
                           <span className={`flex items-center gap-1.5 font-medium ${user.status === 'Active' ? 'text-emerald-400' : 'text-rose-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-500'}`}></div>
                               {user.status}
                           </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{user.last_login}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"><MoreVertical size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6 shadow-xl">
                                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                    <UserCheck size={16} className="text-cyan-400" /> 빠른 조치
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:border-cyan-500/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <UserCheck size={18} className="text-cyan-400"/>
                                            <span className="text-sm font-medium">권한 승격 (Editor)</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform"/>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:border-rose-500/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <UserX size={18} className="text-rose-400"/>
                                            <span className="text-sm font-medium">선택 유저 차단</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                                <div className="pt-6 border-t border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-4 tracking-widest">Login Activity</p>
                                    <div className="space-y-4">
                                        <ProgressBar label="Github OAuth" value={85} colorClass="bg-slate-200" />
                                        <ProgressBar label="Google OAuth" value={12} colorClass="bg-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'infra':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Server className="text-cyan-400" /> 인프라 및 시스템 관리
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                                Proxmox Node: Running
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Cpu size={16} className="text-cyan-400"/> 리소스 모니터링
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center group hover:border-cyan-500/30 transition-colors">
                                        <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">CPU Usage</div>
                                        <div className="text-2xl font-mono font-bold text-cyan-400">12.4%</div>
                                    </div>
                                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center group hover:border-blue-500/30 transition-colors">
                                        <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">RAM Usage</div>
                                        <div className="text-2xl font-mono font-bold text-blue-400">8.2<span className="text-xs text-slate-600 ml-1">/ 32GB</span></div>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-5">
                                    <ProgressBar label="Storage (/mnt/data)" value={64} colorClass="bg-amber-500" />
                                    <ProgressBar label="OPNsense Network" value={21} colorClass="bg-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <RefreshCw size={16} className={`${isBuilding ? 'animate-spin' : ''} text-cyan-400`}/> CI/CD 배포 제어
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between group hover:border-slate-700 transition-colors">
                                        <div>
                                            <div className="text-sm text-slate-200 font-bold">Portfolio Frontend</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-tighter mt-0.5">Pipeline: portfolio-main-deploy</div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleJenkinsTrigger(); }}
                                            disabled={isBuilding}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isBuilding ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}
                                        >
                                            {isBuilding ? 'Building...' : <><Play size={14}/> Trigger Build</>}
                                        </button>
                                    </div>

                                    <div className="bg-black/40 border border-slate-800 rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                                            <Terminal size={12} className="text-slate-600" />
                                            <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">Live Console Output</span>
                                        </div>
                                        <div className="space-y-1.5 h-28 overflow-y-auto custom-scrollbar">
                                            {MOCK_LOGS.map((log, i) => (
                                                <div key={i} className={log.includes('Error') ? 'text-rose-400' : 'text-slate-400'}>
                                                    <span className="text-slate-700 mr-2 opacity-50 font-bold">{i+1}</span>
                                                    <span className="text-cyan-500/50 mr-2">➜</span> {log}
                                                </div>
                                            ))}
                                            {isBuilding && (
                                                <div className="text-cyan-400 animate-pulse flex items-center gap-2">
                                                    <span className="text-slate-700 mr-2 opacity-50 font-bold">{MOCK_LOGS.length + 1}</span>
                                                    <span className="text-cyan-400">➜</span> [WAIT] Fetching latest commits from Github...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'feedback':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="text-cyan-400" /> 소통 및 알림
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">댓글 관리</h3>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 group hover:border-slate-700 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                                                    Guest User
                                                </div>
                                                <div className="text-[10px] text-slate-600 uppercase">3 hours ago</div>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">포스팅 잘 보고 갑니다! Jenkins 설정 부분이 많은 도움이 되었어요.</p>
                                            <div className="flex gap-4 pt-2">
                                                <button className="text-[10px] text-slate-500 hover:text-cyan-400 font-bold uppercase transition-colors">답글 달기</button>
                                                <button className="text-[10px] text-rose-500/70 hover:text-rose-400 font-bold uppercase transition-colors">삭제</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">문의 내역 (Contact)</h3>
                                <div className="space-y-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer group border ${i === 1 ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-transparent'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-800'}`}></div>
                                                <div>
                                                    <div className={`text-sm ${i === 1 ? 'text-white font-bold' : 'text-slate-400'}`}>협업 제안 드립니다.</div>
                                                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">recruiter@company.com</div>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={14} className={`transition-colors ${i === 1 ? 'text-cyan-400' : 'text-slate-700 group-hover:text-slate-400'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-cyan-500/30">
            {/* --- Sidebar --- */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30`}>
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-950/20 shrink-0">
                        J
                    </div>
                    {isSidebarOpen && <span className="font-bold tracking-tight text-white uppercase text-sm">Admin Panel</span>}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { id: 'cms', icon: FileText, label: 'Content' },
                        { id: 'iam', icon: Users, label: 'IAM' },
                        { id: 'infra', icon: Server, label: 'System' },
                        { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group ${
                                activeTab === item.id
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_12px_rgba(6,182,212,0.05)]'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                            }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : ''} />
                            {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-rose-400 transition-colors group">
                        <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500"/>
                        {isSidebarOpen && <span className="text-sm font-medium">로그아웃</span>}
                    </button>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
                <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                            <MoreVertical size={18} className="rotate-90"/>
                        </button>
                        <div className="text-[10px] text-slate-600 flex items-center gap-2 uppercase font-bold tracking-widest">
                            <Clock size={12} /> Sync: just now
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs font-bold text-white">Ahn Jin</span>
                            <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-black">Super Admin</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 p-0.5 shadow-lg shadow-cyan-900/10">
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-900/50 to-blue-900/50 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                AJ
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                                {activeTab.replace('-', ' ')}
                            </h1>
                            <div className="h-1 w-12 bg-cyan-500 mt-2 rounded-full"></div>
                            <p className="text-slate-500 text-sm mt-4 font-medium max-w-2xl leading-relaxed">
                                {activeTab === 'dashboard' && '사이트 현황 및 주요 지표를 실시간으로 모니터링합니다. 데이터 기반의 의사결정을 지원합니다.'}
                                {activeTab === 'cms' && '포스팅 및 프로젝트를 체계적으로 관리합니다. 일괄 관리 기능을 활용하여 효율성을 높이세요.'}
                                {activeTab === 'iam' && '사용자 접근 권한 및 보안 설정을 정밀하게 제어합니다. 시스템 보안의 핵심 영역입니다.'}
                                {activeTab === 'infra' && '서버 리소스 상태 및 배포 파이프라인을 통제합니다. 고가용성 인프라 운영을 위한 도구입니다.'}
                                {activeTab === 'feedback' && '방문자 댓글 및 다이렉트 메시지를 확인하고 소통합니다. 사용자 경험 개선의 핵심입니다.'}
                            </p>
                        </div>

                        {renderContent()}
                    </div>

                    <footer className="mt-20 py-10 border-t border-slate-900 text-center">
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">Jin Dev Panel © 2026 Version 1.0.4</p>
                    </footer>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #020617;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}