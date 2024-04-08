// # INITIALIZE MONGODB STORAGE SERVER ON PAGE RESTART
/*import *as MongoDB from "./mongoDB.js";
MongoDB.mongoDBinitialize();*/

// # INITIALIZE ON PAGE RESTART _____________________________________

// Create a key for the local storage
const STORAGE_KEY = '__natalingo.48__';

// Import page elemetns
const newTermButton = document.querySelector('.new-term-button');
const inputField = document.querySelector('input');
inputField.value = '';
const termsList = document.querySelector('.terms-list');
const emptyListMessage = document.querySelector('.empty-list-message');

// Define empty node list for clickable items from the page's HTML code
let pencils = document.createElement(null);
// Define empty node list for clickable trash bins from the page's HTML code
let trashBins = document.createElement(null);
// Define empty node list for clickable flags from the page's HTML code
let flagIconsItalian = document.createElement(null);
let flagIconsEnglish = document.createElement(null);
// Define empty node list for clickable checkmarks from the page's HTML code
let checks = document.createElement(null);

// Define empty node list for term and translation values
let updatedTermBox = document.createElement(null);
let updatedTermBoxEnglish = document.createElement(null);
// Define a terms list array
let terms = [];

// # DYNAMIC PROCEDURES _____________________________________

// Check for new user input
respondToNewTermClick();

// Retrieve local storage
const storage = localStorage.getItem(STORAGE_KEY);
// If there were terms in the local storage...
if (storage) {
  //Save the terms list
  terms = JSON.parse(storage);
  // Rebuild all terms on page refresh
  for (let editIndex = 0; editIndex < terms.length; editIndex++) {
    terms[editIndex].edit_mode = false;
  }
}
// Load the terms list to the viewport
loadTerms();
// React to term clicks
respondToClickedTerms();

// # FUNCTIONS _____________________________________

async function mymemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|en`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const result = jsonData.responseData.translatedText;
  return result;
}

// Function that responds to uploaded term clicks in the viewport
function respondToClickedTerms() {
  // Retrieve clickable edit icons from the page's HTML code
  pencils = document.querySelectorAll('.term-edit');
  // Retrieve clickable trash bins from the page's HTML code
  trashBins = document.querySelectorAll('.term-delete');
  // Retrieve clickable flags from the page's HTML code
  flagIconsItalian = document.querySelectorAll('.flag-button-it');
  flagIconsEnglish = document.querySelectorAll('.flag-button-en');
  // Retrieve clickable checkmarks from the page's HTML code
  checks = document.querySelectorAll('.term-check');
  
  // Create an HTML template for each existing term
  terms.forEach(function(term, index) {
    pencils[index].addEventListener('click', function editTerm() {
      // Function to edit a specific term in the viewport when pencil is clicked

      if (term.edit_mode === true) {
        // Replace and save edited term with user input
        updateTermFromInput(index);
      }
      // Make sure that only one term at the time is being edited
      for (let editIndex = 0; editIndex < terms.length; editIndex++) {
        if (editIndex === index) {
          // Toggle editing/reading mode
          terms[editIndex].edit_mode = !terms[editIndex].edit_mode;
        }
        else {
          // Keep or switch back to reading mode all other terms
          terms[editIndex].edit_mode = false;
        }
      }
      
      // Update the local storage and the viewport
      saveToLocalStorage();
      // Reload the terms list in the viewport
      loadTerms();

      if (term.edit_mode === true) {
      
        // Retrieve clickable edit icons from the page's HTML code
        pencils = document.querySelectorAll('.term-edit');
        // Retrieve clickable trash bins from the page's HTML code
        trashBins = document.querySelectorAll('.term-delete');
        // Retrieve clickable flags from the page's HTML code
        flagIconsItalian = document.querySelectorAll('.flag-button-it');
        flagIconsEnglish = document.querySelectorAll('.flag-button-en');
        // Retrieve clickable checkmarks from the page's HTML code
        checks = document.querySelectorAll('.term-check');

        // Retrieve clickable items from the page's temporary HTML code
        const arrowUp = document.querySelector('.term-arrow-up');
        const arrowDown = document.querySelector('.term-arrow-down');

        // If the term is not at the top...
        if (index > 0) {
          arrowUp.addEventListener('click', function() {
          // Function to move term one level up in the list on arrow click
            // Replace and save edited term with user input
            updateTermFromInput(index);
            // Save both terms
            index -= 1;
            const tempTerm0 = terms[index].valueOf();
            const tempTerm1 = terms[index+1].valueOf();
            // Swap terms in the array
            terms.splice(index, 2, tempTerm1, tempTerm0);

            // Update the local storage and the viewport
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();
            // Flip back to keep editing
            terms[index].edit_mode = false;
            // Continue to edit term
            editTerm();
          });
        }
            
        // If the term is not at the bottom...
        if (index < terms.length-1) {
          arrowDown.addEventListener('click', function() {
          // Function to move term one level down in the list on arrow click
            // Replace and save edited term with user input
            updateTermFromInput(index);
            // Save both terms
            const tempTerm0 = terms[index].valueOf();
            const tempTerm1 = terms[index+1].valueOf();
            // Swap terms in the array
            terms.splice(index, 2, tempTerm1, tempTerm0);
            index += 1;

            // Update the local storage and the viewport
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();
            // Flip back to keep editing
            terms[index].edit_mode = false;
            // Continue to edit term
            editTerm();
          });
        }

        // Replace and save edited term with user input
        updateTermFromInput(index);
        // React to edited term "Enter" key (code=13) pressing as a mouse click
        updatedTermBox.addEventListener("keydown", (event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            pencils[index].click();
          }
        });
        // React to edited term translation "Enter" key (code=13) pressing as a mouse click
        updatedTermBoxEnglish.addEventListener("keydown", (event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            pencils[index].click();
          }
        });

      }
      else { 
      }
      // React to term clicks
      respondToClickedTerms();
    });
    
    // Delete term for clicked trash bin icon
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

    //Toggle clicked checkmark
    checks[index].addEventListener('click', function () {
      //Toggle checkmark click status
      term.check_click = !term.check_click;
      let checkmarkType = "images/check_maybe.svg";
      // If checkmark checked
      if (term.check_click) {
        checkmarkType = "images/checkmark.png";
      } 
      // Checkmark unchecked
      checks[index].innerHTML = `<img class="check-icon" src="${checkmarkType}" alt="Check Icon">`;
      createTermHTML(term);
      // Update the local storage and the viewport
      saveToLocalStorage();
    });

    if (term.edit_mode) {
      // present term translation for clicked flag button
      flagIconsItalian[index].addEventListener('click', function () {
        //Toggle checkmark click status
        term.flag_click_it = !term.flag_click_it;
        // Create and update a new HTML template for the edited term
        createTermHTML(term);
        // Clear list
        termsList.innerText = '';
        // Create an HTML template for each existing term
        terms.forEach(function(term) {
          // Insert term into the page
          termsList.innerHTML += `${term.htmlCode}`;
        });

        // Update the local storage and the viewport
        saveToLocalStorage();
        // React to term clicks
        respondToClickedTerms();
      });

      // present term translation for clicked flag button
      flagIconsEnglish[index].addEventListener('click', function () {
        //Toggle checkmark click status
        term.flag_click_en = !term.flag_click_en;
        // Create and update a new HTML template for the edited term
        createTermHTML(term);
        // Clear list
        termsList.innerText = '';
        // Create an HTML template for each existing term
        terms.forEach(function(term) {
          // Insert term into the page
          termsList.innerHTML += `${term.htmlCode}`;
        });

        // Update the local storage and the viewport
        saveToLocalStorage();
        // React to term clicks
        respondToClickedTerms();
      });
    }

  });
}

// Function to read edited term input
function updateTermFromInput(index) {
  // Retrieve updated term and translation values from the page's temporary HTML code
  updatedTermBox = document.querySelector('.term-text-it-edit');
  updatedTermBoxEnglish = document.querySelector('.term-text-en-edit');
  const updatedTermText = updatedTermBox.value.trim();
  const updatedTermTextEnglish = updatedTermBoxEnglish.value.trim();
  if (updatedTermText.length > 0) {
  // If not empty...
    // Update the terms array values
    terms[index].text = updatedTermText;
    terms[index].textEnglish = updatedTermTextEnglish;
    // Update the local storage and the viewport
    saveToLocalStorage();
  }
}

// Function that adds a new term to the end of the terms array from a user input
function respondToNewTermClick() {
  // React to "Enter" key pressing as a mouse click
  inputField.addEventListener('keypress',function onEvent(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      newTermButton.click();
    }
  });
  // On a mouse click on the + for a new term button...
  newTermButton.addEventListener('click', function () {
    // Add term to the list
    addTerm();
  });
}

// Function to add a term to the terms array
async function addTerm() {
  // Retreive text from the input field
  const newTerm = inputField.value.trim();
  let newEnglishTranslation = await mymemoryTranslate(newTerm);
  newEnglishTranslation = newEnglishTranslation.toLowerCase();
  // If the field is not empty... 
  if (newTerm.length > 0) {
    // Add term to the end of the terms list
    terms.push({textItalian: newTerm, textEnglish: newEnglishTranslation, check_click: false, 
      flag_click_it: true, flag_click_en: true, edit_mode: false, htmlCode: ''});
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
}

// Function to change the HTML code of the terms list to show it
function loadTerms() {
  // Clear list
  termsList.innerText = '';
  // Empty message unless there are no terms in the list
  emptyListMessage.innerText = '';
  // If a term exists ...
  if (terms.length > 0) {
    // Remove "empty-list-message" class to hide the block style
    emptyListMessage.classList.remove("empty-list-message");
    // Create an HTML template for each existing term
    terms.forEach(function(term) {
      createTermHTML(term);
      // Insert term into the page
      termsList.innerHTML += `${term.htmlCode}`;
    });
  }
  // Otherwise show an "empty list" message
  else {
    // Add "empty-list-message" class to hide the block style
    emptyListMessage.classList.add("empty-list-message");
    // Message to show when there are no terms in the list
    emptyListMessage.innerText = 'La tua lista è vuota';
  }
}

// Function to create an HTML template for a givven term
function createTermHTML(term) {
  // Toggle checkmark icon if clicked
  let checkmarkIcon = "images/check_maybe.svg";
  
  if (term.check_click) {
    checkmarkIcon = "images/checkmark.png";
  }
    
  // Declare and initialize Italian flag with hidden text
  let textHTMLit = `
    <button class="flag-button-it flag-button-hide" data-lang="it">🇮🇹</button>
  `;
  if (term.flag_click_it) {
    textHTMLit = `
      <p class="term-text-it read-mode">${term.textItalian}</p>
      <button class="flag-button-it flag-button-show" data-lang="it">🇮🇹</button>
    `;
  }

  // Declare and initialize Italian flag with hidden text
  let textHTMLen = `
    <button class="flag-button-en flag-button-hide" data-lang="en">🇬🇧</button>
  `;
  if (term.flag_click_en) {
    textHTMLen = `
      <button class="flag-button-en flag-button-show" data-lang="en">🇬🇧</button>
      <p class="term-text-en read-mode">${term.textEnglish}</p>
  `;
  }

  let editIconHTML = `
    <div class="term-edit read-mode">
      <img class="pencil-icon" src="images/pencil.png" alt="Pencil Icon">
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
          <input class="term-text-it-edit edit-mode" type="text" value="${term.textItalian}">
        </div>
        <div>
          <input class="term-text-en-edit edit-mode" type="text" value="${term.textEnglish}">
        </div>
      </div>
    `;
    textHTMLen = ``;
  }

  // Return the following HTML
  const fullHTML = `
    <li class="term-item">
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

// Function to update the local storage
function saveToLocalStorage() {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}
