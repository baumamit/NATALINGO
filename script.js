// # INITIALIZE ON PAGE RESTART

// Create a key for the local storage
const STORAGE_KEY = '__natalingo.40__';

// Import page elemetns
const button = document.querySelector('button');
const inputField = document.querySelector('input');
inputField.value = '';
const termsList = document.querySelector('.terms-list');
const emptyListMessage = document.querySelector('.empty-list-message');

// Define empty node list for clickable checkmarks from the page's HTML code
let checks = document.querySelectorAll('.no-check');
// Define empty node list for clickable trash bins from the page's HTML code
let trashBins = document.querySelectorAll('.no-delete');
// Define empty node list for clickable items from the page's HTML code
let pencils = document.querySelectorAll('.no-edit');

// Define a terms list array
let terms = [];

// Check for new user input
respondToNewTermClick();
//showContent();

// # DYNAMIC PROCEDURES 

// Retrieve local storage
const storage = localStorage.getItem(STORAGE_KEY);
// If there were terms in the local storage...
if (storage) {
  //Save the terms list
  terms = JSON.parse(storage);
  // Load the terms list to the viewport
  loadTerms();
  // React to term clicks
  respondToClickedTerms();
}

// # FUNCTIONS 

// Function that responds to uploaded term clicks in the viewport
function respondToClickedTerms() {
  console.log('start respondToClickedTerms');
  
  // Retrieve clickable checkmarks from the page's HTML code
  checks = document.querySelectorAll('.term-check');
  // Retrieve clickable trash bins from the page's HTML code
  trashBins = document.querySelectorAll('.term-delete');
  // Retrieve clickable items from the page's HTML code
  pencils = document.querySelectorAll('.term-edit');
//  termTexts = document.querySelectorAll('.term-text');
//  termItems = document.querySelectorAll('.term-item');

  // Create an HTML template for each existing term
  terms.forEach(function(term, index) {

    //Toggle clicked checkmark
    checks[index].addEventListener('click', function () {
      //Toggle checkmark click status
      term.check_click = !term.check_click;
      let checkmarkType = "images/check_maybe.svg";
      // If checkmark checked
      if (term.check_click) {
        checkmarkType = "images/check.svg";
      } 
      // Checkmark unchecked
      checks[index].innerHTML = `<img src="${checkmarkType}" alt="Check Icon" height="20">`;
      term.htmlCode = createTermHTML(term);
      // Update the local storage and the viewport
      saveToLocalStorage();
    });

    // Delete clicked trash bin sign term
    trashBins[index].addEventListener('click', function () {
      // Remove term from the terms list
      terms.splice(index, 1);
      // Update the local storage and the viewport
      saveToLocalStorage();
      // Reload the terms list in the viewport
      loadTerms();
      // React to term clicks
      respondToClickedTerms();
    });
    

    // Define alternative index for term editing mode
    let editIndex = index;
    pencils[index].addEventListener('click', function editTerm() {
      // Function to edit a specific term in the viewport if pencil is clicked
      console.log(`start term.edit_mode=${term.edit_mode}, `+`index=${index}, `+`editIndex=${editIndex}`);

      //Toggle clicked pencil icon
      term.edit_mode = !term.edit_mode;
      // Update the local storage and the view port
      saveToLocalStorage();

      if (term.edit_mode === true) {

        // Update the local storage and the viewport
        saveToLocalStorage();
        // Reload the terms list in the viewport
        loadTerms();

        // Retrieve clickable items from the page's temporary HTML code
        let arrowUp = document.querySelector('.term-arrow-up');
        let arrowDown = document.querySelector('.term-arrow-down');  
    
        //If the term is not at the top...
        if (editIndex > 0){
          arrowUp.addEventListener('click', function arrowUpListener () {
            //Function to move term one level up in the list
            // Save both terms
            editIndex -= 1;
            const tempTerm0 = terms[editIndex].valueOf();
            const tempTerm1 = terms[editIndex+1].valueOf();
            // Swap terms in the array
            terms.splice(editIndex, 2, tempTerm1, tempTerm0);

            // Update the local storage and the viewport
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();

            // Switch back to reading mode
            term.edit_mode = false;
            // Continue to edit term
            editTerm();
          }, { once: true });
        }
            
        //If the term is not at the bottom...
        if (editIndex < terms.length-1){
          arrowDown.addEventListener('click', function arrowDownListener () {

            //Function to move term one level down in the list
            // Save both terms
            const tempTerm0 = terms[editIndex].valueOf();
            const tempTerm1 = terms[editIndex+1].valueOf();
            // Swap terms in the array
            terms.splice(editIndex, 2, tempTerm1, tempTerm0);
            editIndex += 1;

            // Update the local storage and the viewport
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();

            // Switch back to reading mode
            term.edit_mode = false;
            // Continue to edit term
            editTerm();
            }, { once: true });
        }
      }
      else {
        // Switch back to reading mode on if pencil is clicked again
        term.edit_mode = false;
        // Update the local storage and the view port
        saveToLocalStorage();
        // Reload the terms list in the viewport
        loadTerms();
      }
      // React to term clicks
      respondToClickedTerms();

      console.log(`finish term.edit_mode=${term.edit_mode}, `+`index=${index}, `+`editIndex=${editIndex}`);
    });
  });
  console.log('finish respondToClickedTerms');
}

// Function that adds a new term to the end of the terms array from a user input
function respondToNewTermClick() {
  // React to "Enter" key pressing as a mouse click
  inputField.addEventListener('keypress',function onEvent(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      button.click();
    }
  });
  // On a mouse click...
  button.addEventListener('click', function () {
    // Add term to the list
    addTerm();
  });
}

// Function to add a term to the terms array
function addTerm() {
  console.log('start addTerm');
  // Retreive text from the input field
  const newTerm = inputField.value.trim();
  // If the field is not empty... 
  if (newTerm.length > 0) {
    // Add term to the end of the terms list
    terms.push({text: newTerm, check_click: false, edit_mode: false, htmlCode: ''});
    // Create HTML code for the last added term
    terms[terms.length-1].htmlCode = createTermHTML(terms[terms.length-1]);
    // Clear the input field
    inputField.value = '';
    // Update the local storage and the view port
    saveToLocalStorage();
    // Reload the terms list in the viewport
    loadTerms();
    // React to term clicks
    respondToClickedTerms();
  }
  console.log('finish addTerm');
}

// Function to change the HTML code of the terms list to show it
function loadTerms() {
  console.log('loadTerms');
  // Clear list
  termsList.innerText = '';
  emptyListMessage.innerText = '';
  // If a term exists ...
  if (terms.length > 0) {
    // Create an HTML template for each existing term
    terms.forEach(function(term) {
      term.htmlCode = createTermHTML(term);
      // Insert term into the page
      termsList.innerHTML += `${term.htmlCode}`;
    });
  }
  // Otherwise show an "empty list" message
  else {
    emptyListMessage.innerText = 'La tua lista è vuota';
  }
//  console.log('finish loadTerms');
}

// Function to create an HTML template for a givven term
function createTermHTML(term) {
  console.log('execute createTermHTML');
  // Choose checkmark icon iF clicked
  let checkmarkIcon = "images/check_maybe.svg";
  if (term.check_click) {
    checkmarkIcon = "images/check.svg";
  }

  // HTML to append to the term if pencil icon is clicked: pencil and arrows icons
  let editIcon = "images/pencil.png";
  let htmlToAppend = "";
  if (term.edit_mode) {
    editIcon = "images/icon.png";
    htmlToAppend = `
    <div class="term-arrow-up">
      <img src="images/arrow_up.svg" alt="Arrow Up Icon" height="20">
    </div>
    <div class="term-arrow-down">
      <img src="images/arrow_down.svg" alt="Arrow Down Icon" height="20">
    </div>
    `;
  }

  // Return the following HTML
  const fullHTML = `
  <li class="term-item">
    <div class="term-check">
      <img src="${checkmarkIcon}" alt="Check Icon" height="20">
    </div>
    <div class="term-edit">
      <img src="${editIcon}" alt="Pencil Icon" height="20">
    </div>
    `
    +`${htmlToAppend}`+
    `<p class="term-text">${term.text}</p>
    <div class="term-delete">
      <img src="images/trash.png" alt="Delete Icon" height="20">
    </div>
  </li>
  `;
   
  return fullHTML;
}

// Function to update the local storage
function saveToLocalStorage() {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  console.log('executed saveToLocalStorage');
}
