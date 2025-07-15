import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleSheetsHandler} from "../../services/apiGoogleSpreadSheet";
import "./SkillsPage.css";

const SkillsPage = () => {
    const [skills, setSkills] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const sheetsHandler = new GoogleSheetsHandler();
                const data = await sheetsHandler.readData();
                const headerRow = data[0];
                setHeaders(headerRow);

                const formattedData = data.slice(1).map((row) => {
                    const skillObject = {};
                    headerRow.forEach((header, index) => {
                        skillObject[header.toLowerCase()] = row[index] || '';
                    });
                    return skillObject;
                });

                setSkills(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching skills:', err);
                setError('Failed to load skills data');
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    useEffect(() => {
        const checkScroll = () => {
            const wrapper = document.querySelector('.table-wrapper');
            if (wrapper) {
                const hasScroll = wrapper.scrollWidth > wrapper.clientWidth;
                wrapper.classList.toggle('has-scroll', hasScroll);
            }
        };
    
        checkScroll();
        
        window.addEventListener('resize', checkScroll);
        
        return () => {
            window.removeEventListener('resize', checkScroll);
        };
    }, [skills]);

    const isMobileDevice = () => {
        return window.matchMedia("(max-width: 768px)").matches || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(isMobileDevice());
        };
        
        checkDevice();
        
        window.addEventListener('resize', checkDevice);
        
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    const handleNameClick = (discordId, name) => {
        console.log('Navigation vers profil:', { discordId, name });
        if (discordId) {
            navigate(`/student/${discordId.toString().trim()}`, {
                state: { studentName: name }
            });
        } else {
            console.error('Discord ID manquant pour:', name);
        }
    };

    const renderCell = (header, value, skill) => {
        if (header.toLowerCase() === 'name') {
            return (
                <button
                    className="name-link"
                    onClick={() => handleNameClick(skill['discord id'], value)}>
                    {value}
                </button>
            );
        }
        return value;
    };

    const filteredSkills = skills.filter((skill) => {
        const skillName = skill.name?.toLowerCase().trim().normalize(); // NFC normalization by default
        const name = skillName || '';
        return name.includes(search.toLowerCase().trim());
    });

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="skills-page">
            <h1>Liste des compétences</h1>
            <div id={"search-bar"}>
                <p>Chercher un étudiant</p>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="nom..."
                />
            </div>
            <div className="skills-container">
                {!isMobile  && (
                    <small className="small-instruction">
                        Utilisez Shift + Molette de souris pour naviguer horizontalement
                    </small>
                )}
                <div className="table-wrapper">
                    <table id="tab-skills">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} scope="col">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {filteredSkills.map((skill, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => {
                                    const key = header.toLowerCase();
                                    const value = skill[key];
                                    return (
                                        <td key={colIndex}>
                                            {renderCell(header, value, skill)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SkillsPage;