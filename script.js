'use strict';

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

async function request(url) {
   const response = await fetch(url);
   const data = await response.json();
   return await data;
}

function setInfo(response) {
   const data = response.results;
   for (let i = 0; i < select.length; i++) {
      for (let currency in data) {
         let selected;

         if (i == 0) {
            selected = currency == 'RUB' ? 'selected' : '';
         } else if (i == 1) {
            selected = currency == 'USD' ? 'selected' : '';
         }

         const option = `<option value="${currency}"${selected}>${currency}</option>`;
         select[i].insertAdjacentHTML('beforeend', option);
      }
   }
   select.forEach((element) => {
      const flag = element.value.slice(0, -1);
      const img = element.parentNode.querySelector('img');
      img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
   });
}

async function start() {
   const response = await request(listOfCurrenciesURL);
   await setInfo(response);
}
start();

function setFlag() {
   const currency = this.querySelector('select').value;
   const flag = currency.slice(0, -1);
   const img = this.querySelector('img');
   img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
}

selectBoxes.forEach((element) => {
   element.addEventListener('click', setFlag);
});

function swapCurrency() {
   const currentValue = inputFrom.value;
   inputFrom.value = inputTo.value;
   inputTo.value = currentValue;
}

buttonSwap.addEventListener('click', swapCurrency);

async function convert() {
   let value = amount.value;
   value = value.replace(/\,/, '.');
   const from = inputFrom.value;
   const to = inputTo.value;
   if (output.classList.contains('error')) {
      output.classList.remove('error');
      amount.classList.remove('error');
   }
   if (/[a-z]/i.test(value)) {
      output.textContent = `Введите корректное значение !`;
      output.classList.add('error');
      amount.classList.add('error');
      return false;
   }

   if (value === '' || value === 0) {
      value = 1;
   }

   const requestUrl = mainUrl + `/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=${apiKey}`;
   const response = await request(requestUrl);

   for(let course in response) {
      const result = (value * response[course]).toFixed(3);
      output.textContent = `${value} ${from} = ${result} ${to}`;
   }
}

convertButton.addEventListener('click', convert);

function selectLanguage() {
   if(event.target.classList.contains('language')) {
      if (event.target.classList.contains('language--active')) {
         return false;
      }
      
      const lang = event.target.getAttribute('data-lang');
      const headerTitle = document.querySelector('.converter__header');
      const title = document.querySelector('.title-amount');
      const amountInput = amount;
      const from = document.querySelector('.headline--from');
      const to = document.querySelector('.headline--to');
      const button = convertButton;

      document.querySelector('.language--active').classList.remove('language--active');
      event.target.classList.add('language--active');

      if (lang === 'RU') {
         setLanguage(ruLang)
      } else if (lang === 'EN') {
         setLanguage(enLang);
      } else {
         alert('Error, this function works unproperly');
      }

      function setLanguage(language) {
         headerTitle.textContent = language.title;
         title.textContent = language.amountTitle;
         amountInput.placeholder = language.selectText;
         from.textContent = language.from;
         to.textContent = language.to;
         button.textContent = language.button;
      }
   }
}

document.querySelector('.converter').addEventListener('click', selectLanguage)