// =====================================================
// LOGIN CHECK
// =====================================================

const user = JSON.parse(
    localStorage.getItem("user")
);

if (!user) {
    window.location.href = "login.html";
}


// =====================================================
// USER NAME
// =====================================================

const userNameElement =
    document.getElementById("userName");

if (userNameElement && user) {
    userNameElement.textContent = user.name;
}


// =====================================================
// MOVIE
// =====================================================

const movieName =
    localStorage.getItem("selectedMovie");

if (!movieName) {
    window.location.href = "home.html";
}


// =====================================================
// DISPLAY MOVIE
// =====================================================

const summaryMovie =
    document.getElementById("summaryMovie");

if (summaryMovie) {
    summaryMovie.textContent = movieName;
}


// =====================================================
// VARIABLES
// =====================================================

let selectedSeats = [];

const ticketPrice = 200;


// =====================================================
// FOOD
// =====================================================

const foodItems = {

    popcorn: {
        name: "Popcorn",
        price: 150,
        quantity: 0
    },

    coke: {
        name: "Coke",
        price: 100,
        quantity: 0
    },

    pizza: {
        name: "Pizza",
        price: 250,
        quantity: 0
    },

    fries: {
        name: "French Fries",
        price: 120,
        quantity: 0
    }

};


// =====================================================
// SELECT SHOW TIME
// =====================================================

function selectTime(button) {

    const buttons =
        document.querySelectorAll(
            ".show-time-btn"
        );

    buttons.forEach(function (item) {

        item.classList.remove("selected");

    });


    button.classList.add("selected");


    const summaryTime =
        document.getElementById(
            "summaryTime"
        );

    if (summaryTime) {

        summaryTime.textContent =
            button.textContent.trim();

    }

}


// =====================================================
// THEATRE CHANGE
// =====================================================

const theatreSelect =
    document.getElementById("theatre");

if (theatreSelect) {

    theatreSelect.addEventListener(
        "change",
        function () {

            const summaryTheatre =
                document.getElementById(
                    "summaryTheatre"
                );

            if (summaryTheatre) {

                summaryTheatre.textContent =
                    this.value || "-";

            }

        }
    );

}


// =====================================================
// SELECT SEAT
// =====================================================

function selectSeat(button) {

    if (
        button.classList.contains("booked")
    ) {
        return;
    }


    const seatNumber =
        button.textContent.trim();


    if (
        selectedSeats.includes(
            seatNumber
        )
    ) {

        selectedSeats =
            selectedSeats.filter(
                function (seat) {

                    return seat !== seatNumber;

                }
            );

        button.classList.remove(
            "selected"
        );

    } else {

        selectedSeats.push(
            seatNumber
        );

        button.classList.add(
            "selected"
        );

    }


    updateSummary();

}


// =====================================================
// UPDATE SEAT SUMMARY
// =====================================================

function updateSummary() {

    const seatsElement =
        document.getElementById(
            "selectedSeats"
        );


    if (selectedSeats.length === 0) {

        seatsElement.textContent =
            "None";

    } else {

        seatsElement.textContent =
            selectedSeats.join(", ");

    }


    updateGrandTotal();

}


// =====================================================
// FOOD QUANTITY
// =====================================================

function changeFoodQuantity(
    item,
    change
) {

    const food =
        foodItems[item];

    if (!food) {
        return;
    }


    food.quantity += change;


    if (food.quantity < 0) {
        food.quantity = 0;
    }


    const quantityElement =
        document.getElementById(
            item + "Qty"
        );


    if (quantityElement) {

        quantityElement.textContent =
            food.quantity;

    }


    updateFoodTotal();

}


// =====================================================
// FOOD TOTAL
// =====================================================

function getFoodTotal() {

    let total = 0;


    Object.values(foodItems).forEach(
        function (food) {

            total +=
                food.price *
                food.quantity;

        }
    );


    return total;

}


// =====================================================
// UPDATE FOOD TOTAL
// =====================================================

function updateFoodTotal() {

    const foodTotal =
        getFoodTotal();


    const foodTotalElement =
        document.getElementById(
            "foodTotal"
        );

    if (foodTotalElement) {

        foodTotalElement.textContent =
            "₹" + foodTotal;

    }


    const summaryFood =
        document.getElementById(
            "summaryFood"
        );

    if (summaryFood) {

        summaryFood.textContent =
            "₹" + foodTotal;

    }


    updateGrandTotal();

}


// =====================================================
// GRAND TOTAL
// =====================================================

function updateGrandTotal() {

    const ticketTotal =
        selectedSeats.length *
        ticketPrice;


    const foodTotal =
        getFoodTotal();


    const total =
        ticketTotal +
        foodTotal;


    const totalAmount =
        document.getElementById(
            "totalAmount"
        );


    if (totalAmount) {

        totalAmount.textContent =
            "₹" + total;

    }

}


// =====================================================
// SELECTED FOOD
// =====================================================

function getSelectedFood() {

    const selectedFood = [];


    Object.values(foodItems).forEach(
        function (food) {

            if (food.quantity > 0) {

                selectedFood.push({

                    name: food.name,

                    price: food.price,

                    quantity: food.quantity,

                    total:
                        food.price *
                        food.quantity

                });

            }

        }
    );


    return selectedFood;

}


// =====================================================
// BOOKING ID
// =====================================================

function generateBookingId() {

    const number =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "CB" + number;

}


// =====================================================
// CONFIRM BOOKING
// =====================================================

function confirmBooking() {

    const theatre =
        document.getElementById(
            "theatre"
        ).value;


    const selectedTime =
        document.querySelector(
            ".show-time-btn.selected"
        );


    // THEATRE CHECK

    if (!theatre) {

        alert(
            "Please select a theatre."
        );

        return;

    }


    // TIME CHECK

    if (!selectedTime) {

        alert(
            "Please select a show time."
        );

        return;

    }


    // SEAT CHECK

    if (selectedSeats.length === 0) {

        alert(
            "Please select at least one seat."
        );

        return;

    }


    const bookingId =
        generateBookingId();


    const selectedFood =
        getSelectedFood();


    const foodTotal =
        getFoodTotal();


    const ticketTotal =
        selectedSeats.length *
        ticketPrice;


    const total =
        ticketTotal +
        foodTotal;


    const bookingData = {

        bookingId:
            bookingId,

        movie:
            movieName,

        theatre:
            theatre,

        time:
            selectedTime.textContent.trim(),

        seats:
            selectedSeats,

        ticketPrice:
            ticketPrice,

        ticketTotal:
            ticketTotal,

        food:
            selectedFood,

        foodTotal:
            foodTotal,

        total:
            total,

        customer:
            user.name,

        email:
            user.email,

        bookingDate:
            new Date().toLocaleDateString()

    };


    // SAVE CURRENT BOOKING

    localStorage.setItem(
        "bookingData",
        JSON.stringify(
            bookingData
        )
    );


    // SAVE BOOKING HISTORY

    let bookingHistory =
        JSON.parse(
            localStorage.getItem(
                "bookingHistory"
            )
        ) || [];


    bookingHistory.push(
        bookingData
    );


    localStorage.setItem(
        "bookingHistory",
        JSON.stringify(
            bookingHistory
        )
    );


    // GO TO TICKET

    window.location.href =
        "ticket.html";

}