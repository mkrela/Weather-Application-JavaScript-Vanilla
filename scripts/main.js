import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";

const CLEFAPI = "55d98c1c718e61a231e9661e2e177d67";
let resultatsAPI;
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-nom-prevision");
const tempsPourH = document.querySelectorAll(".heure-prevision-valeur");
const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempsjoursDiv = document.querySelectorAll(".jour-prevision-temp");
const imgIcone = document.querySelector(".logo-meteo");
const chargementContainer = document.querySelector(".overlay-icone-chargement");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //   console.log(position);
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      AppelApi(long, lat);
    },
    () => {
      alert("Vous avez refusé jeune chacal, mangez vos grands morts");
    }
  );
}

function AppelApi(long, lat) {
  // console.log(long, lat);
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`
  )
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      console.log(data);
      resultatsAPI = data;
      temps.innerText = resultatsAPI.current.weather[0].description;
      temperature.innerText = `${resultatsAPI.current.temp}°C`;
      localisation.innerText = resultatsAPI.timezone;

      //    Les heures par tranches de 3 avec leur température.

      let heureActuelle = new Date().getHours();

      for (let i = 0; i < heure.length; i++) {
        let heureIncr = heureActuelle + i * 3;
        if (heureIncr > 24) {
          heure[i].innerText = `${heureIncr - 24}h`;
        } else if (heureIncr === 24) {
          heure[i].innerText = "00h";
        } else heure[i].innerText = `${heureIncr}h`;
      }

      // temps pour les 3h seulement
      for (let j = 0; j < tempsPourH.length; j++) {
        tempsPourH[j].innerText = `${Math.trunc(
          resultatsAPI.hourly[j * 3].temp
        )}°`;
      }

      // trois premieres lettres des jours
      for (let k = 0; k < tabJoursEnOrdre.length; k++) {
        joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
      }

      // temps par jour
      for (let m = 0; m < 7; m++) {
        tempsjoursDiv[m].innerText = `${Math.trunc(
          resultatsAPI.daily[m + 1].temp.day
        )}°`;
      }

      // affichage dynamique du logo
      if (heureActuelle >= 6 && heureActuelle < 21) {
        imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
      } else {
        imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
      }

    });
  }

  chargementContainer.classList.add("disparition");
