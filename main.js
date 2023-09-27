'use strict';

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const inputRace = document.querySelector('.js-input-race');

const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_search_race = document.querySelector('.js_in_search_race');

const GITHUB_USER = 'BarbaraBravoRedondo';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

const kittenListStored = JSON.parse(localStorage.getItem('kittensList'));

let kittenDataList = [];

//Funciones

function kittenStored() {
  if (kittenListStored) {
    renderKittenList(kittenListStored);
  } else {
    fetch(SERVER_URL)
      .then((response) => response.json())
      .then((data) => {
        kittenDataList = data.results;
        renderKittenList(kittenDataList);
        localStorage.setItem('kittensList', JSON.stringify(kittenDataList));
        console.log(kittenDataList);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
kittenStored();

function renderKitten(kittenData) {
  let html = '';
  if (kittenData.race === '') {
    html = `Uy que despiste, no sabemos su raza`;
  } else {
    html = kittenData.race;
  }

  const kitten = document.createElement('li');
  kitten.classList.add('card');
  const article = document.createElement('article');
  kitten.appendChild(article);
  const img = document.createElement('img');
  img.classList.add('card_img');
  img.src = kittenData.image;
  img.alt = 'gatito';
  article.appendChild(img);
  const cardName = document.createElement('h3');
  cardName.classList.add('card_title');
  cardName.textContent = kittenData.name;
  article.appendChild(cardName);
  const cardRace = document.createElement('h3');
  cardRace.classList.add('card_race');
  const catRace = document.createTextNode(html);
  cardRace.appendChild(catRace);
  article.appendChild(cardRace);
  const desc = document.createElement('p');
  desc.classList.add('card_description');
  desc.textContent = kittenData.desc;
  article.appendChild(desc);

  return kitten;
}

function renderKittenList(kittenDataList) {
  listElement.innerHTML = '';

  for (const kittenItem of kittenDataList) {
    listElement.appendChild(renderKitten(kittenItem));
  }
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
  newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
  newFormElement.classList.add('collapsed');
}

function handleClickNewCatForm(event) {
  event.preventDefault();
  if (newFormElement.classList.contains('collapsed')) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}
//Adicionar nuevo gatito

function addNewKitten(event) {
  event.preventDefault();
  const valueDesc = inputDesc.value;
  const valuePhoto = inputPhoto.value;
  const valueName = inputName.value;
  const newKittenDataObject = {
    image: inputPhoto.value,
    name: inputName.value,
    desc: inputDesc.value,
    race: inputRace.value,
  };

  if (valueDesc === '' || valuePhoto === '' || valueName === '') {
    labelMessageError.innerHTML = '¡Uy! parece que has olvidado algo';
  } else if (valueDesc !== '' && valuePhoto !== '' && valueName !== '') {
    labelMessageError.innerHTML = 'Mola! Un nuevo gatito en Adalab!';

    fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newKittenDataObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          kittenDataList.push(newKittenDataObject);
          localStorage.setItem('kittensList', JSON.stringify(kittenDataList));
          inputPhoto.value = '';
          inputName.value = '';
          inputDesc.value = '';
          inputRace.value = '';
          renderKittenList(kittenDataList);
        } else {
          labelMessageError.innerHTML = 'No se pudo añadir tu gatito =(';
        }
      });
  }
}
//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
  event.preventDefault();
  newFormElement.classList.add('collapsed');
  inputDesc.value = '';
  inputPhoto.value = '';
  inputName.value = '';
}

//Filtrar por descripción
function filterKitten(event) {
  event.preventDefault();
  const descrSearchText = input_search_desc.value;
  const raceSearchText = input_search_race.value;

  const kittenListFiltered = kittenDataList
    .filter((eachKitten) =>
      eachKitten.desc.toLowerCase().includes(descrSearchText)
    )
    .filter((eachKitten) =>
      eachKitten.race.toLowerCase().includes(raceSearchText)
    );

  renderKittenList(kittenListFiltered);
}

//Eventos
linkNewFormElememt.addEventListener('click', handleClickNewCatForm);
searchButton.addEventListener('click', filterKitten);
buttonAdd.addEventListener('click', addNewKitten);
buttonCancelForm.addEventListener('click', cancelNewKitten);
