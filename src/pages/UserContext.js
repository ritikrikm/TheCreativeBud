// UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [additionalUserInfo, setAdditionalUserInfo] = useState({});
    

    useEffect(() => {
        const auth = getAuth();
        const database = getDatabase();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                
                // Fetch additional user info from Realtime Database
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    const userInfo = snapshot.val();
                    if (userInfo) {
                        setAdditionalUserInfo(userInfo);
                        console.log(userInfo);
                    }
                }, {
                    onlyOnce: true
                });

            } else {
                setCurrentUser(null);
                setAdditionalUserInfo({});
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, additionalUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};
