import React, { useState, useRef, useEffect } from "react";
import Layout from "./Layout";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, push, set, remove, get } from "firebase/database";
import { onValue } from "firebase/database";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "../styling/homepage.css";
import { auth, database } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

import Header from "./Header"; // Import Header component
import Footer from "./Footer"; // Import Footer component
import { Helmet } from 'react-helmet';
function HomePage() {
  // In your product listing component

  const location = useLocation();
  const productContainerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showModifyDeleteModal, setShowModifyDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedProductDetails, setSelectedProductDetails] = useState({
    name: "",
    desc: "",
    photo: [],
    price: "",
  });
  const [showModifyFields, setShowModifyFields] = useState(false);
  const [uid, setUid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    desc: "",
    photo: [], 
    price: "",
  });
  useEffect(() => {
    // Create the Tawk.to script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://embed.tawk.to/6598b43a0ff6374032bd1729/1hje8015m";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    // Append the script to the document body
    document.body.appendChild(script);
  
    // Clean up by removing the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); 
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    // Firebase Realtime Database
    const database = getDatabase();
    const productsRef = ref(database, "products"); // Adjust this path to your database structure

    // Fetch products regardless of user authentication state
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const productList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setProducts(productList);
      } else {
        setProducts([]); // Set to an empty array if no products are found
      }
    });
  }, []);
  const storage = getStorage();
  const handleFileUpload = async (files) => {
    if (!files.length) return [];

    const uploadedUrls = [];

    for (const file of files) {
        const productId = Date.now().toString(); // Generate a unique ID for each product
        const storageLocation = storageRef(storage, `product-photos/${productId}/${file.name}`);
        
        try {
            await uploadBytes(storageLocation, file);
            const url = await getDownloadURL(storageLocation);
            uploadedUrls.push(url);
        } catch (error) {
            console.error("Error uploading file:", file.name, error);
        }
    }

    return uploadedUrls;
};

  useEffect(() => {
    if (location.state?.fromProductDetail) {
      // Scroll to the product that has the ID equal to location.state.fromProductDetail
      const productElement = productContainerRef.current.querySelector(
        `[data-product-id="${location.state.fromProductDetail}"]`
      );
      if (productElement) {
        window.scrollTo({
          top: productElement.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [location]);
  useEffect(() => {
    // Firebase Auth
    const auth = getAuth();

    // Listen for changes in user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, get their UID
        const userUid = user.uid;

        setUid(user.uid);
        console.log(user.uid);
        // Firebase Realtime Database
        const database = getDatabase();
        const roleRef = ref(database, `users/${userUid}/role`);
        const productsRef = ref(database, "products"); // Adjust this path to your database structure
        const userRef = ref(database, `users/${userUid}/name`); // Adjust the path to the name field in your database
        onValue(roleRef, (snapshot) => {
          const role = snapshot.val();
          setUserRole(role);
        });
        onValue(productsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert object to array
            const productList = Object.keys(data).map((key) => ({
              ...data[key],
              id: key,
            }));
            setProducts(productList);
          }
        });
      } else {
        // User is signed out, clear the user name
        // setUserName(null);
        setUid(null);
        setUserRole(null);
        // Perform any other relevant state updates
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe(); // Unsubscribe from the authentication listener
    };
  }, []);
  const handleProductSelection = async (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);

    if (productId) {
      const database = getDatabase();
      const productRef = ref(database, `products/${productId}`);
      onValue(productRef, (snapshot) => {
        const data = snapshot.val();
        setSelectedProductDetails(data || {});
      });
      setShowModifyFields(true);
    } else {
      setSelectedProductDetails({
        name: "",
        desc: "",
        photo: "",
        price: "",
      });
      setShowModifyFields(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId) return;
  
    try {
      const database = getDatabase();
      const productRef = ref(database, `products/${selectedProductId}`);
  
      // Retrieve the current product details
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const productData = snapshot.val();
  
        // If there are photo URLs, delete each photo from storage
        if (productData.photos && productData.photos.length > 0) {
          for (const photoURL of productData.photos) {
            const photoRef = storageRef(storage, photoURL);
            await deleteObject(photoRef).catch((error) =>
              console.error("Error deleting photo:", error)
            );
          }
        }
      }
      await remove(productRef);
  
      alert("Deleted");
  
      // Clear selected product details and close modal
      setSelectedProductDetails({ name: "", desc: "", photos: [], price: "" });
      setShowModifyFields(false);
      setSelectedProductId(null);
  
      // Show success message or refresh the product list
    } catch (error) {
      console.error("Error deleting product: ", error);
      // Handle error (e.g., show error message)
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = e.target.elements["productPhotos"].files;

    const photoURLs = await handleFileUpload(files);

    if (photoURLs.length === 0) {
        console.error("Photo upload failed.");
        return; // Exit if photo upload fails
    }

    const database = getDatabase();
    const newProductRef = push(ref(database, "products"));
    const newProductId = newProductRef.key;

    await set(newProductRef, {
        ...newProduct,
        id: newProductId,
        photos: photoURLs
    });

    // Reset form and state after successful submission
    setNewProduct({ name: "", desc: "", photos: [], price: "" });
    setShowModal(false);
};


  const handleSaveChanges = async () => {
    if (!selectedProductId) return;

    try {
      const database = getDatabase();
      const productRef = ref(database, `products/${selectedProductId}`);
      const fileInput = document.querySelector('[name="modifyProductPhoto"]');
      const file = fileInput.files[0];
      let updatedProductDetails = { ...selectedProductDetails };

      // If there's a file to upload and an existing photo, delete the old photo first
      if (file && updatedProductDetails.photo) {
        const oldPhotoRef = storageRef(storage, updatedProductDetails.photo);
        await deleteObject(oldPhotoRef).catch((error) =>
          console.error("Error deleting old photo:", error)
        );
      }

      // Upload the new photo and update the product details
      if (file) {
        const newPhotoURL = await handleFileUpload(file, selectedProductId);
        console.log(newPhotoURL);
        if (newPhotoURL) {
          updatedProductDetails.photo = newPhotoURL;
        }
      }

      // Update product details in the database
      await set(productRef, updatedProductDetails);

      setSuccessMessage("Product updated successfully.");
      setShowModifyFields(false);
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset the file input for future uploads
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error updating product: ", error);
      setSuccessMessage("Error updating product.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      spaceBetween: 30,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }, []);

  return (
    <div>
      <Helmet>
    
    <meta name="description" content="Discover unique and creative products at TheCreativeBud. Explore our latest collections of handcrafted items, perfect for adding a touch of creativity to your life." />
    <meta property="og:type" content="website" />
                <meta property="og:url" content="https://thecreativebud.in/" />
                <meta property="og:title" content="TheCreativeBud - Unique and Creative Products" />
                <meta property="og:description" content="Explore our unique collections of handcrafted items, perfect for adding creativity to your life. Discover the latest trends and exclusive products at TheCreativeBud." />

</Helmet>
      <div className="main-content-container">
        {" "}
        {/* Add this wrapper around your content */}
        <Header setUid={setUid} uid={uid} /> {/* Include Header at the top */}
        <section className="featured">
          <div className="featured-text">
            {/* <button> Click me</button>
             <h2>Our new design</h2> */}
          </div>
        </section>
        <section className="latest">
          <div className="product-intro">
            {userRole === "admin" && (
              <>
                <div className="admin-upload">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setShowModifyDeleteModal(false);
                    }}
                  >
                    Upload Product
                  </button>
                </div>
                <div className="admin-delete">
                  <button
                    onClick={() => {
                      setShowModifyDeleteModal(true);
                      setShowModal(false);
                    }}
                  >
                    Modify/Delete Product
                  </button>
                </div>
              </>
            )}
            <h1>
              New <span>Arrivals</span>
            </h1>
            <p>
              {" "}
              Discover the latest additions to our collection at TheCreativeBud. 
              Each item is carefully selected to ensure the highest quality and uniqueness. 
              From trendy items to must-have accessories, our New Arrivals section is constantly 
              updated with exciting products that cater to all tastes and styles. Don't miss out on the 
              opportunity to find your next favorite item, perfectly crafted to add that extra flair to your 
              wardrobe or lifestyle. Shop now and experience the blend of style, comfort, and innovation with every purchase.
            </p>
          </div>
          <div className="card-container">
            {products.map((product) => (
        <div className="card" key={product.id} onClick={() => navigate(`/category/products/${product.id}`)}>
 <div>
                {product.photos && product.photos.length > 0 ? (
                    <img src={product.photos[0]} alt={`Product ${product.name}`} />
                ) : (
                    <img src="./imgna.png" alt="No image available" />
                )}
            </div>
            <h1>{product.name}</h1>
            <p className="product-description">{product.desc}</p>
            <p className="priceHP">{product.price} INR</p>
        </div>
    ))}


            {showModal && (
              <div className="modal-two">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                  />
                  <textarea
                    name="desc"
                    value={newProduct.desc}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    name="productPhotos"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <br />
                  <br />

                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />
                  <button type="submit">Add Product</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
            {showModifyDeleteModal && (
              <div className="modal-md">
                <form>
                  <select
                    className="form-select"
                    onChange={handleProductSelection}
                  >
                    <option value="">Select a Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {/* Add more form elements for modification */}
                  {showModifyFields && selectedProductDetails && (
                    <div className="product-modify-fields">
                      <div className="product">
                        <input
                          type="text"
                          value={selectedProductDetails.name}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              name: e.target.value,
                            })
                          }
                          placeholder="Product Name"
                        />
                        <textarea
                          value={selectedProductDetails.desc}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              desc: e.target.value,
                            })
                          }
                          placeholder="Description"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          name="modifyProductPhoto"
                        />
                        <input
                          type="number"
                          value={selectedProductDetails.price}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              price: e.target.value,
                            })
                          }
                          placeholder="Price"
                        />

                        <button type="button" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}

                  <button type="button" onClick={handleDeleteProduct}>
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModifyDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
        <section className="trends">
          <div className="product-intro">
            <h1>
              Top <span>Trends</span>
            </h1>
            <p>
            Stay ahead of the curve with our Top Trends collection at TheCreativeBud. 
            We've curated the most sought-after items of the season, blending cutting-edge style with unparalleled quality. 
            From the latest in fashion to innovative lifestyle products, our selection is 
            geared towards those who appreciate the finer things in life. Whether you're 
            ooking to make a statement or find something uniquely you, our Top Trends showcase 
            the best in contemporary design and functionality. Elevate your experience with pieces 
            that are as distinctive as they are desirable, all just a click away.
            </p>
          </div>
          <div className="content-wrapper">
            {" "}
            {/* Wrapper to control Swiper width */}
            <div className="swiper-container mySwiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-1.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-2.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-3.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-4.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-5.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-6.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-7.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-8.jpg"
                    alt="Description of "
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://swiperjs.com/demos/images/nature-9.jpg"
                    alt="Description of "
                  />
                </div>
              </div>
              <div className="swiper-pagination" />
            </div>
          </div>
        </section>
        <Footer /> {/* Include Footer at the bottom */}
      </div>
    </div>
  );
}

export default HomePage;
