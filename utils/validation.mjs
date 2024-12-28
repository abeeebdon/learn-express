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
