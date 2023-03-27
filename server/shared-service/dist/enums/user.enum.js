"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.ErrorMessages = exports.UserCommands = void 0;
var UserCommands;
(function (UserCommands) {
    UserCommands["CREATE_USER"] = "createUser";
    UserCommands["LOGIN_USER"] = "loginUser";
    UserCommands["IS_LOGGED_IN"] = "isLoggedIn";
    UserCommands["GET_USER_FROM_TOKEN"] = "getUserFromToken";
})(UserCommands = exports.UserCommands || (exports.UserCommands = {}));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["TOKEN_ERROR"] = "Could not get token";
    ErrorMessages["LOGIN_ERROR"] = "Could not log in";
    ErrorMessages["TOKEN_VALIDATION_ERROR"] = "Token validation failed";
    ErrorMessages["USER_EXIST_ERROR"] = "User already exists";
    ErrorMessages["USER_NOT_FOUND"] = "User not found";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));
var Database;
(function (Database) {
    Database["TABLE_NAME_USERS"] = "users";
    Database["DB_HOST"] = "DB_HOST";
    Database["DB_USER"] = "DB_USER";
    Database["DB_PASSWORD"] = "DB_PASSWORD";
    Database["DB_NAME"] = "DB_NAME";
})(Database = exports.Database || (exports.Database = {}));
//# sourceMappingURL=user.enum.js.map