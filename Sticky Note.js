// ==UserScript==
// @name Sticky Note
// @namespace http://your.namespace.com
// @version 1.8
// @description Adds a sticky note to the browser for taking quick notes
// @match https://*/*
// @match http://*/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==

(function () {
  'use strict';

  // Create the sticky note element
  var note = document.createElement('div');
  note.id = 'sticky-note';
  note.contentEditable = true;
  note.spellcheck = false;
  note.style.display = 'none';
  note.style.position = 'fixed';
  note.style.top = '10px';
  note.style.right = '10px';
  note.style.width = '7em';
  note.style.height = '8em';
  note.style.padding = '10px';
  note.style.backgroundColor = 'rgba(255, 215, 0, 0.9)'; // Set opacity to 90%
  note.style.color = '#000000';
  note.style.fontFamily = 'Arial, sans-serif';
  note.style.fontSize = '14px';
  note.style.zIndex = '9999';
  note.style.borderRadius = '10px'; // Rounded corners
  note.style.boxShadow =
    '0px -3px 10px rgba(0, 0, 0, 0.3), 0px 0px 10px rgba(255, 215, 0, 0.5)'; // Upper shadow and glow shadow
  note.style.overflow = 'auto'; // Enable scrollbars when content exceeds the box height

  // Append the note to the document
  document.body.appendChild(note);

  // Show or hide the note when Tab key is pressed
  var isNoteVisible = false;

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      isNoteVisible = !isNoteVisible;
      note.style.display = isNoteVisible ? 'block' : 'none';
      event.preventDefault(); // Prevents the default tab behavior
    }
  });

  // Save note content when it's changed
  note.addEventListener('input', function () {
    var content = note.innerText; // Use innerText to get plain text without HTML tags
    GM_setValue('stickyNoteContent', content);
    resizeNote();
  });

  // Remove note when the page is unloaded
  window.addEventListener('beforeunload', function () {
    GM_deleteValue('stickyNoteContent'); // Delete the stored note content
    document.body.removeChild(note);
  });

  // Resize the note based on content length
  function resizeNote() {
    var content = note.innerText; // Use innerText to get plain text without HTML tags
    note.style.height = ''; // Reset the height to recalculate the scrollable height

    // Determine text direction based on the note content
    if (isRTLText(content)) {
      note.style.direction = 'rtl';
    } else {
      note.style.direction = 'ltr';
    }
  }

  // Check if text contains right-to-left (RTL) characters
  function isRTLText(text) {
    var rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
  }

  // Retrieve note content if available
  var storedContent = GM_getValue('stickyNoteContent');
  if (storedContent) {
    note.innerText = storedContent;
  }

  // Resize the note when it becomes visible
  note.addEventListener('transitionend', function () {
    if (isNoteVisible) {
      resizeNote();
    }
  });
})();
