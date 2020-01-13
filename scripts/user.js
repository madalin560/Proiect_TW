// Modal handling

const registerModal = document.getElementById("registerModal");
const loginModal = document.getElementById("loginModal");

document.getElementById("registerButton").addEventListener("click", () => {
    closeOtherModals();
    registerModal.style.display = "block";
});

// User detection

window.onload = () => {
    user = localStorage.getItem('loggedUser');
    if (user) {
        addElement('navigation-user', 'p', 'loggedUserName', user);
        addElement('navigation-user', 'button', 'userBooks', 'Your bookings', 'btn btn-primary', () => showUserBookmarks(user));
    } else {
        addElement('navigation-user', 'button', 'loginButton', 'Sign in', 'btn btn-primary', () => loginModal.style.display = "block");
    }
};

// Login handling

handleLoginFormSubmit = (event) => {
    event.preventDefault();

    const email = document.getElementById( "loginEmail" ).value;
    const password = document.getElementById( "loginPassword" ).value;
    fetch("https://my-json-server.typicode.com/madalin560/demo/users")
        .then(response => response.json().then(data => {
                data.forEach(user => {
                    if (email === user.email && password === user.password) {
                        localStorage.setItem('loggedUser', user.name);
                        location.reload();
                    }
                });
            })
        )
        .catch(function(error) {
            // Daca am avut o eroare
            console.log("Eroarea este",error);
        });
}

// Form handling

const passwordField = document.getElementById("inputPassword");
document.getElementById("inputPasswordRegister").addEventListener("keydown", (event) => {
    const field = event.target;

    if (!isPasswordValid(field.value)) {
        const newElement = document.createElement("small");
        newElement.id = "registerPasswordError";

        if (!document.getElementById("registerPasswordError")) {
            newElement.appendChild(document.createTextNode("Password must be at least 8 character long and containt a uppercase lowercase letter as well as a symbol and number"));
            field.parentNode.insertBefore(newElement, field.nextSibling);
        }
    } else {
        if (document.getElementById("registerPasswordError")) {
            removeElement("registerPasswordError");
        }
    }
});

// Handle the registration with validation and notifications

handleRegisterFormSubmit = (event) => {
    event.preventDefault();
    const errors = [];

    const inputs = document.getElementById("registerForm").elements;
    const data = formToJSON(inputs);
    data.id = data.email;

    if (!data.email) {
        errors.push("Email can't be empty");
    }

    if (!isPasswordValid(data.password)) {
        errors.push("Invalid password");
    }

    if (!data.name) {
        errors.push("Name cannot be empty");
    }

    if (errors.length > 0) {
        Swal.fire({
            title: 'Error!',
            text: `The form has the following errors: ${errors.join(' , ')}`,
            icon: 'error'
        })
    } else {
        fetch("https://my-json-server.typicode.com/madalin560/demo/users", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (response.status === 201) {
                Swal.fire({
                    title: 'User created',
                    text: `The user ${data.name} was successfully created`,
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
}
