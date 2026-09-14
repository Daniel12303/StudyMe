const error_p = document.getElementById("error_message");
let link = window.location.href.split("/");

if (link.length > 4) {
  let error_message = link[4];
  error_message = error_message.replaceAll("%20", " ");
  console.log(error_message);

  if (error_message != "") {
    error_p.textContent = `Err: ${error_message}!`;
    error_p.style.display = "block";
  }
}
