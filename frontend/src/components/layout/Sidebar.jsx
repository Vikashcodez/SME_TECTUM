import { Link, useLocation } from 'react-router-dom';
import { IoMdDocument } from "react-icons/io";
import { MdDashboard, MdClose, MdChevronRight, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { name: 'Dashboard', icon: <MdOutlineSpaceDashboard />, path: '/user-dashboard' },
    { name: 'Business Profile', icon: <IoMdDocument />, path: '/data-entry/business-profile' },
    { name: 'Finance', icon: <TbReportAnalytics />, path: '/FinacleReport' }
  ];

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  useEffect(() => {
    setExpandedMenus((prev) => ({
      ...prev,
      ...(location.pathname.startsWith('/data-entry') ? { 'Business Profile': true } : {}),
    }));
  }, [location.pathname]);

  const isMenuActive = (item) => {
    if (item.submenu) {
      return item.submenu.some((subitem) => location.pathname === subitem.path);
    }
    return location.pathname === item.path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 flex h-screen flex-col border-r border-white/5 ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'}`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-white">TECHTUM </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">SME SYSTEM</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-transparent">
          <p className="px-4 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</p>
          
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        isMenuActive(item)
                          ? 'bg-white/5 text-white shadow-sm'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-lg transition-colors ${isMenuActive(item) ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <MdChevronRight className={`transform transition-transform duration-300 ${expandedMenus[item.name] ? 'rotate-90' : ''} ${isMenuActive(item) ? 'text-teal-400' : 'text-slate-600'}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus[item.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="ml-5 mt-1 space-y-1 border-l border-slate-800 pl-4 py-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.path}
                            onClick={onClose}
                            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative ${
                              location.pathname === subitem.path
                                ? 'text-teal-300 font-semibold bg-teal-500/10'
                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                            {location.pathname === subitem.path && (
                              <span className="absolute left-0 top-1/2 -translate-x-[22px] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            )}
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group overflow-hidden ${
                      isMenuActive(item) 
                        ? 'text-white bg-gradient-to-r from-teal-600/20 to-transparent' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {/* Left accent line for active state */}
                    {isMenuActive(item) && (
                      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-emerald-500"></div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className={`p-1.5 rounded-lg transition-colors ${
                        isMenuActive(item) 
                          ? 'bg-teal-500/20 text-teal-400 shadow-sm shadow-teal-500/20' 
                          : 'text-slate-500 group-hover:text-slate-300 group-hover:bg-white/5'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={isMenuActive(item) ? 'text-white' : ''}>{item.name}</span>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section removed to keep sidebar compact */}
      </aside>
    </>
  );
};

export default Sidebar;