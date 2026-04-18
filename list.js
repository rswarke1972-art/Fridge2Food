<<<<<<< HEAD
let recipes = [];

async function loadRecipes() {
  const file = document.getElementById("region").value;

  const res = await fetch("data/" + file);
  recipes = await res.json();

  render(recipes);
}

function render(list) {
  const container = document.getElementById("recipeList");
  container.innerHTML = "";

  list.forEach(r => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p>₹${r.cost} | ${r.time} min</p>
    `;

    div.onclick = () => {
      localStorage.setItem("recipe", JSON.stringify(r));
      window.location.href = "recipe.html";
    };

    container.appendChild(div);
  });
}

function applyFilters() {
  let list = [...recipes];
  const sort = document.getElementById("sort").value;

  if (sort === "cost") list.sort((a, b) => a.cost - b.cost);
  if (sort === "time") list.sort((a, b) => a.time - b.time);

  render(list);
}

=======
let recipes = [];

async function loadRecipes() {
  const file = document.getElementById("region").value;

  const res = await fetch("data/" + file);
  recipes = await res.json();

  render(recipes);
}

function render(list) {
  const container = document.getElementById("recipeList");
  container.innerHTML = "";

  list.forEach(r => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p>₹${r.cost} | ${r.time} min</p>
    `;

    div.onclick = () => {
      localStorage.setItem("recipe", JSON.stringify(r));
      window.location.href = "recipe.html";
    };

    container.appendChild(div);
  });
}

function applyFilters() {
  let list = [...recipes];
  const sort = document.getElementById("sort").value;

  if (sort === "cost") list.sort((a, b) => a.cost - b.cost);
  if (sort === "time") list.sort((a, b) => a.time - b.time);

  render(list);
}

>>>>>>> 4f33fc612b00083a98597ff09cc83e41b0016c93
loadRecipes();