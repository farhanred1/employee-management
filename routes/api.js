const express = require('express');
const router = express.Router();

const Department = require('../models/department');
const Employee = require('../models/employee');

router.post('/department', async (req, res) => {
    try { 
        const { name } = req.body;

        if(!(name)){
            return res.status (200).json('Please enter a department name');
        }
        const checkDepartment = await Department.findOne({ name });
        if (checkDepartment) {
            return res.status(409).json({
                message : 'Department already exists',
            });
        }
        const department = new Department({ name });
        await department.save(); 
        
        return res.status(201).json({
            message : 'Department created successfully',
            department: department,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
})

router.post('/employee', async (req, res) => {
    try {
        // Extract employee data from the request body
        const { firstName, lastName, dob, email, departmentId } = req.body;

        if(!(firstName && lastName && dob && email && departmentId)){
            return res.status (200).json('Please enter employee details');
        }

        // Check if the departmentId exists in the Department collection
        const departmentExists = await Department.exists({ _id: departmentId });

        if (!departmentExists) {
            return res.status(400).json({
                message: 'Department not found. Please provide a valid departmentId.',
            });
        }

        // Create a new employee document
        const newEmployee = new Employee({
            firstName,
            lastName,
            dob,
            email,
            departmentId,
        });

        // Save the employee document to the database
        await newEmployee.save();

        return res.status(201).json({
            message: 'Employee added successfully.',
            employee: newEmployee,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();

        return res.status(200).json({
            employees,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find();

        return res.status(200).json({
            departments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.get('/employees/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found.',
            });
        }

        return res.status(200).json({
            employee,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.get('/departments/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({
                message: 'Department not found.',
            });
        }

        return res.status(200).json({
            department,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.delete('/employees/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const result = await Employee.deleteOne({ _id: employeeId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Employee not found.',
            });
        }

        return res.status(200).json({
            message: 'Employee deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.delete('/departments/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;

        const result = await Department.deleteOne({ _id: departmentId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Department not found.',
            });
        }

        return res.status(200).json({
            message: 'Department deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.put('/employees/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { firstName, lastName, dob, email, departmentId } = req.body;

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found.',
            });
        }

        // Update the employee's information if provided in the request body
        if (firstName) {
            employee.firstName = firstName;
        }
        if (lastName) {
            employee.lastName = lastName;
        }
        if (departmentId) {
            employee.departmentId = departmentId;
        }
        if (dob) {
            employee.dob = dob;
        }
        if (email) {
            employee.email = email;
        }

        // Save the updated employee document
        await employee.save();

        return res.status(200).json({
            message: 'Employee updated successfully.',
            employee,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

router.put('/departments/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { name } = req.body;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({
                message: 'Department not found.',
            });
        }

        // Update the department's name if provided in the request body
        if (name) {
            department.name = name;
        }

        // Save the updated department document
        await department.save();

        return res.status(200).json({
            message: 'Department updated successfully.',
            department,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});





module.exports = router;