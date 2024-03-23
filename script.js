// # INITIALIZE ON PAGE RESTART

// Import page elemetns
const button = document.querySelector('button');
const inputField = document.querySelector('input');
const termsList = document.querySelector('.terms-list');
const emptyListMessage = document.querySelector('.empty-list-message');

// Create a key for the local storage
const STORAGE_KEY = '__natalingo.13__';
// Define a terms list array
let terms = [];
console.log(terms);

// Retrieve local storage
const storage = localStorage.getItem(STORAGE_KEY);
// If there were terms in the local storage...
if (storage) {
  //Save the terms list
  terms = JSON.parse(storage);
  console.log(terms);
  //  terms.text = JSON.parse(storage);
//  console.log(terms);
}
showContent();

// # DYNAMIC PROCEDURES 
respondToNewTermClick();

// # FUNCTIONS 


// Function that decide what to show in viewport
function showContent() {
  console.log('start showContent');
  // Reload the terms list to the viewport
  loadTerms();
  // If a term exists ...
  if (terms.length > 0) {
    // Reload the terms list to the viewport
    respondToClickedTerms();
  }
  // Otherwise show an "empty list" message
  else {
    emptyListMessage.innerText = 'La tua lista è vuota';
  }
  console.log('finished showContent');
}

function respondToClickedTerms() {
  // Retrieve clickable items from the page's HTML code
  let checks = document.querySelectorAll('.term-check');
  let trashBins = document.querySelectorAll('.term-delete');
  let termItems = document.querySelectorAll('.term-item');
  let termTexts = document.querySelectorAll('.term-text');
  // Create an HTML template for each existing term
  terms.forEach(function(term, index) {

    //Toggle clicked checkmark icon
    checks[index].addEventListener('click', function () {
      term.check_click = !term.check_click;
      // Update the local storage and the view port
      saveToLocalStorage();
      // Check for new user actions
      showContent();
    });

    // Delete clicked trash bin sign term
    trashBins[index].addEventListener('click', function () {
      // Remove term from the terms list
      terms.splice(index, 1);
      // Update the local storage and the view port
      saveToLocalStorage();
      // Check for new user actions
      showContent();
    });
    
    //Toggle pencil icon whenever the mouse hovers over a term item or text
    termItems[index].addEventListener('mouseover',function onEvent(event) {
      event.preventDefault();
      termTexts[index].mouseover();
    });
    termItems[index].addEventListener('mouseleave',function onEvent(event) {
      event.preventDefault();
      termTexts[index].mouseleave();
    });

    termTexts[index].addEventListener('mouseover', function () {
      term.pencil_click = true;
      termTexts[index].addEventListener('mouseleave', function () {
        term.pencil_click = false;
        showContent();
      });
      // Reload the terms list to the viewport
      loadTerms();
      // Retrieve clickable items from the page's temporary HTML code
      let pencil = document.querySelector('.term-edit');
      let arrowUp = document.querySelector('.term-arrow-up');
      let arrowDown = document.querySelector('.term-arrow-down');  

      //If the term is not at the top...
      if (index > 0){
        arrowUp.addEventListener('click', function () {
          //Move term one level up in the list
          const tempTerm = terms[index];
          terms[index] = terms[index-1];
          terms[index-1] = tempTerm;
          // Update the local storage and the view port
          saveToLocalStorage();
          // Check for new user actions
          showContent();
        });
      }
    
      //If the term is not at the bottom...
      if (index != terms.length){
        arrowDown.addEventListener('click', function () {
          //Move term one level down in the list
          const tempTerm = terms[index+1];
          terms[index+1] = terms[index];
          terms[index] = tempTerm;
          // Update the local storage and the view port
          saveToLocalStorage();
          // Check for new user actions
          showContent();
        });
      }

      console.log(pencil);
      pencil.addEventListener('click', function () {
        // *** FOR NOW NO IDEA WHAT TO DO ***
        term.pencil_click = !!term.pencil_click;
        // Update the local storage and the view port
        saveToLocalStorage();
        // Check for new user actions
        showContent();
      });

    });
  });
}

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

// Function to add a term
function addTerm() {
  console.log('start addTerm');
  // Retreive text from the input field
  const newTerm = inputField.value.trim();
  // If the field is not empty... 
  if (newTerm.length > 0) {
    // Add term to the end of the terms list
    terms.push({text:newTerm, check_click:false, pencil_click:false});
    // Clear the input field
    console.log(terms);
    inputField.value = '';
    // Update the local storage and the view port
    saveToLocalStorage();
    loadTerms();
  }
  console.log('finish addTerm');
}

// Function to change the HTML code of the terms list to show it
function loadTerms() {
  console.log('start loadTerms');
  // Clear list
  termsList.innerText = '';
  emptyListMessage.innerText = '';
  // If a term exists ...
  if (terms.length > 0) {
    let template = '';
    // Create an HTML template for each existing term
    terms.forEach(function(term) {
      template = createTermTemplate(term);
      // Insert term into the page
      termsList.innerHTML += template;
    });
  }
  // Otherwise show an "empty list" message
  else {
    emptyListMessage.innerText = 'La tua lista è vuota';
  }
  console.log('finish loadTerms');
}

// Function to create an HTML template for a givven term
function createTermTemplate(term) {
  console.log('execute createTermTemplate');
  let checkmarkType = "images/check_maybe.svg";
  if (term.check_click) {
    checkmarkType = "images/check.svg";
  }

  // HTML to append to the term if pencil icon is clicked: pencil and arrows icons
  let htmlToAppend = "";
  if (term.pencil_click) {
    htmlToAppend = `
    <div class="term-edit">
    <img src="images/pencil.png" alt="Pencil Icon" height="20">
  </div>
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
      <img src="${checkmarkType}" alt="Check Icon" height="20">
    </div>`
    +`${htmlToAppend}`+
    `<p class="term-text">${term.text}</p>
    <div class="term-delete">
      <img src="images/trash.png" alt="Delete Icon" height="20">
    </div>
  </li>
  `;
   
  return fullHTML;
}

function saveToLocalStorage() {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  console.log('executed saveToLocalStorage');
}
