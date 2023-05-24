import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');
import { refs } from './js/refs.js';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    if (!e.target.value) {
    return clearEl();
    }

    fetchCountries(e.target.value.trim())
    .then(data => {
        if (data.length > 10) {
        clearEl();

        Notify.info(
            'Too many matches found. Please enter a more specific name.'
        );
        } else if (data.length >= 2) {
        clearEl();

        refs.listEl.innerHTML = data
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .reduce((ac, el) => {
            return (
                ac +
                `<li class="country-item"><img src="${el.flags.svg}" alt="${el.name.official}" width="40"><span>${el.name.common}</span></li>`
            );
            }, '');
        } else if (data.length === 1) {
        clearEl();

        refs.divEl.innerHTML = `<div><div class="header"><img src="${
            data[0].flags.svg
        }" alt="${data[0].name.common}" width="100"><h2>${
            data[0].name.common
        }</h2></div><p><span class="values">Capital: </span>${
            data[0].capital
        }</p><p><span class="values">Population: </span>${
            data[0].population
        }</p><p><span class="values">Languages: </span>${Object.values(
            data[0].languages
        ).join(', ')}</p></div>`;
        }
    })
    .catch(err => {
        if (err.message === '404') {
        clearEl();
        Notify.failure('Oops, there is no country with that name');
        }

        console.log(err);
    });
}

function clearEl() {
    refs.listEl.innerHTML = '';
    refs.divEl.innerHTML = '';
}
