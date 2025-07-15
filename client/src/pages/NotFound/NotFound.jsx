import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown, Home, RotateCcw } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };
 
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <Frown size={100} className="sad-face" />
                <h2>Oups ! On dirait que vous vous êtes perdu...</h2>
                <p className="error-message">
                    La page que vous cherchez s'est peut-être fait manger par un bug...
                </p>
                <div className="not-found-actions">
                    <button onClick={handleGoBack} className="action-button back">
                        <RotateCcw size={20} />
                        Retourner en arrière
                    </button>
                    <button onClick={handleGoHome} className="action-button home">
                        <Home size={20} />
                        Retourner à l'accueil
                    </button>
                </div>
                <div className="fun-element">
                    <div className="pacman">
                        <div className="pacman-top"></div>
                        <div className="pacman-bottom"></div>
                    </div>
                    <div className="dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;