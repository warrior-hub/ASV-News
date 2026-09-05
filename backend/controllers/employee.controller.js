const mongoose = require("mongoose");
const Employee = require("../models/employee.model");


const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      phone,
      dob,
      designation,
      city,
      address,
      joiningDate,
      status,
    } = req.body;
    const profileImage =req.file.path
    console.log("Received Employee Data:", req.body);

    // --------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------

    if (
      !employeeId ||
      !name ||
      !email ||
      !phone ||
      !dob ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID, name, email, phone, date of birth and designation are required",
      });
    }

    // --------------------------------------------
    // CLEAN DATA
    // --------------------------------------------

    const cleanEmployeeId = employeeId
      .trim()
      .toUpperCase();

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanPhone = phone.trim();

    const cleanCity = city?.trim() || "";

    const cleanAddress = address?.trim() || "";

    // --------------------------------------------
    // CHECK DUPLICATE EMPLOYEE ID
    // --------------------------------------------

    const existingEmployeeId = await Employee.findOne({
      employeeId: cleanEmployeeId,
    });

    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    // --------------------------------------------
    // CHECK DUPLICATE EMAIL
    // --------------------------------------------

    const existingEmail = await Employee.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // --------------------------------------------
    // CREATE EMPLOYEE
    // --------------------------------------------

    const employee = await Employee.create({
      employeeId: cleanEmployeeId,

      name: cleanName,

      email: cleanEmail,

      phone: cleanPhone,

      dob,

      designation,

      profileImage: profileImage?.trim() || "",

      city: cleanCity,

      address: cleanAddress,

      joiningDate: joiningDate || undefined,

      status: status || "active",
    });

    // --------------------------------------------
    // RESPONSE
    // --------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    // --------------------------------------------
    // MONGOOSE DUPLICATE KEY
    // --------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Employee ID or email already exists",
      });
    }

    // --------------------------------------------
    // MONGOOSE VALIDATION ERROR
    // --------------------------------------------

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(
        error.errors
      ).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    // --------------------------------------------
    // SERVER ERROR
    // --------------------------------------------

    return res.status(500).json({
      success: false,
      message: "Failed to add employee",
      error: error.message,
    });
  }
};
const getAllEmployees = async (req, res) => {
  try {
    const {
      search,
      status,
      department,
      place,
      page = 1,
      limit = 20,
    } = req.query;

    // --------------------------------------------
    // QUERY
    // --------------------------------------------

    const query = {};

    // --------------------------------------------
    // UNIVERSAL SEARCH
    // name
    // employeeId
    // email
    // phone
    // place
    // designation
    // department
    // --------------------------------------------

    if (search && search.trim()) {
      const searchText =
        search.trim();

      query.$or = [
        {
          name: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          employeeId: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          place: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          department: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------
    // STATUS FILTER
    // --------------------------------------------

    if (status) {
      query.status = status;
    }

    // --------------------------------------------
    // DEPARTMENT FILTER
    // --------------------------------------------

    if (department) {
      query.department = {
        $regex: department.trim(),
        $options: "i",
      };
    }

    // --------------------------------------------
    // PLACE FILTER
    // --------------------------------------------

    if (place) {
      query.place = {
        $regex: place.trim(),
        $options: "i",
      };
    }

    // --------------------------------------------
    // PAGINATION
    // --------------------------------------------

    const pageNumber =
      Math.max(Number(page), 1);

    const limitNumber =
      Math.min(
        Math.max(Number(limit), 1),
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // --------------------------------------------
    // DATABASE
    // --------------------------------------------

    const [employees, total] =
      await Promise.all([
        Employee.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limitNumber)
          .lean(),

        Employee.countDocuments(query),
      ]);

    const totalPages =
      Math.ceil(
        total / limitNumber
      );

    return res.status(200).json({
      success: true,

      count: employees.length,

      total,

      page: pageNumber,

      limit: limitNumber,

      totalPages,

      employees,
    });
  } catch (error) {
    console.error(
      "Get All Employees Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch employees",
      error: error.message,
    });
  }
};
const getEmployeeById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error(
      "Get Employee Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch employee",
      error: error.message,
    });
  }
};
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

   
    const {
      employeeId,
      name,
      email,
      phone,
      city,
      place,
      designation,
      department,
      salary,
      joiningDate,
      status,
      address,
    } = req.body;

    // --------------------------------------------
    // EMPLOYEE ID
    // --------------------------------------------

    if (employeeId !== undefined) {
      const newEmployeeId = employeeId
        .trim()
        .toUpperCase();

      const duplicate = await Employee.findOne({
        employeeId: newEmployeeId,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Employee ID already exists",
        });
      }

      employee.employeeId = newEmployeeId;
    }

    // --------------------------------------------
    // NAME
    // --------------------------------------------

    if (name !== undefined) {
      employee.name = name.trim();
    }

    // --------------------------------------------
    // EMAIL
    // --------------------------------------------

    if (email !== undefined) {
      const newEmail = email
        .trim()
        .toLowerCase();

      const duplicateEmail =
        await Employee.findOne({
          email: newEmail,
          _id: { $ne: id },
        });

      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      employee.email = newEmail;
    }

    // --------------------------------------------
    // PHONE
    // --------------------------------------------

    if (phone !== undefined) {
      employee.phone = phone.trim();
    }

    // --------------------------------------------
    // CITY
    // --------------------------------------------

    if (city !== undefined) {
      employee.city = city.trim();
    } else if (place !== undefined) {
      // Backward compatibility
      employee.city = place.trim();
    }

    // --------------------------------------------
    // DESIGNATION
    // --------------------------------------------

    if (designation !== undefined) {
      employee.designation =
        designation.trim();
    }

    // --------------------------------------------
    // DEPARTMENT
    // --------------------------------------------

    if (department !== undefined) {
      employee.department =
        department.trim();
    }

    // --------------------------------------------
    // SALARY
    // --------------------------------------------

    if (salary !== undefined) {
      const newSalary = Number(salary);

      if (
        Number.isNaN(newSalary) ||
        newSalary < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Salary must be a valid positive number",
        });
      }

      employee.salary = newSalary;
    }

    // --------------------------------------------
    // JOINING DATE
    // --------------------------------------------

    if (joiningDate !== undefined) {
      employee.joiningDate =
        joiningDate || null;
    }

    // --------------------------------------------
    // STATUS
    // --------------------------------------------

    if (status !== undefined) {
      const allowedStatuses = [
        "active",
        "inactive",
        "on_leave",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee status",
        });
      }

      employee.status = status;
    }

    // --------------------------------------------
    // ADDRESS
    // --------------------------------------------

    if (address !== undefined) {
      employee.address = address.trim();
    }

    // --------------------------------------------
    // PROFILE IMAGE
    // --------------------------------------------
    // New image selected:
    //   req.file exists -> update image
    //
    // No new image selected:
    //   req.file undefined -> old image remains
    // --------------------------------------------

    if (req.file) {
      employee.profileImage = req.file.path;
    }

    // --------------------------------------------
    // SAVE
    // --------------------------------------------

    await employee.save();

    return res.status(200).json({
      success: true,
      message:
        "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(
      "Update Employee Error:",
      error
    );

    // --------------------------------------------
    // DUPLICATE KEY ERROR
    // --------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Employee ID or email already exists",
      });
    }

    // --------------------------------------------
    // SERVER ERROR
    // --------------------------------------------

    return res.status(500).json({
      success: false,
      message:
        "Failed to update employee",
      error: error.message,
    });
  }
};
const deleteEmployee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee =
      await Employee.findByIdAndDelete(
        id
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Employee deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Employee Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete employee",
      error: error.message,
    });
  }
};


module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

