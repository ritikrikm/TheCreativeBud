// LoginPage.js
import React from 'react';
import { auth } from '/Users/apple/Desktop/E-commerce/frontend/src/firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage({ setIsModalOpen, setUserName }) {
    const handleLogin = (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Logic after successful login
                setUserName(userCredential.user.displayName);
                setIsModalOpen(false);
            })
            .catch((error) => {
                alert('Error during login: ' + error.message);
            });
    };

    return (
        <div className="login-form">
            <h1>Sign In</h1>
            <p>or use your email account:</p>
            <form id="login-form" onSubmit={handleLogin}>
                <input type="email" id="login-email" placeholder="Email" />
                <input type="password" id="login-password" placeholder="Password" />
                <button type="submit">SIGN IN</button>
            </form>
        </div>
    );
}

export default LoginPage;
