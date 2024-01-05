import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { debounce } from '../utils'; // import debounce from utils.js
import { CartContext } from './CartProvider';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref,get, set, onValue } from "firebase/database";

import { signOut } from "firebase/auth";
import "../styling/header.css";

import { UserContext } from "./UserContext";


function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { cartItems } = useContext(CartContext);
  const isCartNotEmpty = cartItems.length > 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerFormVisible, setRegisterFormVisible] = useState(false);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const [sidenavWidth, setSidenavWidth] = useState("0px");

  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true); // default value as per your logic
  const [signUpButtonText, setSignUpButtonText] = useState("SIGN UP"); // default button text
  const [detailText, setDetailText] = useState(
    "Enter your personal details and start journey with us"
  ); // New state for detail text
  const [leftPanelDisplay, setLeftPanelDisplay] = useState("block"); // New state for left panel display

  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const uid = currentUser ? currentUser.uid : null;
  const name = additionalUserInfo ? additionalUserInfo.name : "";
  const role = additionalUserInfo ? additionalUserInfo.role : "";

  const auth = getAuth(); // Initialize Firebase Auth
  const database = getDatabase(); // Initialize Firebase Database
  const navigate = useNavigate();
    useEffect(() => {
      // Call the search function after a delay of 300ms
      const debouncedSearch = debounce(handleSearch, 300);
      
      if (searchInput) {
        debouncedSearch();
      } else {
        setSearchResults([]);
      }
    }, [searchInput]); // useEffect will run on every change in searchInput

  // Logout function
  const handleLogout = () => {
    const auth = getAuth();

    // Sign out the user
    signOut(auth)
      .then(() => {
        // Clear user data from local storage
        localStorage.removeItem("user");
        navigate('/'); 
        window.location.reload();
        // Set the user name to null
        // setUserName(null);
        // Perform any other relevant state updates
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const resetStates = () => {
    setIsModalOpen(false);
    setRegisterFormVisible(false);
    setIsLeftPanelVisible(true);
    setLeftPanelDisplay("block");
    setSignUpButtonText("SIGN UP");
    setDetailText("Enter your personal details and start journey with us");
  };

  const handleSearch = async (input) => {
    if (!input || !input.trim()) {
      setSearchResults([]);
      return;
    }

    const collections = ['earrings', 'keychains', 'offers', 'products', 'stationary'];
    let allResults = [];

    for (const collection of collections) {
      const refPath = ref(database, collection);
      const snapshot = await get(refPath);
      const data = snapshot.val();

      if (data) {
        Object.keys(data).forEach(key => {
          if (data[key].name.toLowerCase().includes(input.toLowerCase())) {
            allResults.push({ ...data[key], id: key, collection });
          }
        });
      }
    }

    setSearchResults(allResults);
  };

  const debouncedSearch = useCallback(debounce((input) => handleSearch(input), 500), []);

const handleSearchInputChange = (e) => {
  const input = e.target.value;
  setSearchInput(input);
  debouncedSearch(input);
};
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Entered");
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    console.log(email, password, auth);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful

        alert("Login successful!");
        const uid = userCredential.user.uid;
        const userRef = ref(database, "users/" + uid);
        // setUserName(userCredential.user.displayName || 'User')
        resetStates();
        // You can redirect the user to another page or update the UI accordingly
      })
      .catch((error) => {
        alert("Error during login: " + error.message);
        // Handle errors here, such as showing a message to the user
      });
  };

  const handleSignUpClick = () => {
    setIsLeftPanelVisible(!isLeftPanelVisible); // Toggle visibility of the left panel
    setRegisterFormVisible(!registerFormVisible); // Toggle visibility of the register form

    if (!registerFormVisible) {
      setSignUpButtonText("Click to Sign-in");
      setDetailText("Already have an account here?");
    } else {
      setSignUpButtonText("SIGN UP");
      setDetailText("Enter your personal details and start journey with us");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile", { state: { uid } });
  };
  const handleStationaryClick = () => {
    navigate("/stationary", { state: { uid } });
  };
  const handleOffersClick = () => {
    navigate("/spcloffer", { state: { uid } });
  };
  const handleEarringClick = () => {
    navigate("/accessories/earrings", { state: { uid } });
  };

  const handlePendantsClick = () => {
    navigate("/accessories/pendants", { state: { uid } });
  };
  const handleKeychainClick = () => {
    navigate("/accessories/keychains", { state: { uid } });
  };
  const handleRegister = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Define a reference to the user data in the Realtime Database
        const uid = userCredential.user.uid;
        const userRef = ref(database, "users/" + uid);

        // Set the user data at the defined reference
        set(userRef, {
          name: name,
          email: email,
          password: password,
          uid: uid,
        })
          .then(() => {
            alert("User created and data saved successfully!");
            document.getElementById("name").value = "";
            document.getElementById("signup-email").value = "";
            document.getElementById("signup-password").value = "";

            resetStates();
          })
          .catch((error) => {
            alert("Error saving user data: " + error.message);
          });
      })
      .catch((error) => {
        alert("Error creating user: " + error.message);
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // setUserName(userData.name);
      // any other relevant state updates
    }

    // ... other useEffect logic
  }, []);
  const isUser = currentUser && role === "user";
  const isAdmin = currentUser && role === "admin";
  console.log("HEY" + isAdmin);
  return (
    <header>
      <nav className="nav1">
        <div className="left">
          <span>TheCreativeBud</span>

          {name ? (
            <>
              {isAdmin ? (
                <span>, Welcome Admin {name}</span>
              ) : (
                <span>, Welcome {name}</span>
              )}

              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <div>
              <a
                href="#"
                onClick={() => {
                  setIsModalOpen(true);
                  setRegisterFormVisible(false);
                }}
              >
                Login
              </a>
              <span> OR </span>
              <a
                href="#"
                onClick={() => {
                  setIsModalOpen(true);
                  setRegisterFormVisible(true);
                }}
              >
                Register
              </a>
            </div>
          )}
        </div>
        <div
          id="loginModal"
          className="modal"
          style={{ display: isModalOpen ? "block" : "none" }}
        >
          <div className="modal-content">
            <span className="close" onClick={resetStates}>
              ×
            </span>
            <div className="container">
              <p id="msg" style={{ display: "none" }}>
                Lets start exploring!
              </p>
              <div
                className={`panel left-panel ${
                  isLeftPanelVisible ? "" : "move-left"
                }`}
              >
                <h1>Sign In</h1>
                <p>or use your email account:</p>
                <form id="login-form" onSubmit={handleLogin}>
                  <input type="email" id="login-email" placeholder="Email" />
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                  />
                  {/* <a href="#">Forgot your password?</a> */}
                  <button type="submit">SIGN IN</button>
                </form>
              </div>
              <div
                className={`panel right-panel ${
                  registerFormVisible ? "full-space" : ""
                }`}
              >
                <div className="mainPanelRight">
                  <div className="items">
                    <h1>Hello, Friend!</h1>
                    <p id="det">
                      Enter your personal details and start journey with us
                    </p>
                    <button onClick={handleSignUpClick}>
                      {signUpButtonText}
                    </button>
                  </div>
                  <div
                    className={`register-form ${
                      registerFormVisible ? "full-space" : ""
                    }`}
                  >
                    <h1>Register</h1>
                    <p>Create your account:</p>
                    <form id="signup-form" onSubmit={handleRegister}>
                      <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        required
                      />
                      <input
                        type="email"
                        id="signup-email"
                        placeholder="Email"
                      />
                      <input
                        type="password"
                        id="signup-password"
                        placeholder="Password"
                      />
                      <button type="submit">REGISTER</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
        
          <a href="https://www.instagram.com/thecreativebud/" target="_blank">
            <i className="fa fa-instagram" />
          </a>
          <a href="https://www.instagram.com/thecreativebud/" target="_blank">
            <i className="fa fa-whatsapp" />
          </a>
          <a href="https://www.instagram.com/thecreativebud/" target="_blank">
            <i className="fa fa-behance" />
          </a>
          <Link to="/cart" className="cart-icon">
  <i className="fa fa-shopping-cart" />
  {isCartNotEmpty && <span className="cart-notification-dot"></span>}
</Link>

        </div>
      </nav>
      {/* nav1 end*/}
      {/* nav2 start */}
      <nav className="nav2">
        <div className="nav2-left">
          <i className="fa fa-phone" /> +91 8750727401
          <i className="fa fa-envelope" /> thecreativebud@gmail.com
        </div>
        <div className="nav2-center">
          <h1>
            Prerna <span>Sharma</span>
          </h1>
          <p>One stop destination for all your creative needs</p>
        </div>
        <div className="nav2-right">
          <a
            href="https://www.google.com/maps/place/The+Creative+Bud/@28.7351688,77.1203905,15z/data=!4m6!3m5!1s0x390d01951bf387d7:0x2b60f18e92c6a04c!8m2!3d28.7351688!4d77.1203905!16s%2Fg%2F11sdxmzt8v?entry=ttu"
            target="_blank"
            className="black-link"
          >
            <i className="fa fa-map" />
            Reach me!
          </a>
        </div>
      </nav>
      {/* nav2 end */}
      {/* nav3 start */}
      <div className="nav3">
        <ul>
          <li>
            <Link to="/">
              <i className="fa fa-home" />
              Home
            </Link>
          </li>
          <li>
            <a onClick={handleStationaryClick}>
              <i className="fa fa-user" />
              Stationary
            </a>
          </li>

          <li>
            <a onClick={handleOffersClick}>
              <i className="fa fa-calendar-check-o" />
              Special Offers
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-anchor" />
              Accessories <i className="fa fa-caret-down" />
            </a>
            <ul>
              <li>
                <a onClick={handleEarringClick}>
                  <i className="fa fa-clipboard" />
                  Earrings
                </a>
              </li>
              <li>
                <a onClick={handlePendantsClick}>
                  <i className="fa fa-circle-o" />
                  Pendants
                </a>
              </li>
              <li>
                <a onClick={handleKeychainClick}>
                  <i className="fa fa-gavel" />
                  Keychain
                </a>
              </li>
            </ul>
          </li>
          {uid && (
            <li>
              <a onClick={handleProfileClick}>
                <i className="fa fa-user" />
                Profile
              </a>
            </li>
          )}
          <li>
            <a
              href="#"
              onClick={() => setIsSearchBoxVisible(!isSearchBoxVisible)}
            >
              <i className="fa fa-search" />
              Find
            </a>
          </li>
          {isSearchBoxVisible && (
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search..."
            onChange={handleSearchInputChange}
            value={searchInput}
          />
    
        </div>
      )}
          {/* <div
            id="searchBox"
            style={{ display: isSearchBoxVisible ? "flex" : "none" }}
            >
            <input
              type="text"
              id="searchInput"
              placeholder="Search..."
              onChange={handleSearchInputChange}
              value={searchInput}
            />
            <button id="sBtn" onClick={handleSearch}>
              <i className="fa fa-search" />
            </button>
            <div className="sr-main">
              {searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  {searchResults.map((product, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() =>
                        navigate(
                          `/category/${product.collection}/${product.id}`
                        )
                      }
                    >
                      {product.name} ({product.collection})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}
        </ul>
    

        <div className="sr-container"style={{ display: searchInput ? 'block' : 'none' }}>
        <div className="search-results-dropdown">
          {searchInput && searchResults.length === 0 ? (
            <div className="no-results-message">
              No Product Found.
            </div>
          ) : (
            searchResults.map((product, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => navigate(`/category/${product.collection}/${product.id}`)}
              >
                {product.name} ({product.collection})
              </div>
            ))
          )}
        </div>
      </div>

        </div>

       
      
      {/* nav3 end */}
      <section id="sidenav" style={{ width: sidenavWidth }}>
        <ul>
          <li>
            <a href="#">
              <i className="fa fa-home" />
              Home
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-user" />
              Boy
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-users" />
              Accessories
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-calendar-check-o" />
              Special Offers
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-search" />
              Find
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-anchor" />
              Accessories <i className="fa fa-caret-down" />
            </a>
            <ul>
              <li>
                <a href="#">
                  <i className="fa fa-clipboard" />
                  Earrings
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-circle-o" />
                  Pendants
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-gavel" />
                  Keychain
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <i
        className="fa fa-anchor"
        id="menubar"
        onClick={() =>
          setSidenavWidth(sidenavWidth === "0px" ? "250px" : "0px")
        }
      />
    </header>
  );
}

export default Header;
