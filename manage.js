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

      let userObj = {
        confirm: childData.confirm,
        displayname: childData.displayname,
        email: childData.email,
        password: childData.password,
        username: childData.username
      };

      users.push(userObj);
    });
    renderUsers();
  });

  // Function to render the user list
  function renderUsers() {
    const incomingUserTable = document.getElementById("incoming-user-list");
    incomingUserTable.innerHTML = "";

    const currentUserTable = document.getElementById("current-user-list");
    currentUserTable.innerHTML = "";

    users.forEach((user, userKey) => {
      const row = document.createElement("tr");
      if (user.confirm === 0) {
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
        incomingUserTable.appendChild(row);
      } else {
        row.innerHTML = `
          <td>
            <form id="delete">
              <button onclick="denyUser('${userKey}')">Delete</button>
            </form>
          </td>
          <td>${user.username}</td>
          <td>${user.displayname}</td>
          <td>${user.email}</td>
        `;
        currentUserTable.appendChild(row);
      }
    });
  }

  // Function to confirm a user
  function confirmUser(id) {
    event.preventDefault();
    if (id >= 0 && id < users.length) {
      users[id].confirm = 1;
      database.ref("users").set(users);
      renderUsers();
    }
  }

  // Function to deny a user
  function denyUser(id) {
    event.preventDefault();
    if (id >= 0 && id < users.length) {
      users.splice(id, 1);
      database.ref("users").set(users);
      renderUsers();
    }
  }
} else {
  alert("Your session has expired. Please log in again.");
}
