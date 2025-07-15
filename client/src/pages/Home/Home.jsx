import React from "react";
import "./Home.css";
import { BookOpen, Bot, Users, Filter, UserCircle, RefreshCw } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>SkillTracker</h1>
        <h2>Gestionnaire des compétences</h2>
        <p className="intro">
          Bienvenue sur la plateforme de suivi des compétences du Master 1 Informatique 
          de l'Université de Poitiers. Notre outil vous permet de suivre votre progression 
          et de visualiser vos compétences tout au long de votre parcours.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-section website">
          <h3>
            <BookOpen className="feature-icon" size={24} />
            Site Web
          </h3>
          <div className="features-list">
            <div className="feature-item">
              <Users className="list-icon" size={20} />
              <span>Consultez le tableau des compétences</span>
            </div>
            <div className="feature-item">
              <Filter className="list-icon" size={20} />
              <span>Filtrez les skills par étudiant</span>
            </div>
            <div className="feature-item">
              <UserCircle className="list-icon" size={20} />
              <span>Visualisez les profils détaillés</span>
            </div>
            <div className="feature-item">
              <RefreshCw className="list-icon" size={20} />
              <span>Mettez à jour vos compétences</span>
            </div>
          </div>
        </div>

        <div className="feature-section discord">
          <h3>
            <Bot className="feature-icon" size={24} />
            Bot Discord
          </h3>
          <div className="features-list">
            <div className="feature-item">
              <UserCircle className="list-icon" size={20} />
              <span>Accédez à vos skills via Discord</span>
            </div>
            <div className="feature-item">
              <Users className="list-icon" size={20} />
              <span>Consultez les compétences des autres étudiants</span>
            </div>
            <div className="feature-item">
              <RefreshCw className="list-icon" size={20} />
              <span>Mettez à jour vos skills rapidement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;