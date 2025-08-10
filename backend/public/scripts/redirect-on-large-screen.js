checkSize();
window.onresize = function () {
  checkSize();
};

function checkSize() {
  if (window.innerWidth>1022) window.location.href = "/"; // Change this to the page you want to Redirect
}
