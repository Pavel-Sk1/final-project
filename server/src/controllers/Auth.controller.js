const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/User.service");
const { User } = require("../db/models");
const formatResponse = require("../utils/formatResponse");
const generateJWTTokens = require("../utils/generateJWTTokens");
const cookieConfig = require("../config/cookieConfig");

class AuthController {
  static async refreshTokens(req, res) {
    try {
      const { refreshToken } = req.cookies;

      const { user } = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN
      );

      const { accessToken, refreshToken: newRefreshToken } = generateJWTTokens({
        user,
      });

      return res
        .status(201)
        .cookie("refreshToken", newRefreshToken, cookieConfig)
        .json(
          formatResponse(201, "Успешно продлена пользовательская сессия", {
            user,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log(
        "=============AuthController.refreshTokens=============",
        message
      );
      res
        .status(401)
        .json(formatResponse(401, "Invalid refreshToken", null, message));
    }
  }

  static async signUp(req, res) {
    const { email, password, username } = req.body;

    const { isValid, error } = User.validateSignUpData({
      email,
      password,
      username,
    });

    if (!isValid) {
      return res.status(422).json(formatResponse(422, error, null, error));
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (userFound) {
        return res
          .status(409)
          .json(
            formatResponse(
              409,
              `Пользователь c таким email (${email}) уже существует`,
              null,
              `Пользователь c таким email (${email}) уже существует`
            )
          );
      }

      const newUser = await UserService.create({
        email,
        password,
        username,
      });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              "Не удалось создать пользователя",
              null,
              "Не удалось создать пользователя"
            )
          );
      }
      
      const { accessToken, refreshToken } = generateJWTTokens({
        user: newUser,
      });

      return res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(
            201,
            "Пользователь успешно зарегистрирован",
            { accessToken, user: newUser },
            null
          )
        );
    } catch ({ message }) {
      console.error("======AuthController.signUp===\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;

    const { isValid, error } = User.validateSignInData({
      email,
      password,
    });

    if (!isValid) {
      return res.status(422).json(formatResponse(422, error, null, error));
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (!userFound) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Пользователь c таким email (${email}) не найден`,
              null,
              `Пользователь c таким email (${email}) не найден`
            )
          );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userFound.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json(
            formatResponse(
              401,
              `Неверный пароль для пользователя с email (${email})`,
              null,
              `Неверный пароль для пользователя с email (${email})`
            )
          );
      }

      delete userFound.password;

      const { accessToken, refreshToken } = generateJWTTokens({
        user: userFound,
      });

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(
            200,
            "Пользователь успешно вошёл",
            { accessToken, user: userFound },
            null
          )
        );
    } catch ({ message }) {
      console.error("======AuthController.signIn===\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }

  static signOut(req, res) {
    try {
      res
        .clearCookie("refreshToken")
        .json(formatResponse(200, "Успешно вышли"));
    } catch ({ message }) {
      console.log("=============AuthController.signOut=============", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }
}

module.exports = AuthController;
