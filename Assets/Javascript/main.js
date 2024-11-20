const API_KEY = "227bf804-1d32-42d2-850a-68774448c6f0"
const URL_API = "http://146.59.242.125:3009"

const PromoContainer = document.querySelector("#promos")

//_______________________________________________________________________________________Fetch API

// --------------------- fetch GET----------------------------

async function getPromo() {

    const response = await fetch(URL_API + "/promos", {
        method: "GET",
        headers: {
            authorization: "Bearer " + API_KEY
        }
    });

    const data = await response.json()
    displayPromo(data)

    if (!response.ok) {
        console.error("Erreur :", response.statusText);
        return;
    }
}
// --------------------- fetch DELETE----------------------------

async function deleteInfo(id) {
    const response = await fetch(URL_API + "/promos/" + id, {
        method: "DELETE",
        headers: {
            authorization: "Bearer " + API_KEY
        }
    });

    let data = await response.json()
  
    if (!response.ok) {
        showError("Error deleting the promotion");
    } else {
        showSuccess("Promotion deleted successfully!");
    }
}

// --------------------- fetch PUT----------------------------

async function updateInfo(id, updateData) {
    const response = await fetch(URL_API + "/promos/" + id, {
        method: "PUT",
        headers: {
            authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json" // format JSON
        },
        body: JSON.stringify(updateData),
    });

    if (response.ok) {
        showSuccess("Promotion updated successfully!");
        PromoContainer.textContent = "";
        getPromo();
    } else {
        showError("Error updating the promotion");
    }
}

// --------------------- fetch POST----------------------------

async function addPromo(data) {
    try {
        const response = await fetch(URL_API + "/promos/", {
            method: "POST",
            headers: {
                authorization: "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error!");
        }

        showSuccess("added with success!");
        PromoContainer.textContent = "";

    } catch (error) {
        showError(error.message);
    }
}

// __________________________________________________________ // Function principale

function displayPromo(data) {

    data.forEach(element => {

        ///_____ Conteneur par Promo
        const infoPromo = createContainer("article", "infoPromo");
        PromoContainer.appendChild(infoPromo);

        ///_____ info Promo
        const infoDiv = createContainer("div", "infoDiv");
        infoPromo.appendChild(infoDiv);

        const namePromo = document.createElement("h2");
        namePromo.textContent = element.name;
        infoDiv.appendChild(namePromo);

        ///_____ Conteneur Date
        const dateDiv = createContainer("div");
        infoDiv.appendChild(dateDiv);

        const startDate = document.createElement("p");
        startDate.textContent = new Date(element.startDate).toLocaleDateString()
        dateDiv.appendChild(startDate);

        const endDate = document.createElement("p");
        endDate.textContent = new Date(element.endDate).toLocaleDateString()
        dateDiv.appendChild(endDate);


        ///_____ Conteneur Bouton
        const btnContainer = createContainer("div", "btnContainer");
        infoPromo.appendChild(btnContainer);

        // Button edit 
        const editBtn = createButton("", '<ion-icon name="create"></ion-icon>')
        btnContainer.appendChild(editBtn);

        buttonEvents(editBtn, "click", () => updatePromo(infoPromo, element)); // () une seule info

        // See more
        const seeMoreBtn = document.createElement("a")
        seeMoreBtn.href = `student.html?id=${element._id}`
        seeMoreBtn.innerHTML = '<ion-icon name="eye"></ion-icon>'
        seeMoreBtn.classList.add("seemorebtn")
        btnContainer.appendChild(seeMoreBtn)

        // Button delete
        const deleteBtn = createButton("", '<ion-icon name="trash"></ion-icon>')
        btnContainer.appendChild(deleteBtn);

        buttonEvents(deleteBtn, "click", () => { // {} cas ou plusieurs instructions
            deleteInfo(element._id);
            infoPromo.remove();
        });

        
    });

};

//_____________________________________________________________________________Edit function

function updatePromo(infoPromo, promo) {
    infoPromo.textContent = "";

    ///_____ Conteneur Globale
    const editContainer = createContainer("form", "editContainer");
    infoPromo.appendChild(editContainer);

    /// Input namePromo
    const inputName = createInput("text", "Promotion's name");
    inputName.value = promo.name;
    editContainer.appendChild(inputName);
    /// Input startdate
    const inputStartdate = createInput("date", "Start date");
    inputStartdate.value = new Date(promo.startDate).toISOString().split("T")[0];
    editContainer.appendChild(inputStartdate);
    /// Input enddate
    const inputEndDate = createInput("date", "End date");
    inputEndDate.value = new Date(promo.endDate).toISOString().split("T")[0];
    editContainer.appendChild(inputEndDate);

    ///_____ Conteneur Bouton
    const editbtncontainer = createContainer("div", "editbtncontainer");
    infoPromo.appendChild(editbtncontainer);

    /// Submit
    const submitBtn = createButton("", '<ion-icon name="checkmark-circle"></ion-icon>');
    editbtncontainer.appendChild(submitBtn);

    buttonEvents(submitBtn, "click", async (event) => {
        event.preventDefault();
        
          //_______________________________________________________ Condition d'erreur
          if (!inputName.value || !inputStartdate.value || !inputEndDate.value) {
            showError("All fields are required");
            return;
        }

        if (new Date(inputStartdate.value) > new Date(inputEndDate.value)) {
            showError("Start date cannot be later than end date");
            return;
        }

        if (isNaN(new Date(inputStartdate.value)) || isNaN(new Date(inputEndDate.value))) {
            showError("Invalid date format");
            return;
        }

        await updateInfo(promo._id, {
            name: inputName.value,
            startDate: inputStartdate.value,
            endDate: inputEndDate.value,
        });

    });

    /// Reset
    const resetBtn = createButton("", '<ion-icon name="refresh-circle"></ion-icon>');
    editbtncontainer.appendChild(resetBtn)

    buttonEvents(resetBtn, "click", (event) => {
        event.preventDefault();
        PromoContainer.textContent = ""
        getPromo()

    });
}

//_______________________________________________________________Add function

function addPromoForm() {
    PromoContainer.textContent = "";

    
    ///_____ Conteneur Globale
    const addForm = createContainer("form", "addForm");
    PromoContainer.appendChild(addForm);

    /// Input namePromo
    const inputName = createInput("text", "Promotion's name");
    addForm.appendChild(inputName);

    /// Input Date
    const inputStartdate = createInput("date", "Start date");
    addForm.appendChild(inputStartdate);
    const inputEndDate = createInput("date", "End date");
    addForm.appendChild(inputEndDate);

    ///_____ Conteneur Bouton
    const addBtnContainer = createContainer("div", "addContainer");
    PromoContainer.appendChild(addBtnContainer);

    /// Submit
    const submitAdd = createButton("", '<ion-icon name="add-circle"></ion-icon>', "Add");
    addBtnContainer.appendChild(submitAdd);

    buttonEvents(submitAdd, "click", async (event) => {
        event.preventDefault();

        //_______________________________________________________ Condition d'erreur
        if (!inputName.value || !inputStartdate.value || !inputEndDate.value) {
            showError("All fields are required");
            return;
        }

        if (new Date(inputStartdate.value) > new Date(inputEndDate.value)) {
            showError("Start date cannot be later than end date");
            return;
        }

        if (inputName.value.length < 3) {
            showError("Promotion name must be at least 3 characters long");
            return;
        }

        await addPromo({
            name: inputName.value,
            startDate: inputStartdate.value,
            endDate: inputEndDate.value,
        });

        PromoContainer.textContent = "";
        getPromo();

    });

    /// Reset
    const cancelBtn = createButton("", '<ion-icon name="close-circle"></ion-icon>', "cancel");
    addBtnContainer.appendChild(cancelBtn);

    cancelBtn.addEventListener("click", (event) => {
        event.preventDefault();
        PromoContainer.textContent = "";
        getPromo();
    });

}

getPromo()



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

