const signupFormHandler = async (event) => {
  const name = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  console.log(name, email, password)

  if (name && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/menu');
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

  console.log(typeof name, password)

  if (name && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/menu');
    } else {
      alert('Failed to log in.');
    }
  } else {
    alert("Cannot be empty");
  }
};

$("#login-btn").on('click', loginFormHandler);
$("#signup-btn").on('click', signupFormHandler);