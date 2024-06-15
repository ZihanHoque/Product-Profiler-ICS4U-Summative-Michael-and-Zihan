// initialize the date input to know the current date as the newest acceptable one
function setDate() {
  var today = new Date();
  today.setTime(today.getTime() - (today.getTimezoneOffset() * 60 * 1000)); // account for timezone shift, since toISOString defaults to UTC
  document.getElementById("dateLastPurchased").max = today.toISOString().substring(0, 10);
  document.getElementById("dateLastPurchased").value = today.toISOString().substring(0, 10);
}

// generate a new field to add a comment to an item profile, possibly with preset text
function addNewComment(commentString) {
  var comments = document.getElementById("comment-panel");
  if (comments.children.length < 3) { // max commments/links of 3
    var newRow = document.createElement("div");
    var newComment = document.createElement("textarea");
    if (commentString) { // if text has been given, initialize comment with it
      newComment.append(commentString);
    }
    newComment.id = "comm" + (comments.children.length + 1); 
    newComment.name = newComment.id;
    newComment.placeholder = "*Comment*";
    
    // building the associated delete to the new comment field
    var deleteButton = document.createElement("button");
    deleteButton.style.width = "100%"; 
    deleteButton.addEventListener("click", deleteRow)
    deleteButton.appendChild(document.createTextNode("Delete Comment Above"));
    
    newRow.appendChild(newComment);
    newRow.appendChild(deleteButton);
    comments.appendChild(newRow);
  }
  else {
    alert("Max Comment Number Reached");
  }
}

// locate and wipe the event source's comment/link row 
function deleteRow(event) {
  event.target.parentElement.remove();
}

// stick a new link field on, carbon copy of addNewComment
function addNewLink(linkString) {
  var links = document.getElementById("links-panel");
  if (links.children.length < 3) {
    var newRow = document.createElement("div");
    var newLink = document.createElement("input");
    if (linkString) {
      newLink.value = linkString;
    }
    var deleteButton = document.createElement("button");
    deleteButton.style.marginTop = "1vh";
    deleteButton.style.width = "100%";
    newLink.type = "text";
    newLink.id = "link"+(links.children.length + 1);
    newLink.name = newLink.id;
    newLink.placeholder = "*Link*"
    deleteButton.addEventListener("click", deleteRow);
    deleteButton.appendChild(document.createTextNode("Delete Link Above"));
    newRow.appendChild(newLink);
    newRow.appendChild(deleteButton);
    links.appendChild(newRow);
  }
  else {
    alert("Max Link Number Reached");
  }
}

// grabs img file input from user and displays it in a below div
function setPreview() {
  if (document.getElementById("profilePic").files[0] && document.getElementById("profilePic").files) {
    var image = document.getElementById("profilePic").files[0];
    if (image.type.startsWith("image/")) {
      var fReader = new FileReader();
      var container = document.getElementById("preview-container");
      var preview;
      if (container.hasChildNodes()) { // avoid stacking multiple child images onto the container
        preview = container.children[0];
      } else {
        preview = document.createElement("img");
      }
      fReader.onload = (e) => {
        preview.src = e.target.result; // the src attribute can read data URLs, which is cool
        container.appendChild(preview);
      };
      fReader.readAsDataURL(image); // encode the image into a url string 
    }
  }
}

// package given item information into a Form, and send the item creation request to the server
function createItem() {
  if (document.getElementById("iName").value.length < 1) { // manual requirement validation because name field is important
    alert("Missing Item Name");
  }
  else {
    var itemDetails = new FormData();
    var purchaseDate = document.getElementById("dateLastPurchased").valueAsDate;
    purchaseDate.setTime(purchaseDate.getTime() + (purchaseDate.getTimezoneOffset() * 60 * 1000));// read back the timezone shift applied by .valueAsDate (input type=date defaults to UTC, so valueAsDate shifts it by -getTimezoneOffset() minutes to get to UTC, which can cause discrepencies between user input and stored value)
    var comments = [];
    var links = [];
  
    for (var i = 1; document.getElementById("comm" + i) != null; i++) {
      comments.push(document.getElementById("comm" + i).value);
    }
    for (var j = 1; document.getElementById("link" + j) != null; j++) {
      links.push(document.getElementById("link" + j).value);
    }
  
    itemDetails.append("ItemName", document.getElementById("iName").value);
    itemDetails.append("Description", document.getElementById("desc").value);
    itemDetails.append("Comments", JSON.stringify(comments));
    itemDetails.append("Links", JSON.stringify(links));
    itemDetails.append("LastPurchased", purchaseDate);
    
    // checks if an image was inputted into the preview
    if (document.getElementById("preview-container").hasChildNodes()) {
      itemDetails.append("ImageDataURL", document.getElementById("preview-container").children[0].src); // grab that DataURL setPreview() already made, instead of waiting to encode another
    }

    // change the page back to transaction history if the item creation was successful
    var req = new XMLHttpRequest();
    req.open("post", "/items/create");
    req.onload = () => {  
      if (req.response != "success") {
        alert(req.response);
      } else {
        location = "/history";
      }  
    }
    req.send(itemDetails);
  }
}

// navbar page redirection based on button clicked
function changePage(newPage) {
  location = newPage;
}