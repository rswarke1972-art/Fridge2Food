let recipes = [];
let allRecipes = [];

// ---------- LIST PAGE ----------
function initList() {
  loadRecipes();
}

async function loadRecipes() {
  const file = document.getElementById("region").value;
  const res = await fetch("data/" + file);
  recipes = await res.json();
  renderList(recipes);
}

function renderList(list) {
  const container = document.getElementById("recipeList");
  container.innerHTML = "";

  list.forEach(r => {

    console.log(r.name, "=>", r.image); // ✅ correct place

    const div = document.createElement("div");
    div.className = "card";

    div.style.backgroundImage = `url(${r.image || 'placeholder.jpg'})`;

    div.innerHTML = `
      <div class="overlay">
        <h3>${r.name}</h3>
        <div class="meta">₹${r.cost} • ${r.time} min</div>
        <div class="tag">${r.course || "unknown"}</div>
      </div>
    `;

    div.onclick = () => openRecipe(r);
    container.appendChild(div);
  });
}

function applyFilters() {
  let list = [...recipes];

  const sort = document.getElementById("sort").value;
  const nutrient = document.getElementById("nutrient").value;
  const courseEl = document.getElementById("course");

  const course = courseEl ? courseEl.value : "";

  // FILTER COURSE
  if (course) {
    list = list.filter(r => r.course === course);
  }

  // SORT
  if (sort === "cost") list.sort((a, b) => a.cost - b.cost);
  if (sort === "time") list.sort((a, b) => a.time - b.time);

  // NUTRIENT
  if (nutrient === "protein") {
    list.sort((a, b) => (b.nutrients.protein || 0) - (a.nutrients.protein || 0));
  }

  renderList(list);
}

// ---------- INGREDIENT PAGE ----------
function initIngredients() {}

async function searchRecipes() {
  document.getElementById("results").classList.add("search-mode");
  if (allRecipes.length === 0) {
    const india = await fetch("data/india.json").then(r => r.json());
    const italian = await fetch("data/italian.json").then(r => r.json());
    allRecipes = [...india, ...italian];
  }

 const input = document.getElementById("input").value;

if (!input || input.trim() === "") {
  renderList(allRecipes);
  return;
}

const user = input
  .toLowerCase()
  .split(",")
  .map(i => i.trim())
  .filter(Boolean);

const results = allRecipes.map(r => {

  const ingredients = r.ingredients.map(i =>
    i.toLowerCase().trim()
  );

  let match = 0;

  user.forEach(u => {
    if (ingredients.some(i => i.includes(u))) {
      match++;
    }
  });

  let percent = (match / ingredients.length) * 100;

  return { ...r, percent };
});

// safe filtering
let filtered = results.filter(r => r.percent > 0);

// fallback if everything becomes 0
if (filtered.length === 0) {
  filtered = results;
}

filtered.sort((a, b) => b.percent - a.percent);

  const container = document.getElementById("results");
  container.innerHTML = "";

 filtered.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
  <img src="${r.image || 'placeholder.jpg'}" class="result-img">

  <div class="result-content">
    <h3>${r.name}</h3>
    <p>${r.percent.toFixed(0)}% match</p>
  </div>
`;

    div.onclick = () => openRecipe(r);
    container.appendChild(div);
  });
}

// ---------- RECIPE PAGE ----------
function openRecipe(r) {
  localStorage.setItem("recipeName", r.name);
  window.location.href = "recipe.html";
}

async function loadRecipePage() {
  const name = localStorage.getItem("recipeName");

  // load fresh data
  const india = await fetch("data/india.json").then(r => r.json());
  const italian = await fetch("data/italian.json").then(r => r.json());

  const all = [...india, ...italian];

  const r = all.find(item => item.name === name);

  const container = document.getElementById("recipeDetail");
  const n = r.nutrients || {};

  container.innerHTML = `
    <div class="recipe-card">
      <h1>${r.name}</h1>

      <div class="tag">${formatCourse(r.course)}</div>

      <img src="${r.image}" class="recipe-img">

      <div class="meta">
        💰 ₹${r.cost} • ⏱️ ${r.time} min
      </div>

      <h3>Nutrients</h3>
      <ul class="nutrients">
        ${n.protein ? `<li>💪 Protein (per serving): ${n.protein}g</li>` : ""}
        ${n.calories ? `<li>🔥 Calories (per serving): ${n.calories} kcal</li>` : ""}
        ${n.carbs ? `<li>🍞 Carbs (per serving): ${n.carbs}g</li>` : ""}
        ${n.fats ? `<li>🧈 Fats (per serving): ${n.fats}g</li>` : ""}
        ${n.fiber ? `<li>🌿 Fiber (per serving): ${n.fiber}g</li>` : ""}
      </ul>

      <h3>Ingredients</h3>
      <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

      <h3>Steps</h3>
      <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>
    </div>
  `;
}

function goBack() {
  window.history.back();
}

function formatCourse(c) {
  const map = {
    appetizer: "Starter",
    soup: "Soup",
    salad: "Salad",
    side: "Side",
    bread: "Bread",
    entree: "Main Course",
    dessert: "Dessert",
    drink: "Drink"
  };
  return map[c] || c;
}

function openContact() {
  document.getElementById("contactBox").style.display = "block";
}

function sendMessage(event) {
  event.preventDefault();

  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  document.getElementById("status").innerText = "Sending...";

  emailjs.send(
    "service_a7ayyfv",
    "template_4acypww",
    params
  )
  .then(() => {
    document.getElementById("status").innerText =
      "✅ Message sent successfully!";
    document.querySelector("form").reset();
  })
  .catch((error) => {
    document.getElementById("status").innerText =
      "❌ Failed to send message.";
    console.error(error);
  });
}

function goBack() {
  window.history.back();
}