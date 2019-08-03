var p = document.getElementsByClassName("dropdown")[0];
var dropdown = document.getElementsByClassName("dropdown-content")[0];
dropdown.style.display = "none";
p.addEventListener("click", function () {
    if (dropdown.style.display == "none") {
        dropdown.style.display = "block";
        dropdown.style.transition = "1.7s ease";
    }
    else {
        dropdown.style.display = "none";
        dropdown.style.transition = "2.7s ease";
    }
});