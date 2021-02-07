// Global Variables

const addCurrencyBtn = document.querySelector(".add-currency-btn");
const addCurrencyList = document.querySelector(".add-currency-list");
const currenciesList = document.querySelector(".currencies");

const dataURL = "https://api.exchangerate.host/latest";

const initiallyDisplayedCurrencies = ["USD", "EUR", "HNL"];
let baseCurrency;
let baseCurrencyAmount;

let currencies = [
  {
    name: "US Dollar",
    abbreviation: "USD",
    symbol: "\u0024",
    flagURL: "http://www.geonames.org/flags/l/us.gif"
  },
  {
    name: "Euro",
    abbreviation: "EUR",
    symbol: "\u20AC",
    flagURL:
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"
  },
  {
    name: "Lempira",
    abbreviation: "HNL",
    symbol: "L",
    flagURL: "http://www.geonames.org/flags/l/hn.gif"
  },
  {
    name: "Japanese Yen",
    abbreviation: "JPY",
    symbol: "\u00A5",
    flagURL: "http://www.geonames.org/flags/l/jp.gif"
  },
  {
    name: "British Pound",
    abbreviation: "GBP",
    symbol: "\u00A3",
    flagURL: "http://www.geonames.org/flags/l/uk.gif"
  },
  {
    name: "Canadian Dollar",
    abbreviation: "CAD",
    symbol: "\u0024",
    flagURL: "http://www.geonames.org/flags/l/ca.gif"
  },
  {
    name: "Chinese Yuan Renminbi",
    abbreviation: "CNY",
    symbol: "\u00A5",
    flagURL: "http://www.geonames.org/flags/l/cn.gif"
  },
  {
    name: "Hong Kong Dollar",
    abbreviation: "HKD",
    symbol: "\u0024",
    flagURL: "http://www.geonames.org/flags/l/hk.gif"
  },
  {
    name: "South Korean Won",
    abbreviation: "KRW",
    symbol: "\u20A9",
    flagURL: "http://www.geonames.org/flags/l/kr.gif"
  }
];

// Event Listeners

addCurrencyBtn.addEventListener("click", addCurrencyBtnClick);

function addCurrencyBtnClick(event) {
  addCurrencyBtn.classList.toggle("open");
}

addCurrencyList.addEventListener("click", addCurrencyListClick);

function addCurrencyListClick(event) {
  const clickedListItem = event.target.closest("li");
  if (!clickedListItem.classList.contains("disabled")) {
    const newCurrency = currencies.find(
      (c) => c.abbreviation === clickedListItem.getAttribute("data-currency")
    );
    if (newCurrency) newCurrenciesListItem(newCurrency);
  }
}

currenciesList.addEventListener("click", currenciesListClick);

function currenciesListClick(event) {
  if (event.target.classList.contains("close")) {
    const parentNode = event.target.parentNode;
    parentNode.remove();
    addCurrencyList
      .querySelector(`[data-currency=${parentNode.id}]`)
      .classList.remove("disabled");
    if (parentNode.classList.contains("base-currency")) {
      const newBaseCurrencyLI = currenciesList.querySelector(".currency");
      if (newBaseCurrencyLI) {
        setNewBaseCurrency(newBaseCurrencyLI);
        baseCurrencyAmount = Number(
          newBaseCurrencyLI.querySelector(".input input").value
        );
      }
    }
  }
}

function setNewBaseCurrency(newBaseCurrencyLI) {
  newBaseCurrencyLI.classList.add("base-currency");
  baseCurrency = newBaseCurrencyLI.id;
  const baseCurrencyRate = currencies.find(
    (currency) => currency.abbreviation === baseCurrency
  ).rate;
  currenciesList.querySelectorAll(".currency").forEach((currencyLI) => {
    const currencyRate = currencies.find(
      (currency) => currency.abbreviation === currencyLI.id
    ).rate;
    const exchangeRate =
      currencyLI.id === baseCurrency
        ? 1
        : (currencyRate / baseCurrencyRate).toFixed(4);
    currencyLI.querySelector(
      ".base-currency-rate"
    ).textContent = `1 ${baseCurrency} = ${exchangeRate} ${currencyLI.id}`;
  });
}

currenciesList.addEventListener("input", currenciesListInputChange);

function currenciesListInputChange(event) {
  const isNewBaseCurrency = event.target.closest("li").id !== baseCurrency;
  if (isNewBaseCurrency) {
    currenciesList
      .querySelector(`#${baseCurrency}`)
      .classList.remove("base-currency");
    setNewBaseCurrency(event.target.closest("li"));
  }
  const newBaseCurrencyAmount = isNaN(event.target.value)
    ? 0
    : Number(event.target.value);
  if (baseCurrencyAmount !== newBaseCurrencyAmount || isNewBaseCurrency) {
    baseCurrencyAmount = newBaseCurrencyAmount;
    const baseCurrencyRate = currencies.find(
      (currency) => currency.abbreviation === baseCurrency
    ).rate;
    currenciesList.querySelectorAll(".currency").forEach((currencyLI) => {
      if (currencyLI.id !== baseCurrency) {
        const currencyRate = currencies.find(
          (currency) => currency.abbreviation === currencyLI.id
        ).rate;
        const exchangeRate =
          currencyLI.id === baseCurrency
            ? 1
            : (currencyRate / baseCurrencyRate).toFixed(4);
        currencyLI.querySelector(".input input").value =
          exchangeRate * baseCurrencyAmount !== 0
            ? (exchangeRate * baseCurrencyAmount).toFixed(4)
            : "";
      }
    });
  }
}

currenciesList.addEventListener("focusout", currenciesListFocusOut);

function currenciesListFocusOut(event) {
  const inputValue = event.target.value;
  if (isNaN(inputValue) || Number(inputValue) === 0) event.target.value = "";
  else event.target.value = Number(inputValue).toFixed(4);
}

currenciesList.addEventListener("keydown", currenciesListKeyDown);

function currenciesListKeyDown(event) {
  if (event.key === "Enter") event.target.blur();
}

// Auxiliary Functions

function populateAddCyrrencyList() {
  for (let i = 0; i < currencies.length; i++) {
    addCurrencyList.insertAdjacentHTML(
      "beforeend",
      `<li data-currency=${currencies[i].abbreviation}>
        <img src=${currencies[i].flagURL} class="flag"><span>${currencies[i].abbreviation} - ${currencies[i].name}</span>
      </li>`
    );
  }
}

function populateCurrenciesList() {
  for (let i = 0; i < initiallyDisplayedCurrencies.length; i++) {
    const currency = currencies.find(
      (c) => c.abbreviation === initiallyDisplayedCurrencies[i]
    );
    if (currency) newCurrenciesListItem(currency);
  }
}

function newCurrenciesListItem(currency) {
  if (currenciesList.childElementCount === 0) {
    baseCurrency = currency.abbreviation;
    baseCurrencyAmount = 0;
  }
  addCurrencyList
    .querySelector(`[data-currency=${currency.abbreviation}]`)
    .classList.add("disabled");
  const baseCurrencyRate = currencies.find(
    (c) => c.abbreviation === baseCurrency
  ).rate;
  const exchangeRate =
    currency.abbreviation === baseCurrency
      ? 1
      : (currency.rate / baseCurrencyRate).toFixed(4);
  const inputValue = baseCurrencyAmount
    ? (baseCurrencyAmount * exchangeRate).toFixed(4)
    : "";

  currenciesList.insertAdjacentHTML(
    "beforeend",
    `<li class="currency ${
      currency.abbreviation === baseCurrency ? "base-currency" : ""
    }" id=${currency.abbreviation}>
      <img src=${currency.flagURL} class="flag">
      <div class="info">
        <p class="input"><span class="currency-symbol">${
          currency.symbol
        }</span><input placeholder="0.0000" value=${inputValue}></p>
        <p class="currency-name">${currency.abbreviation} - ${currency.name}</p>
        <p class="base-currency-rate">1 ${baseCurrency} = ${exchangeRate} ${
      currency.abbreviation
    }</p>
      </div>
      <span class="close">&times;</span>
    </li>`
  );
}

fetch(dataURL)
  .then((res) => res.json())
  .then((data) => {
    document.querySelector(".date").textContent = data.date;
    data.rates["EUR"] = 1;
    currencies = currencies.filter(
      (currency) => data.rates[currency.abbreviation]
    );
    currencies.forEach(
      (currency) => (currency.rate = data.rates[currency.abbreviation])
    );
    populateAddCyrrencyList();
    populateCurrenciesList();
  })
  .catch((err) => console.log(err));

//-----------------------------------------------------------

/*

//var currency;

function setup() {
  loadJSON('https://api.exchangerate.host/latest?base=USD&symbols=HNL', gotData, 'jsonp');
}

function gotData(data) {
  console.log(data);
}

var requestURL = 'https://api.exchangerate.host/latest?base=USD&symbols=HNL';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var response = request.response;
  console.log(response);
}

*/

var monHNL = 1;

const dataUSD = "https://api.exchangerate.host/latest?base=USD&symbols=HNL";
const dataEUR = "https://api.exchangerate.host/latest?base=EUR&symbols=HNL";

function loadCurr() {
  document.getElementById('comUSD').innerHTML = "2";
}
