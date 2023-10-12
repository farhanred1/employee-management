import { toggleFormSubmitButton } from "./uiUtils.js";

const Employee_Form_Modal = document.getElementById('employee-form-modal');
const Department_Form_Modal = document.getElementById('department-form-modal');

async function populateEmployeeTable(employees) {
    const employeeTable = document.getElementById('employeeTable');
    const tbody = employeeTable.getElementsByTagName('tbody')[0];
    const thead = employeeTable.getElementsByTagName('thead')[0];
    tbody.innerHTML = ''; // Clear the table body

    function createTableHeader() {
        thead.innerHTML = ''; // Clear the existing header
        const headerRow = thead.insertRow();
        headerRow.innerHTML = `
            <th>Full Name</th>
            <th>Department</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Action</th>
        `;
    }

    // Function to fetch department name by departmentId
    async function getDepartmentName(departmentId) {
        const departmentResponse = await fetch(`/departments/${departmentId}`);
        const departmentData = await departmentResponse.json();
        return departmentData.department.name; // Assuming you have a 'name' property in the department object
    }

    // Create the table header
    createTableHeader();

    employees.forEach(async (employee) => {
        const row = tbody.insertRow();
        row.dataset.employeeId = employee._id;
        const fullName = `${employee.firstName} ${employee.lastName}`;
        row.insertCell(0).textContent = fullName;
        row.insertCell(1).textContent = employee.dob;
        row.insertCell(2).textContent = employee.email;
        const departmentName = await getDepartmentName(employee.departmentId);
        row.insertCell(3).textContent = departmentName;

        // Create action buttons cell
        const actionsCell = row.insertCell(4);

        // Create an edit button
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editEmployee(employee));
        actionsCell.appendChild(editButton);

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => confirmDeleteEmployee(employee._id));
        actionsCell.appendChild(deleteButton);
    });
}

function editEmployee(employee) {
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('dob').value = employee.dob;
    document.getElementById('email').value = employee.email;
    document.getElementById('department').value = employee.departmentId;
    document.getElementById('employee-form').setAttribute('data-employee-id', employee._id);

    toggleFormSubmitButton(Employee_Form_Modal, true);
}

function confirmDeleteEmployee(employeeId) {
    const confirmation = confirm('Are you sure you want to delete this employee?');

    if (confirmation) {
        deleteEmployee(employeeId);
    }
}


async function populateDepartmentTable(departments) {
    const departmentTable = document.getElementById('employeeTable');
    const tbody = departmentTable.getElementsByTagName('tbody')[0];
    const thead = departmentTable.getElementsByTagName('thead')[0];
    tbody.innerHTML = ''; // Clear the table body

    function createTableHeader() {
        thead.innerHTML = ''; // Clear the existing header
        const headerRow = thead.insertRow();
        headerRow.innerHTML = `
            <th>Department Name</th>
            <th>Action</th>
        `;
    }

    createTableHeader();

    departments.forEach((department) => {
        const row = tbody.insertRow();
        const departmentId = department._id;

        row.insertCell(0).textContent = department.name;

        const actionsCell = row.insertCell(1);

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editDepartment(department));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => confirmDeleteDepartment(departmentId));
        actionsCell.appendChild(deleteButton);
    });
}

function editDepartment(department) {
    document.getElementById('department-name').value = department.name;
    document.getElementById('department-form').setAttribute('data-department-id', department._id);

    toggleFormSubmitButton(Department_Form_Modal, true);
}

function confirmDeleteDepartment(departmentId) {
    const confirmation = confirm('Are you sure you want to delete this department?');

    if (confirmation) {
        deleteDepartment(departmentId);
    }
}



export async function onTableSelectChange() {
    const select = document.getElementById('tables');
    const selectedOption = select.options[select.selectedIndex].value;

    if (selectedOption === 'employee') {
        const employees = await fetchAllEmployees();
        await populateEmployeeTable(employees)
    } else if (selectedOption === 'department') {
        const departments = await fetchAllDepartments();
        await populateDepartmentTable(departments)
    }

    return selectedOption;
}

export async function populateDepartmentDropdown() {
    const departments = await fetchAllDepartments();

    if (departments.length > 0) {
        const departmentSelect = document.getElementById('department');

        // Clear existing options
        departmentSelect.innerHTML = '<option value="">Select Department</option>';

        // Populate options from the fetched data
        departments.forEach((department) => {
            const option = document.createElement('option');
            option.value = department._id;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });
    } else {
        console.error('No departments found or an error occurred.');
    }
}



export async function fetchAllEmployees() {
    try {
        const response = await fetch('/employees'); // Replace with your API endpoint
        const data = await response.json();

        if (response.ok) {
            return data.employees;
        } else {
            console.error('Error:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export async function createNewEmployee(employeeData) {
    try {
        const response = await fetch('/employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        });

        if (response.ok) {
            // Handle success, e.g., display a success message
            alert('Employee added successfully.');
/*             // Clear the form fields and reset the button text
            resetForm();
            // Fetch and refresh the employee data table
            fetchEmployeeData(); */
        } else {
            // Handle errors, e.g., display an error message
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

export async function updateEmployee(employeeId, employeeData) {
    try {
        const response = await fetch(`/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        });

        if (response.ok) {
            // Handle success, e.g., display a success message
            alert('Employee updated successfully.');
/*             // Clear the form fields and reset the button text
            resetForm();
            // Fetch and refresh the employee data table
            fetchEmployeeData(); */
        } else {
            // Handle errors, e.g., display an error message
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

export async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`/employees/${employeeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove the row from the table upon successful deletion
            const deletedRow = document.querySelector(`[data-employee-id="${employeeId}"]`);
            deletedRow.remove();
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


export async function fetchAllDepartments() {
    try {
        const response = await fetch('/departments'); // Replace with your API endpoint
        const data = await response.json();

        if (response.ok) {
            return data.departments;
        } else {
            console.error('Error:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export async function createNewDepartment(departmentData) {
    try {
        // Make a POST request to the API to create a new department
        const response = await fetch('/department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departmentData),
        });

        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message); // Show success message
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message); // Show error message
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while processing your request.');
    }
}

export async function updateDepartment(departmentId, departmentData) {
    try {
        // Make a PUT request to the API to update the department
        const response = await fetch(`/departments/${departmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departmentData),
        });

        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message); // Show success message
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message); // Show error message
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while processing your request.');
    }
}

export async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(`/departments/${departmentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Remove the row from the table upon successful deletion
            const deletedRow = document.querySelector(`[data-department-id="${departmentId}"]`);
            deletedRow.remove();
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}