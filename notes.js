showNotes();
let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", async function (e) {
    let addText = document.getElementById("addText").value;
    let addTitle = document.getElementById("addTitle").value;

    if (addTitle.length > 0 && addText.length > 0) {
        try {
            await addDoc(collection(db, "notes"), {
                Title: addTitle,
                Content: addText
            });
            console.log("Note added to Firestore successfully!");
        } catch (error) {
            console.error("Error adding note to Firestore: ", error);
        }
    } else {
        showAlert();
    }
    
    document.getElementById("addText").value = "";
    document.getElementById("addTitle").value = "";


    async function showNotes() {
        const querySnapshot = await getDocs(collection(db, "notes"));
        let notesObj = [];
    
        querySnapshot.forEach((doc) => {
            notesObj.push({ id: doc.id, ...doc.data() });
        });
    
        let html = "";
        notesObj.forEach(function (element) {
            html += `
            <div class="card my-2 mx-2" style="width: 18rem; background-color: darkgray;">
                <div class="card-body">
                    <h5 class="card-title" style="text-decoration:underline;">${element.Title}</h5>
                    <p class="card-text">${element.Content}</p>
                    <button onclick="deleteNote('${element.id}')" class="btn btn-primary">delete</button>
                </div>
            </div>`;
        });
    
        let notesElm = document.getElementById("content");
        if (notesObj.length != 0) {
            notesElm.innerHTML = html;
        } else {
            notesElm.innerHTML = `Nothing to show. Use "Add Note" to add a note.`;
        }
    }

    

    async function deleteNote(noteId) {
        try {
            await deleteDoc(doc(db, "notes", noteId));
            console.log("Note deleted from Firestore successfully!");
            showNotes(); // Refresh notes after deletion
        } catch (error) {
            console.error("Error deleting note from Firestore: ", error);
        }
    }
    

    
    let notes = localStorage.getItem("notes");
    if (notes == null)
        notesObj = [];
    else
        notesObj = JSON.parse(notes);
    let myObj = {
        Content: addText.value,
        Title: addTitle.value
    };
	if(myObj.Title.length > 0 && myObj.Content.length > 0) {
		notesObj.push(myObj);
		localStorage.setItem("notes", JSON.stringify(notesObj));
	}
	else
		showAlert();
    addText.value = "";
    addTitle.value = "";
    showNotes();
});

function showNotes() {
    let notes = localStorage.getItem("notes");
    if (notes == null)
        notesObj = [];
    else
        notesObj = JSON.parse(notes);
    let html = "";
    notesObj.forEach(function (element, index) {
            html += `
            <div class="card my-2 mx-2" style="width: 18rem; background-color: darkgray;">
                <div class="card-body">
                    <h5 class="card-title" style="text-decoration:underline;">${element.Title}</h5>
                    <p class="card-text">${element.Content}</p>
                    <button id="${index}" onclick="confirmDelete(this.id)" class="btn btn-primary">delete</button>
                </div>
            </div>`;
    });
    let notesElm = document.getElementById("content");
    if (notesObj.length != 0)
        notesElm.innerHTML = html;
    else
        notesElm.innerHTML = `Nothing to show. Use "Add Note" to add a note.`;
}

function showAlert() {
    let alert = document.getElementById("alerting");
        alert.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Error!</strong> Note heading and content cannot be empty.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
        setTimeout(function () {
            alert.innerHTML = '';
        }, 3000);	
}

function confirmDelete(index) {    
    deleteButton = document.getElementById(index);
    deleteButton.setAttribute("onclick", `deleteNote(${index})`)    
    deleteButton.style.marginLeft = "10px";
    deleteButton.innerText = 'Confirm?'
    
    cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel";
    cancelButton.classList.add("btn");
    cancelButton.classList.add("btn-primary");
    cancelButton.classList.add("cancel-delete");
    cancelButton.setAttribute("onclick", `cancelDelete(${index})`);    

    msg = document.createElement('p');
    msg.classList.add("msg");
    // msg.innerHTML = "Are you sure you want to delete this node?";    

    card = deleteButton.parentNode;
    deleteButton.remove();

    card.append(msg);
    card.append(cancelButton);
    card.append(deleteButton);
}

function cancelDelete(index) {    
    deleteButton = document.getElementById(index);    
    card = deleteButton.parentNode;    

    childnodes = card.childNodes;
    let len = childnodes.length;
    for (let i = len-1; i >= len-3; i--) {        
        childnodes[i].remove();
    }
    
    card.append(deleteButton);
    deleteButton.setAttribute("onclick", `confirmDelete(${index})`);
    deleteButton.style.marginLeft = "0px";
    deleteButton.innerText = 'delete'
}

function deleteNote(index) {
    let notes = localStorage.getItem("notes");
    if (notes == null)
        notesObj = [];
    else
        notesObj = JSON.parse(notes);
    notesObj.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
}

let search = document.getElementById('searchText');
search.addEventListener("input", function () {
    let inputVal = search.value.toLowerCase();
   
    let noteCards = document.getElementsByClassName("card");
    Array.from(noteCards).forEach(function (element) {
        let cardText = element.getElementsByTagName("p")[0].innerText;
        let cardTextheading = element.getElementsByTagName("h5")[0].innerText; //heading text inclusion
     
        if (cardText.includes(inputVal) || cardTextheading.includes(inputVal)) { //OR statement for heading as well
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });
});

const options = {
  bottom: '64px', // default: '32px'
  right: '32px', // default: '32px'
  left: 'unset', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();

// pre loader start
function loader(){
    document.querySelector('.loader-container').classList.add('fade-out');
}
function fadeOut(){
    setInterval(loader,500);
}
window.onload = fadeOut;
// pre loader end






