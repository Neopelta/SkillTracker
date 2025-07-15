import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Template.css";

const Template = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include"
        });

        if (!response.ok) return;
        const permResponse = await fetch(`/api/permissions/admin`, {
          credentials: 'include'
        });

        if (permResponse.ok) {
          const perms = await permResponse.json();
          setIsAdmin(perms.isAdmin && perms.isValidToken);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du statut admin:", err);
      }
    };

    checkAdminStatus();
  }, []);

  return (
      <div className="template">
        <Header />
        {isAdmin && (
            <div className="admin-banner">
              Vous êtes connecté en tant qu'administrateur
            </div>
        )}
        <main className="main-content">
          <div className="content-wrapper">{children}</div>
        </main>
        <Footer />
      </div>
  );
};

export default Template;
