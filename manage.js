if (sessionStorage.getItem("token") === "adminpassword") {
  var firebaseConfig = {
    apiKey: "AIzaSyDaGflOJidMjEghcK9xpqYBH6YI-nOSuvw",
    authDomain: "zephyr-studata.firebaseapp.com",
    databaseURL: "https://zephyr-studata-default-rtdb.firebaseio.com",
    projectId: "zephyr-studata",
    storageBucket: "zephyr-studata.appspot.com",
    messagingSenderId: "236682966409",
    appId: "1:236682966409:web:96428f11dff8fa4f751d58",
    measurementId: "G-NEPJNZ2VC2"
  };
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  // Session user data
  let users = [];

  var dataRef = database.ref('users');
  dataRef.on('value', function(snapshot) {
    users = []; // Clear existing user data
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();

      // Check if data exists in Firebase
      // If data exists, retrieve and parse it
      let data = childData;
      let userObj = {};
      Object.keys(data).forEach(key => {
        let userData = data[key];
        userObj = {
          confirm: userData.confirm,
          email: userData.email,
          password: userData.password,
          username: userData.username
        };
        users.push(userObj);
      });
    });
    renderUsers();
  });

  // Function to render the user list
  function renderUsers() {
  const userList = document.getElementById("incoming-user-list");
  userList.innerHTML = "";
  let id = 0;
  let updatedUsers = {};

  users.forEach((user) => {
    const userKey = `user${id}`; // Generate a unique user key
    const userData = {
      confirm: user.confirm,
      email: user.email,
      displayname: user.displayname,
      password: user.password,
      username: user.username
    };

    updatedUsers[userKey] = userData;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <form id="confirm">
          <button onclick="confirmUser('${userKey}')">Confirm</button>
        </form>
        <form id="deny">
          <button onclick="denyUser('${userKey}')">Deny</button>
        </form>
      </td>
      <td>${user.username}</td>
      <td>${user.displayname}</td>
      <td>${user.email}</td>
    `;
    userList.appendChild(row);
    id++;
  });

  database.ref("users").set(updatedUsers);
}

  // Function to confirm a user
  function confirmUser(id) {
    event.preventDefault();
    if (id >= 0) {
      users[id].confirm = 1;
      renderUsers();
    }
  }

  // Function to deny a user
  function denyUser(id) {
    event.preventDefault();
    if (id >= 0) {
      users.splice(id, 1);
      renderUsers();
    }
  }
  
} else {
  alert("Your session has expired. Please log in again.");
}
