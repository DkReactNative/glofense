//***** Validation rules for input fields */
const validation = {
  email: {
    presence: {
      message: 'Please enter your email',
    },
    format: {
      pattern: /^\w+([\.-]?\w+)+([\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
      message: 'Please enter a valid email',
    },
  },

  firstName: {
    presence: {
      message: 'Please enter your first name',
    },
    length: {
      minimum: 3,
      maximum: 55,
      message: 'Your name must be between 3 and 55 characters long length',
    },
  },
  lastName: {
    presence: {
      message: 'Please enter your last name',
    },
    length: {
      minimum: 3,
      maximum: 55,
      message: 'Your name must be between 3 and 55 characters long length',
    },
  },

  userName: {
    presence: {
      message: 'Please enter your user name',
    },
    length: {
      minimum: 3,
      maximum: 55,
      message: 'Your name must be between 3 and 55 characters long length',
    },
  },

  phone: {
    presence: {
      message: 'Please enter your mobile number',
    },
    format: {
      pattern: /^[0-9]{10}$/,
      message: 'Please enter a valid mobile 10 digit number',
    },
  },

  address: {
    presence: {
      message: 'Please enter your address',
    },
    format: {
      pattern: /^(([a-z A-Z 0-9]+)\W*([a-z A-Z 0-9]*)){1,500}$/,
      message:
        'Please enter valid address and it should not be more than 500 characters.',
    },
    length: {
      minimum: 1,
      maximum: 500,
      message:
        'Please enter valid address and it should not be more than 500 characters.',
    },
  },

  city: {
    presence: {
      message: 'Please select your city',
    },
    format: {
      pattern: /^(?!\s*$|\s).*$/,
      message: 'Please select valid city',
    },
  },
  state: {
    presence: {
      message: 'Please select your state',
    },
    format: {
      pattern: /^(?!\s*$|\s).*$/,
      message: 'Please select valid state',
    },
  },

  pincode: {
    presence: {
      message: 'Please enter pin code',
    },
    format: {
      pattern: /^[0-9]{4,8}$/,
      message: 'Pin code must be between 4 and 8 numbers',
    },
  },

  password: {
    presence: {
      message: 'Please enter a password',
    },
    format: {
      pattern: /^\S*$/,
      message: 'Spaces are not allowed',
    },
    length: {
      minimum: 8,
      maximum: 12,
      message: 'Your password must be between 8 and 12 characters',
    },
  },

  confirm_password: {
    presence: {
      message: 'Please enter a confirm password',
    },
    format: {
      pattern: /^\S*$/,
      message: 'Spaces are not allowed',
    },
    length: {
      minimum: 8,
      maximum: 12,
      message: 'Your password must be between 8 and 12 characters',
    },
    match: {
      message: 'Your password & confirm password must be same',
    },
  },

  loginPassword: {
    presence: {
      message: 'Please enter a password',
    },
  },

  otp: {
    presence: {
      message: 'Please enter OTP',
    },
    format: {
      pattern: /^[0-9]{4,6}$/,
      message: 'Please enter a valid OTP',
    },
    length: {
      minimum: 4,
      message: 'Please enter a valid OTP',
    },
  },

  dob: {
    presence: {
      message: 'Please enter your birth date',
    },
    date: {
      message: 'Age should be minimum 18',
    },
  },

  accountHolderName: {
    presence: {
      message: 'Please enter account holder name',
    },
    length: {
      minimum: 3,
      maximum: 55,
      message: 'Your name must be between 3 and 55 characters long length',
    },
  },

  accountNumber: {
    presence: {
      message: 'Please enter your account number',
    },
    format: {
      pattern: /^[0-9]{6,18}$/,
      message: 'Please enter a valid Number between 6 to 18 numbers long',
    },
    length: {
      minimum: 6,
      maximum: 18,
      message: 'Please enter a valid Number between 6 to 18 numbers long',
    },
  },

  idProof: {
    presence: {
      message: 'Please upload a image',
    },
    length: {
      maximum: 2621440000,
      message: 'Oops! Image size should be less than 4Mb. Try again',
    },
  },
};

export default validation;
