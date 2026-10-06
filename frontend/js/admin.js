const API_BASE = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

let currentUser = null;

try {
    currentUser = storedUser
        ? JSON.parse(storedUser)
        : null;
} catch (error) {
    currentUser = null;
}

/* ================================
   AUTH CHECK
================================ */

if (!token || !currentUser || currentUser.role !== "admin") {
    window.location.href = "../login.html";
}

/* ================================
   COMMON API FUNCTION
================================ */

async function apiRequest(url, options = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (response.status === 401 || response.status === 403) {
        alert(data.message || "Session expired or access denied.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../login.html";
        return;
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
}

/* ================================
   PAGE INITIALIZATION
================================ */

document.addEventListener("DOMContentLoaded", () => {

    setAdminDetails();
    setCurrentDate();

    loadDashboard();

    setupNavigation();
    setupModalEvents();
    setupForms();

});


/* ================================
   ADMIN DETAILS
================================ */

function setAdminDetails() {

    const adminName =
        currentUser?.name || "Administrator";

    const adminNameElements = [
        document.getElementById("adminName"),
        document.getElementById("topAdminName")
    ];

    adminNameElements.forEach(element => {
        if (element) {
            element.textContent = adminName;
        }
    });

}


/* ================================
   CURRENT DATE
================================ */

function setCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) return;

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


/* ================================
   NAVIGATION
================================ */

function setupNavigation() {

    const links =
        document.querySelectorAll(".sidebar-link");

    links.forEach(link => {

        link.addEventListener("click", function (event) {

            const section =
                this.dataset.section;

            if (!section) return;

            event.preventDefault();

            showSection(section);

        });

    });

}


/* ================================
   SHOW SECTION
================================ */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".admin-section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    const links =
        document.querySelectorAll(".sidebar-link");

    links.forEach(link => {
        link.classList.remove("active");

        if (
            link.dataset.section === sectionId
        ) {
            link.classList.add("active");
        }
    });

    updatePageTitle(sectionId);

    if (sectionId === "movies") {
        loadMovies();
    }

    if (sectionId === "theatres") {
        loadTheatres();
    }

    if (sectionId === "shows") {
        loadShows();
        loadShowOptions();
    }

    if (sectionId === "bookings") {
        loadBookings();
    }

    if (sectionId === "food") {
        loadFoodOrders();
    }

    if (sectionId === "users") {
        loadUsers();
    }

}


/* ================================
   PAGE TITLE
================================ */

function updatePageTitle(sectionId) {

    const pageTitle =
        document.getElementById("pageTitle");

    if (!pageTitle) return;

    const titles = {
        dashboard: "Dashboard",
        movies: "Movie Management",
        theatres: "Theatre Management",
        shows: "Show Management",
        bookings: "Booking Management",
        food: "Food Orders",
        users: "User Management"
    };

    pageTitle.textContent =
        titles[sectionId] || "Dashboard";
}


/* ================================
   DASHBOARD
================================ */

async function loadDashboard() {

    try {

        await Promise.all([
            loadMovies(),
            loadTheatres(),
            loadShows()
        ]);

        updateDashboardStats();

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* ================================
   MOVIES
================================ */

async function loadMovies() {

    try {

        const movies =
            await apiRequest("/movies");

        renderMovies(movies);

        const count =
            document.getElementById("movieCount");

        if (count) {
            count.textContent =
                movies.length;
        }

        return movies;

    } catch (error) {

        console.error(
            "Load movies error:",
            error
        );

        showAlert(
            error.message,
            "error"
        );

        return [];

    }

}


/* ================================
   RENDER MOVIES
================================ */

function renderMovies(movies) {

    const container =
        document.getElementById("moviesList");

    if (!container) return;

    if (!movies || movies.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎬</div>
                <h3>No Movies Added</h3>
                <p>Add your first movie.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        movies.map(movie => {

            const poster =
                movie.poster ||
                "https://via.placeholder.com/500x700?text=No+Poster";

            return `
                <div class="management-card">

                    <div class="management-card-image">
                        <img
                            src="${escapeHTML(poster)}"
                            alt="${escapeHTML(movie.title)}"
                            onerror="this.src='https://via.placeholder.com/500x700?text=No+Poster'"
                        />
                    </div>

                    <div class="management-card-content">

                        <h3>
                            ${escapeHTML(movie.title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                movie.genre || "Movie"
                            )}
                        </p>

                        <div class="card-meta">
                            <span>
                                ${escapeHTML(
                                    movie.language || "Telugu"
                                )}
                            </span>

                            <span>
                                ⭐ ${movie.rating || 0}
                            </span>
                        </div>

                        <div class="card-actions">

                            <button
                                class="danger-button"
                                onclick="deleteMovie('${movie._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");

}


/* ================================
   ADD MOVIE
================================ */

async function addMovie(event) {

    event.preventDefault();

    const title =
        document.getElementById("movieTitle").value.trim();

    const description =
        document.getElementById("movieDescription").value.trim();

    const genre =
        document.getElementById("movieGenre").value.trim();

    const language =
        document.getElementById("movieLanguage").value.trim();

    const duration =
        document.getElementById("movieDuration").value.trim();

    const poster =
        document.getElementById("moviePoster").value.trim();

    const rating =
        document.getElementById("movieRating").value;

    if (!title) {
        showAlert(
            "Movie title is required",
            "error"
        );
        return;
    }

    try {

        await apiRequest("/movies", {

            method: "POST",

            body: JSON.stringify({

                title,
                description,
                genre,
                language,
                duration,
                poster,
                rating

            })

        });

        showAlert(
            "Movie added successfully!",
            "success"
        );

        closeMovieModal();

        document
            .getElementById("movieForm")
            .reset();

        await loadMovies();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   DELETE MOVIE
================================ */

async function deleteMovie(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this movie?"
        );

    if (!confirmed) return;

    try {

        await apiRequest(
            `/movies/${id}`,
            {
                method: "DELETE"
            }
        );

        showAlert(
            "Movie deleted successfully!",
            "success"
        );

        await loadMovies();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   THEATRES
================================ */

async function loadTheatres() {

    try {

        const theatres =
            await apiRequest("/theatres");

        renderTheatres(theatres);

        const count =
            document.getElementById("theatreCount");

        if (count) {
            count.textContent =
                theatres.length;
        }

        return theatres;

    } catch (error) {

        console.error(
            "Load theatres error:",
            error
        );

        showAlert(
            error.message,
            "error"
        );

        return [];

    }

}


/* ================================
   RENDER THEATRES
================================ */

function renderTheatres(theatres) {

    const container =
        document.getElementById("theatresList");

    if (!container) return;

    if (!theatres || theatres.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏢</div>
                <h3>No Theatres Added</h3>
                <p>Add your first theatre.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        theatres.map(theatre => {

            return `
                <div class="management-card">

                    <div class="management-card-icon">
                        🏢
                    </div>

                    <div class="management-card-content">

                        <h3>
                            ${escapeHTML(theatre.name)}
                        </h3>

                        <p>
                            📍 ${escapeHTML(theatre.location)}
                        </p>

                        <div class="card-meta">

                            <span>
                                ${theatre.screens || 1}
                                Screen(s)
                            </span>

                            <span class="status-badge">
                                Active
                            </span>

                        </div>

                        <div class="card-actions">

                            <button
                                class="danger-button"
                                onclick="deleteTheatre('${theatre._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");

}


/* ================================
   ADD THEATRE
================================ */

async function addTheatre(event) {

    event.preventDefault();

    const name =
        document.getElementById("theatreName").value.trim();

    const location =
        document.getElementById("theatreLocation").value.trim();

    const screens =
        document.getElementById("theatreScreens").value;

    if (!name || !location) {

        showAlert(
            "Theatre name and location are required",
            "error"
        );

        return;
    }

    try {

        await apiRequest("/theatres", {

            method: "POST",

            body: JSON.stringify({

                name,
                location,
                screens

            })

        });

        showAlert(
            "Theatre added successfully!",
            "success"
        );

        closeTheatreModal();

        document
            .getElementById("theatreForm")
            .reset();

        await loadTheatres();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   DELETE THEATRE
================================ */

async function deleteTheatre(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this theatre?"
        );

    if (!confirmed) return;

    try {

        await apiRequest(
            `/theatres/${id}`,
            {
                method: "DELETE"
            }
        );

        showAlert(
            "Theatre deleted successfully!",
            "success"
        );

        await loadTheatres();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   SHOWS
================================ */

async function loadShows() {

    try {

        const shows =
            await apiRequest("/shows");

        renderShows(shows);

        const count =
            document.getElementById("showCount");

        if (count) {
            count.textContent =
                shows.length;
        }

        return shows;

    } catch (error) {

        console.error(
            "Load shows error:",
            error
        );

        showAlert(
            error.message,
            "error"
        );

        return [];

    }

}


/* ================================
   RENDER SHOWS
================================ */

function renderShows(shows) {

    const container =
        document.getElementById("showsList");

    if (!container) return;

    if (!shows || shows.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎟️</div>
                <h3>No Shows Added</h3>
                <p>Create a show for a movie and theatre.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        shows.map(show => {

            const movieName =
                show.movie?.title || "Unknown Movie";

            const theatreName =
                show.theatre?.name || "Unknown Theatre";

            return `
                <div class="management-card">

                    <div class="management-card-icon">
                        🎟️
                    </div>

                    <div class="management-card-content">

                        <h3>
                            ${escapeHTML(movieName)}
                        </h3>

                        <p>
                            🏢 ${escapeHTML(theatreName)}
                        </p>

                        <div class="show-details">

                            <span>
                                📅 ${escapeHTML(show.showDate)}
                            </span>

                            <span>
                                🕐 ${escapeHTML(show.showTime)}
                            </span>

                            <span>
                                ₹${show.ticketPrice}
                            </span>

                        </div>

                        <div class="card-actions">

                            <button
                                class="danger-button"
                                onclick="deleteShow('${show._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");

}


/* ================================
   LOAD MOVIE + THEATRE OPTIONS
================================ */

async function loadShowOptions() {

    try {

        const [
            movies,
            theatres
        ] = await Promise.all([

            apiRequest("/movies"),
            apiRequest("/theatres")

        ]);

        const movieSelect =
            document.getElementById("showMovie");

        const theatreSelect =
            document.getElementById("showTheatre");

        if (movieSelect) {

            movieSelect.innerHTML =
                `<option value="">
                    Select Movie
                </option>`;

            movies.forEach(movie => {

                movieSelect.innerHTML += `
                    <option value="${movie._id}">
                        ${escapeHTML(movie.title)}
                    </option>
                `;

            });

        }

        if (theatreSelect) {

            theatreSelect.innerHTML =
                `<option value="">
                    Select Theatre
                </option>`;

            theatres.forEach(theatre => {

                theatreSelect.innerHTML += `
                    <option value="${theatre._id}">
                        ${escapeHTML(theatre.name)}
                    </option>
                `;

            });

        }

    } catch (error) {

        console.error(
            "Show options error:",
            error
        );

    }

}


/* ================================
   ADD SHOW
================================ */

async function addShow(event) {

    event.preventDefault();

    const movie =
        document.getElementById("showMovie").value;

    const theatre =
        document.getElementById("showTheatre").value;

    const showDate =
        document.getElementById("showDate").value;

    const showTime =
        document.getElementById("showTime").value;

    const ticketPrice =
        document.getElementById("ticketPrice").value;

    if (
        !movie ||
        !theatre ||
        !showDate ||
        !showTime ||
        !ticketPrice
    ) {

        showAlert(
            "Please fill all show fields",
            "error"
        );

        return;
    }

    try {

        await apiRequest("/shows", {

            method: "POST",

            body: JSON.stringify({

                movie,
                theatre,
                showDate,
                showTime,
                ticketPrice

            })

        });

        showAlert(
            "Show added successfully!",
            "success"
        );

        closeShowModal();

        document
            .getElementById("showForm")
            .reset();

        await loadShows();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   DELETE SHOW
================================ */

async function deleteShow(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this show?"
        );

    if (!confirmed) return;

    try {

        await apiRequest(
            `/shows/${id}`,
            {
                method: "DELETE"
            }
        );

        showAlert(
            "Show deleted successfully!",
            "success"
        );

        await loadShows();

        updateDashboardStats();

    } catch (error) {

        showAlert(
            error.message,
            "error"
        );

    }

}


/* ================================
   DASHBOARD STATS
================================ */

async function updateDashboardStats() {

    try {

        const [
            movies,
            theatres,
            shows
        ] = await Promise.all([

            apiRequest("/movies"),
            apiRequest("/theatres"),
            apiRequest("/shows")

        ]);

        const movieCount =
            document.getElementById("movieCount");

        const theatreCount =
            document.getElementById("theatreCount");

        const showCount =
            document.getElementById("showCount");

        if (movieCount) {
            movieCount.textContent =
                movies.length;
        }

        if (theatreCount) {
            theatreCount.textContent =
                theatres.length;
        }

        if (showCount) {
            showCount.textContent =
                shows.length;
        }

        const bookingCount =
            document.getElementById("bookingCount");

        const revenueCount =
            document.getElementById("revenueCount");

        if (bookingCount) {
            bookingCount.textContent = "0";
        }

        if (revenueCount) {
            revenueCount.textContent = "₹0";
        }

    } catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}


/* ================================
   BOOKINGS
================================ */

async function loadBookings() {

    const table =
        document.getElementById("bookingsTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="7" class="table-empty">
                Booking management will appear here
                after the booking API is connected.
            </td>
        </tr>
    `;

}


/* ================================
   FOOD ORDERS
================================ */

async function loadFoodOrders() {

    const container =
        document.getElementById("foodOrdersList");

    if (!container) return;

    container.innerHTML = `
        <div class="food-empty-panel">
            <div class="empty-icon">🍿</div>
            <h3>No Food Orders</h3>
            <p>
                Food orders will appear here
                when customers place interval orders.
            </p>
        </div>
    `;

}


/* ================================
   USERS
================================ */

async function loadUsers() {

    const table =
        document.getElementById("usersTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="5" class="table-empty">
                User management will appear here
                after the user API is connected.
            </td>
        </tr>
    `;

}


/* ================================
   MOVIE MODAL
================================ */

function openMovieModal() {

    const modal =
        document.getElementById("movieModal");

    if (modal) {
        modal.classList.add("active");
    }

}


function closeMovieModal() {

    const modal =
        document.getElementById("movieModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


/* ================================
   THEATRE MODAL
================================ */

function openTheatreModal() {

    const modal =
        document.getElementById("theatreModal");

    if (modal) {
        modal.classList.add("active");
    }

}


function closeTheatreModal() {

    const modal =
        document.getElementById("theatreModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


/* ================================
   SHOW MODAL
================================ */

function openShowModal() {

    const modal =
        document.getElementById("showModal");

    if (modal) {

        modal.classList.add("active");

        loadShowOptions();

    }

}


function closeShowModal() {

    const modal =
        document.getElementById("showModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


/* ================================
   MODAL EVENTS
================================ */

function setupModalEvents() {

    const movieModal =
        document.getElementById("movieModal");

    const theatreModal =
        document.getElementById("theatreModal");

    const showModal =
        document.getElementById("showModal");

    [movieModal, theatreModal, showModal]
        .forEach(modal => {

            if (!modal) return;

            modal.addEventListener(
                "click",
                function (event) {

                    if (event.target === modal) {

                        modal.classList.remove(
                            "active"
                        );

                    }

                }
            );

        });

}


/* ================================
   FORM EVENTS
================================ */

function setupForms() {

    const movieForm =
        document.getElementById("movieForm");

    const theatreForm =
        document.getElementById("theatreForm");

    const showForm =
        document.getElementById("showForm");

    if (movieForm) {

        movieForm.addEventListener(
            "submit",
            addMovie
        );

    }

    if (theatreForm) {

        theatreForm.addEventListener(
            "submit",
            addTheatre
        );

    }

    if (showForm) {

        showForm.addEventListener(
            "submit",
            addShow
        );

    }

}


/* ================================
   LOGOUT
================================ */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMovie");

    window.location.href =
        "../login.html";

}


/* ================================
   ALERT
================================ */

function showAlert(message, type = "success") {

    const oldAlert =
        document.querySelector(".admin-alert");

    if (oldAlert) {
        oldAlert.remove();
    }

    const alert =
        document.createElement("div");

    alert.className =
        `admin-alert ${type}`;

    alert.textContent =
        message;

    document.body.appendChild(alert);

    setTimeout(() => {

        alert.classList.add("hide");

        setTimeout(() => {
            alert.remove();
        }, 300);

    }, 3000);

}


/* ================================
   ESCAPE HTML
================================ */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ================================
   GLOBAL FUNCTIONS
================================ */

window.showSection = showSection;

window.openMovieModal =
    openMovieModal;

window.closeMovieModal =
    closeMovieModal;

window.openTheatreModal =
    openTheatreModal;

window.closeTheatreModal =
    closeTheatreModal;

window.openShowModal =
    openShowModal;

window.closeShowModal =
    closeShowModal;

window.deleteMovie =
    deleteMovie;

window.deleteTheatre =
    deleteTheatre;

window.deleteShow =
    deleteShow;

window.logout =
    logout;