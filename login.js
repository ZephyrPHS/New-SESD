var firebaseConfig = {
  // Firebase configuration object
  // ...
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

sessionStorage.setItem("token", "");

document.addEventListener('DOMContentLoaded', function() {
  // Get the form element
  const loginForm = document.querySelector('.the-form');

  // Add event listener for form submission
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the values from the input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform validation
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter both username and password.');
    } else {
      // Perform login logic
      var dataRef = database.ref('users');
      dataRef.once('value', function(snapshot) {
        let authenticatedUser = null;

        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();

          if (childData.username === username && childData.password === password) {
            authenticatedUser = childData;
            return true; // Stop iterating through users
          }
        });

        if (authenticatedUser) {
          const token = generateToken(authenticatedUser.displayname, authenticatedUser.email);
          sessionStorage.setItem("token", token);
          window.location.href = 'https://zephyrphs.github.io/New-SESD/student_database';
        } else {
          alert('Invalid username or password. Please try again.');
        }
      });
    }
  });
});

// Function to generate a JWT token
function generateToken(displayname, email) {
  // Add your JWT token generation logic here
  // This is just a placeholder example
  const token = displayname + ',' + email;
  return token;
}
