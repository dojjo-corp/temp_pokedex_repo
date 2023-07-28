// TODO: GET WEB DATA (JSON) FROM API AND STORE IN GLOBAL LIST

// TODO: GET CHUNKS OF WEB DATA FOR PAGINATION

// TODO: BUTTONS TO NAVIGATE BETWEEN PAGES/CHUNKS

async function getData() {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon?limit=3000&offset=0");
    const json = await result.json();
    console.log(json);
}