
document.addEventListener("DOMContentLoaded", function () {

    // Load saved registrations
    function getRegistrations() {
        return JSON.parse(
            localStorage.getItem("campusRegistrations") || "[]"
        );
    }

    // Display registration count
    const count = document.getElementById("registrationCount");

    if (count) {
        count.textContent = getRegistrations().length;
    }

    // Event category filtering
    const filterButtons = document.querySelectorAll(".filter-pill");
    const eventCards = document.querySelectorAll(".event-card");

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            const category = button.dataset.filter;

            eventCards.forEach(function (card) {

                if (
                    category === "All" ||
                    card.dataset.category === category
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });
        });
    });

    // Registration form
    const form = document.getElementById("registrationForm");

    if (form) {

        const eventSelect = document.getElementById("event");

        const requestedEvent =
            new URLSearchParams(window.location.search).get("event");

        if (requestedEvent && eventSelect) {
            eventSelect.value = requestedEvent;
        }

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!form.reportValidity()) {
                return;
            }

            const formData = new FormData(form);

            const registration = {
                name: formData.get("name"),
                studentId: formData.get("studentId"),
                email: formData.get("email"),
                department: formData.get("department"),
                event: formData.get("event"),
                participation: formData.get("participation"),
                interests: formData.getAll("interests"),
                reason: formData.get("reason"),
                date: new Date().toLocaleString()
            };

            const registrations = getRegistrations();

            const duplicate = registrations.some(function (item) {
                return (
                    item.studentId.toLowerCase() ===
                    registration.studentId.toLowerCase() &&
                    item.event === registration.event
                );
            });

            const message = document.getElementById("formMessage");

            if (duplicate) {
                message.textContent =
                    "You have already registered for this event.";
                message.style.color = "red";
                return;
            }

            registrations.push(registration);

            localStorage.setItem(
                "campusRegistrations",
                JSON.stringify(registrations)
            );

            message.textContent =
                "Registration submitted successfully!";

            message.style.color = "green";

            form.reset();
        });
    }

});
