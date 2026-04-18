let allRecipes = [];

async function loadAll() {
  const india = await fetch("data/india.json").then(r => r.json());
  const italian = await fetch("data/italian.json").then(r => r.json());

  allRecipes = [...india, ...italian];
}

async function search() {
  if (allRecipes.length === 0) await loadAll();

  const input = document.getElementById("input").value.toLowerCase();
  const user = input.split(",").map(i => i.trim());

  const results = allRecipes.map(r => {
    let match = r.ingredients.filter(i => user.includes(i)).length;
    let percent = (match / r.ingredients.length) * 100;
    return { ...r, percent };
  });

  results.sort((a, b) => b.percent - a.percent);

  const container = document.getElementById("results");
  container.innerHTML = "";

  results.forEach(r => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p>${r.percent.toFixed(0)}% match</p>
    `;

    div.onclick = () => {
      localStorage.setItem("recipe", JSON.stringify(r));
      window.location.href = "recipe.html";
    };

    container.appendChild(div);
  });
}