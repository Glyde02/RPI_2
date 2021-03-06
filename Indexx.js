const
    time = document.getElementById('time'),
    date = document.getElementById('date'),
    greeting = document.getElementById('greeting'),
    name = document.getElementById('name'),
    focus = document.getElementById('focus'),
    arrow = document.getElementById('rightArrow'),
    quote = document.getElementById('quote'),
    quoteRefresh = document.getElementById('newQuote'),
    city = document.getElementById('city'),
    temp = document.getElementById('temp'),
    condition = document.getElementById('condition'),
    humidity = document.getElementById('humidity'),
    wind = document.getElementById('wind'),
    icon = document.getElementById('icon');

const
    arr_month = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
    arr_week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function showTime()
{
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        dayWeek = today.getDay(),
        day = today.getDate(),
        month = today.getMonth();



    if (min === 0 && sec === 0)
        nextHour();
    time.innerHTML = `${makeTime(hour)}<span>:</span>${makeTime(min)}<span>:</span>${makeTime(sec)}`;
    date.innerHTML = `${arr_week[dayWeek]}<span>, </span>${day} ${arr_month[month]}`;


    setTimeout(showTime, 1000);
}

function makeTime(i){
    return (i < 10 ? '0' : '') + i;
}

//---------------------------------

const startPath = 'css/img/';
let index_type = 0;
const arr_type = ["night/", "morning/", "day/", "evening/"];
let index_img = 0;
const arr_index = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg",
    "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
    "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", ];

function prepareBackground(){
    let today = new Date(),
        hour = today.getHours();

    if (hour < 6)
    {
        index_type = 0;
        greeting.textContent = 'Good Night, ';
        outBackground();

    } else if (hour < 12)
    {
        index_type = 1;
        greeting.textContent = 'Good Morning, ';
        outBackground();

    } else if (hour < 18)
    {
        index_type = 2;
        greeting.textContent = 'Good Day, ';
        outBackground();

    } else
    {
        index_type = 3;
        greeting.textContent = 'Good Evening, ';
        outBackground();
    }
}

function outBackground(type) {
    arr_index.sort(() => Math.random() - 0.5);

    let path = startPath + arr_type[index_type] + arr_index[index_img];
    //document.body.style.backgroundImage = `url(${path})`;

    const img = new Image();
    img.src = path;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${path})`;
    };
    //document.getElementById('focus').innerHTML = `${path}`;
}

//auto every hour
function nextHour(hour) {
    index_img++;
    if (index_img > 19)
        index_img = 0;

    prepareBackground();
}

//pushed button
function setNextBackground() {

    //next img
    index_img++;
    if (index_img > 19) {
        index_img = 0;

        //next type of day
        index_type++;
        if (index_type > 3)
            index_type = 0;
    }
    outBackground();
}

//------------------------------------------

let buff_text;

function getName(){
    if (localStorage.getItem('name') === null) {
        name.textContent = '[Enter Name]';
    }
    else
    {
        name.textContent = localStorage.getItem('name');
    }
}
function setName(e){
    if (e.type === 'keypress'){
        if (e.keyCode === 13)
        {
            localStorage.setItem('name', e.target.innerHTML);
            name.blur();
        }
    }
    else
    {
        if (name.innerHTML === '')
            name.innerHTML = buff_text;
        localStorage.setItem('name', e.target.innerHTML);
    }
}

function getFocus(){
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[Enter Focus]';
    }
    else
    {
        focus.textContent = localStorage.getItem('focus');
    }
}
function setFocus(e){
    if (e.type === 'keypress'){
        if (e.keyCode === 13)
        {
            localStorage.setItem('focus', e.target.innerHTML);
            focus.blur();
        }
    }
    else
    {
        if (focus.innerHTML === '')
            focus.innerHTML = buff_text;
        localStorage.setItem('focus', e.target.innerHTML);
    }
}


showTime();
prepareBackground();
getName();
getFocus();


name.addEventListener('click', () => {if (name.innerHTML !== '') {buff_text = name.innerHTML; name.innerHTML = '';}});
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('click', () => {if (focus.innerHTML !== '') {buff_text = focus.innerHTML; focus.innerHTML = '';}});
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

//------------------------



function nextImg() {

    setNextBackground();

    arrow.disabled = true;
    setTimeout(function() { arrow.disabled = false }, 950);


}


arrow.addEventListener('click', nextImg);

//-------------------------

async function getQuote() {
    const url = `https://api.chucknorris.io/jokes/random`;
    const res = await fetch(url);

    if (!res.ok){
        quote.textContent = 'Error API';
    }
    else
    {
        const json = await res.json();
        quote.textContent = json.value;
    }
}


document.addEventListener('DOMContentLoaded', getQuote);
quoteRefresh.addEventListener('click', getQuote);

//-------------------------

let buff_city;

function getCity(){
    if (localStorage.getItem('city_name') === null) {
        city.textContent = '[Enter City]';
    }
    else
    {
        city.textContent = localStorage.getItem('city_name');
    }
}
function setCity(e){
    if (e.type === 'keypress'){
        if (e.keyCode == 13)
        {
            localStorage.setItem('city_name', e.target.innerHTML);

            getWeatherInfo();
            city.blur();
        }
    }
    else
    {
        if (city.innerHTML === '')
            city.innerHTML = buff_city;
        localStorage.setItem('city_name', e.target.innerHTML);
    }
}

async function getWeatherInfo(){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('city_name')}&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
        icon.className = 'weather-icon owf';
        city.textContent = 'Incorrect city name';
        temp.innerHTML = ``;
        condition.textContent =  ``;
        humidity.innerHTML = ``;
        wind.innerHTML = ``;
        return;
    }
    localStorage.setItem('city_name', city.textContent);


    const info = await res.json();
    temp.innerHTML = `Температура - ${info.main.temp}°C`;
    condition.textContent =  info.weather[0].description[0].toUpperCase() + info.weather[0].description.substring(1);
    humidity.innerHTML = `Влажность - ${info.main.humidity}%`;
    wind.innerHTML = `Ветер - ${info.wind.speed} м/с`;

    icon.className = 'weather-icon owf';
    icon.classList.add(`owf-${info.weather[0].id}`);

}

getCity();
getWeatherInfo();

city.addEventListener('click',() => { if (city.innerHTML !== ''){buff_city = city.innerHTML; city.innerHTML = '';}});
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

