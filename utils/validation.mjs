export const addUserSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Please enter ur username',
    },
    isLength: {
      options: {
        min: 4,
        max: 10,
      },
      errorMessage: 'Username must be between 4 and 10 characters',
    },
  },
}

export const addNewUserSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Name cannot be empty',
    },
    isLength: {
      options: {
        min: 4,
        max: 20,
      },
      errorMessage: 'Name must be between 4 and 20 characters',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'Email cannot be empty',
    },
  },
}
