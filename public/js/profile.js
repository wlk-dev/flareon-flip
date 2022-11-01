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

const submitHiScore = async () => {
    const result = await fetch('/api/hi-scores/submit', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if(result.ok) {
        await Swal.fire(
            'Submitted!',
            'Your hi-score has been submitted.',
            'success'
        )
    } else {
        await Swal.fire(
            'Failed to submit your score...',
            'error'
        ) 
    }
}

$("#submit").on('click', submitHiScore)
$('#delete').on('click', deleteUser);
