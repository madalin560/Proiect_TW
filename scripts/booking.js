// Modal handling

const flightsModal = document.getElementById("flightsModal");
const bookingModal = document.getElementById("bookingModal");

const start = datepicker('.start', { id: 1 })
const end = datepicker('.end', { id: 1 })

openFlightsModal = () => {
    closeOtherModals();
    flightsModal.style.display = "block";
}

// Return flights list based on form

findFlightOffers = (event) => {
    event.preventDefault();

    const errors = [];

    const inputs = document.getElementById("bookingForm").elements;
    const payload = formToJSON(inputs);

    if (payload.destination === constatns.defaultValueForSelect || payload.origin === constatns.defaultValueForSelect) {
        errors.push("Origin or destination can't be empty");
    }

    const timeRange = end.getRange();
    if (!timeRange.end || !timeRange.start) {
        errors.push("Time range can't be empty");
    } else {
        Object.assign(payload, timeRange);
    }

    if (errors.length > 0) {
        Swal.fire({
            title: 'Error!',
            text: `The form has the following errors: ${errors.join(' , ')}`,
            icon: 'error'
        })
    } else {
        fetch(`https://my-json-server.typicode.com/madalin560/demo/flights?origin=${payload.origin}&destination=${payload.destination}`).then(response => response.json().then(data => {
            if (!data.length) {
                Swal.fire({
                    title: 'No flights available!',
                    text: `There is no flight to ${payload.destination} from ${payload.origin} available`,
                    icon: 'info'
                })
            } else {
                openBookForm(data);
            }
        }))
        .catch(function(error) {
            console.log("Eroarea este",error);
        });
    }
}

// List of flights to be booked

openBookForm = (flights) => {
    closeOtherModals();
    bookingModal.style.display = "block";

    addElement('flightsTable', 'p', 'flightTimer', 'This window will close in 10 minutes');
    flights.forEach(flight => {
        const id = Math.random().toString(36).substring(7);
        addElement('flightsTable', 'div', id);

        addElement(id, 'p', id + '*company', flight.company);
        addElement(id, 'p', id + '*flight', `${flight.origin} - ${flight.destination}`);
        addElement(id, 'button', id + '*book', 'Book now', 'btn btn-primary', () => bookFlight(flight));
        addElement(id, 'hr', id + '*separator');

        var counter = 10;
        setInterval(() => {
            counter--;
            if (counter === 0) {
                location.reload();
            }
        }, 1000);
    });
}

// Book a flight

bookFlight = (flight) => {
    const user = localStorage.getItem("loggedUser");
    const id = Math.floor(Math.random() * 100);
    const payload = Object.assign({}, flight, {id, user})
    fetch("https://my-json-server.typicode.com/madalin560/demo/bookings", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(payload),
        }).then(response => {
            if (response.status === 201) {
                Swal.fire({
                    title: 'Flight booked',
                    text: `The booking with the id ${id} was successfully created`,
                    icon: 'success',
                    showConfirmButton: false
                })

                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(function(error) {
            console.log("Eroarea este",error);
    });
}

showUserBookmarks = (user) => {
    fetch(`https://my-json-server.typicode.com/madalin560/demo/bookings?user=${user}`).then(response => response.json().then(data => {
            closeOtherModals();
            bookingModal.style.display = "block";

            data.forEach(flight => {
                const id = parseInt(flight.id);
                addElement('flightsTable', 'div', id);

                addElement(id, 'p', id + '*company', flight.company);
                addElement(id, 'p', id + '*flight', `${flight.origin} - ${flight.destination}`);
                addElement(id, 'button', id + '*book', 'Delete booking', 'btn btn-primary', () => deleteFlight(id));
                addElement(id, 'hr', id + '*separator');
            });
        }))
        .catch(function(error) {
            console.log("Eroarea este",error);
    });
}

// Delete a flight book

deleteFlight = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/madalin560/demo/bookings?id=${id}`, {
        method: 'DELETE'
    }).then(response => location.reload);
}