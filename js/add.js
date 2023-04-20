// import displayMessage from "./components/common/displayMessage.js";
// import createMenu from "./components/common/createMenu.js";
// import { getToken } from "./utils/storage.js";
// import { baseUrl } from "./settings/api.js";

// createMenu();

// const form = document.querySelector("form");
// const title = document.querySelector("#title");
// const price = document.querySelector("#price");
// const description = document.querySelector("#description");
// const developer = document.querySelector("#developer");
// const publisher = document.querySelector("#publisher");
// const platform = document.querySelector("#platform");
// const genre = document.querySelector("#genre");
// const release = document.querySelector("#release");
// const message = document.querySelector(".message-container");

// form.addEventListener("submit", submitForm);

// function submitForm(event) {
//   event.preventDefault();

//   message.innerHTML = "";

//   const titleValue = title.value.trim();
//   const priceValue = parseFloat(price.value);
//   const descriptionValue = description.value.trim();
//   const developerValue = developer.value.trim();
//   const publisherValue = publisher.value.trim();
//   const platformValue = platform.value.trim();
//   const genreValue = genre.value.trim();
//   const releaseValue = release.value.trim();

//   if (
//     titleValue.length === 0 ||
//     priceValue.length === 0 ||
//     isNaN(priceValue) ||
//     descriptionValue.length === 0 ||
//     developerValue.length === 0 ||
//     publisherValue.length === 0 ||
//     platformValue.length === 0 ||
//     genreValue.length === 0 ||
//     releaseValue.length === 0
//   ) {
//     return displayMessage(
//       "warning",
//       "Please supply proper values",
//       ".message-container"
//     );
//   }

//   addGame(
//     titleValue,
//     priceValue,
//     descriptionValue,
//     developerValue,
//     publisherValue,
//     platformValue,
//     genreValue,
//     releaseValue
//   );
// }

// async function addGame(
//   title,
//   price,
//   description,
//   developer,
//   publisher,
//   platform,
//   genre,
//   release
// ) {
//   const url = baseUrl + "/api/games";

//   const data = JSON.stringify({
//     data: {
//       title: title,
//       price: price,
//       description: description,
//       info: {
//         developer: developer,
//         publisher: publisher,
//         platform: platform,
//         genre: genre,
//         release_date: release,
//       },
//     },
//   });

//   const token = getToken();

//   const options = {
//     method: "POST",
//     body: data,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     const json = await response.json();

//     if (json.data.attributes.createdAt) {
//       displayMessage("success", "Product created", ".message-container");
//       form.reset();
//     }

//     if (json.data.attributes.error) {
//       displayMessage("error", json.error.message, ".message-container");
//     }

//     console.log(json.data.attributes.error);
//     console.log(json);
//   } catch (error) {
//     console.log(error);
//     displayMessage("error", "An error occurred", ".message-container");
//   }
// }

import displayMessage from "./components/common/displayMessage.js";
import createMenu from "./components/common/createMenu.js";
import { getToken } from "./utils/storage.js";
import { baseUrl } from "./settings/api.js";

createMenu();

const form = document.querySelector("form");
const messageContainer = document.querySelector(".message-container");

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  messageContainer.innerHTML = "";

  const values = Object.fromEntries(new FormData(form));

  if (
    Object.values(values).some(
      (value) => typeof value === "string" && value.trim() === ""
    )
  ) {
    return displayMessage(
      "warning",
      "Please supply all values",
      ".message-container"
    );
  }

  addGame(values);
}

async function addGame(values) {
  const {
    title,
    price,
    description,
    developer,
    publisher,
    platform,
    genre,
    release,
  } = values;

  const imageFile = document.querySelector("#thumbnail").files[0];

  const url = `${baseUrl}/api/games`;

  const token = getToken();

  const data = {
    title,
    price: parseFloat(price),
    description,
    info: {
      developer,
      publisher,
      platform,
      genre,
      release,
    },
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  const imageBlob = new Blob([imageFile], { type: imageFile.type });
  formData.append("files.thumbnail", imageBlob, imageFile.name);

  const options = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (json.data && json.data.attributes.createdAt) {
      displayMessage("success", "Product created", ".message-container");
      form.reset();
    } else if (json.data && json.data.attributes.error) {
      displayMessage("error", json.data.attributes.error, ".message-container");
    }
  } catch (error) {
    console.log(error);
    displayMessage("error", "An error occurred", ".message-container");
  }
}
