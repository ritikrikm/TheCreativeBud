import React, { useState, useEffect } from "react";
import LoginModal from "./loginmodel";
import UserProfile from "./userprofile";
import { useNavigate,Link } from "react-router-dom";
import MyClasses from "./myclasses";
import FacultyClasses from "./facultyclasses";
import EnquiryModal from "./enquiry"; 
import ClassesPreferred from "./classespreferred";
import ForgotPasswordModal from "./forgotpassword";
import Attendance from "./attendance";

import VerticalMenu from "./verticalmenu";
import { useAuth } from "../pages/authcontext";
import dummyClassesData from "../dummydata/classesAttended";
import { getDatabase, ref, get } from "firebase/database";
import '/Users/apple/Desktop/E-commerce/frontend/src/styling/userhomepage.css'

const UserHomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username, login, logout, currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [activeLink, setActiveLink] = useState("home");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [isMyOrder, setIsMyOrder] = useState(false);

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isFacultyClassesOpen, setIsFacultyClassesOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [uid, setUid] = useState(null);

  useEffect(() => {
    setActiveLink("home");
    setIsProfileOpen(true);
    setIsClassesPreferOpen(false);
    setIsEnquiryOpen(false);
    setIsMyClassesOpen(false);
    setIsAttendanceOpen(false);
    setIsFacultyClassesOpen(false);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openForgotModal = () => {
    closeLoginModal();
    setIsForgotModalOpen(true);
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
  };

  const fetchUserProfileData = async (uid) => {
    if (!uid) {
      console.error("UID is not defined.");
      return;
    }

    const database = getDatabase();
    const userRef = ref(database, `users/${uid}`);

    try {
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setProfileData(userData);
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setProfileData(null);
    }
  };

  useEffect(() => {
    if (isProfileOpen && currentUser) {
      const uid = currentUser.uid;
      fetchUserProfileData(uid);
      setUid(uid);
    }
  }, [isProfileOpen, currentUser]);

  const handleNavLinkClick = (link) => {
    if (link === "profile") {
      setIsProfileOpen(true);
      setOpenModal(null);
      setIsClassesPreferOpen(false);
      setIsEnquiryOpen(false);
      setIsMyClassesOpen(false);
      setIsAttendanceOpen(false)
      setIsFacultyClassesOpen(false)
    } else if (link === "classesPreferred") {
      setIsClassesPreferOpen(true);
      setIsProfileOpen(false);
      setIsEnquiryOpen(false);
      setIsMyClassesOpen(false);
      setIsAttendanceOpen(false)
      setIsFacultyClassesOpen(false)
    } else if (link === "myclasses") {
      setIsClassesPreferOpen(false);
      setIsProfileOpen(false);
      setIsEnquiryOpen(false);
      setIsMyClassesOpen(true);
      setIsAttendanceOpen(false)
      setIsFacultyClassesOpen(false)
    } else if (link === "enquiry") {
      setIsClassesPreferOpen(false);
      setIsProfileOpen(false);
      setIsEnquiryOpen(true);
      setIsMyClassesOpen(false);
      setIsAttendanceOpen(false)
      setIsFacultyClassesOpen(false)
    } 
    else if (link === "attendance") {
      setIsClassesPreferOpen(false);
      setIsProfileOpen(false);
      setIsEnquiryOpen(false);
      setIsMyClassesOpen(false);
      setIsAttendanceOpen(true)
      setIsFacultyClassesOpen(false)
    }else if (link === "facultyClasses") {
      setIsClassesPreferOpen(false);
      setIsProfileOpen(false);
      setIsEnquiryOpen(false);
      setIsMyClassesOpen(false);
      setIsAttendanceOpen(false)
      setIsFacultyClassesOpen(true)
    } else {
      setActiveLink(link);
      setOpenModal(link);
      setIsProfileOpen(false);
    }
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  const closeClassesPreferModal = () => {
    setIsClassesPreferOpen(false);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryOpen(false);
  };

  const closeMyClassesModal = () => {
    setIsMyClassesOpen(false);
  };

  const closeAttendanceModal = () => {
    setIsAttendanceOpen(false);
  };

  const closeFacultyClassesModal = () => {
    setIsFacultyClassesOpen(false);
  };


  const isAdmin = currentUser && currentUser.role === 'admin';

  const isStudent = currentUser && currentUser.role === 'user';

  const menuItems = [
  { id: "profile", label: "Profile" },
  { 
    id: "classesPreferred", 
    label: isStudent ? "Available Courses" : "Classes Preferred",
    
  },
  { id: "facultyClasses", label: "Faculty Classes",
    
  },
  { id: "myclasses", label: isStudent ? "Student Classes" : "My Classes",

  },
  {
    id: "attendance", label:"Attendance",

  },
  { id: "enquiry", label: "Enquiry" ,

},
 
];

  const handleLogin = (userData) => {
    login(userData);
    setUid(userData.uid);
  };

  return (
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
            username={username}
            profileData={profileData}
          />}
           {isProfileOpen && <UserProfile
            isProfileOpen={isProfileOpen}
            onClose={closeProfileModal}
            username={username}
            profileData={profileData}
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
  );
};

export default UserHomePage;
