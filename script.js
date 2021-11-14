'use strict';

const inputFrom = document.querySelector('#currency-from');
const inputTo = document.querySelector('#currency-to');
const selectBoxes = document.querySelectorAll('.select-box');
const convertButton = document.querySelector('#convert');
const amount = document.querySelector('#amount');
const apiKey = '96705bd0-417f-11ec-8d6c-45c8b69d2b4f';
const mainUrl = `https://freecurrencyapi.net/api/v2/latest?apikey=${apiKey}`;
const select = document.querySelectorAll('select');

async function request() {
   const response = await fetch(mainUrl);
   const data = await response.json();
   console.log(data)
   await setInfo(data)
}
request();

function setInfo(response) {
   const data = response.data;
   for (let i = 0; i < select.length; i++) {
      for (let currency in data) {
         let selected;
         for (let i = 0; i < select.length; i++) {
            if (i == 0) {
               selected = currency == 'USD' ? 'selected' : '';
               //console.log(selected)
            } else if (i == 1) {
               selected = currency == 'RUB' ? 'selected' : '';
               console.log(selected)
            }
         }
         const option = `<option value="${data[currency]}" label="${currency}"${selected}>${currency}</option>`;
         select[i].insertAdjacentHTML('beforeend', option);
      }
   }
   //for (let currency in data) {
   //   let selected;
   //   for (let i = 0; i < select.length; i++) {
   //      if (i == 0) {
   //         selected = currency == 'USD' ? 'selected' : '';
   //      } else if (i == 1) {
   //         selected = currency == 'RUB' ? 'selected' : '';
   //      }
   //   }
   //   select.forEach((element) => {
   //      if (element == 'RUB' || element == 'USD') {
   //         element.innerHTML += `<option value="${data[currency]}" label="${currency}" selected>${currency}</option>`;
   //      } else {
   //         element.innerHTML += `<option value="${data[currency]}" label="${currency}">${currency}</option>`;
   //      }
   //   });
   //}
   //selectBoxes.forEach((box) => {
   //   const currency = box.querySelector('select');
   //   let currencyOption = currency.querySelector('option')
   //   console.log(currencyOption.label)
   //   //const flag = currency.slice(0, -1);
   //   //const img = box.querySelector('img');
   //   //img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
   //})
}
function setFlag() {
   const currency = this.querySelector('select').label;
   const flag = currency.slice(0, -1);
   const img = this.querySelector('img');
   img.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${flag}.svg`;
}

selectBoxes.forEach((element) => {
   element.addEventListener('click', setFlag)
});

//function convert() {
//   //let amount = inputFrom.value;
//   let course = inputFrom.value
//   if (amount === '' || amount === 0) {
//      inputFrom.value = 1;
//      amount = 1;
//   }
//   console.log(course)
//   //let result = 
//}

convertButton.addEventListener('click', convert);