//api file
const GET_API = "api/get.php";

const CREATE_API = "api/create.php";

const UPDATE_API = "api/update.php";
Z
const DELETE_API = "api/delete.php";


//html

const form = document.getElementById("crudForm");

const recordId = document.getElementById("recordId");

const titleInput = document.getElementById("title");

const userIdInput = document.getElementById("userId");

const submitButton = document.getElementById("submitButton");

const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");

const recordsTable = document.getElementById("recordsTable");

const statusMessage = document.getElementById("status");

const loadingMessage = document.getElementById("loading");

//status
function showStatus(message, type) {

    statusMessage.textContent = message;

    statusMessage.className = type;

}

//get rec
async function getRecords() {

    try {

        loadingMessage.style.display = "block";

        showStatus(
            "Loading records...",
            "loading"
        );


        const response = await fetch(
            GET_API
        );


        if (!response.ok) {

            throw new Error(
                "Failed to get records."
            );

        }


        const records = await response.json();


        recordsTable.innerHTML = "";


        if (records.length === 0) {

            const row = document.createElement("tr");

            const cell = document.createElement("td");

            cell.colSpan = 5;

            cell.textContent = "No records found.";

            cell.style.textAlign = "center";

            row.appendChild(cell);

            recordsTable.appendChild(row);

        }


        records.forEach(function(record) {

            const row = document.createElement("tr");


            //id

            const idCell = document.createElement("td");

            idCell.textContent = record.id;

            row.appendChild(idCell);


            //userid

            const userIdCell = document.createElement("td");

            userIdCell.textContent = record.user_id;

            row.appendChild(userIdCell);


            //titlle

            const titleCell = document.createElement("td");

            titleCell.textContent = record.title;

            row.appendChild(titleCell);


            //comp

            const completedCell = document.createElement("td");


            if (
                record.completed == 1 ||
                record.completed === "1"
            ) {

                completedCell.textContent = "Yes";

            } else {

                completedCell.textContent = "No";

            }


            row.appendChild(completedCell);


            //act

            const actionCell = document.createElement("td");


            //edit

            const editButton =
                document.createElement("button");

            editButton.textContent = "Edit";

            editButton.className = "edit-btn";


            editButton.onclick = function() {

                editRecord(record);

            };


            actionCell.appendChild(
                editButton
            );


            //del button

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.className = "delete-btn";


            deleteButton.onclick = function() {

                deleteRecord(record.id);

            };


            actionCell.appendChild(
                deleteButton
            );


            row.appendChild(
                actionCell
            );


            recordsTable.appendChild(
                row
            );

        });


        showStatus(
            "Records loaded successfully!",
            "success"
        );


    } catch (error) {

        console.error(error);


        showStatus(
            "Error loading records: " +
            error.message,
            "error"
        );


    } finally {

        loadingMessage.style.display = "none";

    }

}

//submit
form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id = recordId.value;

        const title =
            titleInput.value.trim();

        const userId =
            Number(userIdInput.value);


        if (title === "") {

            showStatus(
                "Please enter a title.",
                "error"
            );

            return;

        }


        if (userId <= 0) {

            showStatus(
                "Please enter a valid User ID.",
                "error"
            );

            return;

        }


        if (id === "") {

            await createRecord(
                title,
                userId
            );

        } else {

            await updateRecord(
                id,
                title,
                userId
            );

        }

    }
);

//create
async function createRecord(title, userId) {

    try {

        showStatus(
            "Creating record...",
            "loading"
        );

        submitButton.disabled = true;


        const response = await fetch(
            "api/create.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    user_id: userId
                })
            }
        );


        const responseText = await response.text();

        console.log("Create response:", responseText);


        let result;

        try {

            result = JSON.parse(responseText);

        } catch (error) {

            throw new Error(
                "PHP returned an invalid response: " +
                responseText
            );

        }


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to create record."
            );

        }


        showStatus(
            "Record created successfully!",
            "success"
        );


        resetForm();

        await getRecords();


    } catch (error) {

        console.error(error);

        showStatus(
            "Error creating record: " +
            error.message,
            "error"
        );


    } finally {

        submitButton.disabled = false;

    }

}

//editt
function editRecord(record) {

    recordId.value = record.id;

    titleInput.value = record.title;

    userIdInput.value =
        record.user_id;


    formTitle.textContent =
        "Update Record";


    submitButton.textContent =
        "Update Record";


    cancelButton.style.display =
        "inline-block";


    showStatus(
        "Record loaded for editing.",
        "success"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//update
async function updateRecord(
    id,
    title,
    userId
) {

    try {

        showStatus(
            "Updating record...",
            "loading"
        );


        submitButton.disabled = true;


        const updatedRecord = {

            id: Number(id),

            title: title,

            user_id: userId

        };


        const response = await fetch(
            UPDATE_API,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(
                    updatedRecord
                )

            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update record."
            );

        }


        showStatus(
            "Record updated successfully!",
            "success"
        );


        resetForm();


        await getRecords();


    } catch (error) {

        console.error(error);


        showStatus(
            "Error updating record: " +
            error.message,
            "error"
        );


    } finally {

        submitButton.disabled = false;

    }

}

//detellllete
async function deleteRecord(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
    );


    if (!confirmDelete) {

        return;

    }


    try {

        showStatus(
            "Deleting record...",
            "loading"
        );


        const response = await fetch(
            DELETE_API,
            {

                method: "DELETE",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    id: Number(id)

                })

            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete record."
            );

        }


        showStatus(
            "Record deleted successfully!",
            "success"
        );


        await getRecords();


    } catch (error) {

        console.error(error);


        showStatus(
            "Error deleting record: " +
            error.message,
            "error"
        );

    }

}

//cancel edit
function cancelEdit() {

    resetForm();


    showStatus(
        "Edit cancelled.",
        "success"
    );

}

//reset
function resetForm() {

    form.reset();


    recordId.value = "";


    formTitle.textContent =
        "Add Record";


    submitButton.textContent =
        "Add Record";


    cancelButton.style.display =
        "none";

}

getRecords();