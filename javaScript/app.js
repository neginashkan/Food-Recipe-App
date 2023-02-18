const searchFormElement = document.getElementById("search-form");
const errorMassage = document.getElementById("error-massage");
const searchResult = document.getElementById("search-result");
const input = document.getElementById("food-name");
const NumberOfRecipeToShow = 27;
const randomButton = document.getElementById("random-button");
const apiKey = "38fd39f495a9426d8c30275b1debc269";
input.addEventListener("focus", (event) => {
  event.preventDefault();
  errorMassage.textContent = "";
});

function changeHtml(instructions, image, title, summary, ingredientsList) {
  searchResult.classList.remove("visible");
  searchResult.classList.add("hidden");
  const clickedFoodRecipe = document.getElementById("clicked-food-recipe");
  const backButton = document.getElementById("back-button");
  clickedFoodRecipe.classList.remove("hidden");
  backButton.classList.remove("hidden");
  backButton.addEventListener("click", (event) => {
    event.preventDefault();
    searchResult.classList.remove("hidden");
    searchResult.classList.add("visible");
    clickedFoodRecipe.classList.add("hidden");
    backButton.classList.add("hidden");
  });
  const foodImage = document.getElementById("food-image");
  foodImage.src = image;
  foodImage.alt = title;
  const summaryEl = document.getElementById("summary");
  summaryEl.innerHTML = summary;
  const ingredients = document.getElementById("ingredients");
  ingredients.append(ingredientsList);
  const recipe = document.getElementById("recipe");
  recipe.innerHTML = instructions;
  const foodName = document.getElementsByClassName("food-title");
  foodName.textContent = title;
}
function show(allRecipesArray) {
  
  let row = "";
  for (let i = 0; i < allRecipesArray.length; i++) {
    const title = allRecipesArray[i].title;
    const image = allRecipesArray[i].image;
    const instructions = allRecipesArray[i].instructions;
    const summary = allRecipesArray[i].summary;
    const extendedIngredientsArray = allRecipesArray[i].extendedIngredients;
    const ingredientsList = document.createElement("ul");
    extendedIngredientsArray.forEach((ingredientArray) => {
      let eachIngredient = ingredientArray.original;
      ingredientsList.innerHTML += `<li>${eachIngredient}</li>`;
    });

    if (i % 3 === 0) {
      row = document.createElement("div");
      row.setAttribute("class", "row");
      searchResult.appendChild(row);
    }
    const recipeBox = document.createElement("div");
    recipeBox.setAttribute("class", "recipe-box");
    row.append(recipeBox);
    const recipeImage = document.createElement("img");
    recipeImage.setAttribute("class", "recipe-image");
    recipeImage.src = image;
    recipeImage.alt = title;
    recipeBox.appendChild(recipeImage);
    const recipeName = document.createElement("div");
    recipeName.setAttribute("class", "recipe-name");
    recipeName.textContent = title;
    recipeBox.appendChild(recipeName);
    const seeFullRecipe = document.createElement("div");
    seeFullRecipe.setAttribute("class", "see-full-recipe");
    const fullRecipeButton = document.createElement("button");
    fullRecipeButton.setAttribute("class", "full-recipe-button");
    fullRecipeButton.textContent = "Get Recipe";
    fullRecipeButton.addEventListener("click", (event) => {
      event.preventDefault();
      changeHtml(instructions, image, title, summary, ingredientsList);
    });
    seeFullRecipe.append(fullRecipeButton);
    recipeBox.appendChild(seeFullRecipe);
  }
}
function displayResult(response) {
  const allRecipesArray = response.data.recipes;
  allRecipesArray.sort(() => Math.random() - 0.5);
  show(allRecipesArray);
}
function displayRandomRecipes(event) {
  // when you add button turn it on
  // event.preventDefault();
  const apiUrl = `https://api.spoonacular.com/recipes/random?number=${NumberOfRecipeToShow}&tags=vegetarian,dessert&apiKey=${apiKey}`;
  axios.get(apiUrl).then(displayResult);
}
function getFoodBaseOnSearch(foodName) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${foodName}&number=${NumberOfRecipeToShow}&apiKey=${apiKey}`;
  axios.get(apiUrl).then((response) => {
    const allRecipesArray = response.data.results;
    allRecipesArray.sort(() => Math.random() - 0.5);
    let row = "";
    for (let i = 0; i < allRecipesArray.length; i++) {
      const title = allRecipesArray[i].title;
      const image = allRecipesArray[i].image;
      const foodId = allRecipesArray[i].id;
      if (i % 3 === 0) {
        row = document.createElement("div");
        row.setAttribute("class", "row");
        searchResult.appendChild(row);
      }
      const recipeBox = document.createElement("div");
      recipeBox.setAttribute("class", "recipe-box");
      row.append(recipeBox);
      const recipeImage = document.createElement("img");
      recipeImage.setAttribute("class", "recipe-image");
      recipeImage.src = image;
      recipeImage.alt = title;
      recipeBox.appendChild(recipeImage);
      const recipeName = document.createElement("div");
      recipeName.setAttribute("class", "recipe-name");
      recipeName.textContent = title;
      recipeBox.appendChild(recipeName);
      const seeFullRecipe = document.createElement("div");
      seeFullRecipe.setAttribute("class", "see-full-recipe");
      const fullRecipeButton = document.createElement("button");
      fullRecipeButton.setAttribute("class", "full-recipe-button");
      fullRecipeButton.textContent = "Get Recipe";
      fullRecipeButton.addEventListener("click", (event) => {
        event.preventDefault();
        const apiUrl = `https://api.spoonacular.com/recipes/${foodId}/information?instructionsRequired=true&apiKey=${apiKey}`;
        axios.get(apiUrl).then((response) => {
          const userChoice = response.data;
          const title = userChoice.title;
          const image = userChoice.image;
          const instructions = userChoice.instructions;
          const summary = userChoice.summary;
          const extendedIngredientsArray = userChoice.extendedIngredients;
          const ingredientsList = document.createElement("ul");
          extendedIngredientsArray.forEach((ingredientArray) => {
            let eachIngredient = ingredientArray.original;
            ingredientsList.innerHTML += `<li>${eachIngredient}</li>`;
          });
          changeHtml(instructions, image, title, summary, ingredientsList);
        });
      });
      seeFullRecipe.append(fullRecipeButton);
      recipeBox.appendChild(seeFullRecipe);
    }
  });
}

function displayUserChoice(event) {
  event.preventDefault();
  const foodName = input.value;
  const invalid = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let valid = true;
  // error massage
  for (let i = 0; i < foodName.length; i++) {
    if (invalid.includes(foodName[i])) {
      valid = false;
      break;
    }
  }

  if (valid && foodName.trim() !== "") {
    document.getElementById("h4-span-title").textContent = " Search Result";
    searchResult.textContent = "";
    getFoodBaseOnSearch(foodName.toLowerCase());
  } else {
    errorMassage.textContent = "Error Invalid Input";
  }
}

displayRandomRecipes();
searchFormElement.addEventListener("submit", displayUserChoice);
//random button


randomButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("h4-span-title").textContent = "Random Recipes";
  searchResult.textContent = "";
  displayRandomRecipes();
});
