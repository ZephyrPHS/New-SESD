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
var userDataRef = database.ref('users');
var userDisplayName = "";
var login = false;
// check if user exists in database
userDataRef.once('value', function(userSnapshot) {
  let authenticatedUser = null;
  userSnapshot.forEach(function(userChildSnapshot) {
    var userChildData = userChildSnapshot.val();
    if (userChildData.displayname === sessionStorage.getItem("token") && userChildData.confirm == 1) {
      authenticatedUser = userChildData;
      return true; // Stop iterating through users
    }
  });
  if (authenticatedUser) {
    userDisplayName = authenticatedUser.displayname;
    login = true;
  } else {
    alert('Invalid username or password. Please try again.');
  }
});
// make sure user is logged in
if(login) {
  var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  var dataRef = database.ref('students');
  dataRef.on('value', function(snapshot) {
    tableRef.innerHTML = '';
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var row = tableRef.insertRow();
      var firstnameCell = row.insertCell();
      firstnameCell.textContent = childData.firstName;
      var lastnameCell = row.insertCell();
      lastnameCell.textContent = childData.lastName;
      var gradeCell = row.insertCell();
      gradeCell.textContent = childData.grade;
      var idCell = row.insertCell();
      idCell.textContent = childData.id;
      var disabilityCell = row.insertCell();
      disabilityCell.textContent = childData.disability;
      var managerCell = row.insertCell();
      managerCell.textContent = childData.manager;
      var dateCell = row.insertCell();
      dateCell.textContent = childData.date;
      var actionsCell = row.insertCell();
      var editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', function() {
        showEditForm(childKey, childData);
      });
      actionsCell.appendChild(editButton);
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
          database.ref('students/' + childKey).remove()
      });
      actionsCell.appendChild(deleteButton);
      var viewButton = document.createElement('button');
      viewButton.textContent = 'Goals';

      viewButton.addEventListener('click', function() {
        window.location.href = 'goals_database.html?id=' + childKey;
      });
      actionsCell.appendChild(viewButton);
      var exportButton = document.createElement('button');
      exportButton.textContent = 'Export Student';
      exportButton.addEventListener('click', function() {
        exportStudent(childData);
      });
      actionsCell.append("\n");
      actionsCell.appendChild(exportButton);

    });
  });
  document.getElementById('add-student-button').addEventListener('click', function() {
      document.getElementById('add-form').style.display = 'block';

  });
  document.getElementById('export-csv').addEventListener('click', function() {
    exportData();

  });
  document.getElementById('search-button').addEventListener('click', function() {
    searchStudent();
  });
  document.getElementById('add-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var myfirst = document.getElementById('add-first').value;
      var mylast = document.getElementById('add-last').value;
      var mygrade = document.getElementById('add-grade').value;
      var myid = document.getElementById('add-identity').value;
      var mydisability = document.getElementById('add-disability').value;
      var mymanager = document.getElementById('add-manager').value;
      var mydate = document.getElementById('add-date').value;
      var newstudent = {
          firstName: myfirst,
          lastName: mylast,
          grade: mygrade,
          id: myid,
          disability: mydisability,
          manager: mymanager,
          date: mydate
      };
      database.ref("students").child(myid).set(newstudent);
      document.getElementById('add-form').reset();
      document.getElementById('add-form').style.display = 'none';
  });
  function showEditForm(studentId, studentData) {
    document.getElementById('edit-id').value = studentId;
    document.getElementById('edit-first').value = studentData.firstName;
    document.getElementById('edit-last').value = studentData.lastName;
    document.getElementById('edit-grade').value = studentData.grade;
    document.getElementById('edit-id').value = studentData.id;
    document.getElementById('edit-disability').value = studentData.disability;
    document.getElementById('edit-manager').value = studentData.manager;
    document.getElementById('edit-date').value = studentData.date;
    document.getElementById('edit-form').style.display = 'block';
  }

  function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
  }
  function cancelAdd() {
    document.getElementById('add-form').style.display = 'none';
  }
  function searchStudent(){
    document.getElementById('data-table').style.display = 'none';
    document.getElementById('search-table').style.display = 'table';
    var searchTableRef = document.getElementById('search-table').getElementsByTagName('tbody')[0];
    var searchRef = document.getElementById('search-bar').value;
    dataRef.on('value', function(snapshot) {
      searchTableRef.innerHTML = '';
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (searchRef == childData.firstName || searchRef==childData.lastName || searchRef == childData.grade || searchRef == childData.id || searchRef == childData.disability || searchRef == childData.manager || searchRef == childData.date){
          var row = searchTableRef.insertRow();
          var firstnameCell = row.insertCell();
          firstnameCell.textContent = childData.firstName;
          var lastnameCell = row.insertCell();
          lastnameCell.textContent = childData.lastName;
          var gradeCell = row.insertCell();
          gradeCell.textContent = childData.grade;
          var idCell = row.insertCell();
          idCell.textContent = childData.id;
          var disabilityCell = row.insertCell();
          disabilityCell.textContent = childData.disability;
          var managerCell = row.insertCell();
          managerCell.textContent = childData.manager;
          var dateCell = row.insertCell();
          dateCell.textContent = childData.date;
          var actionsCell = row.insertCell();
          var editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', function() {
            showEditForm(childKey, childData);
          });
          actionsCell.appendChild(editButton);
          var deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', function() {
              database.ref('students/' + childKey).remove()
          });
          actionsCell.appendChild(deleteButton);
          var viewButton = document.createElement('button');
          viewButton.textContent = 'View Goals';

          viewButton.addEventListener('click', function() {
            window.location.href = 'goals_database.html?id=' + childKey;
          });
          actionsCell.appendChild(viewButton);
        }
      });
    });  
  }
  function clearSearch(){
    document.getElementById('data-table').style.display = 'table';
    document.getElementById('search-table').style.display = 'none';
  }
  document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var studentId = document.getElementById('edit-id').value;
    var newFirst = document.getElementById('edit-first').value;
    var newLast = document.getElementById('edit-last').value;
    var newGrade = document.getElementById('edit-grade').value;
    var newId = document.getElementById('edit-id').value;
    var newDisability = document.getElementById('edit-disability').value;
    var newManager = document.getElementById('edit-manager').value;
    var newDate = document.getElementById('edit-date').value;

    database.ref('students/' + studentId).update({
      firstName: newFirst,
      lastName: newLast,
      grade: newGrade,
      id: newId,
      disability: newDisability,
      manager: newManager,
      date: newDate
    }, function(error) {
      if (error) {
        console.log('Error updating data:', error);
      } else {
        console.log('Data updated successfully');
        document.getElementById('edit-form').style.display = 'none';
      }
    });
  });
  function exportData() {
    dataRef.once('value', function(snapshot) {
      var csvContent = "data:text/csv;charset=utf-8,";
      var headerRow = "First,Last,Grade,ID,Disability,Manager,Date\r\n";
      csvContent += headerRow;
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var csvRow = childData.firstName+","+childData.lastName + "," + childData.grade + "," + childData.id + "," + childData.disability + "," + childData.manager + "," + childData.date;
        csvContent += csvRow + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    });
  }

  function exportStudent(childData){
    var csvContent = "data:text/csv;charset=utf-8,";
    var csvRow = childData.firstName + ","+ childData.lastName + "," + childData.grade + "," + childData.id + "," + childData.disability + "," + childData.manager + "," + childData.date;
    csvContent += csvRow + "\r\n";
    goalsRef = database.ref('students/' + childData.id + '/goals');
    goalsRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childGoal = childSnapshot.val();
        var csvRow = "Goal: " + "," + childGoal.name + "," + childGoal.category + "," + childGoal.progress + "," + childGoal.notes;  
        csvContent += csvRow + "\r\n";
        specificObjRef = database.ref('students/' + childData.id + '/goals/' + childGoal.num + '/objectives');
        specificObjRef.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childObj = childSnapshot.val();
            var csvRow = "" + "," + "Objective: " + "," + childObj.name + "," + childObj.progress + "," + childObj.notes;  
            csvContent += csvRow + "\r\n";
          });
        });
      });
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", childData.firstName+"_"+childData.lastName + ".csv");
    document.body.appendChild(link);
    link.click();
  }
}
