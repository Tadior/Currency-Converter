'use strict';
// Create start variables / Создаем стартовые переменные переменные
const inputFrom = document.querySelector('#currency-from');
const inputTo = document.querySelector('#currency-to');
const selectBoxes = document.querySelectorAll('.select-box');
const convertButton = document.querySelector('#convert');
const amount = document.querySelector('#amount');
const apiKey = '914d1b78d615771f93ba';
const mainUrl = `https://free.currconv.com`;
const listOfCurrenciesURL = mainUrl + `/api/v7/currencies?apiKey=${apiKey}`;
const buttonSwap = document.querySelector('.icon');
const select = document.querySelectorAll('select');
const output = document.querySelector('#output');
const ruLang = {
   title: 'Конвертер валют',
   amountTitle: 'Введите значение',
   selectText: 'Введите число',
   from: 'Конвертировать из',
   to: 'В',
   button: 'Конвертировать'
};
const enLang = {
   title: 'Currency Converter',
   amountTitle: 'Enter amount',
   selectText: 'Input number',
   from: 'From',
   to: 'To',
   button: 'Convert'
};
// This function used for set LocalStorage language / Функция установки языка из хранилища
function setStorageLang() {
   if (localStorage.length > 0) {
      if (localStorage.getItem('language') !== null) {
         if (localStorage.language == 'RU') {
            setLanguage(ruLang);
         } else if (localStorage.language == 'EN') {
            setLanguage(enLang);
         }
         document.querySelector('.language--active').classList.remove('language--active');
         document.querySelector(`[data-lang=${localStorage.language}]`).classList.add('language--active');
      }
   }
}
//----------------------------------------------------------
// There're two function for server request / Имеются двe функции для API запроса, 
// возвращают ответ в формате JSON, Можно использовать любую из пердставленных
async function request(url) {
   const response = await fetch(url);
   const data = await response.json();
   return await data;
}

//function request(url) {
//   return new Promise(function(resolve,reject) {
//      const xhr = new XMLHttpRequest()
//      xhr.open('GET' , url);
//      xhr.setRequestHeader('Content-type', 'application/json');
//      xhr.responseType = 'json';
//      xhr.onload = () => {
//         if (xhr.status >= 400) {
//            reject(xhr.response);
//         } else {
//            resolve(xhr.response);
//         }
//      }
//      xhr.send();
//   });
//}

//----------------------------------------------------------
//This function set currency on website
function setInfo(response) {
   const data = response.results; // Get data / Получаем данные
   for (let i = 0; i < select.length; i++) {
      for (let currency in data) {
         let selected;
         if (i == 0) { // Set standard currency / Устанавливаем стандартные валюты
            if (localStorage.getItem('from')) {
               selected = currency == localStorage.from ? 'selected' : '';
            } else {
               selected = currency == 'RUB' ? 'selected' : '';
            }
         } else if (i == 1) { // Set standard currency / Устанавливаем стандартные валюты
            if (localStorage.getItem('to')) {
               selected = currency == localStorage.to ? 'selected' : '';
            } else {
               selected = currency == 'USD' ? 'selected' : '';
            }
         }

         const option = `<option value="${currency}"${selected}>${currency}</option>`; //Add new elements / Добавляем новые элементы на страницу
         select[i].insertAdjacentHTML('beforeend', option);
      }
   }
   // Set flags / Устанавливает флаги
   select.forEach((element) => {
      const flag = element.value.slice(0, -1);
      const img = element.parentNode.querySelector('img');
      img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
   });
}
//----------------------------------------------------------

// This function used for first page loading / Функция используется для первоночальной загрузки страницы
async function start() {
   const response = await request(listOfCurrenciesURL);
   await setInfo(response);
   setStorageLang();
}
start();
//----------------------------------------------------------

// Set flag for new selected currency / Устанавливает флаг для выбранной валюты
function setFlag() {
   const currency = this.querySelector('select').value;
   const flag = currency.slice(0, -1);
   const img = this.querySelector('img');
   img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
   // Set localStorage values / Запоминаем валюту
   if (this.querySelector('#currency-from')) {
      localStorage.from = currency;
   } else if (this.querySelector('#currency-to')) {
      localStorage.to = currency;
   }
}
// set event for select / Задаем событие для select
selectBoxes.forEach((element) => {
   element.addEventListener('click', setFlag);
});
//----------------------------------------------------------

// This function swap currency side / Функция меняет местами валюты
function swapCurrency() {
   const currentValue = inputFrom.value;
   inputFrom.value = inputTo.value;
   inputTo.value = currentValue;
}
// set event for buttin swap / Задаем событие для смены мест валюты
buttonSwap.addEventListener('click', swapCurrency);
//----------------------------------------------------------

// It's a main function which calculate values / Главная функция которая рассчитывает значение 
async function convert() {
   let value = amount.value;
   value = value.replace(/\,/, '.'); // Replace ',' on '.'/ Если введена заптятая меняем на точку
   const from = inputFrom.value;
   const to = inputTo.value;
   if (output.classList.contains('error')) {
      output.classList.remove('error');
      amount.classList.remove('error');
   }
   if (/[a-z]/i.test(value)) { // Letter checking / Проверка на введенные буквы
      output.textContent = `Введите корректное значение !`;
      output.classList.add('error');
      amount.classList.add('error');
      return false;
   }

   if (value === '' || value === 0) { // If figure not entered, value = 1  / Если число не ввидено, принимае значение равным 1
      value = 1;
   }

   const requestUrl = mainUrl + `/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=${apiKey}`;
   const response = await request(requestUrl); // get data / Получаем данные

   for(let course in response) {
      const result = (value * response[course]).toFixed(3); // Round value to 3 figures after ','/ Округляет до 3 цифр после запятой
      output.textContent = `${value} ${from} = ${result} ${to}`; // Show value/ Выводим расчет на страницу
   }
}
// Set event for currency calculating / Добавляем событие для рассчета валют
convertButton.addEventListener('click', convert);
//----------------------------------------------------------

// Function switch language of application / Функция переключает язык веб приложения
function selectLanguage() {
   if(event.target.classList.contains('language')) { // event.target checking / Проверка элемента по которому кликнули
      if (event.target.classList.contains('language--active')) {
         return false;
      }
      
      const lang = event.target.getAttribute('data-lang');

      document.querySelector('.language--active').classList.remove('language--active');
      event.target.classList.add('language--active');

      if (lang === 'RU') {
         localStorage.language = 'RU';
         setLanguage(ruLang);
      } else if (lang === 'EN') {
         localStorage.language = 'EN';
         setLanguage(enLang);
      } else {
         alert('Error, this function works unproperly');
      }
   }
}
function setLanguage(language) {
   const headerTitle = document.querySelector('.converter__header');
   const title = document.querySelector('.title-amount');
   const amountInput = amount;
   const from = document.querySelector('.headline--from');
   const to = document.querySelector('.headline--to');
   const button = convertButton;

   headerTitle.textContent = language.title;
   title.textContent = language.amountTitle;
   amountInput.placeholder = language.selectText;
   from.textContent = language.from;
   to.textContent = language.to;
   button.textContent = language.button;
}
// Set event for select language / Делигирование события 
document.querySelector('.converter').addEventListener('click', selectLanguage);
//----------------------------------------------------------