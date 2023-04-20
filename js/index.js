import { baseUrl } from "./settings/api.js";
import displayMessage from "./components/common/displayMessage.js";
import createMenu from "./components/common/createMenu.js";
import { getUsername } from "./utils/storage.js";

const gamesUrl = baseUrl + "/api/games?populate=*";

createMenu();

(async function () {
  const container = document.querySelector(".game-container");

  try {
    const response = await fetch(gamesUrl);
    const json = await response.json();
    const username = getUsername();

    let toggleHref = "";

    if (username) {
      toggleHref = "edit.html";
    } else {
      toggleHref = "detail.html";
    }

    container.innerHTML = "";

    json.data.forEach(function (game) {
      const thumbnailUrl = game.attributes.thumbnail
        ? baseUrl + game.attributes.thumbnail.data.attributes.url
        : "/images/Placeholder.png";

      console.log(game.attributes.thumbnail.data.attributes.url);

      container.innerHTML += `<a class="game" href="${toggleHref}?id=${game.id}" style="background-image: url(${thumbnailUrl})">
                                <div class="game-details">
                                  <h4>${game.attributes.title}</h4>
                                  <span>${game.attributes.price}kr</span>
                                  <p>${game.attributes.info.platform}</p>
                                </div>
                              </a>`;
    });
  } catch (error) {
    console.log(error);
    displayMessage("error", error, ".game-container");
  }
})();
