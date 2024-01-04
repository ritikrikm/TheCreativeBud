
import React from 'react';
import '../styling/footer.css'
function Footer() {
  return (
    
    <footer>
    <div>
      <h1>Prerna <span>Sharma</span></h1>
      <p>One stop destination for all your creative needs</p>
    </div>
    <div clßassName="black-link" >
    <a  href="https://www.instagram.com/thecreativebud/" rel="noopener noreferrer"  target="_blank">
      <i className="fa fa-facebook" />
        </a>
        <a href="https://www.instagram.com/thecreativebud/" rel="noopener noreferrer" target="_blank">
        <i className="fa fa-instagram" />
        </a>
        <a href="https://www.instagram.com/thecreativebud/" rel="noopener noreferrer" target="_blank">
        <i className="fa fa-whatsapp" />
        </a>
        <a href="https://www.instagram.com/thecreativebud/" rel="noopener noreferrer"   target="_blank">
        <i className="fa fa-behance" />
        </a>
        <p id='designer' onClick={() => window.open('https://www.instagram.com/rithikrik/', '_blank')}>
  <br />Design by Ritik Mehta
</p>
    </div>
    <div>
      <p>&copy; 2024: Copyright All rights reserverd</p>
    </div>
  </footer>
  );
}

export default Footer;
