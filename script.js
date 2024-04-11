// # _________ INITIALIZE MONGODB STORAGE SERVER ON PAGE RESTART _________
/*import *as MongoDB from "./mongoDB.js";
MongoDB.mongoDBinitialize();*/

// # _________ INITIALIZE ON PAGE RESTART _________

// Create a key for the local storage
const STORAGE_KEY = '__natalingo.50__';

// Import terms list elemetns from page
const emptyListMessage = document.querySelector('.empty-list-message');
const termsList = document.querySelector('.terms-list');
// Import new term panel elemetns from page
const grammaticType = document.querySelector('grammatic-type');
const inputField = document.querySelector('input');
inputField.value = '';
const newTermButton = document.querySelector('.new-term-button');

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
let updatedTermBoxItalian = document.createElement(null);
let updatedTermBoxEnglish = document.createElement(null);
// Define a terms list array
let terms = [];

// # _________ DYNAMIC PROCEDURES _________

//console.log(grammaticType.valueOf);

// Load the terms list to the viewport
loadTerms();
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
  // Load the terms list to the viewport
  loadTerms();
  // React to term clicks
  respondToClickedTerms();
}

// # _________ FUNCTIONS _________

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

  terms.forEach(function(term, index) {
    // Delete term for clicked trash bin icon
    trashBins[index].addEventListener('click', function () {
      // Remove term from the terms list
      terms.splice(index, 1);
      // Update the local storage
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
      // Update the local storage
      saveToLocalStorage();
    });

    if (!term.edit_mode) {
      // present term translation for clicked flag button
      flagIconsItalian[index].addEventListener('click', function () {
        //Toggle flag icon click status
        term.flag_click_it = !term.flag_click_it;
        // Toggle show/hide class for CSS code
        flagIconsItalian[index].classList.toggle("term-hide");
        if (term.flag_click_it) {
          // Declare and initialize Italian flag with hidden text
          flagIconsItalian[index].previousElementSibling.remove();
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
          flagIconsItalian[index].insertAdjacentElement('beforebegin', htmlObject)        // Update the relevant vieport section
        }
        // Create and update a new HTML template for the edited term
        createTermHTML(term);
        // Update the local storage
        saveToLocalStorage();
      });

      // present term translation for clicked flag button
      flagIconsEnglish[index].addEventListener('click', function () {
        //Toggle checkmark click status
        term.flag_click_en = !term.flag_click_en;
        // Toggle show/hide class for CSS code
        flagIconsEnglish[index].classList.toggle("term-hide");
        if (term.flag_click_en) {
          // Declare and initialize Italian flag with hidden text
          flagIconsEnglish[index].nextElementSibling.remove();
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
          flagIconsEnglish[index].insertAdjacentElement('afterend', htmlObject)        // Update the relevant vieport section
        }
        // Create and update a new HTML template for the edited term
        createTermHTML(term);
        // Update the local storage
        saveToLocalStorage();
      });
    }

  });
}

// Run procedure to retrieve edit icons and respond to their clicks
function respondToEdit() {
  // Retrieve clickable edit icons from the page's HTML code
  pencils = document.querySelectorAll('.term-edit');
  for (let pencilIndex = 0; pencilIndex < terms.length; pencilIndex++) {
    pencils[pencilIndex].addEventListener('click', function editTerm() {
    // Function to edit a specific term in the viewport when pencil is clicked

      // Edit mode is still turned on - after 2nd click on the edit button...
      if (terms[pencilIndex].edit_mode === true) {
        // Replace and save edited term with user input
        updateTermFromInput(pencilIndex);
      }
      // Toggle editting mode and make sure that only one term at the time is being edited
      for (let editIndex = 0; editIndex < terms.length; editIndex++) {
        if (editIndex === pencilIndex) {
          // Toggle editing/reading mode for the current term
          terms[editIndex].edit_mode = !terms[editIndex].edit_mode;
        }
        else {
          // Keep or switch back to reading mode all other terms
          terms[editIndex].edit_mode = false;
        }
      }
      // Update the local storage
      saveToLocalStorage();

      if (terms[pencilIndex].edit_mode === true) {
      // If edit mode was turned on - after 1st click on the edit button...

        // Reload the terms list in the viewport
        loadTerms();

        // Retrieve clickable arrows from the page's temporary HTML code
        const arrowUp = document.querySelector('.term-arrow-up');
        // If the term is not at the top...
        if (pencilIndex > 0) {
          arrowUp.addEventListener('click', function() {
          // Function to move term one level up in the list on arrow click
            // Replace and save edited term with user input
            updateTermFromInput(pencilIndex);
            // Save both terms
            pencilIndex -= 1;
            const tempTerm0 = terms[pencilIndex].valueOf();
            const tempTerm1 = terms[pencilIndex+1].valueOf();
            // Swap terms in the array
            terms.splice(pencilIndex, 2, tempTerm1, tempTerm0);

            // Update the local storage
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();
            // Flip back to keep editing
            terms[pencilIndex].edit_mode = false;
            // Continue to edit term
            editTerm();
          });
        }
            
        // Retrieve clickable arrows from the page's temporary HTML code
        const arrowDown = document.querySelector('.term-arrow-down');
        // If the term is not at the bottom...
        if (pencilIndex < terms.length-1) {
          arrowDown.addEventListener('click', function() {
          // Function to move term one level down in the list on arrow click
            // Replace and save edited term with user input
            updateTermFromInput(pencilIndex);
            // Save both terms
            const tempTerm0 = terms[pencilIndex].valueOf();
            const tempTerm1 = terms[pencilIndex+1].valueOf();
            // Swap terms in the array
            terms.splice(pencilIndex, 2, tempTerm1, tempTerm0);
            pencilIndex += 1;

            // Update the local storage
            saveToLocalStorage();
            // Reload the terms list in the viewport
            loadTerms();
            // Flip back to keep editing
            terms[pencilIndex].edit_mode = false;
            // Continue to edit term
            editTerm();
          });
        }

        // Replace and save edited term with user input
        updateTermFromInput(pencilIndex);
        // Rerun procedure to retrieve edit icons and listen to their clicks
        respondToEdit();
      }
      else { 
      // Edit mode was turned off - after 2nd click on the edit button...
        // Update the local storage
        saveToLocalStorage();
        // Reload the terms list in the viewport
        loadTerms();
        // React to term clicks
        respondToClickedTerms();
      }
    });

  }
}

// Function to read edited term input
function updateTermFromInput(indexUpdate) {

  // Retrieve updated term and translation values from the page's temporary HTML code
  updatedTermBoxItalian = document.querySelector('.term-text-it-edit');
  updatedTermBoxEnglish = document.querySelector('.term-text-en-edit');

  // React to edited term "Enter" key (code=13) pressing as a mouse click
  const updatedTermTextItalian = updatedTermBoxItalian.value.trim();
  if (updatedTermTextItalian.length > 0) {
  // If not empty...
    // Update the terms array values
    terms[indexUpdate].text_italian = updatedTermTextItalian;
  }
  const updatedTermTextEnglish = updatedTermBoxEnglish.value.trim();
  if (updatedTermTextEnglish.length > 0) {
    // If not empty...
      // Update the terms array values
      terms[indexUpdate].text_english = updatedTermTextEnglish;
  }
  // Update the local storage
  saveToLocalStorage();

  updatedTermBoxItalian.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      updateTermFromInput(indexUpdate);
      pencils[indexUpdate].click();
    }
  });

  // React to edited term translation "Enter" key (code=13) pressing as a mouse click
  updatedTermBoxEnglish.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      updateTermFromInput(indexUpdate);
      pencils[indexUpdate].click();
    }
  });
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
  // Translate text and insert into a new variable
  let newEnglishTranslation = await mymemoryTranslate(newTerm);
  // Change text to lower case
  newEnglishTranslation = newEnglishTranslation.toLowerCase();
  // If the field is not empty... 
  if (newTerm.length > 0) {
    // Add term to the end of the terms list
    terms.push({grammatic_type: "type-others", text_italian: newTerm, text_english: newEnglishTranslation, check_click: false, 
      flag_click_it: false, flag_click_en: false, edit_mode: false, htmlCode: ''});
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

// Function to change the HTML code of the terms list to show it or an empty message
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
          <input class="term-text-it-edit edit-mode" type="text" value="${term.text_italian}">
        </div>
        <div>
          <input class="term-text-en-edit edit-mode" type="text" value="${term.text_english}">
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

// Function for translation of text from Italian to English
async function mymemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|en`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const result = jsonData.responseData.translatedText;
  return result;
}

// Function to update the local storage
function saveToLocalStorage() {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}
