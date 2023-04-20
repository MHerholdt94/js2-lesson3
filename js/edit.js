import { baseUrl } from "./settings/api.js";
import displayMessage from "./components/common/displayMessage.js";
import createMenu from "./components/common/createMenu.js";
import { getToken } from "./utils/storage.js";

createMenu();

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

if (!id) {
  document.location.href = "/";
}

const gameUrl = baseUrl + "/api/games/" + id + "?populate=*";

const form = document.querySelector("form");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const developer = document.querySelector("#developer");
const publisher = document.querySelector("#publisher");
const platform = document.querySelector("#platform");
const genre = document.querySelector("#genre");
const release = document.querySelector("#release");
const idInput = document.querySelector("#id");
const message = document.querySelector(".message-container");
const loading = document.querySelector(".loading");

(async function () {
  try {
    const response = await fetch(gameUrl);
    const json = await response.json();
    const details = json.data.attributes;

    title.value = details.title;
    price.value = details.price;
    description.value = details.description;
    developer.value = details.info.developer;
    publisher.value = details.info.publisher;
    platform.value = details.info.platform;
    genre.value = details.info.genre;
    release.value = details.info.release;
    idInput.value = json.data.id;

    console.log(details);
  } catch (error) {
    console.log(error);
  } finally {
    loading.style.display = "none";
    form.style.display = "block";
  }
})();

form.addEventListener("submit", submitForm);

function submitForm(event) {
  event.preventDefault();

  message.innerHTML = "";

  const titleValue = title.value.trim();
  const priceValue = parseFloat(price.value);
  const descriptionValue = description.value.trim();
  const developerValue = developer.value.trim();
  const publisherValue = publisher.value.trim();
  const platformValue = platform.value.trim();
  const genreValue = genre.value.trim();
  const releaseValue = release.value.trim();
  const idValue = idInput.value;

  if (
    titleValue.length === 0 ||
    priceValue.length === 0 ||
    isNaN(priceValue) ||
    descriptionValue.length === 0 ||
    developerValue.length === 0 ||
    publisherValue.length === 0 ||
    platformValue.length === 0 ||
    genreValue.length === 0 ||
    releaseValue.length === 0
  ) {
    return displayMessage(
      "warning",
      "Please supply proper values",
      ".message-container"
    );
  }

  updateGame(
    titleValue,
    priceValue,
    descriptionValue,
    developerValue,
    publisherValue,
    platformValue,
    genreValue,
    releaseValue,
    idValue
  );
}

async function updateGame(
  title,
  price,
  description,
  developer,
  publisher,
  platform,
  genre,
  release,
  id
) {
  const url = baseUrl + "/api/games/" + id;

  const data = JSON.stringify({
    data: {
      title: title,
      price: price,
      description: description,
      info: {
        developer: developer,
        publisher: publisher,
        platform: platform,
        genre: genre,
        release: release,
      },
    },
  });

  const token = getToken();

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);

    if (json.data.attributes.updatedAt) {
      displayMessage("success", "Game updated", ".message-container");
    }

    if (json.error) {
      displayMessage("error", json.message, ".message-container");
    }
  } catch (error) {
    console.log(error);
  }
}
