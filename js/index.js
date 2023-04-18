import { baseUrl } from "./settings/api.js";
import displayMessage from "./components/common/displayMessage.js";

const gamesUrl = baseUrl + "/api/games?populate=*";

(async function () {
  const container = document.querySelector(".game-container");

  try {
    const response = await fetch(gamesUrl);
    const json = await response.json();

    container.innerHTML = "";

    json.data.forEach(function (game) {
      const thumbnail =
        baseUrl + game.attributes.image_thumbnail.data.attributes.url;
      console.log(thumbnail);
      container.innerHTML += `<a class="game" href="detail.html?id=${game.id}" style="background-image: url(${thumbnail})">
                                  <h4>${game.attributes.title}</h4>
                                  <p>${game.attributes.price}kr</p>
                                  <p>${game.attributes.info.platform}</p>
                              </a>`;
    });
  } catch (error) {
    console.log(error);
    displayMessage("error", error, ".game-container");
  }
})();
