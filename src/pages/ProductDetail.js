import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import Header from './Header';
import Footer from './Footer';
import '../styling/productdetail.css';
import { useNavigate } from 'react-router-dom';
import '../styling/cart.css'
import { CartContext } from './CartProvider';
import { getAuth, onAuthStateChanged } from "firebase/auth";
function ProductDetail() {
  const { categoryType, productId } = useParams();
  const { cartItems, addToCart } = useContext(CartContext);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
  
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set isLoggedIn to true if the user is logged in
    });
  }, []);
  useEffect(() => {
    const database = getDatabase();
    const productRef = ref(database, `${categoryType}/${productId}`);

    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data);
        setProduct(data);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    }, (error) => {
      setError('Error fetching product data');
      setLoading(false);
    });
  }, [categoryType, productId]);

  const handleAddToCart = () => {
   
    const isProductInCart = cartItems.some(item => item.id === product.id);
    if (isProductInCart) {
      // Show confirmation dialog
      setShowConfirmDialog(true);
    } else {
      // Directly add to cart if not already in cart
      addToCart(product);
    }
  };
  const confirmAddToCart = () => {
    if (window.confirm("This item is already in your cart. Do you want to add it again?")) {
      addToCart(product);
    }
    setShowConfirmDialog(false);
  };
  useEffect(() => {
    if (showConfirmDialog) {
      confirmAddToCart();
    }
  }, [showConfirmDialog]);

  const handleBack = () => {
    navigate(-1, { state: { fromProductDetail: productId } });
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDivClick = () => {
    if (processing) return;
    if (!isLoggedIn) {
      // If user is not logged in, display a message
      alert("Please Login First");
      return;
    }

    setReverting(false);
    setProcessing(true);
    handleAddToCart();
    const layoutTrigger = document.querySelector('.demo').offsetTop;
    const demo = document.querySelector('.demo');
    demo.classList.add('s--processing');

    const endListener = document.createElement('div');
    endListener.classList.add('demo-transitionend-listener');
    demo.appendChild(endListener);

    endListener.addEventListener('transitionend', () => {
      if (reverting) return;
      setReverting(true);
      demo.classList.add('s--reverting');
     
    });

    setTimeout(() => {
      demo.removeChild(endListener);
      demo.classList.remove('s--processing', 's--reverting');
      setProcessing(false);
    }, 10000);
  };
  console.log(product.photo);
  return (
    <>
      <div className="main-content-container">
        <Header />
        <main className="product-detail-container">
          <button className="back-button" onClick={handleBack}>← Back to products</button>
          <div className="product-card">
          {product.photo && product.photo !== 'null' ? (
            <img src={product.photo} alt={product.name} />
          ) : (
            <img src="/imgna.png" alt="Default" />
          )}
        </div>
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-descriptionDetail">{product.desc}</p>
            <p className="price">{product.price} INR</p>
            {/* <button className="add-to-cart-btn">Add to Cart</button> */}
            <div className="demo" onClick={handleDivClick}>
      <div className="demo__drone-cont demo__drone-cont--takeoff">
        <div className="demo__drone-cont demo__drone-cont--shift-x">
          <div className="demo__drone-cont demo__drone-cont--landing">
            <svg viewBox="0 0 136 112" className="demo__drone">
            <path class="demo__drone-arm" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                  <path class="demo__drone-arm demo__drone-arm--2" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                  <path class="demo__drone-yellow" d="M28,36 l20,0 a20,9 0,0,1 40,0 l20,0 l0,8 l-10,0 c-10,0 -15,0 -23,10 l-14,0 c-10,-10 -15,-10 -23,-10 l-10,0z" />
                  <path class="demo__drone-green" d="M16,12 a10,10 0,0,1 20,0 l-10,50z" />
                  <path class="demo__drone-green" d="M100,12 a10,10 0,0,1 20,0 l-10,50z" />
                  <path class="demo__drone-yellow" d="M9,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
                  <path class="demo__drone-yellow" d="M93,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="demo__circle" >
        <div className="demo__circle-inner">
          <svg viewBox="0 0 16 20" className="demo__circle-package">
            <path d="M0,0 16,0 13,20 3,20z" />
          </svg>
          <div className="demo__circle-grabbers"></div>
        </div>
        <svg viewBox="0 0 40 40" className="demo__circle-progress">
          <path className="demo__circle-progress-line" d="M20,0 a20,20 0 0,1 0,40 a20,20 0 0,1 0,-40" />
          <path className="demo__circle-progress-checkmark" d="M14,19 19,24 29,14" />
        </svg>
      </div>
      <div className="demo__text-fields">
        <div className="demo__text demo__text--step-0" style={{ color: 'black' }}>Add to Cart</div>
        <div className="demo__text demo__text--step-1">
          Processing
          <span className="demo__text-dots"><span>.</span></span>
        </div>
        <div className="demo__text demo__text--step-2">
          Delivering
          <span className="demo__text-dots"><span>.</span></span>
        </div>
        <div className="demo__text demo__text--step-3">It's on the way</div>
        <div className="demo__text demo__text--step-4">Added in Cart</div>
      </div>
      <div className="demo__revert-line"></div>
      
     
    </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default ProductDetail;
