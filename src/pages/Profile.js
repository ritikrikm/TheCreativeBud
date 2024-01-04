// Profile.js
import React, { useState, useEffect } from "react";

import Header from './Header'; // Import Header component
import Footer from './Footer'; // Import Footer component
import { ref, onValue } from 'firebase/database';
import UserProfile from "./userprofile";
import UpdateProfile from "./updateprofile";
import OrderProfile from "./orderprofile";
import VerticalMenu from "./verticalmenu";
import { UserContext } from './UserContext';
import { useContext } from 'react';
import '../styling/profile.css'
import ContactUs from "./ContactUs";
import { database } from '../firebase'; // Adjust the path as necessary

function Profile() {
  const [orders, setOrders] = useState([]);

 

  const [openModal, setOpenModal] = useState(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [isMyOrder, setIsMyOrder] = useState(false);
  const [isContactUs, setIsContactUs] = useState(false);
// const{ uids,setUid} = useState(null)
  const [profileData, ] = useState(null);

  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const uid = currentUser ? currentUser.uid : null;
  const name = additionalUserInfo ? additionalUserInfo.name : '';
  const role = additionalUserInfo ? additionalUserInfo.role : '';

  const checkIfAdmin = () => {
    return role === 'admin';
  };
console.log("HELLO"+uid);
  useEffect(() => {


const checkIfAdmin = () => {
  return role === 'admin';
};
    setIsProfileOpen(true);
    setIsMyOrder(false);
    setIsUpdateProfile(false);
    setIsContactUs(false);
 
  }, []);
  useEffect(() => {
    if (checkIfAdmin()) {
      const ordersRef = ref(database, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedOrders = Object.keys(data).map(key => ({
            ...data[key],
            id: key
          }));
          setOrders(fetchedOrders);
        }
      }, {
        onlyOnce: true
      });
    }
  }, [checkIfAdmin]);


  

  const handleNavLinkClick = (link) => {
    // if (!currentUser) {
    //   console.log("No current user found");
    //   // Handle the scenario when there's no user (e.g., redirect to login)
    //   return;
    // }
    if (link === "profile") {
      setIsProfileOpen(true);
      setOpenModal(null);
      setIsUpdateProfile(false)
      setIsMyOrder(false)
      setIsContactUs(false);
   
    } else if (link === "uprofile") {
      setIsUpdateProfile(true);
      setIsProfileOpen(false);
      setIsMyOrder(false);
      setIsContactUs(false);
    
    } else if (link === "orders") {
      setIsMyOrder(true);
      setIsUpdateProfile(false);
      setIsProfileOpen(false);
      setIsContactUs(false);
    
    }else if (link === "contact") {
      setIsContactUs(true);
      setIsMyOrder(false);
      setIsUpdateProfile(false);
      setIsProfileOpen(false);
 
    
    }  else {

      setOpenModal(link);
      setIsProfileOpen(false);
    }
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  const closeUpdateProfileModal = () => {
    setIsUpdateProfile(false);
  };
  const closeisContactModal = () => {
    setIsContactUs(false);
  };
  const closeOrderModal = () => {
    setIsMyOrder(false);
  };


  const isAdmin = currentUser && role === 'admin';

  const isStudent = currentUser && role === 'user';
console.log(isStudent);
  const menuItems = [
  { id: "profile", label: "Profile" },
  // { 
  //   id: "classesPreferred", 
  //   label: isStudent ? "Available Courses" : "Classes Preferred",
    
  // },
  { id: "uprofile", label: "Update Profile",
    
  },
  { id: "orders", label: isStudent ? "My Orders" :"Find Orders",

  },
  { id: "contact", label: "Contact Us",

  },
 
];



  return (

    <>
    <div className="main-content-container"> {/* Add this wrapper around your content */}
    <Header></Header>
    <div className="user-home-page">
      
      

      <main className="userhpmain">
        <section className="menu-section">
          <VerticalMenu
            items={menuItems.filter(item => !item.hidden)}
            activeItem={openModal}
            onItemClick={(item) => handleNavLinkClick(item)}
          />
          {isProfileOpen && <UserProfile
            isProfileOpen={isProfileOpen}
            onClose={closeProfileModal}
            username={name}
            profileData={profileData}
          />}
           {isUpdateProfile && <UpdateProfile
            isUpdateProfile={isUpdateProfile}
            onClose={closeUpdateProfileModal}
            username={name}
            profileData={profileData}
          />}
           {isMyOrder && <OrderProfile
            isMyOrder={isMyOrder}
            onClose={closeOrderModal}
            username={name}
            profileData={profileData}
            checkIfAdmin={checkIfAdmin}
       
          />}
           {isContactUs && <ContactUs
            isContactUs={isContactUs}
            onClose={closeisContactModal}
            username={name}
            profileData={profileData}
            uid = {uid}
          />}
         
        </section>
      </main>

    
      {/* <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        openForgotModal={openForgotModal}
      /> */}
      {/* <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={closeForgotModal} /> */}
    </div>
    <Footer></Footer>
    </div>
    </>
  );
}

export default Profile;
