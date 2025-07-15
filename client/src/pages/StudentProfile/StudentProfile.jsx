import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { GoogleSheetsHandler } from "../../services/apiGoogleSpreadSheet";
import { Pencil, Check, X, ArrowLeft } from "lucide-react";
import "./StudentProfile.css";

const StudentProfile = () => {
    const { discordId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const studentName = location.state?.studentName || "l'étudiant";

    const [editingSkill, setEditingSkill] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissions, setPermissions] = useState({ canEdit: false, isAdmin: false, isValidToken: false });

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch(`/api/permissions/${discordId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch permissions');
                }
                const perms = await response.json();
                setPermissions(perms);
            } catch (err) {
                console.error('Error fetching permissions:', err);
                setPermissions({ canEdit: false, isAdmin: false });
            }
        };

        fetchPermissions();
    }, [discordId]);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const sheetsHandler = new GoogleSheetsHandler();
                const data = await sheetsHandler.readData();
                const headers = data[0];
                const discordIdIndex = headers.findIndex(h => h === 'Discord ID');

                const studentRow = data.slice(1).find(row =>
                    row[discordIdIndex].toString() === discordId.toString()
                );

                if (!studentRow) {
                    throw new Error("Student not found");
                }

                const studentInfo = {};
                headers.forEach((header, index) => {
                    studentInfo[header.toLowerCase()] = studentRow[index];
                });

                setStudentData(studentInfo);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching student data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [discordId]);

    const handleSkillChange = async (key, newValue) => {
        if (!permissions.canEdit || !permissions.isValidToken) {
            alert("Vous n'avez pas la permission de modifier cette fiche");
            return;
        }

        const numericValue = Number(newValue);

        if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
            alert("Veuillez entrer un nombre entre 0 et 10");
            return;
        }

        try {
            const updatedData = {...studentData};
            updatedData[key] = numericValue;

            const now = new Date();
            const formattedDate = now.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(',', '');

            updatedData['last update'] = formattedDate;
            setStudentData(updatedData);

            const sheetsHandler = new GoogleSheetsHandler();
            const data = await sheetsHandler.readData();
            const headers = data[0];
            const rowIndex = data.findIndex(row => row[headers.indexOf('Discord ID')].toString() === discordId.toString());

            if (rowIndex === -1) {
                throw new Error("Student not found");
            }

            const newRow = headers.map(header => updatedData[header.toLowerCase()]);
            await sheetsHandler.updateRow(rowIndex + 1, newRow);
            setEditingSkill(null);
        } catch (err) {
            console.error('Error updating skill:', err);
            alert("Échec de la mise à jour de la compétence");
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (!studentData) return <div>Aucune donnée trouvée</div>;

    return (
        <div className="student-profile">
            <button onClick={() => navigate(-1)} className="back-button">
                <ArrowLeft size={20} />
                Retour
            </button>
            <h1>Fiche de {studentData.name}</h1>
            <div className="profile-content">
                <div className="basic-info">
                    <h2>Informations de base</h2>
                    <p><strong>Discord ID:</strong> {studentData['discord id']}</p>
                    <p><strong>Dernière mise à jour:</strong> {studentData['last update']}</p>
                </div>

                <div className="skills-grid">
                    <h2>Compétences</h2>
                    {!permissions.canEdit && !permissions.isValidToken && (
                        <p className="permission-notice">
                            Vous devez être connecté et autorisé pour modifier ces compétences
                        </p>
                    )}
                    <div className="skills-list">
                        {Object.entries(studentData).map(([key, value]) => {
                            if (!['name', 'discord id', 'last update'].includes(key)) {
                                return (
                                    <div key={key} className="skill-item">
                                        <span className="skill-name">{key}</span>
                                        {editingSkill === key && permissions.canEdit ? (
                                            <div className="skill-edit">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    value={tempValue}
                                                    onChange={(e) => setTempValue(e.target.value)}
                                                />
                                                <button onClick={() => handleSkillChange(key, tempValue)} title="Confirmer">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingSkill(null)} title="Annuler">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="skill-value">
                                                <span>{value}</span>
                                                {permissions.canEdit && permissions.isValidToken &&  (
                                                    <button
                                                        onClick={() => {
                                                            setEditingSkill(key);
                                                            setTempValue(value);
                                                        }}
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;