const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

if (user) {
    document.getElementById("userName").textContent = user.name;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}
function bookMovie(movieName) {
    localStorage.setItem("selectedMovie", movieName);
    window.location.href = "booking.html";
}