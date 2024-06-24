// # _________ INITIALIZE ON PAGE RESTART _________

// 
// Include fs module for storage in the local server
// Explaination: https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// Explaination: https://www.geeksforgeeks.org/node-js-fs-createwritestream-method/

// URL leading to the folder of the REST API server
// CORS cross-origin
// https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content?utm_source=mozilla&utm_medium=firefox-console-errors&utm_campaign=default
//const apiRootPath = 'http://localhost:3000';
//const apiRootPath = 'https://natalingo.api.delikaktus.com';
const apiRootPath = 'https://natalingo.rest.api.delikaktus.com';

// Create a key for the local storage
const STORAGE_KEY_TERMS = '__natalingo.15__';
const STORAGE_KEY_LOGIN = '__natalingo.user.02__';

// ----- Import user panel elements from page -----
// Import general user-panel elemetns
const userPanel = document.querySelector('.user-panel');
const userPanelToggleCheckbox = document.querySelector('.user-panel-toggle-checkbox');
const userLoginStatusCheckbox = document.querySelector('.user-log-status-checkbox');
const userRegisterCheckbox = document.querySelector('.user-register-checkbox');

const loadingWindow = document.querySelector('.loading-window');

// Import user-login-panel elemetns
const emailInput = document.querySelector('.email-input');
const passwordInput = document.querySelector('.password-input');
const userLoginButton = document.querySelector('.user-login-button');
const userRegisterButton = document.querySelector('.user-register-button');

// Import user-logged-inputs / info box elemetns
const loggedUser = {
  first_name: document.querySelector('.logged-user-name-first'),
  surname: document.querySelector('.logged-user-name-surname'),
  email: document.querySelector('.logged-user-email'),
  password: document.querySelector('.logged-user-password'),
  // User image path or URL
  user_image: document.getElementById('user-dropdown-button-image')
};
const userLogoutButton = document.querySelector('.user-logout-button');
const showTermsCheckbox = document.querySelector('.show-terms-checkbox');

// Import user EDIT mode elemetns
// Import EDIT mode checkboxes
const userEditCheckbox = document.querySelector('.user-edit-checkbox');
const userEditNameCheckbox = document.querySelector('.user-edit-name-checkbox');
const userEditEmailCheckbox = document.querySelector('.user-edit-email-checkbox');
const userEditPasswordCheckbox = document.querySelector('.user-edit-password-checkbox');
const userEditImageCheckbox = document.querySelector('.user-edit-image-checkbox');
// Import user edit buttons
const userEditNameButton = document.querySelector('.user-edit-name-button');
// Import user edit properties to update
const userEditInputs = {
  first_name: document.querySelector('.user-new-name-first-input'),
  surname: document.querySelector('.user-new-name-surname-input'),
  email: document.querySelector('.user-new-email-input'),
  password: document.querySelector('.user-new-password-input'),
};
const userNewImageInput = document.querySelector('.user-new-image-input');
const passwordRetypeInput = document.querySelector('.retype-password-to-edit-user-input');
const userEditConfirmButton = document.querySelector('.user-edit-confirm-button');

// Import user-delete-panel elemetns
const userDeleteButton = document.querySelector('.user-delete-button');
const userDeleteConfirmButton = document.querySelector('.user-delete-confirm-button');
const userDeleteCheckbox = document.querySelector('.user-delete-checkbox');

// ----- Import terms list elemetns from page -----
const emptyListMessage = document.querySelector('.empty-list-message');
const termsList = document.querySelector('.terms-list');

// ----- Import 'new term' panel elemetns from page -----
const newTermForm = document.forms['add-new-term-form'];
const termType = newTermForm['menu-terms'];
const newTermInput = document.querySelector('.add-term-input');
newTermInput.value = '';
const newTermButton = document.querySelector('.new-term-button');

// ----- Global variables declaration -----
// Define empty node list for list items from the current viewport HTML code
let items = document.createElement(null);
// Define empty node list for clickable edit icons from the page's HTML code
let pencils = document.createElement(null);
// Define empty node list for clickable trash bins from the page's HTML code
let trashBins = document.createElement(null);
// Define empty node list for clickable checkmarks from the page's HTML code
let checks = document.createElement(null);
// Define empty node list for clickable flags from the page's HTML code
let flagIconsItalian = document.createElement(null);
let flagIconsEnglish = document.createElement(null);

// Define empty node list for term and translation values
let updatedTermBoxItalian = document.createElement(null);
let updatedTermBoxEnglish = document.createElement(null);
// Define a user login credentials array
let userCredentials = {};
// Define a terms list array
let terms = [];

// # _________ DYNAMIC PROCEDURES _________

// Load user login credentials from the browser's local memory storage
const storageLogin = localStorage.getItem(STORAGE_KEY_LOGIN);
// If there were login credentials in the local storage...
if (storageLogin) {
  //Initialize the user credentials with the loaded ones
  userCredentials = JSON.parse(storageLogin);
  if (userCredentials.email) {
    // Initialize user login form with the current user credentials
    userEditInputs.email.value = userCredentials.email;
    userEditInputs.password.value = userCredentials.password;
    // Login user
    login_user(userCredentials.email, userCredentials.password);
  }
}

// Check for user panel clicks
respondToUserPanelClicks();
// Check for new user input
respondToNewTermClick();

/*
saveToUserFile(user);
loadFromUserFile(user);*/

//let output_result = create_term("dog", "5.00");
//console.log(output_result);

/* update_term("662d25498fae51e5642add32", "name", "popo")
  .then(term_link => {
    console.log('term_link = ',term_link.request.url);
  }); */

//delete_term("662e1f464f1712ac8267fcdf");


// # _________ FUNCTIONS _________

// Function to respond to user panel button clicks
function respondToUserPanelClicks() {

  // Hide user panel if any object exept it's elements is clicked
  document.onclick = (event) => {
    // If the clicked element is not part of the user panel nor an checkbox, such as the user dropdown menu button...
    if (!userPanel.contains(event.target) && !event.target.matches('[type="checkbox"]')) {
      userPanelToggleCheckbox.checked = false;
    }
  }
  
  // On a mouse click on the user register button...
  userRegisterButton.addEventListener('click', async (event) =>  {
    // Skip default form functions
    event.preventDefault();

    // Create a request body string from the input fields of at least an email and a password
    let userPropertiesToRegister = {};
    // Create a request body string of non empty modified user credentials
    Object.keys(userEditInputs).forEach(key => {
      userPropertiesToRegister[key] = userEditInputs[key].value.trim();
    });

    // If the email or password field is empty...
    if ( !userPropertiesToRegister.email || !userPropertiesToRegister.password ) {
      console.log('Enter valid email and password!');
    }
    else {
    // If the email and password fields are not empty...
      // attempt to register
      register_new_user(userPropertiesToRegister);      
    }
  });

  // On a mouse click on the user login button...
  userLoginButton.addEventListener('click', async (event) =>  {
    // Skip default form functions
    event.preventDefault();

    // Retreive login credentials from the input fields
    const email = userEditInputs.email.value.trim();
    // If the email input field is empty...
    if ( !email ) {
      console.log('Enter a valid email');
    }
    const password = userEditInputs.password.value.trim();
    // If the password input field is empty...
    if ( !password ) {
      console.log('Enter a valid password');
    }

    // If the field is not empty...
    if ( email.length > 0 && password.length ) {
      // Attempt to login
      /* const loginResponse = await  */login_user(email, password);
    }
  });

  // On a mouse click on the user logout button...
  userLogoutButton.addEventListener('click', () =>  {

    // Show loading window while the async function is running
    loadingWindow.style.display = "block";
    // Initialize user login form with the current user credentials
    userEditInputs.email.value = userCredentials.email;
    userEditInputs.password.value = userCredentials.password;
    // Load logged user terms */
    load_user_terms();
    // Save user login credentials in the local storage without password for security
    userCredentials.password = '';
    saveToLocalStorage(STORAGE_KEY_LOGIN,userCredentials);
    loadingWindow.style.display = "none";
  });

  // On a mouse click on the user edit confirmation button...
  userEditConfirmButton.addEventListener('click', async (event) =>  {
    // Skip default form functions
    event.preventDefault();
        
    console.log('user-edit-confirm-button clicked!')
    // Compare the current user password with the retyped password to confirm the edit
    if ( passwordRetypeInput.value === userCredentials.password ) {
      // If there is a new user image in the input form
      if (userNewImageInput.value) {
        console.log('userNewImageInput.value', userNewImageInput.value);
        // Create a form to attach a file to the fetch request body
        let userNewImageFile = new FormData();
        //const formDataA = {user_image: userNewImageInput.files[0]};
        userNewImageFile.append('user_image', userNewImageInput.files[0]/* ,'user_image' */);
        //userNewImageFile.append('user_image', 'hubot');
        edit_user_image(userNewImageFile);
      }

      // Define a flag to check if new user properties are found in the input fields
      let editFlag = false;
      // Create a request body string
      let userPropertiesToEdit = {};
      // Create a request body string of non empty modified user credentials
      Object.keys(userEditInputs).forEach(key => {
        const newPropertyValue = userEditInputs[key].value.trim();
        if ( (newPropertyValue.length > 0) && (userCredentials[key] != newPropertyValue) ) {
          userPropertiesToEdit[key] = newPropertyValue;
          // At least 1 new user property is found in the input fields and needs to be updated
          editFlag = true;
        }
      });
      // If there are new user properties to update
      if (editFlag) {
        // If there is no new password to update use the current password for verification
        if (isNaN(userPropertiesToEdit.password)) {
          // Initialize the request body string at least with the current user password
          userPropertiesToEdit.password = userCredentials.password;
        }
        edit_user(userPropertiesToEdit);
        // Clear the input field of the user edit confirmation password
        passwordRetypeInput.innerText = '';
        passwordRetypeInput.value = '';

        // Uncheck all the user edit property checkbox to hide panels
        userEditNameCheckbox.checked = false;
        userEditEmailCheckbox.checked = false;
        userEditPasswordCheckbox.checked = false;
      }
    } else {
      console.log('Edit failed!\nTry to retype your password or to login again.');
    }
  });

  // On a mouse click on the user delete button...
  userDeleteButton.addEventListener('click', (event) =>  {
    // Clear the user confirmation password field to assure password retype
    passwordRetypeInput.innerText = '';
    passwordRetypeInput.value = '';      
  });

  // On a mouse click on the user delete confirmation button...
  userDeleteConfirmButton.addEventListener('click', async (event) =>  {
    // Skip default form functions
    event.preventDefault();

    console.log('user-delete-confirm-button clicked!')
    // Retreive password retype from the input field

    if ( passwordRetypeInput.value === userCredentials.password ) {
      delete_user( userCredentials.id, userCredentials.token );
      // Clear the input field of the user edit confirmation password
      passwordRetypeInput.innerText = '';
      passwordRetypeInput.value = '';      
    } else {
      console.log('Delete failed!\nTry to retype your passord or to login again.');
    }
  });
}

// Asynchronous function to register a new user
async function register_new_user(fetchRequestBody) {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";
  console.log(`Attempting to register a new user with fetchRequestBody = \n`,JSON.stringify(fetchRequestBody));

  const fetchResponse = await fetch(apiRootPath+'/user/register', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(fetchRequestBody)/* ,`{ "first_name": "${userCredentials.first_name}", "surname": "${userCredentials.surname}", "email": "${userCredentials.email}", "password": "${userCredentials.password}" }` */
  }).catch(err => {
    console.log(`Critical error 666: Failed to register user with the email ${userCredentials.email} due to an unknown reason.\n\n`,err);
    // https://www.mongodb.com/docs/manual/reference/bson-types/#objectid
    return  '';
  });

  const status = await fetchResponse.status;
  const json_response = await fetchResponse.json();
  const loginCredentials = json_response.login_request.body;
  switch (status) {
    // Success: User was created
    case 201: {
      console.log(`${json_response.message}\n`,
        `User ID: ${json_response.id}`,
        `\nTo login use your credentials:\n`,
        `Email: ${loginCredentials.email}\n`,
        `Password: ${loginCredentials.password}\n`,
        `Image URL: ${loginCredentials.user_image}\n`
      );
      // Attempt user login with the new input password
      const loginResponse = await login_user(loginCredentials.email, loginCredentials.password);
      // If login was successful and there is a new user image input...
      if (loginResponse.id && userNewImageInput.value) {
        // Create a form to attach a file to the fetch request body
        let userNewImageFile = new FormData();
        // Add a file to the end of the form
        userNewImageFile.append('user_image', userNewImageInput.files[0]);
        // Upload a new user image to replace the previous file
        edit_user_image(userNewImageFile);
      }

      return loginCredentials;
    }      
    // Error: User already registered
    case 409: {
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n`,
        `User ID: ${json_response.id}`,
        `\nTo login use your credentials:\n`,
        `Email: ${loginCredentials.email}\n`,
        `Password: ${loginCredentials.password}\n`,
        `Image URL: ${loginCredentials.user_image}\n`
      );
      // Initialize user login form with the current user credentials
      userEditInputs.email.value = loginCredentials.email;
      userEditInputs.password.value = loginCredentials.password;
      // Attempt user login to create a valid logged token corresponding to the new user properties
      login_user(loginCredentials.email, loginCredentials.password);
      return loginCredentials;
    }
    case 500:{
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n`
      );
      return '';
    }
  }
  loadingWindow.style.display = "none";
}

// Asynchronous function to login a registered user
async function login_user(email, password) {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";
  const fetchResponse = await fetch(apiRootPath+'/user/login', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: `{ "email": "${email}", "password": "${password}" }`
  }).catch(err => {
    console.log(`Critical error 666: Failed to login user (email ${email}, password ${password}) due to an unknown reason.\n\n`,err);
    return  '';
  });

  const status = await fetchResponse.status;
  const json_response = await fetchResponse.json();
  loadingWindow.style.display = "none";
  switch (status) {
    // Success: User was created
    case 200: {
      const loggedCredentials = json_response.login_request.body;
      // Apply the new user credentials
      Object.keys(loggedCredentials).forEach(key => {
        userCredentials[key] = loggedCredentials[key];
      });
      // Save logged user credentials in the local storage
      saveToLocalStorage(STORAGE_KEY_LOGIN,userCredentials);

      console.log(`${json_response.message}\n`,
        `\nUser credentials:\n`,
        `User ID: ${userCredentials.id}\n`,
        `Name: ${userCredentials.first_name}\n`,
        `Surname: ${userCredentials.surname}\n`,
        `Email: ${userCredentials.email}\n`,
        `Password: ${userCredentials.password}\n`,
        `Image URL: ${userCredentials.user_image}\n`
      );
      // Update LOGGED panel user info to be displayed
      loggedUser.first_name.innerText = userCredentials.first_name;
      loggedUser.surname.innerText = userCredentials.surname;
      loggedUser.email.innerText = userCredentials.email;
      loggedUser.password.innerText = userCredentials.password;
      loggedUser.user_image.src = userCredentials.user_image;

      // Initialize user input form with the current user credentials
      userEditInputs.first_name.value = userCredentials.first_name;
      userEditInputs.surname.value = userCredentials.surname;
      userEditInputs.email.value = userCredentials.email;
      // Empty the user new password input field
      userEditInputs.password.value = '';
      userEditInputs.password.innerText = '';
      // Clear the input field of the user edit confirmation password
      passwordRetypeInput.value = '';
      passwordRetypeInput.innerText = '';

      userLoginStatusCheckbox.checked = true;
      userPanelToggleCheckbox.checked = false;
      // Save the user login credentials the local storage
      saveToLocalStorage(STORAGE_KEY_LOGIN,userCredentials);
      // Load logged user terms */
      load_user_terms();

      return {
        id: userCredentials.id,
        token: json_response.token
      };
    }
    // Error status: 401 / 409 / 500
    default: {
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n`
      );
      return '';
    }
  }
}

// Asynchronous function to delete a logged user
async function edit_user_image(fetchRequestBody) {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";

  console.log(`Attempting to edit user image at url = \n`,apiRootPath+'/user/edit_user_image'+userCredentials.id);

  const fetchResponse = await fetch(apiRootPath+'/user/edit_user_image'+userCredentials.id, {
    method: 'PATCH',
    headers: {
        //'Accept': '*/*',
        //'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        //'Authorization': `Bearer ${currentToken}`
    },
    body: fetchRequestBody
    //body: JSON.stringify(fetchRequestBody)
    //`{"first_name": "${userEditInputs.first_name.value.trim()}", "surname": "${userEditInputs.surname.value.trim()}", "password": "${passwordRetypeInput.value.trim()}" }`
    //file: userNewImageInput
  }).catch(err => {
    console.log(`Critical error 666: Failed to delete user ID ${userCredentials.id} due to an unknown reason.\n\n`,err);
    // https://www.mongodb.com/docs/manual/reference/bson-types/#objectid
    return '';
  });
  
  const status = await fetchResponse.status;
  const json_response = await fetchResponse.json();
  loadingWindow.style.display = "none";
  switch (status) {
    // Success: User was deleted
    case 200: {
      // Extract the updated user credentials from the response to the fetch request
      const updatedCredentials = json_response.updatedCredentials;
      // Apply the new user credentials
      userCredentials.user_image = updatedCredentials.user_image;
      // Save user login credentials in the local storage
      saveToLocalStorage(STORAGE_KEY_LOGIN,userCredentials);

      // Update LOGGED panel user image to be displayed
      // Force the broser to retreive the user image by adding a unique fragment identifier to the URL after the hash mark '#'
      loggedUser.user_image.src = userCredentials.user_image + '#' + new Date().getTime();

      // Clear the input field
      userNewImageInput.value='';
      // Uncheck user edit image checkbox to hide panel
      userEditImageCheckbox.checked = false;

      // Returns registration credentials to undo user delete
      return userCredentials;
    }
    // Error status: 404 / 409 / 500
    default: {
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n`
      );
      return '';
    }
  }
}

// Asynchronous function to delete a logged user
async function edit_user(fetchRequestBody) {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";

  console.log(`Attempting to edit user with fetchRequestBody = \n`,JSON.stringify(fetchRequestBody));

  const fetchResponse = await fetch(apiRootPath+'/user/'+userCredentials.id, {
    method: 'PATCH',
    headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userCredentials.token}`
    },
    body: JSON.stringify(fetchRequestBody),
    //`{"first_name": "${userEditInputs.first_name.value.trim()}", "surname": "${userEditInputs.surname.value.trim()}", "password": "${passwordRetypeInput.value.trim()}" }`
    //file: userNewImageInput
  }).catch(err => {
    console.log(`Critical error 666: Failed to delete user ID ${userCredentials.id} due to an unknown reason.\n\n`,err);
    // https://www.mongodb.com/docs/manual/reference/bson-types/#objectid
    return '';
  });

  const status = await fetchResponse.status;
  const json_response = await fetchResponse.json();
  loadingWindow.style.display = "none";
  switch (status) {
    // Success: User was deleted
    case 200: {
      // Extract the updated user credentials from the response to the fetch request
      const updatedCredentials = json_response.updatedCredentials;
      // Apply the new user credentials
      Object.keys(updatedCredentials).forEach(key => {
        userCredentials[key] = updatedCredentials[key];
      });
      // Save user login credentials in the local storage
      saveToLocalStorage(STORAGE_KEY_LOGIN,userCredentials);

      login_user(userCredentials.email,userCredentials.password);

      console.log(`${json_response.message}`,
        `\nYour updated credentials:\n`,
        `Name: ${userCredentials.first_name}\n`,
        `Surname: ${userCredentials.surname}\n`,
        `Email: ${userCredentials.email}\n`,
        `Password: ${userCredentials.password}`
      );

      // Returns registration credentials to undo user delete
      return userCredentials;
    }
    // Error status: 404 / 409 / 500
    default: {
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n`
      );
      return '';
    }
  }
}

// Asynchronous function to delete a logged user
async function delete_user(id,token) {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";
  console.log('Attempting to delete user...\n');
  const fetchResponse = await fetch(apiRootPath+'/user/'+id, {
    method: 'DELETE',
    headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
  }).catch(err => {
    console.log(`Critical error 666: Failed to delete user ID ${id} due to an unknown reason.\n\n`,err);
    // https://www.mongodb.com/docs/manual/reference/bson-types/#objectid
    return  '';
  });

  const status = await fetchResponse.status;
  const json_response = await fetchResponse.json();
  loadingWindow.style.display = "none";
  switch (status) {
    // Success: User was deleted
    case 200: {
      const registerCredentials = json_response.register_request.body;
      console.log(`${json_response.message}`,
        `\nTo register again use your credentials:\n`,
        `Email: ${registerCredentials.email}\n`,
        `Password: ${registerCredentials.password}`
      );
      // Switch user panel mode from EDIT to LOGGED and then logout
      userDeleteCheckbox.checked = false;
      userEditCheckbox.checked = false;
      userLogoutButton.click();

      // Returns registration credentials to undo user delete
      return registerCredentials;
    }
    // Error status: 404 / 409 / 500
    default: {
      console.log(`Error ${status}:\n`,
        `${json_response.message}\n!!!!!`
      );
      return '';
    }
  }
}

/* function create_term(name, price) {
  console.log(JSON.stringify({ "name": name, "price": price }))
  fetch(apiRootPath+'/products/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "name": name, "price": price })
  })
  .then(response => response.json())
  .then(response => console.log(JSON.stringify(response)));
} */

/* async function update_term(id, propName, newPropertyValue) {
  const patch_response = await fetch(apiRootPath+'/products/'+id, {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ "propName": propName, "value": newPropertyValue }])
  });
  const clean_patch_response = await patch_response.json();
  return clean_patch_response;
} */

/* function delete_term(id) {
  fetch(apiRootPath+'/products/'+id, {
    method: 'DELETE',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => console.log(JSON.stringify(response)));
} */

function respondToCategoryChange() {
  termType.addEventListener('change', function () {
    // Load the terms list to the viewport
    reloadViewport();
    // Check for new user input
    respondToClickedTerms();
  });
}

// Asynchronous function to load logged user terms
async function load_user_terms() {
  // Show loading window while the async function is running
  loadingWindow.style.display = "block";
  // Load terms from local storage
  const storageTerms = localStorage.getItem(STORAGE_KEY_TERMS);
  // If there are terms in the local storage...
  if (storageTerms) {
    //Save the terms list
    terms = await JSON.parse(storageTerms);
    // Load the terms list
    if (terms.length > 0) {
      showTermsCheckbox.checked = true;
      // Rebuild all terms on page refresh
      for (let editIndex = 0; editIndex < terms.length; editIndex++) {
        terms[editIndex].edit_mode = false;
      }
      // Update the local storage
      saveToLocalStorage(STORAGE_KEY_TERMS,terms);
      // Load the terms list to the viewport
      reloadViewport();

      // If there are list items shown in the viewport..
      if (items.length > 0) {
        // React to term clicks
        respondToClickedTerms();
      }
    // If there are no terms in the local storage...
    } else {
      showTermsCheckbox.checked = false;
    }
  }
  respondToCategoryChange();
  loadingWindow.style.display = "none";
}

// Main function that responds to uploaded term clicks in the viewport
function respondToClickedTerms() {
  // Run procedure to retrieve edit icons and respond to their clicks
  respondToEdit();

  // Retrieve trash bin icons from the viewport HTML code
  trashBins = document.querySelectorAll('.term-delete');
  // Retrieve checkmark icons from the viewport HTML code
  checks = document.querySelectorAll('.term-check');
  // Retrieve flags icons from the viewport HTML code
  flagIconsItalian = document.querySelectorAll('.flag-button-it');
  flagIconsEnglish = document.querySelectorAll('.flag-button-en');

  // Declaration of index to follow the vieport position
  let viewportIndex = 0;
  terms.forEach(function(term, index) {
    if (terms[index].grammatic_type == termType.value || termType.value == 'termini') {

      // Delete term for clicked trash bin icon
      trashBins[viewportIndex].addEventListener('click', function () {
        // Remove term from the terms list
        terms.splice(index, 1);
        // Update the local storage
        saveToLocalStorage(STORAGE_KEY_TERMS,terms);
        // Reload the terms list in the viewport
        reloadViewport();
        // If there are list items shown in the viewport..
        if (items.length > 0) {
          // React to term clicks
          respondToClickedTerms();
        }
      });

      //Toggle clicked checkmark
      checks[viewportIndex].addEventListener('click', function () {
        // Extract the vieport position of the clicked term item
        const position = this.parentElement.value;
        //Toggle checkmark click status
        term.check_click = !term.check_click;
        let checkmarkType = "images/check_maybe.svg";
        // If checkmark checked
        if (term.check_click) {
          checkmarkType = "images/checkmark.png";
        } 
        // Checkmark unchecked
        checks[position].innerHTML = `<img class="check-icon" src="${checkmarkType}" alt="Check Icon">`;
        createTermHTML(term, position);
        // Update the local storage
        saveToLocalStorage(STORAGE_KEY_TERMS,terms);
      });

      if (!term.edit_mode) {
        // present term translation for clicked flag button
        flagIconsItalian[viewportIndex].addEventListener('click', function () {
          // Extract the vieport position of the clicked term item
          const position = this.parentElement.parentElement.value;
          //Toggle flag icon click status
          term.flag_click_it = !term.flag_click_it;
          // Toggle show/hide class for CSS code
          flagIconsItalian[position].classList.toggle("term-hide");
          if (term.flag_click_it) {
            // Declare and initialize Italian flag with hidden text
            flagIconsItalian[position].previousElementSibling.remove();
          }
          else {
            let htmlObject = document.createElement('span');
            // Create a class attribute:
            const att = document.createAttribute("class");
            // Set the value of the class attribute:
            att.value = "term-text-it read-mode";
            // Add the class attribute to the first h1:
            htmlObject.setAttributeNode(att); 
            htmlObject.innerHTML = term.text_italian;
            // Update the relevant vieport section
            flagIconsItalian[position].insertAdjacentElement('beforebegin', htmlObject);
          }
          // Create and update a new HTML template for the edited term
          createTermHTML(term, position);
          // Update the local storage
          saveToLocalStorage(STORAGE_KEY_TERMS,terms);
        });

        // present term translation for clicked flag button
        flagIconsEnglish[viewportIndex].addEventListener('click', function () {
          // Extract the vieport position of the clicked term item
          const position = this.parentElement.parentElement.value;
          //Toggle checkmark click status
          term.flag_click_en = !term.flag_click_en;
          // Toggle show/hide class for CSS code
          flagIconsEnglish[position].classList.toggle("term-hide");
          if (term.flag_click_en) {
            // Declare and initialize Italian flag with hidden text
            flagIconsEnglish[position].nextElementSibling.remove();
          }
          else {
            let htmlObject = document.createElement('span');
            // Create a class attribute:
            const att = document.createAttribute("class");
            // Set the value of the class attribute:
            att.value = "term-text-en read-mode";
            // Add the class attribute to the first h1:
            htmlObject.setAttributeNode(att); 
            htmlObject.innerHTML = term.text_english;
            // Update the relevant vieport section
            flagIconsEnglish[position].insertAdjacentElement('afterend', htmlObject);
          }
          // Create and update a new HTML template for the edited term
          createTermHTML(term, position);
          // Update the local storage
          saveToLocalStorage(STORAGE_KEY_TERMS,terms);
        });
      }
      viewportIndex++;
    }
  });
}

// Run procedure to retrieve edit icons and respond to their clicks
function respondToEdit() {
  // Retrieve clickable edit icons from the page's HTML code
  pencils = document.querySelectorAll('.term-edit');
  // Responed to edit clicks for each viewport list item
  pencils.forEach(function(pencil, pencilIndex) {
    pencil.addEventListener('click', function editTerm() {
    // Function to edit a specific term in the viewport when pencil is clicked
      const termIndex = Number(items[pencilIndex].id);
      // Edit mode is still turned on - after 2nd click on the edit button...
      if (terms[termIndex].edit_mode === true) {
        // Replace and save edited term with user input
        updateTermFromInput(termIndex);
      }
      // Toggle editting mode and make sure that only one term at the time is being edited
      for (let editIndex = 0; editIndex < terms.length; editIndex++) {
        if (editIndex == termIndex) {
          // Toggle editing/reading mode for the current term
          terms[termIndex].edit_mode = !terms[termIndex].edit_mode;
        }
        else {
          // Keep or switch back to reading mode all other terms
          terms[editIndex].edit_mode = false;
        }
      }
      // Update the local storage
      saveToLocalStorage(STORAGE_KEY_TERMS,terms);
      if (terms[termIndex].edit_mode === true) {
        // If edit mode was turned on - after 1st click on the edit button...
          // Reload the terms list in the viewport
          reloadViewport();

          // Retrieve clickable arrows from the page's temporary HTML code
          const arrowUp = document.querySelector('.term-arrow-up');
          // If the term is not at the top...
          if (pencilIndex > 0) {
            arrowUp.addEventListener('click', function() {
            // Function to move term one level up in the list on arrow click
              // Extract the terms list position of the clicked term item
              const termIndexBellow = termIndex;
              // Extract the terms list position of the term ***above*** the clicked term item
              const termIndexAbove = Number(items[pencilIndex].previousElementSibling.id);
              // Replace and save edited term with user input
              updateTermFromInput(termIndexBellow);
              // Save the clicked term item
              const tempTermBellow = terms[termIndexBellow].valueOf();
              // Save the term above the clicked term item
              const tempTermAbove = terms[termIndexAbove].valueOf();
              // Replace the upper value in the array with the edited term
              terms.splice(termIndexAbove, 1, tempTermBellow);
              // Replace the lower value in the array with the term from above
              terms.splice(termIndexBellow, 1, tempTermAbove);
              // Update the local storage
              saveToLocalStorage(STORAGE_KEY_TERMS,terms);
              // Reload the terms list in the viewport
              reloadViewport();
              // Flip back to keep editing
              terms[termIndexAbove].edit_mode = false;
              // Update changed position 
              pencilIndex -= 1;
              // Continue to edit term whithout activating other buttons
              editTerm();
            });
          }
              
          // Retrieve clickable arrows from the page's temporary HTML code
          const arrowDown = document.querySelector('.term-arrow-down');
          // If the term is not at the bottom...
          if (pencilIndex < pencils.length-1) {
            arrowDown.addEventListener('click', function() {
            // Function to move term one level down in the list on arrow click
              // Extract the terms list position of the clicked term item
              const termIndexAbove = termIndex;
              // Extract the terms list position of the term ***bellow*** the clicked term item
              const termIndexBellow = Number(items[pencilIndex].nextElementSibling.id);
              // Replace and save edited term with user input
              updateTermFromInput(termIndexAbove);
              // Save the clicked term item
              const tempTermAbove = terms[termIndexAbove].valueOf();
              // Save the term above the clicked term item
              const tempTermBellow = terms[termIndexBellow].valueOf();
              // Replace the lower value in the array with the term from above
              terms.splice(termIndexBellow, 1, tempTermAbove);
              // Replace the upper value in the array with the edited term
              terms.splice(termIndexAbove, 1, tempTermBellow);
              // Update the local storage
              saveToLocalStorage(STORAGE_KEY_TERMS,terms);
              // Reload the terms list in the viewport
              reloadViewport();
              // Flip back to keep editing
              terms[termIndexBellow].edit_mode = false;
              // Update changed position 
              pencilIndex += 1;
              // Continue to edit term whithout activating other buttons
              editTerm();
            });
          }

          // Replace and save edited term with user input
          updateTermFromInput(termIndex);
          // Rerun procedure to retrieve edit icons and listen to their clicks
          respondToEdit();
        }
        else { 
        // Edit mode was turned off - after 2nd click on the edit button...
          // Update the local storage
          saveToLocalStorage(STORAGE_KEY_TERMS,terms);
          // Reload the terms list in the viewport
          reloadViewport();
          // React to term clicks
          respondToClickedTerms();
        }
      
    });
  });

}

// Function to read edited term input
function updateTermFromInput(termIndextoUpdate) {

  // Retrieve updated term and translation values from the page's temporary HTML code
  updatedTermBoxItalian = document.querySelector('.term-text-it-edit');
  updatedTermBoxEnglish = document.querySelector('.term-text-en-edit');

  // Refer to the terms list position of the clicked term item
  const pencil = updatedTermBoxItalian.parentElement.parentElement.previousElementSibling.previousElementSibling;

  // React to edited term "Enter" key (code=13) pressing as a mouse click
  const updatedTermTextItalian = updatedTermBoxItalian.value.trim();
  if (updatedTermTextItalian.length > 0) {
  // If not empty...
    // Update the terms array values
    terms[termIndextoUpdate].text_italian = updatedTermTextItalian;
  }
  const updatedTermTextEnglish = updatedTermBoxEnglish.value.trim();
  if (updatedTermTextEnglish.length > 0) {
    // If not empty...
      // Update the terms array values
      terms[termIndextoUpdate].text_english = updatedTermTextEnglish;
  }
  // Update the local storage
  saveToLocalStorage(STORAGE_KEY_TERMS,terms);

  updatedTermBoxItalian.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      updateTermFromInput(termIndextoUpdate);
      pencil.click();
    }
  });

  // React to edited term translation "Enter" key (code=13) pressing as a mouse click
  updatedTermBoxEnglish.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      updateTermFromInput(termIndextoUpdate);
      pencil.click();
    }
  });
}

// Function that adds a new term to the end of the terms array from a user input
function respondToNewTermClick() {
  // React to "Enter" key pressing as a mouse click
  newTermInput.addEventListener('keydown', (event) => {
//    event.preventDefault();
    switch(event.key) {
      case "Enter":
        event.preventDefault();
        newTermButton.click();
        break; 
      default:
        break;
    }
  });

  // On a mouse click on the + for a new term button...
  newTermButton.addEventListener('click', async (event) => {
    // Show loading window while the async function is running
    loadingWindow.style.display = "block";
    // Skip default form functions
    event.preventDefault();
    // Define position of the new term as last in the vieport 
    let newViewportIndex = 0;
    if (items.length > 0) {
      newViewportIndex = items.length;
    }
    // Retreive text from the input field
    const newTerm = newTermInput.value.trim();
    // If the field is not empty...
    if (newTerm.length > 0) {
      // Add the new term to the list of terms
      await addNewTerm(newTerm, newViewportIndex);
    }
    loadingWindow.style.display = "none";
  });
}

// Asynchronous function to add a term to the terms array
async function addNewTerm(newTerm, newViewportIndex) {
  // Clear the input field
  newTermInput.value = '';
  // Translate text and insert into a new variable
  let newEnglishTranslation = await mymemoryTranslate(newTerm);
  // Change text to lower case
  newEnglishTranslation = newEnglishTranslation.toLowerCase();
  // Retrieve the chosen grammatic type of the new term from the dropdown menu
  let grammaticType = termType.value;
  // Reclassify unclassified as "others" ("altri")
  if (grammaticType == 'termini') {
    grammaticType = 'altri';
  }
  // Add term to the end of the terms list
  terms.push({grammatic_type: grammaticType, text_italian: newTerm, 
    text_english: newEnglishTranslation, htmlCode: ``, check_click: false, flag_click_it: false, 
    flag_click_en: false, edit_mode: false});
  // Create HTML code for the last added term
  terms[terms.length-1].htmlCode = createTermHTML(terms[terms.length-1], newViewportIndex);
  // Update the local storage and the view port
  saveToLocalStorage(STORAGE_KEY_TERMS,terms);
  // Reload the terms list in the viewport
  reloadViewport();
  // React to term clicks
  respondToClickedTerms();
}

// Function to change the HTML code of the terms list to show it or an empty message
function reloadViewport() {
  // Clear list in the viewport
  termsList.innerText = '';
  // If TERMS exist...
  if (terms.length > 0) {
    // Declaration of index to follow the vieport position
    let viewportPositionIndex = 0;
    // Create an HTML template for each existing term
    terms.forEach(function(term) {
      if (term.grammatic_type == termType.value || termType.value == 'termini') {
        createTermHTML(term,viewportPositionIndex);
        // Insert term into the page
        termsList.innerHTML += `${term.htmlCode}`;
        viewportPositionIndex++;
      }
    });
    items = document.querySelectorAll('.list-item');
    // If list ITEMS of the chosen type exist...
    if (items.length === 0) {
      showTermsCheckbox.checked = false;
      // Message to show when there are no terms in the list of the chosen type
      emptyListMessage.innerText = `Non ci sono ${termType.value} salvati`;
    } else {
      showTermsCheckbox.checked = true;
    }
  }
  // Otherwise show a general "empty list" message
  else {
    // Message to show when there are no terms in the list
    emptyListMessage.innerText = 'La tua lista è vuota';
    showTermsCheckbox.checked = false;
  }
}

// Function to create an HTML template for a givven term
function createTermHTML(term, viewportIndex) {
  // Toggle checkmark icon if clicked
  let checkmarkIcon = "images/check_maybe.svg";
  
  if (term.check_click) {
    checkmarkIcon = "images/checkmark.png";
  }
    
  // Declare and initialize Italian flag with hidden text
  let textHTMLit = `
    <p class="term-italian">
      <span class="term-text-it read-mode">${term.text_italian}</span>
      <button class="flag-button-it" data-lang="it">🇮🇹</button>
    </p>
  `;
  if (term.flag_click_it) {
    textHTMLit = `
      <p class="term-italian">
        <button class="flag-button-it term-hide" data-lang="it">🇮🇹</button>
      </p>
    `;
  }

  // Declare and initialize English flag with hidden text
  let textHTMLen = `
    <p class="term-english">
      <button class="flag-button-en" data-lang="en">🇬🇧</button>
      <span class="term-text-en read-mode">${term.text_english}</span>
    </p>
  `;
  if (term.flag_click_en) {
    textHTMLen = `
      <p class="term-english">
        <button class="flag-button-en term-hide" data-lang="en">🇬🇧</button>
      </p>
    `;
  }

  let editIconHTML = `
    <div class="term-edit read-mode">
      <img class="edit-icon" src="images/carrot.svg" alt="Carrot icon">
    </div>
  `;
  let arrowsHTML = ``;
  // HTML to append to the term if pencil icon is clicked: pencil and arrows icons
  if (term.edit_mode) {
    editIconHTML = `
      <div class="term-edit edit-mode">
        <img class="label-icon" src="images/label.png" alt="Save Edit">
      </div>
    `;
    arrowsHTML = `
      <div class="term-arrows edit-mode">
        <div class="term-arrow-up">
          <img class="arrow-up-icon" src="images/arrow_up.svg" alt="Arrow Up Icon">
        </div>
        <div class="term-arrow-down">
          <img class="arrow-down-icon" src="images/arrow_down.svg" alt="Arrow Down Icon">
        </div>
      </div>
    `;
    textHTMLit = `
      <div>
        <div>
          <input class="term-text-it-edit edit-mode" type="text" value="${term.text_italian}">
        </div>
        <div>
          <input class="term-text-en-edit edit-mode" type="text" value="${term.text_english}">
        </div>
      </div>
    `;
    textHTMLen = ``;
  }

  const termIndex = terms.indexOf(term);
  // Return the following HTML
  const fullHTML = `
    <li class="list-item" value=${viewportIndex} id=${termIndex}>
      <div class="term-check">
        <img class="check-icon" src="${checkmarkIcon}" alt="Check Icon">
      </div>
      `
      +`${editIconHTML}`
      +`${arrowsHTML}`
      +`${textHTMLit}`
      +`${textHTMLen}`
      +`
      <div class="term-delete">
        <img class="trash-bin-icon" src="images/trash.png" alt="Delete Icon">
      </div>
    </li>
  `;
  term.htmlCode = fullHTML;
  return fullHTML;
}

// Function for translation of text from Italian to English
async function mymemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|en`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const result = jsonData.responseData.translatedText;
  return result;
}

// Function to update the local storage
function saveToLocalStorage(STORAGE_KEY,elementToStore) {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(elementToStore));
}
