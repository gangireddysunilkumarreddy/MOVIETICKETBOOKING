// Get booking data

const bookingData =
    JSON.parse(
        localStorage.getItem(
            "bookingData"
        )
    );


// If booking data doesn't exist

if (!bookingData) {

    window.location.href =
        "home.html";

}


// Display ticket details

if (bookingData) {

    document.getElementById(
        "movieName"
    ).textContent =
        bookingData.movie;


    document.getElementById(
        "bookingId"
    ).textContent =
        bookingData.bookingId;


    document.getElementById(
        "customer"
    ).textContent =
        bookingData.customer;


    document.getElementById(
        "theatre"
    ).textContent =
        bookingData.theatre;


    document.getElementById(
        "showTime"
    ).textContent =
        bookingData.time;


    document.getElementById(
        "seats"
    ).textContent =
        bookingData.seats.join(", ");


    document.getElementById(
        "bookingDate"
    ).textContent =
        bookingData.bookingDate;


    document.getElementById(
        "total"
    ).textContent =
        "₹" + bookingData.total;

}