import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

import logoLight from '../assets/transparent-logo 1.svg';
import logoDark from '../assets/transparent-dark.svg';


/**
 * Top Navbar component
 * Features (theo chuẩn ui-ux skill):
 * - Logo sản phẩm bên trái: Biểu tượng ProductMark hình học + Brand name
 * - 2 nút chức năng: 'Tìm việc làm' (navigates /candidate) và 'Tạo CV' (nút Primary duy nhất, navigates /hr)
 * - Đường chia divider mảnh 1px ngăn nhóm chức năng & nhóm tài khoản
 * - 2 nút điều hướng xác thực: 'Đăng nhập' (ghost button) & 'Đăng ký' (outline button)
 * - Switch / toggle Dark & Light mode icon chuẩn
 * - Chiều cao chuẩn h-16 (64px), sticky, border-bottom mỏng, không đổ bóng trong trang (M15)
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const isCandidateActive = location.pathname.startsWith('/candidate');
  const isHrActive = location.pathname.startsWith('/hr');

  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        {/* Left: Brand Logo */}
        <Link to="/" className="navbar-brand" aria-label="CMCV Trang chủ">
          <span className="navbar-brand-badge" aria-hidden="true" >
            <img src={document.documentElement.getAttribute('data-theme') === 'dark' ? logoDark : logoLight} alt="CMCV Logo" className="logo" />
          </span>
          {/* <div className="navbar-brand-info">
            <span className="navbar-brand-name">CMCV</span>
            <span className="navbar-brand-tagline">Smart Recruitment</span>
          </div> */}
        </Link>

        {/* Right: Actions */}
        <nav className="navbar-nav" aria-label="Điều hướng chính và tài khoản">
          {/* Nhóm 2 nút chức năng */}
          <div className="navbar-group navbar-group--features">
            <button
              type="button"
              className={`btn-nav btn-nav--ghost ${isCandidateActive ? 'is-active' : ''}`}
              onClick={() => navigate('/candidate')}
            >
              <svg
                className="btn-nav-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Tìm việc làm</span>
            </button>

            <button
              type="button"
              className={`btn-nav btn-nav--primary ${isHrActive ? 'is-active' : ''}`}
              onClick={() => navigate('/hr')}
            >
              <svg
                className="btn-nav-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Tạo CV</span>
            </button>
          </div>

          <div className="navbar-divider" aria-hidden="true" />

          {/* Nhóm tài khoản: Đăng nhập & Đăng ký */}
          <div className="navbar-group navbar-group--auth">
            <button
              type="button"
              className="btn-nav btn-nav--ghost"
              onClick={() => navigate('/login')}
            >
              <span>Đăng nhập</span>
            </button>

            <button
              type="button"
              className="btn-nav btn-nav--outline"
              onClick={() => navigate('/register')}
            >
              <span>Đăng ký</span>
            </button>
          </div>

          {/* Nút switch Dark / Light mode */}
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {isDark ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
