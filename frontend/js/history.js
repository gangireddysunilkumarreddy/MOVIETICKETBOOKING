// CHECK LOGIN

const user = JSON.parse(
    localStorage.getItem("user")
);

if (!user) {
    window.location.href = "login.html";
}


// DISPLAY USER NAME

if (user) {

    const userName =
        document.getElementById("userName");

    if (userName) {
        userName.textContent = user.name;
    }

}


// LOGOUT

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMovie");

    window.location.href = "login.html";

}


// LOAD BOOKINGS

const bookingList =
    document.getElementById("bookingList");

const bookingHistory =
    JSON.parse(
        localStorage.getItem("bookingHistory")
    ) || [];


// SHOW BOOKINGS

if (bookingHistory.length === 0) {

    bookingList.innerHTML = `

        <div class="empty-bookings">

            <div class="empty-icon">
                🎟️
            </div>

            <h2>
                No Bookings Yet
            </h2>

            <p>
                Your booked movie tickets will appear here.
            </p>

            <a
                href="home.html#movies"
                class="browse-btn"
            >
                Browse Movies
            </a>

        </div>

    `;

} else {

    bookingList.innerHTML = "";

    bookingHistory
        .slice()
        .reverse()
        .forEach(function (booking) {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-card";

            bookingCard.innerHTML = `

                <div class="booking-card-header">

                    <div>

                        <span class="booking-label">
                            BOOKING ID
                        </span>

                        <h3>
                            ${booking.bookingId}
                        </h3>

                    </div>

                    <span class="confirmed">
                        CONFIRMED
                    </span>

                </div>


                <div class="booking-main">

                    <div class="movie-icon">
                        🎬
                    </div>

                    <div class="movie-details">

                        <h2>
                            ${booking.movie}
                        </h2>

                        <p>
                            ${booking.theatre}
                        </p>

                        <p>
                            🕐 ${booking.time}
                        </p>

                    </div>

                </div>


                <div class="booking-info">

                    <div>

                        <span>
                            SEATS
                        </span>

                        <strong>
                            ${booking.seats.join(", ")}
                        </strong>

                    </div>

                    <div>

                        <span>
                            BOOKING DATE
                        </span>

                        <strong>
                            ${booking.bookingDate}
                        </strong>

                    </div>

                    <div>

                        <span>
                            TOTAL
                        </span>

                        <strong class="booking-price">
                            ₹${booking.total}
                        </strong>

                    </div>

                </div>


                <button
                    class="ticket-btn"
                    onclick="viewTicket('${booking.bookingId}')"
                >
                    View Ticket →
                </button>

            `;

            bookingList.appendChild(
                bookingCard
            );

        });

}


// VIEW TICKET

function viewTicket(bookingId) {

    const booking =
        bookingHistory.find(function (item) {

            return item.bookingId === bookingId;

        });


    if (booking) {

        localStorage.setItem(
            "bookingData",
            JSON.stringify(booking)
        );

        window.location.href =
            "ticket.html";

    }

}