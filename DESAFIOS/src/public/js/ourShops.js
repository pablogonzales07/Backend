//I bring the neccesaries elements
const hambButton = document.getElementById("hambButton");
const horizaontalMenu = document.querySelector(".horizontalMenu");
const toggleButton = document.getElementById("toggleButton");

//I generate an event when the user clicks on the hamburger button
hambButton.addEventListener("click", function() {
    horizaontalMenu.classList.toggle("active");
  });

//I generate an event to display a sideBar with all user data
toggleButton.addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.right === "-400px") {
    sidebar.style.right = "0";
  } else {
    sidebar.style.right = "-400px";
  }
});