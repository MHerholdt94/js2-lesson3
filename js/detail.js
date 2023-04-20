import { baseUrl } from "./settings/api.js";
import displayMessage from "./components/common/displayMessage.js";
import createMenu from "./components/common/createMenu.js";

createMenu();

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

if (!id) {
  document.location.href = "/";
}

const gameUrl = baseUrl + "/api/games/" + id + "?populate=*";

(async function () {
  try {
    const response = await fetch(gameUrl);
    const details = await response.json();

    const container = document.querySelector(".detail-container");
    const game = details.data.attributes;

    document.title = game.title;

    container.innerHTML = `<h1>${game.title}</h1>
                          <p>${game.price}kr</p>
                          <p>${game.description}</p>
                          <ul>
                            <li>Developer: ${game.info.developer}</li>
                            <li>Publisher: ${game.info.publisher}</li>
                            <li>Genre: ${game.info.genre}</li>
                            <li>Platform: ${game.info.platform}</li>
                            <li>Release: ${game.info.release_date}</li>
                          </ul>`;
  } catch (error) {
    displayMessage("error", error, ".detail-container");
  }
})();
