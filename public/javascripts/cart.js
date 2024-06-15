// send a checkout request for the server to record that day's purchase
function checkout() {
  var req = new XMLHttpRequest();
  req.open("post", "/cart/checkout");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location = "/history";
    }
  }
  req.send();
}

// send a request to the server to clear the cart
function clearCart() {
  var req = new XMLHttpRequest();
  req.open("post", "/cart/clear");
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location = "/cart";
    }
  }
  req.send();
}

// probably should change the function name to show that it removes from cart so it doesnt get confused with an actual profile deletion 
function deleteItem(rowIndex) {
  var table = document.getElementById("cart-display");
  table.deleteRow(rowIndex);
}

// pulls up the item's updater page
function toUpdatePage(e) {
  var id = e.target.parentElement.parentElement.parentElement.children[1].childNodes[0].nodeValue.split(/\s/).join("-");
  
  location = "/items/update?id="+id;
}

// change selected item's incart to false, and reload the cart display
function removeFromCart(e) {
  var id = e.target.parentElement.parentElement.parentElement.children[1].childNodes[0].nodeValue.split(/\s/).join("-");
  var req = new XMLHttpRequest();
  req.open("post", "/cart/remove?id="+id);
  req.onload = () => {
    if (req.response != "success") {
      alert(req.response);
    } else {
      location = "/cart";
    } 
  }
  req.send();
}

// navbar redirector
function changePage(newPage) {
  location = newPage;
}