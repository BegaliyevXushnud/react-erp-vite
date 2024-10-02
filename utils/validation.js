// import * as Yup from 'yup';  

// // ======= sign in =========
//  export const signInValidationSchema = Yup.object().shape({
//     phone_number: Yup.string().required("phone number is required"),
//     password: Yup.string()
//         .matches(
//             /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
//             "Password must be at least 6 characters and contain at least one uppercase and one lowercase letter"
//         )
//         .required("Password is required"),
// });


// export const signUpValidationSchema = Yup.object().shape({
//   first_name: Yup.string().required("First Name is required"),
//   last_name: Yup.string().required("Last Name is required"),
//   phone_number: Yup.string().required("Phone Number is required"),
//   email: Yup.string().email("Email  is invalid").required("Email is required"),
//   password: Yup.string()
//       .matches(
//           /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
//           "Password must be at least 6 characters and contain at least one uppercase and one lowercase letter"
//       )
//       .required("Password is required"),
// });



// // ======== Course ==========
// export const CourseValidationSchema = Yup.object().shape({
//   course: Yup.string()
//     .required("Course Name is required")
//     .min(3, "Course Name must be at least 3 characters long")
//     .max(50, "Course Name cannot be longer than 50 characters"),
//   duration: Yup.string().required("Duration is required"),
//   price: Yup.number()
//     .required("Price is required")
//     .positive("Price must be a positive number"),
// });

// // ============  Group ==========

// export const groupValidationSchema = Yup.object().shape({
//     course: Yup.string()
//       .required("Course is required"),
//     name: Yup.string()
//       .required("Group Name is required")
//       .min(3, "Group Name must be at least 3 characters long")
//       .max(50, "Group Name cannot be longer than 50 characters"),
//   });


  
//   //========= student ========
//   export const studentValidationSchema = Yup.object().shape({
//     name: Yup.string()
//       .required('Name is required')
//       .min(3, 'Name must be at least 3 characters long')
//       .max(50, 'Name cannot exceed 50 characters'),
    
//     age: Yup.number()
//       .required('Age is required')
//       .positive('Age must be a positive number')
//       .integer('Age must be an integer')
//       .min(5, 'Age must be at least 5')
//       .max(100, 'Age cannot exceed 100'),
    
//     phone: Yup.string()
//       .required('Phone is required'),
     
    
//     group: Yup.string()
//       .required('Group is required'),
    
//     teacher: Yup.string()
//       .required('Teacher is required'),
  
//     address: Yup.string()
//       .required('Address is required')
//       .min(5, 'Address must be at least 5 characters long')
//       .max(100, 'Address cannot exceed 100 characters'),
//   });



//   // =========  teacher ========
//   export const teacherValidationSchema = Yup.object().shape({
//     course: Yup.string()
//       .required('Course is required')
//       .min(3, 'Course must be at least 3 characters'),
    
//     name: Yup.string()
//       .required('Teacher name is required')
//       .min(2, 'Teacher name must be at least 2 characters'),
//   });