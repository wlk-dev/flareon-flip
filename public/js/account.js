const signupFormHandler = async (event) => {
  const name = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (name && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to sign up.');
    }
  } else {
    alert("Cannot be empty");
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