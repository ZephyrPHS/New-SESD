var urlParams = new URLSearchParams(window.location.search);
var studentId = urlParams.get('id');
var goalNo = urlParams.get('goal');
var objKey;
var objData;
const d = new Date();
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
    var targetCell = row.insertCell();
    targetCell.textContent = childData.target;
    var currentCell = row.insertCell();
    currentCell.textContent = childData.currentNum;
    var notesCell = row.insertCell();
    notesCell.textContent = childData.notes;
    var actionsCell = row.insertCell();
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      showEditForm(childKey,childData);
      objKey = childKey;
      objData = childData;
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
document.getElementById('back-obj').addEventListener('click', function() {
  window.location.href = 'goals_database.html?id=' + studentId;
  
});
document.getElementById('add-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var mynum = document.getElementById('add-num').value;
    var myname = document.getElementById('add-name').value;
    var mycurrent = document.getElementById('add-current').value;
    var mytarget = document.getElementById('add-target').value;
    var mynotes = document.getElementById('add-notes').value;
    var newgoal = {
        num: mynum,
        name: myname,
        currentNum:mycurrent,
        target:mytarget,
        notes: mynotes,
        progress:"Not Started"
    };
    database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/').child(mynum).set(newgoal);
    if (mycurrent >= mytarget){
      database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+mynum).update({
        progress: "Complete"
      });
    }
    else if(mycurrent>0){
      database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+mynum).update({
        progress: "In Progress"
      });
    }
    document.getElementById('add-form').reset();
    document.getElementById('add-form').style.display = 'none';
});
function showEditForm(childKey,objData) {
    document.getElementById('edit-name').value = objData.name;
    document.getElementById('edit-current').value = objData.currentNum;
    document.getElementById('edit-target').value = objData.target;
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
  event.preventDefault()
  var newName = document.getElementById('edit-name').value;
  var newCurrent = document.getElementById('edit-current').value;
  var newTarget = document.getElementById('edit-target').value;
  var newNotes = document.getElementById('edit-notes').value;
  if(newCurrent != objData.currentNum){
    newNotes += "\n" + (d.getMonth()+1)+"-"+(d.getDate())+"-"+d.getFullYear()+" Updated current from " + objData.currentNum + " to " + newCurrent;
  }
  if(newTarget != objData.target){
    newNotes += "\n" + (d.getMonth()+1)+"-"+(d.getDate())+"-"+d.getFullYear()+" Updated target from " + objData.target + " to " + newTarget;
  }
  database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+objKey).update({
    name: newName,
    currentNum:newCurrent,
    target:newTarget,
    notes: newNotes
  });
  if (newCurrent >= newTarget){
    database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+objKey).update({
      progress: "Complete"
    });
  }
  else if(newCurrent>0){
    database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+objKey).update({
      progress: "In Progress"
    });
  }
  if(newCurrent==0){
    database.ref('students/'+studentId+'/'+'goals/' + goalNo +'/'+'objectives/'+objKey).update({
      progress: "Not Started"
    });
  }
    document.getElementById('edit-form').style.display = 'none';
});
function exportData() {
  objRef.once('value', function(snapshot) {
    var csvContent = "data:text/csv;charset=utf-8,";
    var headerRow = "Name,Progress,Target, Current, Notes\r\n";
    csvContent += headerRow;
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      var csvRow = childData.name + "," + childData.progress + "," + childData.target + "," + childData.currentNum + "," + childData.notes;
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
var details = document.getElementById("details");
details.innerHTML = "ID #: "+ studentId+ " "+ "Goal #: "+ goalNo;
