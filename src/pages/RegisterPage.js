// RegisterPage.js
import React from 'react';
import { auth, database } from '/Users/apple/Desktop/E-commerce/frontend/src/firebase.js';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

function RegisterPage({ setIsModalOpen }) {
    const handleRegister = (event) => {
        event.preventDefault();
        const fname = document.getElementById('signup-fname').value;
        const lname = document.getElementById('signup-lname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const uid = userCredential.user.uid;
                const userRef = ref(database, 'users/' + uid);

                set(userRef, {
                    fname: fname,
                    lname:lname,
                    email: email
                }).then(() => {
                    alert('User created successfully!');
                    setIsModalOpen(false);
                }).catch((error) => {
                    alert('Error saving user data: ' + error.message);
                });
            })
            .catch((error) => {
                alert('Error creating user: ' + error.message);
            });
    };

    return (
        <div className="register-form">
            <h1>Register</h1>
            <p>Create your account:</p>
            <form id="signup-form" onSubmit={handleRegister}>
                <input type="text" id="signup-fname" placeholder="First Name" required />
                <input type="text" id="signup-lname" placeholder="Last Name" required />
                <input type="email" id="signup-email" placeholder="Email" required/>
                <input type="password" id="signup-password" placeholder="Password" required/>
                <button type="submit">REGISTER</button>
            </form>
        </div>
    );
}

export default RegisterPage;
