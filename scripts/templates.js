
export function getTypeIcon(typeName) {
  switch (typeName) {
    case 'grass':
      return './assets/grass.png';
    case 'normal':
      return './assets/normal.png';
    case 'poison':
      return './assets/poison.png';
    case 'bug':
      return './assets/bug.png';
    case 'flying':
      return './assets/flying.png';
    case 'fire':
      return './assets/fire.png';
    case 'water':
      return './assets/water.png';
    case 'electric':
      return './assets/electric.png';
    case 'fairy':
      return './assets/fairy.png';
    case 'ground':
      return './assets/ground.png';
    case 'fighting':
      return './assets/fighting.png';
    case 'rock':
      return './assets/rock.png';
    case 'ice':
      return './assets/ice.png';
    case 'psychic':
      return './assets/psychic.png';
    case 'ghost':
      return './assets/ghost.png';
    case 'steel':
      return './assets/steel.png';
    case 'dragon':
      return './assets/dragon.png';
    default:
      return `./assets/types/${typeName}.png`;
  }
}


export function pokeCardTemplate(pokemon, i) {
  const sprite = pokemon.sprites.other &&
                 pokemon.sprites.other["official-artwork"] &&
                 pokemon.sprites.other["official-artwork"].front_default 
                 ? pokemon.sprites.other["official-artwork"].front_default 
                 : pokemon.sprites.front_default;

  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  return /*html*/`
  <div class="card overlay-item" id="card-${i}">
    <div class="card-title">
      <b>#${pokemon.id}</b>
      <b>${pokemon.name.toUpperCase()}</b>
    </div>
    <img
      src="${sprite}"
      class="${pokemon.types.map(t => t.type.name).join(' ')}"
      alt="${pokemon.name}"
    >
    
    <div class="type-icons">
      ${pokemon.types.map(typeObj => {
          const typeName = typeObj.type.name;
          const logoPath = getTypeIcon(typeName);
          return `
            <div class="type-icon ${typeName}">
              <img class="type-logo" src="${logoPath}" alt="${typeName} icon">
            </div>
          `;
      }).join('')}
    </div>
    
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input
        type="radio"
        class="btn-check"
        name="btnradio-${i}"
        id="btnradio-main-${i}"
        autocomplete="off"
        checked
        onclick="showSection(${i}, 'main')"
      >
      <label class="btn btn-outline-primary" for="btnradio-main-${i}">main</label>

      <input
        type="radio"
        class="btn-check"
        name="btnradio-${i}"
        id="btnradio-stats-${i}"
        autocomplete="off"
        onclick="showSection(${i}, 'stats')"
      >
      <label class="btn btn-outline-primary" for="btnradio-stats-${i}">stats</label>

      <input
        type="radio"
        class="btn-check"
        name="btnradio-${i}"
        id="btnradio-evo-${i}"
        autocomplete="off"
        onclick="showSection(${i}, 'evo')"
      >
      <div class="btn-evo">
        <label class="btn btn-outline-primary" for="btnradio-evo-${i}">evo chain</label>
      </div>
    </div>

    <div id="mainContent-${i}" style="display: block;">
      <ul>
        <li>Height: ${heightInMeters}m</li>
        <li>Weight: ${weightInKg}kg</li>
        <li>Base Experience: ${pokemon.base_experience}</li>
        <li>Abilities: ${pokemon.abilities.map(ab => ab.ability.name).join(', ')}</li>
      </ul>
    </div>

    <div id="statsContent-${i}" style="display: none;">
      <ul>
        <li>HP: ${pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat}</li>
        <li>Attack: ${pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</li>
        <li>Defense: ${pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</li>
        <li>Special-Attack: ${pokemon.stats.find(stat => stat.stat.name === 'special-attack').base_stat}</li>
        <li>Special-Defense: ${pokemon.stats.find(stat => stat.stat.name === 'special-defense').base_stat}</li>
        <li>Speed: ${pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat}</li>
      </ul>
    </div>

    <div id="evoChainContent-${i}" style="display: none;">
      <p>Lade Evolutionskette...</p>
    </div>
  </div>
  `;
}


export function renderPokemonsTemplate(pokemons, currentDisplayCount) {
  const pokemonsToRender = pokemons.slice(0, currentDisplayCount);
  return pokemonsToRender.map((pokemon, i) => {
    const pokeName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const pokeId = pokemon.id;
    return /*html*/`
      <div class="poke-card" onclick="openPokeCard(${i})">
        <div class="poke-header">
          <span class="poke-id">#${pokeId}</span>
          <span class="poke-name">${pokeName}</span>
        </div>
        <div class="sprite-container ${pokemon.types[0].type.name}">
          <img src="${pokemon.sprites.other?.['official-artwork']?.front_default 
                ? pokemon.sprites.other['official-artwork'].front_default 
                : pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div class="type-icons">
          ${pokemon.types.map(typeObj => {
            const typeName = typeObj.type.name;
            const logoPath = getTypeIcon(typeName);
            return `
              <div class="type-icon ${typeName}">
                <img class="type-logo" src="${logoPath}" alt="${typeName} icon">
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}
