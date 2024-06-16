// global hard copy of profiles. helps for search functionality
var profiles = [];

// redirect user to selected page from navbar
function changePage(newPage) {
  location = newPage;
}

// ping server to request the user's items, then display their profiles in a table
function loadHistory() {
  var req = new XMLHttpRequest();
  req.open("post", "/items/load");
  req.responseType = "json";
  req.onload = () => {
    var table = document.getElementsByClassName("transactionTable")[0];
    for (var Item of req.response) {
      var profile = makeProfile(Item);
      table.appendChild(profile);
      profiles.push(profile);
    }
  }
  req.send();
}

// build and return the HTML structure of a given item's profile
function makeProfile(Item) {
  var purchaseDate = new Date(Item.LastPurchased);
  var profile = document.createElement("div");
  profile.classList.add("profile");
  var dateLabel = document.createElement("div");
  dateLabel.classList.add("dateLabel");
  profile.appendChild(dateLabel);
  var date = document.createElement("h3");
  date.append("LAST PURCHASED: " + purchaseDate.toDateString());
  dateLabel.appendChild(date);
  var profileBody = document.createElement("div");
  profileBody.classList.add("profileBody");
  profile.appendChild(profileBody);
  var topSection = document.createElement("div");
  topSection.classList.add("topSection");
  profileBody.appendChild(topSection);
  var bottomSection = document.createElement("div");
  bottomSection.classList.add("bottomSection");
  profileBody.appendChild(bottomSection);
  var imageContainer = document.createElement("div");
  imageContainer.classList.add("imageContainer");
  topSection.appendChild(imageContainer);
  var image = document.createElement("img");
  if (Item.ImageDataURL) { // dodge the windows file not found icon
    image.src = Item.ImageDataURL;
  }
  else {
    image.src = "/images/no-image-icon-512x512-lfoanl0w.png";
  }
  imageContainer.appendChild(image);
  var mainText = document.createElement("div");
  mainText.classList.add("mainText");
  topSection.appendChild(mainText);
  var ItemName = document.createElement("h4");
  ItemName.append(Item.Name);
  mainText.appendChild(ItemName);
  var description = document.createElement("p");
  description.append(Item.Description); 
  mainText.appendChild(description);
  var comments = document.createElement("div");
  comments.classList.add("comments");
  bottomSection.appendChild(comments);
  var commentLabel = document.createElement("div");
  commentLabel.classList.add("commentLabel");
  commentLabel.append("COMMENTS:");
  comments.appendChild(commentLabel);
  var commentContainer = document.createElement("div");
  commentContainer.classList.add("commentContainer");
  var commentText = document.createElement("pre");
  for (var comment of Item.Comments) {
    commentText.append("" + comment + "\n"); // using pre so ordering is easier. realistically, its probably better to do this in a <ul>
  }
  commentContainer.appendChild(commentText);
  comments.appendChild(commentContainer);
  var links = document.createElement("div");
  links.classList.add("links");
  bottomSection.appendChild(links);
  var linkLabel = document.createElement("div");
  linkLabel.classList.add("linkLabel");
  linkLabel.append("LINKS:");
  links.appendChild(linkLabel);
  var linkContainer = document.createElement("div");
  linkContainer.classList.add("linkContainer");
  var linkText = document.createElement("pre");
  for (var linkString of Item.Links) {
    var link = document.createElement("a");
    link.href = linkString;
    link.target = "_blank";
    link.append(linkString);
    linkText.appendChild(link);
    linkText.append("\n");
  }
  linkContainer.appendChild(linkText);
  links.appendChild(linkContainer);
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  bottomSection.appendChild(buttonContainer);
  var cartButton = document.createElement("button");
  cartButton.classList.add("profileButton");
  var cartIcon = document.createElement("img");

  // display the appropriate button based off the item's cart status 
  if (Item.InCart) {
    cartIcon.src = "/images/remove-from-cart.png";
    cartButton.onclick = (e) => {
      removeFromCart(e);
    } 
  } else {
    cartIcon.src = "/images/add-to-cart.png";
    cartButton.onclick = (e) => {
      addToCart(e);
    }
  }
  cartButton.appendChild(cartIcon);
  buttonContainer.appendChild(cartButton);
  var editButton = document.createElement("button");
  editButton.classList.add("profileButton");
  var editIcon = document.createElement("img");
  editIcon.src = "/images/qubodup_16x16px-capable_black_and_white_icons_17.png";
  editButton.appendChild(editIcon);
  editButton.onclick = (e) => {
    toUpdatePage(e);
  }
  buttonContainer.appendChild(editButton);
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("profileButton");
  var deleteIcon = document.createElement("img");
  deleteIcon.src = "/images/Trashcan-512.webp";
  deleteButton.appendChild(deleteIcon);
  deleteButton.onclick = (e) => {
    deleteItem(e);
  }
  buttonContainer.appendChild(deleteButton);
  return profile;
}

// display only profiles that have an item name regex hit with the inputted search term
function search() {
  var searchString = document.getElementById("searchBar").value;
  var table = document.getElementsByClassName("transactionTable")[0];
  table.replaceChildren(...profiles);
  if (searchString) {
    var query = new RegExp(searchString, "i");
    for (var profile of profiles) {
      if (!query.test(profile.children[1].children[0].children[1].children[0].innerHTML)) {
        table.removeChild(profile);
      }
    }
  }
}

// set the incart of a selected object to true
function addToCart(e) {
  var id = e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[0].innerHTML.split(/\s/).join("-"); // some gross HTML pathing to go from the region activated by the onclick all the way up to the ItemName field in the profile, along with the whitespace processor
  var req = new XMLHttpRequest();
  req.open("post", "/cart/add?id="+id);
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location = "/history";
    }
  }
  req.send();
}

// set the user selected item's incart property to false
function removeFromCart(e) {
  var id = e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[0].innerHTML.split(/\s/).join("-");
  var req = new XMLHttpRequest();
  req.open("post", "/cart/remove?id="+id);
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location = "/history";
    }
  }
  req.send();
}

// send the user off to update their selected item
function toUpdatePage(e) {
  var id = e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[0].innerHTML.split(/\s/).join("-");
  location = "/items/update?id="+id;
}

// ping server for item deletion
function deleteItem(e) {
  var name = e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[0].innerHTML;
  var id = name.split(/\s/).join("-");
  if (confirm("Are you sure you want to delete "+name+"'s profile?")) { // misclick blocker
    var req = new XMLHttpRequest();
    req.open("post", "/items/delete?id="+id);
    req.onload = () => {
      if (req.response != "success") {
        alert(req.response);
      } else {
        location = "/history";
      }
    }
    req.send();
  }
}