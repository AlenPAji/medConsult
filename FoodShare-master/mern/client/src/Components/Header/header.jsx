import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { brandLogo } from "../../assets";
import MainLine from "./mainLine";
import "../../App.css"

export default function Header({ id }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (userData && userData.first_name) {
                        setUserRole(userData.account_type);
                    }
                });
            }
        });

        // Return the cleanup function inside the useEffect
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleMouseEnter = () => {
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        setShowDropdown(false);
    };

    return (
        <section className="Navheader" id={id}>
            <nav>
                {/* <a href="/" className="logo-link">
                    <img
                        src={brandLogo}
                        alt="logo"
                        style={{ transition: 'transform 0.3s ease-in-out' }}
                        className="logo-image"
                    />
                </a> */}

                <div className="nav-links" id="navlink">
                    <ul>
                        <li><a href="/">HOME</a></li>
                        <li><a href="/dashboard">DASHBOARD</a></li>
                        <li><a href="/about">ABOUT US</a></li>
                        <li><a href="/contact">CONTACT US</a></li>
                        {user ? (
                            <button className="logInBtn" onClick={handleLogout}>Log Out</button>
                        ) : (
                            <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <a href="#" className="logInBtn">Log In</a>
                                {showDropdown && (
                                    <ul className="dropdown">
                                        <li><a href="/register?type=patient">Patient</a></li>
                                        <li><a href="/register?type=doctor">Doctor</a></li>
                                        <li><a href="/register?type=admin">Admin</a></li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <MainLine user={user} userRole={userRole} />
        </section>
    );
}
