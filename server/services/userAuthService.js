const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, EmailVerify } = require('../model');
const { sendEmail } = require('./mailJetEmail');

const registerUser = async (req, res, isChildAccount = false) => {
  try {
    const { fname, lname, email, pass, username } = req.body;

    // Validate user input
    if (!(email && pass && username)) {
      return res.status(400).json({ message: 'Alle Eingabefelder werden benötigt' });
    }

    // check if Der Nutzer existiert bereits
    // Validate if user exist in our database
    const oldUser = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });

    if (oldUser) {
      if (isChildAccount) {
        return {
          success: false,
          message: 'UserName or Email already Exist',
        };
      }
      return res
        .status(400)
        .json({ message: 'UserName or Email already Exist' });
    }

    //Encrypt user pass
    let encryptedpass = await bcrypt.hash(pass, 10);

    // Create user in our database

    const lastRecord = await User.findOne().sort({ _id: -1 }).limit(1);

    let counterId;

    if (lastRecord == null) {
      counterId = process.env.MONGO_Counter;
      ////  console.log(process.env.MONGO_Counter);
    } else {
      /////console.log(lastRecord.counterId);

      counterId = lastRecord.counterId + 1;
    }

    const user = await User.create({
      fname,
      lname,
      email: email.toLowerCase(),
      username: username.toLowerCase(), // sanitize: convert email to lowercase
      pass: encryptedpass,
      counterId: counterId,
    });

    console.log('Toen time  now', process.env.TOKEN_Time);

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: process.env.TOKEN_Time,
      }
    );
    // save user token
    user.token = token;
    console.log(token);

    const VerifiedEmial = await EmailVerify.create({
      email: email.toLowerCase(),
    });

    var emailParameters = {
      fname,
      email,

      uniquelink:
        process.env.websiteLink +
        'api/email/verify/' +
        email.toLowerCase() +
        '/uniqueid/' +
        VerifiedEmial._id,
    };

    let emailToSend = [
      {
        Email: email,
      },
    ];

    ///// subject, data, emaile templete to select
    sendEmail(
      emailToSend,
      'Welcome to API Service',
      emailParameters,
      'veerify_Email_Body'
    );

    // return new user
    if (isChildAccount) {
      return {
        success: true,
        message: 'Die Verifikationsemail wurde gesendet. Bitte überprüfen Sie Ihre Email',
        user,
      };
    }

    return res
      .status(201)
      .json('Die Verfikationsemail wurde gesendet. Bitte überprüfen Sie Ihre Email');
  } catch (err) {
    console.log(err);
    if (isChildAccount) {
      return {
        success: false,
        message: 'Etwas lief schief',
      };
    }
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

module.exports = {
  registerUser,
};
