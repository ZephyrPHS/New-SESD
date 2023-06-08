var firebaseConfig = {
  // Your Firebase configuration
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Function to check if a user already exists with the same email or username
function isDuplicateUser(users, email, username) {
  return users.some((user) => user.email === email || user.username === username);
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const signUpForm = document.querySelector('.the-form');

  // Add event listener for form submission
  signUpForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Perform validation
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || email === "" || password === "") {
      alert("Please enter username, email, and password.");
      return;
    }

    // Retrieve existing users from the database
    var dataRef = database.ref('users');

    dataRef.once('value', function(snapshot) {
      const existingUsers = snapshot.val() || {};

      // Check for duplicate email or username
      if (isDuplicateUser(Object.values(existingUsers), email, username)) {
        alert("A user with the same email or username already exists.");
        return;
      }

      // Create a new user object
      const newUser = {
        username: username,
        email: email,
        password: password,
        confirm: 0
      };

      // Generate a unique key for the new user
      const userKey = dataRef.push().key;

      // Add the new user to the existing users in the database
      dataRef.child(userKey).set(newUser);

      // Clear the form inputs
      usernameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";

      alert(
        "Account creation request has been sent to the RTSE and is waiting approval. You may close this page."
      ); // send request to RTSE
    });
  });
});
