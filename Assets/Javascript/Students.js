const API_KEY = "227bf804-1d32-42d2-850a-68774448c6f0"
const URL_API = "http://146.59.242.125:3009"



// Fonction pour récupérer l'ID de la promo dans l'URL
function getId() {
    const params = new URLSearchParams(window.location.search);
    const idPromo = params.get('id');
    return idPromo;
}


// --------------------- fetch GET----------------------------

// Fonction pour récupérer l'ID de la promo dans l'URL
async function getStudent() {

    const response = await fetch(URL_API + "/promos/" + getId(), {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json" // Spécifie que les données envoyées/reçues sont en JSON
        }
    });

    const dataStudent = await response.json(); // Conversion de la réponse en objet JSON
    return dataStudent.students;

}

// --------------------- fetch GET AVATAR----------------------------

async function getAvatar(idStudent) {
try {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent + "/avatar", {

        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json"
        }
    }
    );
    
    const avatarBlob = await response.blob();
    const avatarUrl = URL.createObjectURL(avatarBlob);
    return avatarUrl;

} catch (error) {
    console.error("Error fetching avatar:", error.message);
    showError("Failed to load the student's avatar. Please try again.");
    return null;
}
}

// --------------------- fetch POST AVATAR ----------------------------

async function addStudent(newStudent, avatarFile) {
try {
    const formData = new FormData();
    for (const key in newStudent) {
        formData.append(key, newStudent[key]);
    }

    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    const response = await fetch(URL_API + "/promos/" + getId() + "/students", {
        method: "POST",
        headers: {
            authorization: "Bearer " + API_KEY,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
    

    const data = await response.json();
    console.log("Student added successfully:", data);

} catch (error) {
    console.error("Error adding student:", error.message);
    showError("An error occurred while adding the student. Please check the details and try again.");
}

}

// --------------------- fetch DELETE----------------------------

async function deleteStudent(idStudent) {
try {
    const response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent, {
        method: "DELETE",
        headers: {
            authorization: "Bearer " + API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: Unable to delete student.`);
    }
    

    const data = await response.json();
    console.log("Student deleted successfully:", data);
    displayStudent();

} catch (error) {
    console.error("Error deleting student:", error.message);
    showError("An error occurred while deleting the student. Please try again.");
}
}

// --------------------- fetch PUT----------------------------

async function updateInfo(idStudent, updateStudent) {

let response = await fetch(URL_API + "/promos/" + getId() + "/students/" + idStudent, {
    method: "PUT",
    headers: {
        authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json" // format JSON 
    },
    body: JSON.stringify(updateStudent),
});


if (response.ok) { // Vérifie si la requête a réussi
    PromoContainer.textContent = ""
    getPromo()
    return await response.json()


} else {
    console.error("Erreur de mise à jour :", response.statusText);

}
}



//_______________________________________________________________// Display STUDENTS

const StudentContainer = document.querySelector("#Students");
StudentContainer.classList.add("StudentContainer")

async function displayStudent() {

const dataStudent = await getStudent();


dataStudent.forEach(async element => {

    ///_____ Conteneur global
    const studentListContainer = createContainer("div", "studentListContainer")
    StudentContainer.appendChild(studentListContainer)

    ///_____ Conteneur par student
    const studentList = createContainer("div", "studentList");
    studentListContainer.appendChild(studentList);

    ///_____ Conteneur StudentDIV
    const studentDiv = createContainer("div", "studentDIV");
    studentList.appendChild(studentDiv);

    ///_____ Conteneur avatar
    const imgcontainer = createContainer("div", "imgcontainer");
    studentDiv.appendChild(imgcontainer);

    ///_____ Avatar
    const avatar = document.createElement("img")
    const avatarUrl = await getAvatar(element._id);
    avatar.src = avatarUrl;
    imgcontainer.appendChild(avatar)

    ///_____ Conteneur Info
    const studentInfo = createContainer("div", "studentInfo");
    studentDiv.appendChild(studentInfo);

    ///_____ NOM
    const lastName = createContainer("p");
    lastName.innerHTML = "Nom: <strong> " + element.lastName + "</strong>";
    studentInfo.appendChild(lastName);
    ///_____ PRENOM
    const firstName = createContainer("p");
    firstName.innerHTML = "Prénom: <strong> " + element.firstName + "</strong>";
    studentInfo.appendChild(firstName);
    ///_____ AGE
    const age = createContainer("p");
    age.innerHTML = "Age : <strong>" + element.age + "</strong>";
    studentInfo.appendChild(age);

    ///_____ Conteneur Bouton
    const studentBtnContainer = createContainer("div", "studentBtnContainer");
    studentList.appendChild(studentBtnContainer);

    // Button edit 
    const editBtn = createButton("", '<ion-icon name="create"></ion-icon>')
    studentBtnContainer.appendChild(editBtn)

    buttonEvents(editBtn, "click", () => updateStudent(studentListContainer, element));

    // Button delete
    const deleteBtn = createButton("", '<ion-icon name="trash"></ion-icon>');
    studentBtnContainer.appendChild(deleteBtn)

    buttonEvents(deleteBtn, "click", () => {
        deleteStudent(element._id);
        studentListContainer.remove();
        StudentContainer.textContent = ""
    });

});

}

//___________________________________________________________________ function Edit

function updateStudent(studentListContainer, student) {
studentListContainer.textContent = "";

///_____ Conteneur Globale
const editContainer = createContainer("form", "editContainer");
studentListContainer.appendChild(editContainer);

///_____ Conteneur INPUT
const InputContainer = createContainer("form", "InputContainer");
editContainer.appendChild(InputContainer);

/// Input lastName
const inputlastName = createInput("text", "Last Name");
inputlastName.value = student.lastName;
InputContainer.appendChild(inputlastName);
/// Input firstName
const inputfirstName = createInput("text", "First Name");
inputfirstName.value = student.firstName;
InputContainer.appendChild(inputfirstName);
/// Input age
const inputage = createInput("number", "student'a age");
inputage.value = student.age
InputContainer.appendChild(inputage);


///_____ Conteneur Bouton
const editbtncontainer = createContainer("div", "editbtncontainer");
editContainer.appendChild(editbtncontainer);


/// Submit
const validBtn = createButton("", '<ion-icon name="checkmark-circle"></ion-icon>');
editbtncontainer.appendChild(validBtn);

buttonEvents(validBtn, "click", async (event) => {
    event.preventDefault();
    await updateInfo(student._id, {
        firstName: inputfirstName.value,
        lastName: inputlastName.value,
        age: inputage.value,

    });
    StudentContainer.textContent = ""
    displayStudent();
});

/// Reset
const resetBtn = createButton("", '<ion-icon name="refresh-circle"></ion-icon>');
editbtncontainer.appendChild(resetBtn)
buttonEvents(resetBtn, "click", (event) => {
    event.preventDefault();
    StudentContainer.textContent = ""
    displayStudent()

});

}

//_______________________________________________________________Add function

function addStudentForm() {
StudentContainer.textContent = "";

///_____ Conteneur Globale
const addForm = createContainer("form", "addForm");
StudentContainer.appendChild(addForm);

 /// Input Avatar
 const labelAvatar = document.createElement("label");
 labelAvatar.textContent = "Add the student's avatar here : ";
 const inputAvatar = createInput("file", "Student First Name");
 labelAvatar.appendChild(inputAvatar);
 addForm.appendChild(labelAvatar);
 labelAvatar.classList.add("AddAvatar")

/// Input lastName
const inputlastName = createInput("text", "Student Last Name");
addForm.appendChild(inputlastName);

/// Input firstName
const inputfirstName = createInput("text", "Student First Name");
addForm.appendChild(inputfirstName);

/// Input age
const inputage = createInput("number", "Student's age");
addForm.appendChild(inputage);

///_____ Conteneur Bouton
const addBtnContainer = createContainer("div", "addContainer");
StudentContainer.appendChild(addBtnContainer);

/// Submit
const validAdd = createButton("", '<ion-icon name="add-circle"></ion-icon>', "add");
addBtnContainer.appendChild(validAdd)

buttonEvents(validAdd, "click", async (event) => {
    event.preventDefault();


    if (!inputfirstName.value || !inputlastName.value || !inputage.value) {
        showError("All fields are required. Please fill in the student's details.");
        return;
    }

    const newStudent = {
        firstName: inputfirstName.value,
        lastName: inputlastName.value,
        age: inputage.value,
    };

    const avatarFile = inputAvatar.files[0];
    try {
        await addStudent(newStudent, avatarFile);
        alert("Student added successfully!");
        StudentContainer.textContent = "";
        displayStudent();
    } catch (error) {
        console.error("Error adding student:", error.message);
        showError("Failed to add the student. Please try again later.");
    }
});


/// Reset
const cancelBtn = createButton("", '<ion-icon name="close-circle"></ion-icon>', "cancel");
addBtnContainer.appendChild(cancelBtn);

cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    StudentContainer.textContent = "";
    displayStudent();
});

}

displayStudent()

























//________________________________________________________________________Générique 

//-------------------------------------- Container

function createContainer(tagName = "div", className = "") {
    const container = document.createElement(tagName);
    if (className) {
        container.classList.add(className);
    }
    return container
}

//---------------------------------------- Button

function createButton(className = "", innerHTML = "", textContent = "") {
    const button = document.createElement("button");
    if (className) {
        button.classList.add(className);
    }
    if (innerHTML) {
        button.innerHTML = innerHTML;

    } if (textContent) {
        const textSpan = document.createElement("span");
        textSpan.textContent = textContent;
        button.appendChild(textSpan);
    }
    return button;
}

//---------------------------------------------- AddEvent

function buttonEvents(button, eventType, handler) {
    button.addEventListener(eventType, handler);
}

//---------------------------------------------- Input

function createInput(type, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    return input;
}

//---------------------------------------------------------- POP UP

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: message,
        showConfirmButton: false,
        timer: 1200
    });
}


function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
        showConfirmButton: true
    });
}
