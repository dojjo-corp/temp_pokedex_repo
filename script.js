const searchBar = document.getElementById('searchBar');
const searchResults = document.getElementById('searchResults');
const gridView = document.querySelector('.gridView');
const detailsContainer = document.getElementById('details-container')
const detailsView = document.getElementById('detailsView');
const detailName = document.getElementById('detailName');
const detailImage = document.getElementById('detailImage');
const detailsMoves = document.querySelector('.moves');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const closeBtn = document.getElementById('close-btn');

let offset = 0;

async function fetchPokemons(offset = 0, limit = 20) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
}

async function fetchPokemonDetail(pokemonUrl) {
    const result = await fetch(pokemonUrl);
    const data = await result.json();
    return data;
}

async function displayPokemons() {
    const pokemons = await fetchPokemons(offset);
    gridView.innerHTML = '';

    pokemons.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon');
        // credit: chatgpt
        pokemonDiv.innerHTML = `
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png" alt="${pokemon.name}">
          <h3>${pokemon.name}</h3>
        `;
        pokemonDiv.addEventListener('click', () => displayPokemonDetails(pokemon));
        gridView.appendChild(pokemonDiv);
    });

    updatePaginationButtons();
}

searchBar.addEventListener('input', async () => {
    const searchValue = searchBar.value.toLowerCase();

    if (searchValue.length >= 3) {
        const pokemons = await fetchPokemons(0, 1300); // Fetch all Pokémon for search
        const matchingPokemons = pokemons.filter(pokemon => pokemon.name.includes(searchValue));

        searchResults.innerHTML = '';
        matchingPokemons.forEach(pokemon => {
            const resultItem = document.createElement('div');
            const resultImg = document.createElement('img');
            const resultName = document.createElement('h3');
            resultName.innerText = pokemon.name;
            resultImg.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`);
            resultItem.className = 'pokemon';
            resultItem.appendChild(resultImg);
            resultItem.appendChild(resultName);
            resultItem.addEventListener('click', () => displayPokemonDetails(pokemon));
            searchResults.appendChild(resultItem);
        });

        searchResults.style.display = 'grid';
        gridView.style.display = 'none';
        detailsView.style.display = 'none';
    } else {
        searchResults.style.display = 'none';
        gridView.style.display = 'grid';
    }
});

function updatePaginationButtons() {
    prevButton.disabled = offset === 0;
}

prevButton.addEventListener('click', () => {
    if (offset > 0) {
        offset -= 20;
        displayPokemons();
    }
});

nextButton.addEventListener('click', () => {
    offset += 20;
    displayPokemons();
});

function getPokemonIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

async function displayPokemonDetails(pokemon) {
    const pokemonData = await fetchPokemonDetail(pokemon.url);
    const moves = pokemonData.moves;
    detailName.textContent = pokemon.name;
    detailImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`;

    // display moves
    moves.forEach(move => {
        const moveContainer = document.createElement('div'); 
        moveContainer.innerText = move.move.name
        detailsMoves.appendChild(moveContainer);
    });

    detailsContainer.style.display = 'block';
    closeBtn.addEventListener('click', () => {
        detailsContainer.style.display = 'none';
    });
}

displayPokemons();