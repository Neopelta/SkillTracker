import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
        .then((response) => {
          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await fetch("/api/user", { credentials: "include" });
        if (userResponse.ok) {
          setIsLoggedIn(true);
          const permResponse = await fetch(`/api/permissions/admin`, {
            credentials: 'include'
          });
          if (permResponse.ok) {
            const perms = await permResponse.json();
            setIsAdmin(perms.isAdmin);
            setIsExpired(!perms.isValidToken);
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    fetch("/auth/logout", {
      method: "GET",
      credentials: "include",

    }).then(() => {
      console.log("fetch")
      setIsLoggedIn(false);
    });
  };

  return (
      <header className="header">
        <nav>
          <div
              className={`menu-icon ${isMenuOpen ? "open" : ""}`}
              onClick={toggleMenu}
          >
            <span className="burger"></span>
          </div>
          <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/skills" onClick={toggleMenu}>
                Tableau des Skills
              </Link>
            </li>
            <li>
              <a
                  href="https://docs.google.com/spreadsheets/d/12IlZ5US1jQOlQBFj8L1ivkTPtNpEl2uJPygO7L_Y3dI/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMenu}
              >
                Tableur Google
              </a>
            </li>
            {(isAdmin && !isExpired) &&(
                <li>
                  <Link to="/admin/connected-users" className="admin-page">
                    Gérer les utilisateurs
                  </Link>
                </li>
            )}
          </ul>
          {(isLoggedIn && !isExpired) ? (
              <button className="login-button" onClick={handleLogout}>
                Se déconnecter
              </button>
          ) : (
              <Link to="/login" className="login-button">
                Connexion
              </Link>
          )}
        </nav>
      </header>
  );
};

export default Header;