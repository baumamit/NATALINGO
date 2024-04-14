// # _________ INITIALIZE MONGODB STORAGE SERVER ON PAGE RESTART _________
/*import *as MongoDB from "./mongoDB.js";
MongoDB.mongoDBinitialize();*/

// # _________ INITIALIZE ON PAGE RESTART _________

// 
// Include fs module for storage in the local server
// Explaination: https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// Explaination: https://www.geeksforgeeks.org/node-js-fs-createwritestream-method/
let fs = require('fs');
const user = 'natalie';

// Create a key for the local storage
const STORAGE_KEY = '__natalingo.14__';

// Import terms list elemetns from page
const emptyListMessage = document.querySelector('.empty-list-message');
const termsList = document.querySelector('.terms-list');

// Import 'new term' panel elemetns from page
const newTermForm = document.forms['add-new-term'];
const termType = newTermForm['menu-terms'];

const inputField = document.querySelector('input');
inputField.value = '';
const newTermButton = document.querySelector('.new-term-button');

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
// Define a terms list array
let terms = [];

// # _________ DYNAMIC PROCEDURES _________

// Message to show when there are no terms in the list
emptyListMessage.innerText = 'La tua lista è vuota';

// Check for new user input
respondToNewTermClick();


// Retrieve local storage
const storage = localStorage.getItem(STORAGE_KEY);
// If there were terms in the local storage...
if (storage) {
  //Save the terms list
  terms = JSON.parse(storage);
  //Save the terms list
  if (terms.length > 0) {
    // Rebuild all terms on page refresh
    for (let editIndex = 0; editIndex < terms.length; editIndex++) {
      terms[editIndex].edit_mode = false;
    }
    // Update the local storage
    saveToLocalStorage();
    // Load the terms list to the viewport
    loadTerms();

    // If there are list items shown in the viewport..
    if (items.length > 0) {
      // React to term clicks
      respondToClickedTerms();
    }
  }
}

loadFromUserFile(user);
saveToUserFile(user);
respondToCategoryChange();


// # _________ FUNCTIONS _________

function respondToCategoryChange() {
  termType.addEventListener('change', function () {
    // Load the terms list to the viewport
    loadTerms();
    // Check for new user input
    respondToClickedTerms();
  });
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
        saveToLocalStorage();
        // Reload the terms list in the viewport
        loadTerms();
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
        saveToLocalStorage();
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
          saveToLocalStorage();
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
          saveToLocalStorage();
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
      saveToLocalStorage();
      if (terms[termIndex].edit_mode === true) {
        // If edit mode was turned on - after 1st click on the edit button...
          // Reload the terms list in the viewport
          loadTerms();

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
              saveToLocalStorage();
              // Reload the terms list in the viewport
              loadTerms();
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
              saveToLocalStorage();
              // Reload the terms list in the viewport
              loadTerms();
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
          saveToLocalStorage();
          // Reload the terms list in the viewport
          loadTerms();
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
  saveToLocalStorage();

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
  inputField.addEventListener('keydown', (event) => {
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
  newTermButton.addEventListener('click', (event) => {
    // Add term to the list
    event.preventDefault();
    // Define position of the new term as last in the vieport 
    let newViewportIndex = 0;
    if (items.length > 0) {
      newViewportIndex = items.length;
    }
    // Retreive text from the input field
    const newTerm = inputField.value.trim();
    // If the field is not empty...
    if (newTerm.length > 0) {
      // Add the new term to the list of terms
      addNewTerm(newTerm, newViewportIndex);
    }
  });
}

// Asynchronous function to add a term to the terms array
async function addNewTerm(newTerm, newViewportIndex) {
  // Clear the input field
  inputField.value = '';
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
  saveToLocalStorage();
  // Reload the terms list in the viewport
  loadTerms();
  // React to term clicks
  respondToClickedTerms();
}

// Function to change the HTML code of the terms list to show it or an empty message
function loadTerms() {
  // Clear list in the viewport
  termsList.innerText = '';
  // Empty message in case there are terms in to show
  emptyListMessage.innerText = '';
  // If list items exists ...
  if (terms.length > 0) {
    // Declaration of index to follow the vieport position
    let viewportPositionIndex = 0;
    // Create an HTML template for each existing term
    terms.forEach(function(term) {
      if (term.grammatic_type == termType.value || termType.value == 'termini') {
        // Remove "empty-list-message" class to hide the block style
        emptyListMessage.classList.remove("empty-list-message");
        createTermHTML(term,viewportPositionIndex);
        // Insert term into the page
        termsList.innerHTML += `${term.htmlCode}`;
        viewportPositionIndex++;
      }
    });
    items = document.querySelectorAll('.list-item');
    if (items.length === 0) {
      // Add "empty-list-message" class to hide the block style
      emptyListMessage.classList.add("empty-list-message");
      // Message to show when there are no terms in the list
      emptyListMessage.innerText = `Non ci sono ${termType.value} salvati`;
    }
  }
  // Otherwise show an "empty list" message
  else {
    // Add "empty-list-message" class to hide the block style
    emptyListMessage.classList.add("empty-list-message");
    // Message to show when there are no terms in the list
    emptyListMessage.innerText = 'La tua lista è vuota';
  }
  // Define empty node list for list items from the current viewport HTML code
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
function saveToLocalStorage() {
  // Update the local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}

// Function to load the terms array stored as a string from each user's file in the local server
function loadFromUserFile(username) {
  const pathName = `${username}.txt`;
  //let file = fs.createWriteStream(pathName);

  fs.readFile(pathName, function(err, data) {
    if(err) throw err;
    let termsOfUser = data.toString().split("\n");
    console.log(termsOfUser);
  });
/*
  //create an empty file named mynewfile2.txt:
  fs.open(username,, function (err, file) {
    if (err) throw err;
    console.log('Saved!');
  });

  // the finish event is emitted when all data has been flushed from the stream
  file.on('finish', () => {
    console.log(`wrote all the array data to file ${pathName}`);
  });
  // handle the errors on the write process
  file.on('error', (err) => {
    console.error(`There was an error writing the file ${pathName} => ${err}`)
  });
  // write each value of the array on the file breaking line
  terms.forEach(term => file.write(`${term}\n`));
*/
  /*terms.forEach(function(term) {
    file.write(term.join(', ') + '\n');
  });*/
//  file.end();
}

// Function to save the terms array stored as a string to each user's file in the local server
function saveToUserFile(username) {
  const pathName = `${username}.txt`;
  let file = fs.createWriteStream(pathName);
  // the finish event is emitted when all data has been flushed from the stream
  file.on('finish', () => {
    console.log(`wrote all the array data to file ${pathName}`);
  });
  // handle the errors on the write process
  file.on('error', (err) => {
    console.error(`There was an error writing the file ${pathName} => ${err}`)
  });
  // write each value of the array on the file breaking line
  terms.forEach(term => file.write(`${term}\n`));

  /*terms.forEach(function(term) {
    file.write(term.join(', ') + '\n');
  });*/
  file.end();
}
