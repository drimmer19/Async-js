"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////

// Котики
// const request = new XMLHttpRequest();
// request.open('GET', 'https://meowfacts.herokuapp.com/?count=5');
// request.send();
// request.addEventListener('load',function () {
//     const data = JSON.parse(request.responseText);
//     const text = data.data
//     text.forEach((item) => countriesContainer.insertAdjacentText('afterend', `Факт: ${item} <br>` ))
// })

////////////////////////////////////////

// function getCountryData(country) {
//     const request = new XMLHttpRequest();
//
//     request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//     request.send();
//     function renderCards (data, className = '') {
//         const currencies = Object.entries(data.currencies);
//         const languages = Object.entries(data.languages)
//         const html = ` <article class="country ${className}">
//           <img class="country__img" src="${data.flags.svg}" />
//           <div class="country__data">
//             <h3 class="country__name">${data.name.common}</h3>
//             <h4 class="country__region">${data.region}</h4>
//             <p class="country__row"><span>👫</span>${data.population}</p>
//             <p class="country__row"><span>🗣️</span>${languages[0][1]}</p>
//             <p class="country__row"><span>💰</span>${currencies[0][1].name}</p>
//           </div>
//         </article> `;
//         countriesContainer.insertAdjacentHTML('beforeend', html);
//         countriesContainer.style.opacity = 1;
//
//     }
//
//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(request.responseText)
//         const neighbour = data.borders[0]
//         renderCards(data);
//
//         const request2 = new XMLHttpRequest();
//         request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//         request2.send();
//         request2.addEventListener('load', function () {
//             const [data2] = JSON.parse(request2.responseText)
//             renderCards(data2, 'neighbour')
//         })
//     })
// }
//
// getCountryData('russia')

//                                              Fetch
function renderCards(data, className = "") {
  const currencies = Object.entries(data.currencies);
  const languages = Object.entries(data.languages);
  const html = ` <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span>🗣️</span>${languages[0][1]}</p>
            <p class="country__row"><span>💰</span>${currencies[0][1].name}</p>
          </div>
        </article> `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
}

function renderError(message) {
  countriesContainer.insertAdjacentText("beforeend", message);
}

function getCountryData(country) {
  function getJSON(url, errorMsg = "Ошибка") {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(
          `${errorMsg} (${response.status} ${response.statusText})`,
        );
      }
      return response.json();
    });
  }

  getJSON(`https://restcountries.com/v3.1/name/${country}`, "Страна не найдена")
    .then((data) => {
      renderCards(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) {
        throw new Error("Страна сосед не найдена");
      }

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "Страна сосед не найдена",
      ).then((data) => {
        const [res] = data;
        renderCards(res, "neighbour");
      });
    })
    .catch((err) => renderError(`Ошибка: ${err.message}`))
    .finally(() => (countriesContainer.style.opacity = 1));
}

// практика
function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (err) => reject(err),
    );
  });
}


const apiKey = "114753668578654511182x21582";

btn.addEventListener("click", function () {
  (async () => {
    try {
      const pos = await getPosition({
        timeout: 1000,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      console.log("coords:", lat, lng);

      const resGeo = await fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`,
      );
      if (!resGeo.ok)
        throw new Error(
          `Ошибка геокодинга (${resGeo.status} ${resGeo.statusText})`,
        );
      const dataGeo = await resGeo.json();
      console.log(dataGeo);

      const country = dataGeo.country;
      getCountryData(country);
    } catch (e) {
      console.error("Ошибка получения позиции:", e);
    }
  })();
});

// не работает в России только через VPN



