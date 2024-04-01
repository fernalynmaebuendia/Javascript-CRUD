// To reload page and back to top of the page
window.scrollTo({
    top:0,
    behavior: "smooth"
})

// Pagination prev and next current page
let currentUserPage = 1;
// Show entries users per page and 5 is default show entries 
let userPerPage = 5;
// Show all total of tables
let totalUserResults = 0;
// Default sorting order is ascending
let ascendingSort = true;
// Local sotrage variable
var userList;
// For set/showing table
var html = "";

// Validate form inputs before submitting data
function validateForm() {
    const form = document.getElementById("form");
    const error = form.querySelectorAll(".error");
    let hasErrors = false;

    // Error message
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    const dobErrorMsg = document.getElementById("dobErrorMsg");
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    const emailErrorMsg = document.getElementById("emailErrorMsg");

    // Get input for invalid error
    const firstNameInput = form.querySelector('input[name="firstName"]').value;
    const lastNameInput = form.querySelector('input[name="lastName"]').value;
    const dobInput = document.getElementById("dob").value;
    const addressInput = form.querySelector('input[name="address"]').value;
    const emailInput = form.querySelector('input[name="email"]').value;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");

        if (firstNameInput.trim() === "") {
            firstNameErrorMsg.innerHTML = "Please enter your first name";
            firstNameErrorMsg.style.display = "block";
            setTimeout(function () {
                firstNameErrorMsg.style.display = "none";
            }, 3000);
            hasErrors = true;
        }

        if (lastNameInput.trim() === "") {
            lastNameErrorMsg.innerHTML = "Please enter your last name";
            lastNameErrorMsg.style.display = "block";
            setTimeout(function () {
                lastNameErrorMsg.style.display = "none";
            }, 3000);
            hasErrors = true;
        }

        if (dobInput.trim() === "") {
            dobErrorMsg.innerHTML = "Please enter your birthday";
            dobErrorMsg.style.display = "block";
            setTimeout(function () {
                dobErrorMsg.style.display = "none";
            }, 3000);
            hasErrors = true;
        }

        if (addressInput.trim() === "") {
            addressErrorMsg.innerHTML = "Please enter your address";
            addressErrorMsg.style.display = "block";
            setTimeout(function () {
                addressErrorMsg.style.display = "none";
            }, 3000);
            hasErrors = true;
        }

        if (emailInput.trim() === "") {
                emailErrorMsg.innerHTML = "Please enter your email";
                emailErrorMsg.style.display = "block";
                setTimeout(function () {
                    emailErrorMsg.style.display = "none";
                }, 3000);
                hasErrors = true;
            } else if (!isValidEmail(emailInput)) {
                emailErrorMsg.innerHTML = "Invalid email address";
                emailErrorMsg.style.display = "block";
                setTimeout(function () {
                    emailErrorMsg.style.display = "none";
                }, 3000);
                hasErrors = true;
            }
            
        // Set timeout
        setTimeout(function() {
            form.classList.remove("was-validated");
            error.forEach(element => element.style.display = "none");
        }, 3000);
        
        return false;
    }
    form.classList.remove("was-validated");
    return true;
}

// Simple email validation function
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Function to Show Data from local storage
function showUser() {
    // Checks if there's a userlist in local storage in JSON format otherwise null/empty
    if (localStorage.getItem("userList") == null) {
        userList = [];
    }
    else {
        userList = JSON.parse(localStorage.getItem("userList"))
    }

    // Show all data in the table with buttons (edit, delete, and view)
    userList.forEach(function (element, index) {
        // Generate the HTML for each user row
        html += "<tr>";
        html += "<td>" + element.firstName + "</td>";
        html += "<td>" + element.lastName + "</td>";
        html += "<td>" + element.dob + "</td>";
        html += "<td>" + element.age + "</td>";
        html += "<td>" + element.address + "</td>";
        html += "<td>" + element.email + "</td>";
        html += 
            '<td style="text-align: center"><button type="button" onclick="viewUser(' + 
            index +
            ')" class="btn btn-info m-2"><i class="bi bi-eye"></i></button><button type="button" onclick="deleteUser(' + 
            index +
            ')" class="btn btn-danger" id="Delete"><i class="bi bi-trash"></i></button><button type="button" onclick="updateUser(' + 
            index +
            ')" class="btn btn-warning m-2"><i class="bi bi-pencil-square"></i></button></td>'
        html += "</tr>";
    });
    
    // Get table id to show data in the table in html
    document.querySelector("#userTable tbody").innerHTML = html;

    // Call ShowUsersOnPage function 
    showUsersOnPage(userList)
    updatePaginationInfo();
}

// Close the modal when clicking outside the modal content
// window.addEventListener('click', function(event) {
//     const modal = document.getElementById('myModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// });

// Close the modal when the Escape key is pressed
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Function to open modal
function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Function to View Data from local storage
function viewUser(indexOnPage) {
    // Function to display all data in the modal
    const modalData = document.getElementById("modalData");
    modalData.innerHTML = ""; // Clear previous data

    // Retrieve data when click
    const indexInList = (currentUserPage - 1) * userPerPage + indexOnPage;
    // Get the user to update
    const userToView = userList[indexInList];

    // Create and append to display user in the modal
    const firstName = document.createElement("h5");
    firstName.innerHTML = `<strong>First Name: </strong> ${userToView.firstName}`;
    modalData.appendChild(firstName);

    const lastName = document.createElement("h5");
    lastName.innerHTML = `<strong>Last Name: </strong> ${userToView.lastName}`;
    modalData.appendChild(lastName);

    const dob = document.createElement("h5");
    dob.innerHTML = `<strong>Birthday: </strong> ${userToView.dob}`;
    modalData.appendChild(dob);

    const age = document.createElement("h5");
    age.innerHTML = `<strong>Age: </strong> ${userToView.age}`;
    modalData.appendChild(age);

    const address = document.createElement("h5");
    address.innerHTML = `<strong>Address: </strong> ${userToView.address}`;
    modalData.appendChild(address);

    const email = document.createElement("h5");
    email.innerHTML = `<strong>Email: </strong> ${userToView.email}`;
    modalData.appendChild(email);

    // Open the modal
    openModal();
}

closeModal();

function calculateAge(birthDate) {
    const dob = new Date(birthDate);
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - dob.getFullYear();
    
    // Check if the birthday hasn't occurred this year yet
    if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

// Add an event listener to the "Birthday" input field
document.getElementById("dob").addEventListener("change", function() {
    // Get the selected birthday value
    var dob = this.value;
    
    // Calculate the age based on the selected birthday
    var age = calculateAge(dob);
    
    // Update the "Age" input field with the calculated age
    document.getElementById("age").value = age;
});

// Function to Add Data to local storage
function AddUser() {
    // If form is validated
    if (validateForm()) {
        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        // Get the birthday in dob
        var dob = document.getElementById("dob").value; 
        // Calculate age based on the birthday
        var age = calculateAge(dob); 
        var address = document.getElementById("address").value;
        var email = document.getElementById("email").value;

        if (localStorage.getItem("userList") == null) {
            userList = [];
        }
        else {
            userList = JSON.parse(localStorage.getItem("userList"));
        }

        // Userlist to push to store in local storage
        userList.push({
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            age: age,
            address: address,
            email: email,
        });

        // Set data to userlist and convert from JSON  to Javascript
        localStorage.setItem("userList", JSON.stringify(userList));
        
        // Show alert-success message
        var successAlert = document.querySelector(".alert-success");
        successAlert.style.display = "block";

        // Hide the alert-success message after 3 seconds
        setTimeout(function () {
            successAlert.style.display = "none";
        }, 3000);

        // Clear form fields
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("dob").value = "";
        document.getElementById("age").value = "";
        document.getElementById("address").value = "";
        document.getElementById("email").value = "";

        // Show update Users immediately
        showUsersOnPage(userList);
        updatePaginationInfo();
    }
}

// Function to Delete Data from local storage
function deleteUser(indexOnPage) {
    // Calculate the index in the entire userlist array based on the current page
    const indexInList = (currentUserPage - 1) * userPerPage + indexOnPage;
    
    // Delete user from userlist
    userList.splice(indexInList, 1);

    // Update the userlist
    localStorage.setItem("userList", JSON.stringify(userList));
    
    // Show the alert-danger message
    var deleteAlert = document.querySelector(".alert-danger");
    deleteAlert.style.display = "block";

    // Hide the alert-danger message after 3 seconds
    setTimeout(function () {
        deleteAlert.style.display = "none";
    }, 3000);

    // Show update Users immediately
    showUsersOnPage(userList);
    updatePaginationInfo();

    // Clear form fields
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("age").value = "";
    document.getElementById("address").value = "";
    document.getElementById("email").value = "";

    // Update button will hide and Submit Button will show for updating of Data in local storage
    document.getElementById('Update').style.display = "none";
    document.getElementById('Submit').style.display = "block";

    document.getElementById("searchbar").value = "";
    SearchBar();
}

// Function to Update Data from local storage
function updateUser(indexOnPage) {
    window.scrollTo({
        top:0,
        behavior: "smooth"
    })

    // Submit button will hide and Update Button will show for updating of Data in local storage
    document.getElementById('Submit').style.display = "none";
    document.getElementById('Update').style.display = "block";
    
    const indexInList = (currentUserPage - 1) * userPerPage + indexOnPage;
    
    // Get the user to update
    const userToUpdate = userList[indexInList];
    
    // Get old data and display in the input field for update
    document.getElementById("firstName").value = userList[indexInList].firstName;
    document.getElementById("lastName").value = userList[indexInList].lastName;
    document.getElementById("dob").value = userList[indexInList].dob;
    document.getElementById("age").value = userList[indexInList].age;
    document.getElementById("address").value = userList[indexInList].address;
    document.getElementById("email").value = userList[indexInList].email;

    // Get old data to update
    document.querySelector("#Update").onclick = function() {
        if (validateForm()) {
            userToUpdate.firstName = document.getElementById("firstName").value;
            userToUpdate.lastName = document.getElementById("lastName").value;
            userToUpdate.dob = document.getElementById("dob").value;
            userToUpdate.age = document.getElementById("age").value;
            userToUpdate.address = document.getElementById("address").value;
            userToUpdate.email = document.getElementById("email").value;
            
            localStorage.setItem("userList", JSON.stringify(userList));

            // Show the alert-success message
            var updateAlert = document.querySelector(".alert-info");
            updateAlert.style.display = "block";

            // Hide the alert-success message after 3 seconds
            setTimeout(function () {
                updateAlert.style.display = "none";
            }, 3000);

            document.getElementById("firstName").value = "";
            document.getElementById("lastName").value = "";
            document.getElementById("dob").value = "";
            document.getElementById("age").value = "";
            document.getElementById("address").value = "";
            document.getElementById("email").value = "";

            // Update button will hide and Submit Button will show for updating of Data in local storage
            document.getElementById('Update').style.display = "none";
            document.getElementById('Submit').style.display = "block";

            // Show update user immediately
            showUsersOnPage(userList);
            updatePaginationInfo();
        }
    }
}

// Function to display match user
function populateTable(user) {
    var html = "";

    user.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.firstName + "</td>";
        html += "<td>" + element.lastName + "</td>";
        html += "<td>" + element.dob + "</td>";
        html += "<td>" + element.age + "</td>";
        html += "<td>" + element.address + "</td>";
        html += "<td>" + element.email + "</td>";
        html += 
            '<td style="text-align: center"><button type="button" onclick="viewUser(' + 
            index + 
            ')" class="btn btn-info m-2"><i class="bi bi-eye"></i></button><button type="button" onclick="deleteUser(' + 
            index + 
            ')" class="btn btn-danger" id="Delete"><i class="bi bi-trash"></i></button><button type="button" onclick="updateUser(' + 
            index + 
            ')" class="btn btn-warning m-2"><i class="bi bi-pencil-square"></i></button></td>'
        html += "</tr>";
    });

    document.querySelector("#userTable tbody").innerHTML = html;
}

// Function to calculate the total of user pages
function getTotalPages(userList) {
    return Math.ceil(userList.length / userPerPage);
}

// Function to update pagination and show result
function updatePaginationInfo() {
    const paginationInfo = document.getElementById("paginationInfo");
    const paginationShowResult = document.getElementById("paginationShowResult");
    const totalPages = getTotalPages(userList);

    // Calculate by showing the current show result by all users as per next page 
    userPerPage = parseInt(document.getElementById("showEntries").value);
    const startIndexShowResult = (currentUserPage - 1) * userPerPage + 1;
    const endIndexShowResult = Math.min(startIndexShowResult + userPerPage - 1, totalUserResults);

    paginationInfo.textContent = `Page ${currentUserPage} of ${totalPages}`
    paginationShowResult.textContent = `Showing ${endIndexShowResult} of ${totalUserResults} results`
}

// Function to display users on the current page
function showUsersOnPage(userList) {
    const startIndex = (currentUserPage - 1) * userPerPage;
    const endIndex = startIndex + userPerPage;
    const usersToShow = userList.slice(startIndex, endIndex);
    var html = "";

    // Show users based in show entries and default is 5 per pages
    usersToShow.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.firstName + "</td>";
        html += "<td>" + element.lastName + "</td>";
        html += "<td>" + element.dob + "</td>";
        html += "<td>" + element.age + "</td>";
        html += "<td>" + element.address + "</td>";
        html += "<td>" + element.email + "</td>";
        html +=
            '<td style="text-align: center"><button type="button" onclick="viewUser(' + 
            index + 
            ')" class="btn btn-info m-2"><i class="bi bi-eye"></i></button><button type="button" onclick="deleteUser(' + 
            index + 
            ')" class="btn btn-danger" id="Delete"><i class="bi bi-trash"></i></button><button type="button" onclick="updateUser(' + 
            index + 
            ')" class="btn btn-warning m-2"><i class="bi bi-pencil-square"></i></button></td>'
        html += "</tr>";
    });

    document.querySelector("#userTableBody").innerHTML = html;

    // Update the total results based on the filtered user list
    totalUserResults = userList.length;
}

// Function to go to the previous page
function prevPage() {
    if (currentUserPage > 1) {
        currentUserPage--;
        // Update displayed data
        showUsersOnPage(userList);
        updatePaginationInfo();
    }
}

// Function to go to the next page
function nextPage() {
    if (currentUserPage < getTotalPages(userList)) {
        currentUserPage++;
        // Update displayed data
        showUsersOnPage(userList);
        updatePaginationInfo();
    }
}

// Function to change the number of users displayed per page
function changeUsersPerPage() {
    userPerPage = parseInt(document.getElementById("showEntries").value);
    currentUserPage = 1;
    showUsersOnPage(userList);
    updatePaginationInfo();
}

// Function to search through userList
function SearchBar() {
    var input, filter, i, textValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();

    // No result found message
    const searchMessage = document.getElementById("message");
    // Show all result
    const paginationShowResult = document.getElementById("paginationShowResult");
    // Show number of matching result
    searchResultCount = document.getElementById("paginationShowResult");
    // Flag to track if any matching row is found
    let hasResults = false;

    // Initialize an array to store the rows that match the search
    let matchingRows = [];

    if (filter === "") {
        // If the search input is empty, reset the userList to the original list
        userList = JSON.parse(localStorage.getItem("userList")) || [];
    } else {
        for (i = 0; i < userList.length; i++) {
            const user = userList[i];

            // Check each property in the user object for a match
            for (const key in user) {
                if (user.hasOwnProperty(key)) {
                    if (typeof user[key] === "string") {
                        textValue = user[key].toUpperCase();
                        if (textValue.indexOf(filter) > -1) {
                            // If a match is found, add this user to the matchingRows array
                            matchingRows.push(user);
                            hasResults = true;
                            // No need to check other properties for this user
                            break; 
                        }
                    }
                    
                }
            }
        }
    }

    // Update the table with the matching rows or back to original user list if the search is empty
    if (filter === "") {
        showUsersOnPage(userList);
    } else {
        populateTable(matchingRows);
    }

    // Show or hide the message match is found or not
    if (hasResults) {
        searchMessage.style.display = "none";
        searchMessage.innerHTML = "";
    } else {
        searchMessage.style.display = "block";
        searchMessage.innerHTML = "No result found";
    }

    if (searchResultCount) {
        // Update the search result count
        searchResultCount.style.display = "block";
        // Update the count here
        searchResultCount.textContent = `Showing ${matchingRows.length} of ${totalUserResults} results`; 
    } else {
        // Back to original all count
        searchResultCount.style.display = "none";
        paginationShowResult.textContent = `Showing ${totalUserResults} results`;
    }

    // Clear the message when the input value is empty and back to the original table
    if (input.value === "") {
        searchMessage.style.display = "none";
        searchMessage.innerHTML = "";
        showUsersOnPage(userList);
        updatePaginationInfo();
    }

    // Show original/current result count
    userPerPage = parseInt(document.getElementById("showEntries").value);
}

// Function to parse date strings in the format "MM/DD/YYYY" and return a sortable value
function parseDate(dateString) {
    const parts = dateString.split('-');
    console.log('Parse parts: ', parts);
    return new Date(parts[2], parts[0] - 1, parts[1]);
}

// Function to sort all table
function sortTable(columnIndex) {
    // Identify the header cell and the sort icon for the clicked column
    const headerCell = document.querySelector(`#userTable th:nth-child(${columnIndex + 1})`);
    const sortIcon = headerCell.querySelector('.sort-icon');

    // Toggle the sorting order (ascending/descending) and update the sort icon
    ascendingSort = !ascendingSort;
    sortIcon.classList.toggle('bi-sort-alpha-up', ascendingSort);
    sortIcon.classList.toggle('bi-sort-alpha-down-alt', !ascendingSort);

    // Determine the sorting key based on the column index
    let sortKey = '';
    switch (columnIndex) {
        case 0:
            sortKey = 'firstName';
            break;
        case 1:
            sortKey = 'lastName';
            break;
        case 2:
            sortKey = 'dob';
            break;
        case 3:
            sortKey = 'age';
            break;
        case 4:
            sortKey = 'address';
            break;
        case 5:
            sortKey = 'email';
            break;
    }

    // Perform the sorting on the userList array
    userList.sort((a, b) => {
        const valueA = (sortKey === 'dob') ? parseDate(a[sortKey]) : a[sortKey];
        const valueB = (sortKey === 'dob') ? parseDate(b[sortKey]) : b[sortKey];
    
        if (valueA < valueB) {
            return ascendingSort ? -1 : 1;
        }
        if (valueA > valueB) {
            return ascendingSort ? 1 : -1;
        }
        return 0;
    });

    // Update the table with the sorted data
    showUsersOnPage(userList);
}

// Loads all data from local storage when document or page loaded
window.onload = function() {
    // Show all userlist data
    showUser();
}

// Initialize user list
var userList = localStorage.getItem("userList") ? JSON.parse(localStorage.getItem("userList")) : [];
