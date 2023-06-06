var urlParams = new URLSearchParams(window.location.search);
var studentId = urlParams.get('id');
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
var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];
var dataRef = database.ref('students');
var studentRef = dataRef.child(studentId);
var goalsRef = studentRef.child('goals');
goalsRef.on('value', function(snapshot) {
  tableRef.innerHTML = '';
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    var row = tableRef.insertRow();
    var numCell = row.insertCell();
    numCell.textContent = childKey;
    var nameCell = row.insertCell();
    nameCell.textContent = childData.name;
    var categoryCell = row.insertCell();
    categoryCell.textContent = childData.category;
    var progressCell = row.insertCell();
    progressCell.textContent = childData.progress;
    var notesCell = row.insertCell();
    notesCell.textContent = childData.notes;
    var actionsCell = row.insertCell();
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      showEditForm(childKey,childData);
    });
    actionsCell.appendChild(editButton);
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        database.ref('students/'+studentId+'/'+'goals/' + childKey).remove()
    });
    actionsCell.appendChild(deleteButton);
    var viewButton = document.createElement('button');
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', function() {
      window.location.href = 'obj_database.html?id=' + studentId+'&goal='+childKey;
    });
    actionsCell.appendChild(viewButton);
  });
});
document.getElementById('add-student-button').addEventListener('click', function() {
    document.getElementById('add-form').style.display = 'block';
    
});
document.getElementById('back-goal').addEventListener('click', function() {
  window.location.href = 'student_database.html';
  
});
document.getElementById('add-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var mynum = document.getElementById('add-num').value;
    var myname = document.getElementById('add-name').value;
    var mycategory = document.getElementById('add-category').value;
    var myprogress = document.getElementById('add-progress').value;
    var mynotes = document.getElementById('add-notes').value;
    var newgoal = {
        num: mynum,
        name: myname,
        category: mycategory,
        progress: myprogress,
        notes: mynotes
    };
    database.ref('students/'+studentId+'/'+'goals/').child(mynum).set(newgoal);
    document.getElementById('add-form').reset();
    document.getElementById('add-form').style.display = 'none';
});
function showEditForm(childKey,goalData) {
    document.getElementById('edit-num').value = childKey;
    document.getElementById('edit-name').value = goalData.name;
    document.getElementById('edit-category').value = goalData.category;
    document.getElementById('edit-progress').value = goalData.progress;
    document.getElementById('edit-notes').value = goalData.notes;
    document.getElementById('edit-form').style.display = 'block';
}

function cancelEdit() {
  document.getElementById('edit-form').style.display = 'none';
}
function cancelAdd() {
  document.getElementById('add-form').style.display = 'none';
}

document.getElementById('edit-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var goalsKey = document.getElementById('edit-num').value;
  var newName = document.getElementById('edit-name').value;
  var newCategory = document.getElementById('edit-category').value;
  var newProgress = document.getElementById('edit-progress').value;
  var newNotes = document.getElementById('edit-notes').value;

  database.ref('students/'+studentId+'/'+'goals/' + goalsKey).update({
    name: newName,
    category: newCategory,
    progress: newProgress,
    notes: newNotes,
  }, function(error) {
    if (error) {
      console.log('Error updating data:', error);
    } else {
      console.log('Data updated successfully');
      document.getElementById('edit-form').style.display = 'none';
    }
  });
});