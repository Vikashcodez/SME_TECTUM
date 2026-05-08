import { Link, useLocation } from 'react-router-dom';
import { IoMdDocument } from "react-icons/io";
import { 
  MdDashboard ,
   MdClose,
     MdChevronRight, 
 } from "react-icons/md";
 import { TbReportAnalytics } from "react-icons/tb";
import { useEffect, useState } from 'react';


const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard />, path: '/user-dashboard' },
    {
      name: 'Form Entry',
      icon: <IoMdDocument  />,
      submenu: [
        { name: 'Business Profile', path: '/data-entry/business-profile' },
        // { name: 'Business Profile Form', path: '/data-entry/business-profile-form' },
        { name: 'Compliance', path: '/data-entry/compliance' },
        { name: 'Customer', path: '/data-entry/customer' },
        { name: 'Delivery', path: '/data-entry/delivery' },
        { name: 'Financial', path: '/data-entry/financial' },
        { name: 'Governance', path: '/data-entry/governance' },
        { name: 'GST Data', path: '/data-entry/gst-data' },
        { name: 'Industry Specific', path: '/data-entry/industry-specific' },
        { name: 'Inventory', path: '/data-entry/inventory' },
        { name: 'OEM Readiness', path: '/data-entry/oem-readiness' },
        { name: 'Production', path: '/data-entry/production' },
        { name: 'Quality', path: '/data-entry/quality' },
        { name: 'Supplier', path: '/data-entry/supplier' }
      ]
    },
    {
      name: 'Final Report',
      icon: <TbReportAnalytics />,
      submenu: [
        { name: 'Company Report',  path: '/final-report/company-report' }
      ]
    }
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
      ...(location.pathname.startsWith('/data-entry') ? { 'Form Entry': true } : {}),
      ...(location.pathname.startsWith('/final-report') ? { 'Final Report': true } : {}),
    }));
  }, [location.pathname]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex h-screen flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <span className="font-bold tracking-tight text-lg">TECTUM</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <MdClose />
        </button>
      </div>

      <nav className="sidebar-scroll mt-6 px-3 flex-1 overflow-y-auto pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      expandedMenus[item.name]
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    <MdChevronRight className={`transform transition-transform ${(expandedMenus[item.name] || item.submenu?.some((subitem) => subitem.path === location.pathname)) ? 'rotate-90' : ''}`} />
                  </button>
                  {(expandedMenus[item.name] || item.submenu?.some((subitem) => subitem.path === location.pathname)) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-700">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.path}
                          onClick={onClose}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors pl-4 ${
                            location.pathname === subitem.path
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;