var searchBtn = document.getElementById('sBtn')
var find = document.getElementById('findAnchor')
var modal = document.getElementById("loginModal");
var loginBtn = document.getElementById("loginLink");
var registerBtn = document.getElementById("registerLink");
var closeBtn = document.getElementsByClassName("close")[0];
var leftPanel = document.querySelector(".left-panel");
var rightPanel = document.querySelector(".right-panel");
var signUpButton = document.getElementById("signUpButton");
var detail = document.getElementById("det");


var rightPanelItems = document.querySelector('.panel.right-panel .items');
loginBtn.onclick = function() {
  modal.style.display = "block";
  leftPanel.classList.remove("move-left");
  rightPanel.classList.remove("move-right");
}

find.addEventListener('click',function(){

  if(document.getElementById('searchBox').style.display === 'flex'){
    document.getElementById('searchBox').style.display='none';

  }
  else{
    document.getElementById('searchBox').style.display='flex'

  }
  

});
registerBtn.onclick = function() {
  modal.style.display = "block";
  leftPanel.classList.add("move-left");
  rightPanel.classList.add("move-right");
}

closeBtn.onclick = function() {
  modal.style.display = "none";
}

signUpButton.onclick = function() {
  leftPanel.classList.toggle("move-left");
  rightPanel.classList.toggle("move-right");
}
document.getElementById('signUpButton').addEventListener('click', function() {
    var registerForm = document.querySelector('.register-form');
   

    // Check if the register form is already visible
    if (registerForm.style.display === "none" || !registerForm.style.display) {
        registerForm.style.display = 'block'; // Show the register form
        // We need to force a reflow/repaint to make the transition work after changing display
        void registerForm.offsetWidth;
      
     
        
        // Then add the 'in-place' class to start the animation
        registerForm.classList.add('full-space');
        signUpButton.textContent = 'Click to Sign-in';
        detail.textContent = 'Already have an account here?'
       
        leftPanel.style.display = 'none'
        
    } else {
        // Remove the 'in-place' class to start the animation out
        registerForm.classList.remove('full-space');
        signUpButton.textContent = 'SIGN UP';
        detail.textContent = 'Enter your personal details and start journey with us'
        

        
        rightPanelItems.style.animation = 'none';
         void rightPanelItems.offsetWidth; // Force reflow
         rightPanelItems.style.animation = 'slideInFromTop 0.5s ease-in-out';
         

        // Use a timeout to set display to 'none' after the animation ends
        setTimeout(() => {
            registerForm.style.display = 'none';
        }, 500); // Timeout duration should match the CSS transition time
        leftPanel.style.display = 'flex'
    }
});

  
  // Close the modal when the '×' is clicked
  document.querySelector('.close').addEventListener('click', function() {
    document.querySelector('.modal').style.display = 'none';
  });
  
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}


