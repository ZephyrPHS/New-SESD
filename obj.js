var urlParams = new URLSearchParams(window.location.search);
var studentId = urlParams.get('id');
var goalNo = urlParams.get('goal');
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
var specificGoalRef = goalsRef.child(goalNo);
var objRef = specificGoalRef.child('objectives');
objRef.on('value', function(snapshot) {
  tableRef.innerHTML = '';
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    var row = tableRef.insertRow();
    var numCell = row.insertCell();
    numCell.textContent = childKey;
    var nameCell = row.insertCell();
    nameCell.textContent = childData.name;
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
        database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+childKey).remove()
    });
    actionsCell.appendChild(deleteButton);
  });
});
document.getElementById('add-student-button').addEventListener('click', function() {
    document.getElementById('add-form').style.display = 'block';
    
});
document.getElementById('add-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var mynum = document.getElementById('add-num').value;
    var myname = document.getElementById('add-name').value;
    var myprogress = document.getElementById('add-progress').value;
    var mynotes = document.getElementById('add-notes').value;
    var newgoal = {
        num: mynum,
        name: myname,
        progress: myprogress,
        notes: mynotes
    };
    database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives').child(mynum).set(newgoal);
    document.getElementById('add-form').reset();
    document.getElementById('add-form').style.display = 'none';
});
function showEditForm(childKey,objData) {
    document.getElementById('edit-num').value = childKey;
    document.getElementById('edit-name').value = objData.name;
    document.getElementById('edit-progress').value = objData.progress;
    document.getElementById('edit-notes').value = objData.notes;
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

  var objKey = document.getElementById('edit-num').value;
  var newName = document.getElementById('edit-name').value;
  var newProgress = document.getElementById('edit-progress').value;
  var newNotes = document.getElementById('edit-notes').value;

  database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+objKey).update({
    name: newName,
    progress: newProgress,
    notes: newNotes,
  }, function(error) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Update successful');
      document.getElementById('edit-form').style.display = 'none';
    }
  });
});