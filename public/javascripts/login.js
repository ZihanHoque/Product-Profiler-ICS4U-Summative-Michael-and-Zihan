// package user entered fields into a Form, then ping the server with a register request
function registerAccount() {
  var accountIN = new FormData();
  accountIN.append("Username", document.getElementById("user").value);
  accountIN.append("Password", document.getElementById("pass").value);
  
  var req = new XMLHttpRequest();
  req.open("post", "/accounts/register");
  req.onload = () => {
    if (req.response == "success") {
      location = "/history"; // sent off to user's "home" page
    } else {
      alert(req.response);
    }
  }
  req.send(accountIN);
}

// package user entered fields into a Form, then ping the server with a login request
function verifyAccount() {
  var accountIN = new FormData();
  accountIN.append("Username", document.getElementById("user").value);
  accountIN.append("Password", document.getElementById("pass").value);

  var req = new XMLHttpRequest();
  req.open("post", "/accounts/login");
  req.onload = () => {
    if (req.response == "success") {
      location = "/history";
    } else {
      alert(req.response);
    }
  }
  req.send(accountIN);
}
