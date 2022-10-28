const deleteUser = async () => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        const response = await fetch('/api/users/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            await Swal.fire(
                'Deleted!',
                'Your account has been deleted.',
                'success'
            )
            document.location.replace('/');
        }
    }

};

$('#delete').on('click', deleteUser);
