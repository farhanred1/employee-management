export function setModalDisplayStatus(modal, display){
    if (display) {
        modal.style.display = 'block';
    }else {
        modal.style.display = 'none';
    }
}

export function toggleFormSubmitButton(modal, isEditMode) {
    setModalDisplayStatus(modal, true);
    const submitButton = modal.querySelector('.btn-submit');
    const editButton = modal.querySelector('.btn-update');
    
    if (isEditMode) {
        submitButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    } else {
        const form = modal.querySelector('form');
        form.reset();
        submitButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    }
}
