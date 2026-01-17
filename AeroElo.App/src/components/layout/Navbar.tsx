import { Link, useLocation } from 'react-router';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Leaderboard', path: '/' },
  { label: 'Players', path: '/players' },
  { label: 'Log Match', path: '/log-match' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">AeroElo</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
