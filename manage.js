if (sessionStorage.getItem("token") === "adminpassword") {
  var firebaseConfig = {
    // Your Firebase config here
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
    let users2D = [];
    users.forEach((user) => {
      users2D.push([
        user.username,
        user.email,
        user.password,
        user.confirm
      ]);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <form id="confirm">
            <button onclick="confirmUser(${id})">Confirm</button>
          </form>
          <form id="deny">
            <button onclick="denyUser(${id})">Deny</button>
          </form>
        </td>
        <td>${user.username}</td>
        <td>${user.email}</td>
      `;
      userList.appendChild(row);
      id++;
    });
    exportToCsv(users2D);
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

  // Function to export data to CSV format and save it to Firebase
  function exportToCsv(rows) {
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }
    database.ref("users").set(csvFile);
  }
} else {
  alert("Your session has expired. Please log in again.");
}
