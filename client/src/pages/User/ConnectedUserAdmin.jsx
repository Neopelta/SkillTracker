import { Fragment, useState, useEffect } from "react";
import './ConnectedUserAdmin.css';

const ConnectedUserAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/sessions/connected", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });
                const responseData = await response.json();
                setUsers(responseData.data);
            } catch (e) {
                console.error("Erreur dans la récupération des données:", e);
            }
        };

        fetchUsers();
    }, []);


    const handleLogout = async (discordId) => {
        try {
            const response = await fetch("/session/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: discordId,
                }),
            });

            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter(user => user.session_id !== discordId));
                window.location.href = "/";
            } else {
                console.error("Erreur lors de la déconnexion");
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
        }
    };

    return (
        <Fragment>
            <h1>Page réservée à l'administrateur</h1>
            <p>Voici la liste des utilisateurs connectés :</p>
            <table>
                <thead>
                <tr>
                    <th scope="col">Discord ID</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.session_id}</td>
                        <td>
                            <button onClick={() => handleLogout(user.session_id)}>logout</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Fragment>
    );
};

export default ConnectedUserAdmin;
