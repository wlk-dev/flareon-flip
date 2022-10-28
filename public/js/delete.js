const deleteUser = async () => {
    console.log("DELETING")
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log out.');
    }
  };
  
  $('#delete').on('click', deleteUser);
  