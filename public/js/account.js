const signupFormHandler = async (event) => {
    const name = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const confirmPassword = document.querySelector('#confirmed-password-signup').value.trim();

    if (name && email && (password === confirmPassword) && password.length >= 6) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Sign up failed...',
                text: "Something went wrong while trying to create your account!",
            })
        }
    } else {
        let variation =  [name, email, password, confirmPassword].filter( x => x === '' ).length > 1 ? "some" : "one"

        let msg = `It looks like you forgot to fill out ${variation} of the fields!`

        if(password !== confirmPassword) {
            msg = "Sorry it looks like those passwords don't match..."
        } else if (password.length < 6) {
            msg = "Passwords must be longer than 6 characters!"
        }

        await Swal.fire({
            icon: 'error',
            title: 'Sign up failed...',
            text: msg,
            footer: "</p><a href='/login'>Already have an account?</a>"
        })
    }
};

const loginFormHandler = async (event) => {
    const name = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (name && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ name, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "We couldn't find anyone matching those credentials...",
                footer: "</p><a href='/signup'>Don't have an account?</a>"
            })
        }
    } else {
        let error_msg = !name ? "Please enter a valid username!" : "Please enter a valid password!"
        error_msg = !name && !password ? "Login fields cannot be left empty!" : error_msg;

        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error_msg,
        })
    }
};

$("#login-btn").on('click', loginFormHandler);
$("#signup-btn").on('click', signupFormHandler);