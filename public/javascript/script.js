import { onTableSelectChange, createNewDepartment, createNewEmployee, updateDepartment, updateEmployee, populateDepartmentDropdown } from "./dataAccess.js";
import { toggleFormSubmitButton, setModalDisplayStatus } from "./uiUtils.js";

const Employee_Form_Modal = document.getElementById('employee-form-modal');
const Department_Form_Modal = document.getElementById('department-form-modal');

// Event listener for the dropdown change event
document.getElementById('tables').addEventListener('change', onTableSelectChange);
// Call initially
onTableSelectChange()

// Populate the department dropdown
window.addEventListener('load', populateDepartmentDropdown);


const addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
    const select = document.getElementById('tables');
    const selectedOption = select.options[select.selectedIndex].value;
    if (selectedOption === 'employee') {
        toggleFormSubmitButton(Employee_Form_Modal, false)
    } else if (selectedOption === 'department') {
        toggleFormSubmitButton(Department_Form_Modal, false)
    }

});


window.addEventListener('click', (event) => {
    if (event.target == Employee_Form_Modal) {
        setModalDisplayStatus(Employee_Form_Modal, false)
    } else if (event.target == Department_Form_Modal) {
        setModalDisplayStatus(Department_Form_Modal, false)
    }
});


const employeeForm = document.getElementById('employee-form');
employeeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form input values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const departmentId = document.getElementById('department').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;

    // Check if required fields are filled
    if (!firstName || !lastName || !departmentId || !dob || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    const employeeData = {
        firstName,
        lastName,
        departmentId,
        dob,
        email,
    };

    // Get the ID of the submit button that triggered the event
    const submitButtonId = event.submitter.id;

    if (submitButtonId === 'btn-employee-submit') {
        await createNewEmployee(employeeData);
        setModalDisplayStatus(Employee_Form_Modal, false)
        onTableSelectChange();

    } else if (submitButtonId === 'btn-employee-update') {
        // Retrieve the employeeId from the data attribute
        const employeeId = document.getElementById('employee-form').getAttribute('data-employee-id');

        if (!employeeId) {
            alert('Employee ID is missing.');
            return;
        }

        await updateEmployee(employeeId, employeeData);
        setModalDisplayStatus(Employee_Form_Modal, false)
        onTableSelectChange();
    }


});


const departmentForm = document.getElementById('department-form');
departmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form input value
    const departmentName = document.getElementById('department-name').value;

    // Check if the department name is provided
    if (!departmentName) {
        alert('Please enter a department name.');
        return;
    }

    const departmentData = {
        name: departmentName,
    };

    // Get the ID of the submit button that triggered the event
    const submitButtonId = event.submitter.id;

    if (submitButtonId === 'btn-department-submit') {
        await createNewDepartment(departmentData);
        setModalDisplayStatus(Department_Form_Modal, false)
        onTableSelectChange();
        populateDepartmentDropdown();
    } else if (submitButtonId === 'btn-department-update') {
        // Retrieve the employeeId from the data attribute
        const departmentId = document.getElementById('department-form').getAttribute('data-department-id');

        if (!departmentId) {
            alert('Department ID is missing.');
            return;
        }

        await updateDepartment(departmentId, departmentData);
        setModalDisplayStatus(Department_Form_Modal, false)
        onTableSelectChange();
        populateDepartmentDropdown();
    }
});
