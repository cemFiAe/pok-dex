const BASE_URL = "https://pokeapi.co/api/v2/";
let allPokemonsData = [], cachedEvolutionChains = {}, currentDisplayCount = 20;
import { pokeCardTemplate, renderPokemonsTemplate, getTypeIcon } from './templates.js';

function init() {
  setTimeout(() => { renderAllPokemons(); document.getElementById('loader').style.display = 'none'; }, 2000);
  document.getElementById('inputPokemonName').addEventListener('keyup', searchPokemons);
}

async function fetchPokemonList(limit = 151) { return (await fetch(`${BASE_URL}pokemon?limit=${limit}`)).json(); }

async function fetchPokeDetail(url) { return (await fetch(url)).json(); }

async function renderAllPokemons() {
  try {
    const { results } = await fetchPokemonList();
    allPokemonsData = await Promise.all(results.map(p => fetchPokeDetail(p.url)));
    renderPokemons(allPokemonsData);
  } catch (error) { document.getElementById('content').innerHTML = `<p>Fehler: ${error}</p>`; }
}

function searchPokemons(e) {
  const term = e.target.value.toLowerCase().trim(),
        filtered = allPokemonsData.filter(p => p.name.toLowerCase().includes(term));
  renderPokemons(filtered);
}

function openPokeCard(i) {
  const p = allPokemonsData[i];
  if (!p) { console.error('Kein gültiges Pokemon für Index:', i); return; }
  const card = document.getElementById('overlay-card');
  card.classList.remove("d-none"); 
  card.innerHTML = pokeCardTemplate(p, i);
  renderEvolutionChainWithSprites(p.species.url, i);
}

function closePokeCard(e) { if (e.target.id === 'overlay-card') document.getElementById('overlay-card').classList.add('d-none'); }

function showSection(i, section) {
  const m = document.getElementById(`mainContent-${i}`),
        s = document.getElementById(`statsContent-${i}`),
        e = document.getElementById(`evoChainContent-${i}`);
  m.style.display = s.style.display = e.style.display = 'none';
  if (section === 'main') m.style.display = 'block';
  else if (section === 'stats') s.style.display = 'block';
  else if (section === 'evo') e.style.display = 'flex';
}

async function renderEvolutionChainWithSprites(url, cardIndex) {
  if (cachedEvolutionChains[url]) { 
    document.getElementById(`evoChainContent-${cardIndex}`).innerHTML = cachedEvolutionChains[url]; 
    return; 
  }
  try {
    const speciesData = await (await fetch(url)).json(),
          evoData = await (await fetch(speciesData.evolution_chain.url)).json();
    let current = evoData.chain, arr = [];
    while (current) {
      const sName = current.species.name,
            spriteUrl = (await (await fetch(`${BASE_URL}pokemon/${sName}`)).json()).sprites.front_default;
      arr.push(`<div class="evo-stage"><img src="${spriteUrl}" alt="${sName}" title="${sName}" style="width:96px;height:96px;"></div>`);
      current = (current.evolves_to && current.evolves_to.length) ? current.evolves_to[0] : null;
    }
    const html = arr.reduce((acc, cur, j) => acc + cur + (j < arr.length - 1 ? `<span class="arrow">&#8594;</span>` : ""), "");
    document.getElementById(`evoChainContent-${cardIndex}`).innerHTML = cachedEvolutionChains[url] = html;
  } catch (error) { console.error("Fehler beim Laden der Evolutionskette:", error); }
}

function loadMorePokemons() {
  const btn = document.getElementById('loadMore'); if (btn) btn.style.display = 'none';
  let loader = document.getElementById('loadMoreLoader');
  if (!loader) { loader = document.createElement('div'); loader.id = 'loadMoreLoader'; loader.className = 'loader'; 
    loader.innerHTML = '<div class="spinner"></div>'; document.body.appendChild(loader); } else { loader.style.display = 'block'; }
  setTimeout(() => { loader.style.display = 'none'; currentDisplayCount += 20; renderPokemons(allPokemonsData); 
    const btn2 = document.getElementById('loadMore'); if (btn2) btn2.style.display = 'block'; }, 2000);
}

function collapsePokemons() {
  const btn = document.getElementById('collapseButton'); if (btn) btn.style.display = 'none';
  let loader = document.getElementById('collapseLoader');
  if (!loader) { loader = document.createElement('div'); loader.id = 'collapseLoader'; loader.className = 'loader'; 
    loader.innerHTML = '<div class="spinner"></div>'; document.body.appendChild(loader); } else { loader.style.display = 'block'; }
  setTimeout(() => { loader.style.display = 'none'; currentDisplayCount = Math.max(20, currentDisplayCount - 20);
    renderPokemons(allPokemonsData); const btn2 = document.getElementById('collapseButton'); if (btn2) btn2.style.display = 'block'; }, 2000);
}

function renderPokemons(pokemons) {
  const content = document.getElementById('content'),
        html = renderPokemonsTemplate(pokemons, currentDisplayCount);
  content.innerHTML = html;
  const eLB = document.getElementById('loadMore'), eCB = document.getElementById('collapseButton');
  if (eLB) eLB.remove(); if (eCB) eCB.remove();
  if (currentDisplayCount < pokemons.length) { const b = document.createElement('button'); b.id = 'loadMore';
    b.innerText = 'Load More'; b.onclick = loadMorePokemons; document.body.appendChild(b); }
  if (currentDisplayCount > 20) { const b = document.createElement('button'); b.id = 'collapseButton';
    b.innerText = 'Collapse'; b.onclick = collapsePokemons; document.body.appendChild(b); }
}

init();
window.openPokeCard = openPokeCard;
window.closePokeCard = closePokeCard;
window.showSection = showSection;
window.loadMorePokemons = loadMorePokemons;
window.collapsePokemons = collapsePokemons;
window.searchPokemons = searchPokemons;
