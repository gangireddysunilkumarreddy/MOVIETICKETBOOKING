const API_URL = "http://localhost:5000/api/auth";

let loginType = "customer";


// =====================================================
// SELECT CUSTOMER / ADMIN
// =====================================================

function selectLoginType(type) {

    loginType = type;

    const customerBtn =
        document.getElementById("customerBtn");

    const adminBtn =
        document.getElementById("adminBtn");

    const googleBtn =
        document.getElementById("googleBtn");

    const googleDivider =
        document.getElementById("googleDivider");

    const registerSection =
        document.getElementById("registerSection");

    const adminNote =
        document.getElementById("adminNote");

    const message =
        document.getElementById("message");


    // Clear old message
    if (message) {
        message.textContent = "";
    }


    // =================================================
    // ADMIN
    // =================================================

    if (type === "admin") {

        customerBtn.classList.remove("active");

        adminBtn.classList.add("active");


        // Hide Google login for admin

        if (googleBtn) {
            googleBtn.style.display = "none";
        }

        if (googleDivider) {
            googleDivider.style.display = "none";
        }


        // Hide register for admin

        if (registerSection) {
            registerSection.style.display = "none";
        }


        // Show admin message

        if (adminNote) {
            adminNote.style.display = "block";
        }


        // Change button text

        const loginBtn =
            document.getElementById("loginBtn");

        if (loginBtn) {
            loginBtn.textContent = "Admin Login";
        }

    }


    // =================================================
    // CUSTOMER
    // =================================================

    else {

        customerBtn.classList.add("active");

        adminBtn.classList.remove("active");


        // Show Google login

        if (googleBtn) {
            googleBtn.style.display = "flex";
        }

        if (googleDivider) {
            googleDivider.style.display = "flex";
        }


        // Show register

        if (registerSection) {
            registerSection.style.display = "block";
        }


        // Hide admin message

        if (adminNote) {
            adminNote.style.display = "none";
        }


        // Change button text

        const loginBtn =
            document.getElementById("loginBtn");

        if (loginBtn) {
            loginBtn.textContent = "Login";
        }

    }
}


// =====================================================
// LOGIN FORM
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById("message");


            const loginBtn =
                document.getElementById("loginBtn");


            // Clear message

            if (message) {
                message.textContent = "";
            }


            // Button loading

            loginBtn.disabled = true;

            loginBtn.textContent =
                "Logging in...";


            try {

                console.log(
                    "Login request started..."
                );


                // =================================================
                // SEND LOGIN REQUEST
                // =================================================

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Server response:",
                    data
                );


                // =================================================
                // SERVER ERROR
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed"
                    );

                }


                // =================================================
                // CHECK USER DATA
                // =================================================

                if (!data.user) {

                    throw new Error(
                        "User information not received"
                    );

                }


                if (!data.token) {

                    throw new Error(
                        "Login token not received"
                    );

                }


                // =================================================
                // ADMIN LOGIN CHECK
                // =================================================

                if (loginType === "admin") {

                    if (
                        data.user.role !==
                        "admin"
                    ) {

                        throw new Error(
                            "This account is not an admin account."
                        );

                    }

                }


                // =================================================
                // CUSTOMER LOGIN CHECK
                // =================================================

                if (loginType === "customer") {

                    if (
                        data.user.role ===
                        "admin"
                    ) {

                        throw new Error(
                            "This is an admin account. Please select Admin Login."
                        );

                    }

                }


                // =================================================
                // SAVE TOKEN
                // =================================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // =================================================
                // SAVE USER
                // =================================================

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                console.log(
                    "Login successful:",
                    data.user
                );


                // =================================================
                // ADMIN REDIRECT
                // =================================================

                if (
                    data.user.role ===
                    "admin"
                ) {

                    console.log(
                        "Redirecting to Admin Dashboard..."
                    );


                    window.location.href =
                        "admin/dashboard.html";

                }


                // =================================================
                // CUSTOMER REDIRECT
                // =================================================

                else {

                    console.log(
                        "Redirecting to Home..."
                    );


                    window.location.href =
                        "home.html";

                }

            }


            // =================================================
            // ERROR
            // =================================================

            catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                }

            }


            // =================================================
            // ENABLE BUTTON
            // =================================================

            finally {

                loginBtn.disabled = false;


                if (loginType === "admin") {

                    loginBtn.textContent =
                        "Admin Login";

                }

                else {

                    loginBtn.textContent =
                        "Login";

                }

            }

        }
    );

}


// =====================================================
// GOOGLE LOGIN
// =====================================================

function loginWithGoogle() {

    alert(
        "Google Login setup is not completed yet. Normal Customer/Admin login is ready."
    );

}