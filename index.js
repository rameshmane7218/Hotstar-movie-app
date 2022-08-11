//sticky navbar starts here

window.onscroll = function () {
    myFunction();
}

let navbar = document.getElementById("navbar");
let sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}

//sticky navbar end here
// https://www.omdbapi.com/?s=batman&apikey=e18b3001
// https://www.omdbapi.com/?i=tt0372784&apikey=e18b3001

let moviesDiv = document.getElementById("searchlist");
let searchBox = document.getElementById("searchBox");
let id;

async function searchMovies() {
    let searchList = document.getElementById("searchlist");
    let query = document.getElementById("searchBox").value;
    query = query.split(" ").filter(function (el) {
        if (el != " ") return el;
    }).join(" ");
    if (query.length > 0) {
        searchList.style.visibility = "visible";
    } else {
        searchList.style.visibility = "hidden";
    }
    // console.log('query:', query)

    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=e18b3001`);

        const data = await res.json();
        // console.log('data:', data);
        const movies = data.Search;

        // appendMovies(movies)

        return movies;


    }
    catch (err) {
        console.log('err:', err)

    }

}

function appendMovies(data) {

    if (data == undefined) {
        return false;
    }

    moviesDiv.innerHTML = null;
    data.forEach(function (el) {
        let box = document.createElement("div");
        box.setAttribute("class", "searchListItem");
        box.dataset.id = el.imdbID;

        let imgDiv = document.createElement("div");
        imgDiv.setAttribute("class", "searchItemThumbnail");

        let img = document.createElement("img");
        const noPoster = "https://www.prokerala.com/movies/assets/img/no-poster-available.jpg";
        img.src = `${el.Poster != "N/A" ? el.Poster : noPoster}`;

        imgDiv.append(img);

        let infoDiv = document.createElement("div");
        infoDiv.setAttribute("class", "searchItemInfo");

        let title = document.createElement("h4");
        title.textContent = el.Title;

        let year = document.createElement("p");
        year.textContent = el.Year;

        infoDiv.append(title, year);

        box.append(imgDiv, infoDiv);

        moviesDiv.append(box);
    })

    //this function used to get extra information about perticular movie
    loadMovieDetails();
}

//closures
async function main() {
    let data = await searchMovies();
    // console.log(data);

    if (data == undefined) {
        return false;
    }
    // console.log(data);
    appendMovies(data)
}


// Debouncing 

function debounce(func, delay) {
    if (id) {
        clearTimeout(id);
    }

    id = setTimeout(function () {
        func()
    }, delay)
}

window.addEventListener("click", function (event) {
    // console.log(event.target.id);
    if (event.target.id != "searchBox") {
        moviesDiv.style.visibility = "hidden";
        searchBox.value = "";
    }
})


function loadMovieDetails() {
    // console.log("inside function loadMovieDetails")
    const SearchMoviesList = moviesDiv.querySelectorAll(".searchListItem");
    // console.log(SearchMoviesList);
    SearchMoviesList.forEach(function (el) {
        // console.log(el);
        el.addEventListener("click", async () => {
            // console.log(el);
            moviesDiv.style.visibility = "hidden";
            searchBox.value = "";
            // console.log(el.dataset.id)
            const result = await fetch(`https://www.omdbapi.com/?i=${el.dataset.id}&apikey=e18b3001`)
            const movieResult = await result.json();
            // console.log('movieResult:', movieResult)

            displayMovieDetails(movieResult);
        })
    })
}

let detailsContainer = document.getElementById("resultContainer");
function displayMovieDetails(movieResult) {
    // console.log(movieResult);
    let rating;
    if(movieResult.imdbRating != "N/A"){
        rating = `${movieResult.imdbRating}/10`;
    }else{
        rating = "N/A";
    }
    detailsContainer.innerHTML =
    `
        <div class="moviePoster">
            <img src=${movieResult.Poster != "N/A" ? movieResult.Poster : "https://www.prokerala.com/movies/assets/img/no-poster-available.jpg"} alt = "movie poster">
        </div>
        <div class="movieInfo">
            <h3 class="movieTitle">${movieResult.Title}</h3>
            <ul class="movieInfolist">
                <li class="year">Year: ${movieResult.Year}</li>
                <li class="rated">IMDb Ratings: ${rating}</li>
                <li class="released">Released: ${movieResult.Released}</li>
            </ul>
            <p class = "genre"><b>Genre: </b> ${movieResult.Genre}</p>
            <p class = "writer"><b>Writer: </b> ${movieResult.Writer}</p>
            <p class = "actors"><b>Actors: </b>${movieResult.Actors}</p>
            <p class = "plot"><b>Plot: </b>${movieResult.Plot}</p>
            <p class = "language"><b>Language: </b>${movieResult.Language}</p>
            <p class = "awards"><b><i class = "fas fa-award"></i></b>${movieResult.Awards}</p>
        </div>
    `

}



// trending movies
let trending = JSON.parse(localStorage.getItem("trending"))
console.log(trending);
const img_url = `https://image.tmdb.org/t/p/w500`;

trending.forEach((el) => {
    let box = document.createElement("div");
    box.setAttribute("id","movieBox")

    let img = document.createElement("img");
    img.setAttribute("id","img")
    img.src = `${img_url}${el.poster_path}`;

    let para = document.createElement("div");
    para.setAttribute("id","para");

    let name = document.createElement("p");
    name.setAttribute("id", "movieName");
    name.textContent = el.title;
    name.style.fontWeight = "bold";

    let releaseDate = document.createElement("p");
    releaseDate.textContent = `Released: ${el.release_date}`;

    para.append(name,releaseDate)
    box.append(img, para);
    document.getElementById("trending").append(box)

  
})

