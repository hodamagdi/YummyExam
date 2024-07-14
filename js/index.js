/// <reference types="../@types/jquery"/>

// side nav decleartion 
const search = document.getElementById("search");
const categories = document.getElementById("categories");
const area = document.getElementById("area");
const ingredients = document.getElementById("ingredients");
const contact = document.getElementById("contact");

// section id 
const searchInp = document.getElementById("searchInp");
const rowData = document.getElementById("rowData");

$(window).on("load",function(){
  closeNav();
})

//loading screen 
function showLoading() {
  $(".inner-loading").removeClass("d-none").fadeIn();
}

function hideLoading() {
  $(".inner-loading").addClass("d-none").fadeOut();
}


//! start sideNav section
const sideNavWidth = $(".side-nav").innerWidth();

// Close side nav & animation li
function closeNav() {
  $("#sideNavBar").animate({ left: -sideNavWidth }, 800);
  $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
  $(".navAnchor li").animate({ top: 300 }, 1000);
  isOpen = false;
}

// Open & close side nav & animation li
let isOpen = false;

$(".open-close-icon , #search, #categories, #area, #ingredients, #contact").on("click", function () {
  let status;

  if (!isOpen) {
    status = 0;
    $(".open-close-icon").removeClass("fa-bars").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
      $(".navAnchor li").eq(i).animate({ top: 0 }, (i + 5) * 100);
    }
  } else {
    status = -sideNavWidth;
    $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
    $(".navAnchor li").animate({ top: 300 }, 1000);
  }

  isOpen = !isOpen;
  $("#sideNavBar").animate({ left: status }, 800);
});

//! end sideNav section

//! meals 

// get meals 
async function getMeals() {
  rowData.innerHTML = '';
  $(".loading").removeClass("d-none").fadeIn();

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  displayMeals(data.meals);
}

// display Meals 
function displayMeals(data) {
  let box = "";
  for (let i = 0; i < data.length; i++) {
    box += `
  <div class="col-sm-6 col-md-4 col-lg-3 ">
    <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden ">
      <img  src="${data[i].strMealThumb}" alt="${data[i].strMeal}" class=" w-100 rounded-2">
      <div  class="layer position-absolute rounded-2 d-flex align-items-center justify-content-center">
        <h3 >${data[i].strMeal}</h3>
      </div>
    </div>
     
  </div>

  `;
  }
  rowData.innerHTML = box;
}

(function () {
  getMeals();
  searchInp.classList.add("d-none");
})();

// get Meal Details  
async function getMealDetails(mealId) {
  rowData.innerHTML = '';
  showLoading();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  let data = await response.json();
  hideLoading();
  displayMealDetails(data.meals[0]);
  // console.log(data.meals[0]);
}

// display Meals details
function displayMealDetails(meal) {
  let box = `
  <div class="col-md-4">
                    <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                        alt="${meal.strMeal}">
                        <h2>${meal.strMeal}</h2>
                </div>
                <div class="col-md-8">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap" id="receipes">
                        
                    </ul>
    
                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap" id="tags">
                       
                    </ul>
    
                    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>
  `

  rowData.innerHTML = box;
  searchInp.classList.add("d-none");

  var ul = '';
  for (let i = 1; i <= 20; i++) {

    if (meal[`strIngredient${i}`] !== '') {
      // console.log(meal[`strIngredient${i}`]);
      // console.log(meal[`strMeasure${i}`]);
      ul += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
    }
  }
  $('#receipes').html(ul);

  let tags = meal.strTags?.split(",")
  if (!tags) {
    tags = []
  }

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }

  $('#tags').html(tagsStr);
  // console.log(tagsStr);
}

//! end meals 

//!search 
// get search by name 
async function getMealByName(searched) {
  rowData.innerHTML = '';
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searched}`);
  let data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
  hideLoading();
  // console.log(data.meals);
}

// get search by letter 
async function getMealByLett(searched) {
  rowData.innerHTML = '';
  if (!searched) {
    return; 
  }
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searched}`);
  let data = await response.json();
  hideLoading();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
}

// display search inputs 
function displaySearchInp() {
  rowData.innerHTML = '';
  let searchEle = `
  <div class="col-md-6 ">
      <input id="searchByName" class="form-control text-white bg-transparent" type="text" placeholder="Search By Name">
  </div>
  <div class="col-md-6">
      <input id="searchByLett" class="form-control text-white bg-transparent" type="text" placeholder="Search By First Letter"  maxlength="1">
  </div>
  `
  searchInp.classList.remove("d-none");
  searchInp.innerHTML = searchEle;

  $("#searchByName").on("input", function () {
    let search = $('#searchByName').val();
    // console.log(search);
    getMealByName(search);
  })

  $("#searchByLett").on("input", function () {
    let search = $('#searchByLett').val();
    // console.log(search);
    getMealByLett(search);
  })

}

// on click search 
$("#search").on("click", function (e) {
  e.preventDefault();
  displaySearchInp();
})
//! end search 


//! start Category 

// get Categories
async function getCategories() {
  rowData.innerHTML = '';
  showLoading();
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  let data = await response.json();
  hideLoading();
  // console.log(data);
  displayCategories(data.categories);
}

// display Categories 
function displayCategories(Category) {
  let box = "";
  for (let i = 0; i < Category.length; i++) {
    box += `
  <div class=" col-sm-6 col-md-4 col-lg-3 overflow-hidden ">
    <div onclick="getCategoryMeals('${Category[i].strCategory}')" class="meal position-relative overflow-hidden ">
      <img  src="${Category[i].strCategoryThumb}" alt="${Category[i].strCategory}" class=" w-100 rounded-2">
      <div  class="layer position-absolute rounded-2 text-center text-black p-2">
        <h3 >${Category[i].strCategory}</h3>
        <p >${Category[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
      </div>
    </div>
  </div> `
  }
  rowData.innerHTML = box;
  searchInp.classList.add("d-none");
}

//get Category Meals
async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  showLoading();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  let data = await response.json();
  hideLoading();
  // console.log(data);
  displayMeals(data.meals.slice(0, 20));
}

// on click categories 
$("#categories").on("click", function (e) {
  e.preventDefault();
  getCategories();
})

//! end Category 

//! start area 
// get Area 
async function getArea() {
  rowData.innerHTML = '';
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let data = await response.json();
  hideLoading();
  displayArea(data.meals);
}

// display area 
function displayArea(area) {
  let box = '';
  for (let i = 0; i < area.length; i++) {
    box += `
    <div class="col-md-3">
    <div onclick="displayAreaMeals('${area[i].strArea}')" class= "rounded-2 text-center cursor-pointer">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${area[i].strArea}</h3>
    </div>
    </div>
    `
  }
  rowData.innerHTML = box;
  searchInp.classList.add("d-none");
}

// display Area Meals 
async function displayAreaMeals(zone) {
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${zone}`);
  let data = await response.json();
  hideLoading();
  displayMeals(data.meals.slice(0, 20));
}

// on click area 
$("#area").on("click", function (e) {
  e.preventDefault();
  getArea();
})

//! end area 

//! start ingredients 

// get Ingredients 
async function getIngredients() {
  rowData.innerHTML = '';
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let data = await response.json();
  hideLoading();
  // console.log(data.meals.slice(0, 20));
  displayIngredients(data.meals.slice(0, 20));
}

// display Ingredients 
function displayIngredients(ingData) {
  let box = '';
  for (let i = 0; i < ingData.length; i++) {
    box += `
    <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingData[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingData[i].strIngredient}</h3>
                        <p>${ingData[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
    `
  }
  rowData.innerHTML = box;
  searchInp.classList.add("d-none");
}

// get Ingredients Meals
async function getIngredientsMeals(ingredients) {
  showLoading();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  let data = await response.json();
  hideLoading();
  displayMeals(data.meals.slice(0, 20));
}


// on click ingredients 
$("#ingredients").on("click", function (e) {
  e.preventDefault();
  getIngredients();
})

//! end ingredients 

//! start contact 
// displayContact 
function displayContact() {
  const box = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container-fluid w-75 text-center">
          <div class="row g-4">
              <div class="col-md-6">
                  <input id="nameInput" oninput="validateInputs()" type="text" class="form-control" placeholder="Enter Your Name">
                  <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Special characters and numbers not allowed
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="emailInput" oninput="validateInputs()" type="email" class="form-control" placeholder="Enter Your Email">
                  <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Email not valid *example@yyy.zzz
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="phoneInput" oninput="validateInputs()" type="text" class="form-control" placeholder="Enter Your Phone">
                  <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid Phone Number
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="ageInput" oninput="validateInputs()" type="number" class="form-control" placeholder="Enter Your Age">
                  <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid age
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="passwordInput" oninput="validateInputs()" type="password" class="form-control" placeholder="Enter Your Password">
                  <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid password *Minimum eight characters, at least one letter and one number:*
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="repasswordInput" oninput="validateInputs()" type="password" class="form-control" placeholder="Repassword">
                  <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid repassword 
                  </div>
              </div>
          </div>
          <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div> 
  `;

  rowData.innerHTML = box;
  searchInp.classList.add("d-none");

  $("#nameInput").on("input", function () {
    onNameInput = true;
  });

  $("#emailInput").on("input", function () {
    onEmailInput = true;
  });

  $("#phoneInput").on("input", function () {
    onPhoneInput = true;
  });

  $("#ageInput").on("input", function () {
    onAgeInput = true;
  });

  $("#passwordInput").on("input", function () {
    onPasswordInput = true;
  });

  $("#repasswordInput").on("input", function () {
    onRepasswordInput = true;
  });
}

let onNameInput = false;
let onEmailInput = false;
let onPhoneInput = false;
let onAgeInput = false;
let onPasswordInput = false;
let onRepasswordInput = false;

function validateInputs(){
  // validate name
  if (onNameInput) {
    if (nameValidation()) {
      $("#nameAlert").addClass("d-none");
    } else {
      $("#nameAlert").removeClass("d-none");
    }
  }

  // validate email 
  if (onEmailInput) {
    if (emailValidation()) {
      $("#emailAlert").addClass("d-none");
    } else {
      $("#emailAlert").removeClass("d-none");
    }
  }

  // validate phone 
  if (onPhoneInput) {
    if (phoneValidation()) {
      $("#phoneAlert").addClass("d-none");
    } else {
      $("#phoneAlert").removeClass("d-none");
    }
  }

  // validate age 
  if (onAgeInput) {
    if (ageValidation()) {
      $("#ageAlert").addClass("d-none");
    } else {
      $("#ageAlert").removeClass("d-none");
    }
  }

  // validate pass 
  if (onPasswordInput) {
    if (passwordValidation()) {
      $("#passwordAlert").addClass("d-none");
    } else {
      $("#passwordAlert").removeClass("d-none");
    }
  }

  // validate repass 
  if (onRepasswordInput) {
    if (repasswordValidation()) {
      $("#repasswordAlert").addClass("d-none");
    } else {
      $("#repasswordAlert").removeClass("d-none");
    }
  }

  if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}

// rejex 
function nameValidation() {
  return /^[a-zA-Z\s]+$/.test($("#nameInput").val());
}

function emailValidation() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#emailInput").val());
}

function phoneValidation() {
  return /^01[0125][0-9]{8}$/.test($("#phoneInput").val());
}

function ageValidation() {
  const age = $("#ageInput").val();
  return age >= 10 && age <= 100;
}

function passwordValidation() {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($("#passwordInput").val());
}

function repasswordValidation() {
  return $("#repasswordInput").val() === $("#passwordInput").val();
}

//  on click contact 
$("#contact").on("click", function (e){
  e.preventDefault();
  displayContact();
})