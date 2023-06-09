var urlParams = new URLSearchParams(window.location.search);
var studentId = urlParams.get('id');
var goalsKey;
var goalRefData;
var timelineData;
const d = new Date();
var items = document.getElementsByClassName("timeline-item");
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
var timelineCSV = goalsRef.child('timeline');
goalsRef.on('value', function(snapshot) {
  tableRef.innerHTML = '';
  var newRef = snapshot.val();
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    if (childKey != "timeline"){
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
        goalRefData=childData;
        goalsKey = childKey;
      });
      actionsCell.appendChild(editButton);
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
          database.ref('students/'+studentId+'/'+'goals/' + childKey).remove()
          var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
          var csvRow = date+","+childData.name+","+"Deleted";
          var newTimeline = timelineData + csvRow + "\r\n";
          database.ref('students/'+studentId+'/'+'goals/timeline').set(newTimeline);
      });
      actionsCell.appendChild(deleteButton);
      var viewButton = document.createElement('button');
      viewButton.textContent = 'Objectives';
      viewButton.addEventListener('click', function() {
        window.location.href = 'obj_database.html?id=' + studentId+'&goal='+childKey;
      });
      actionsCell.appendChild(viewButton);
      var addNoteButton = document.createElement('button');
      addNoteButton.textContent = 'Add Note';
      addNoteButton.addEventListener('click', function() {
        goalsKey = childKey;
        goalRefData = childData;
        addNote();
      });
      actionsCell.appendChild(addNoteButton);
    }
    else{
      timelineData = childData;
    }
  });
});
document.getElementById('add-student-button').addEventListener('click', function() {
    document.getElementById('add-form').style.display = 'block';
    
});
document.getElementById('back-goal').addEventListener('click', function() {
  window.location.href = 'https://zephyrphs.github.io/New-SESD/student_database';
  
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
    if(myprogress == "Achieved"){
      database.ref('students/'+studentId+'/'+'goals/' + mynum).update({
        completion:(d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear()
      })
    }
    var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    var csvRow = date+","+myname+","+"Created";
    var newTimeline = timelineData + csvRow + "\r\n";
    database.ref('students/'+studentId+'/'+'goals/timeline').set(newTimeline);
    var csvRow = date+","+myname+","+myprogress;
    var newTimeline = timelineData + csvRow + "\r\n";
    database.ref('students/'+studentId+'/'+'goals/timeline').set(newTimeline);
    document.getElementById('add-form').reset();
    document.getElementById('add-form').style.display = 'none';
});
function showEditForm(childKey,goalData) {
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
  var newName = document.getElementById('edit-name').value;
  var newCategory = document.getElementById('edit-category').value;
  var newProgress = document.getElementById('edit-progress').value;
  var newNotes = document.getElementById('edit-notes').value;
  if (goalRefData.progress != newProgress) {
    var newDate = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();
    var csvRow = newDate+","+newName+","+newProgress;
    var newTimeline = timelineData + csvRow + "\r\n";
    database.ref('students/'+studentId+'/'+'goals/timeline').set(newTimeline);
    if (goalRefData.notes == "") {
      newNotes = newDate + ": " + "Updated to " + newProgress+" ";
    }
    else{
      newNotes += "\n" + "|"+newDate + ": " + "Updated to " + newProgress+" ";
    }
  }
  if(newProgress == "Achieved"){
    database.ref('students/'+studentId+'/'+'goals/' + goalsKey).update({
      completion:(d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear()
    })
  }
  database.ref('students/'+studentId+'/'+'goals/' + goalsKey).update({
    name: newName,
    category: newCategory,
    progress: newProgress,
    notes: newNotes
  });
  document.getElementById('edit-form').style.display = 'none';
});
function exportData() {
  goalsRef.once('value', function(snapshot) {
    var csvContent = "data:text/csv;charset=utf-8,";
    var headerRow = "Name,Category,Progress,Notes\r\n";
    csvContent += headerRow;
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      var csvRow = childData.name + "," + childData.category + "," + childData.progress + "," + childData.notes;
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
details.innerHTML = "ID: "+ studentId;
function addNote(){
  document.getElementById('note-form').style.display = 'block';
  var newNote = document.getElementById('add-note').value;
}
function cancelNote(){
  document.getElementById('note-form').style.display = 'none';
}
document.getElementById('note-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var newNote = " "+ goalRefData.notes+"|"+(d.getMonth()+1)+"-"+(d.getDate())+"-"+d.getFullYear()+": "+document.getElementById('add-note').value+"\n";
  if (goalRefData.notes == ""){
    newNote = (d.getMonth()+1)+"-"+(d.getDate())+"-"+d.getFullYear()+": "+document.getElementById('add-note').value+"\n";
  }
  database.ref('students/'+studentId+'/'+'goals/' + goalsKey).update({
    notes: newNote});
  var newDate = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();
  var csvRow = newDate+","+goalRefData.name+","+document.getElementById('add-note').value;
  var newTimeline = timelineData + csvRow + "\r\n";
  database.ref('students/'+studentId+'/'+'goals/timeline').set(newTimeline);
  document.getElementById('add-note').value = "";
  document.getElementById('note-form').style.display = 'none';
});
function addTimeline(timelineGoal){
  var newDivision = document.createElement("div");
  var divisionContent = document.createTextNode(timelineGoal[1]+": " + timelineGoal[0]);
  newDivision.appendChild(divisionContent);
  var timelineDivision = document.getElementById("goal-timeline");
  timelineDivision.appendChild(newDivision);
}
document.getElementById('view-timeline').addEventListener('click', function() {
  document.getElementById('goal-timeline').style.display = 'block';
  document.getElementById('timeline-label').style.display = 'block';
  document.getElementById('view-timeline').style.display = 'none';
  document.getElementById('hide-timeline').style.display = 'inline';
  var goals = [];
  goalsRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      if(childData.progress == "Achieved"){
        goals.push([childData.name,childData.completion]);
      }
      
    });
  });
  goals.sort(function(a, b) {
    var dateA = new Date(a[1]);
    var dateB = new Date(b[1]);
    return dateA - dateB;
  });
  for (var i = 0; i < goals.length; i++) {
    addTimeline(goals[i]);
  }
});
document.getElementById('hide-timeline').addEventListener('click', function() {
  document.getElementById('goal-timeline').style.display = 'none';
  document.getElementById('timeline-label').style.display = 'none';
  document.getElementById('goal-timeline').innerHTML = "";
  document.getElementById('hide-timeline').style.display = 'none';
  document.getElementById('view-timeline').style.display = 'inline';
});
function exportTimeline(){
  var encodedUri = encodeURI(timelineData);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "timeline.csv");
  document.body.appendChild(link);
  link.click();
}