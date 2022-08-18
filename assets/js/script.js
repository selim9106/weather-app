// -----------------------------------burgermenu-------------------------------------

let asidemobile = document.querySelector(".aside")
let burgermenu = document.querySelector("#bgmenu");
let closebgbutton = document.querySelector("#closebgmenu");
let menulinks = document.querySelectorAll(".aside__menu__item");

burgermenu.onclick = openBgmenu;
closebgbutton.onclick = closeBgMenu;

menulinks.forEach(link =>link.addEventListener("click", closeBgMenu));

function openBgmenu() {
    asidemobile.classList.add("asidemobile");
};

function closeBgMenu() {
    asidemobile.classList.remove("asidemobile");
};



// 