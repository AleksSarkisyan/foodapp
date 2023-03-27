export enum UserCommands {
    CREATE_USER = 'createUser',
    LOGIN_USER = 'loginUser',
    IS_LOGGED_IN = 'isLoggedIn',
    GET_USER_FROM_TOKEN = 'getUserFromToken'
}

export enum ErrorMessages {
    TOKEN_ERROR = 'Could not get token',
    LOGIN_ERROR = 'Could not log in',
    TOKEN_VALIDATION_ERROR = 'Token validation failed',
    USER_EXIST_ERROR = 'User already exists',
    USER_NOT_FOUND = 'User not found'
}

export enum Database {
    TABLE_NAME_USERS = 'users',
    DB_HOST = 'DB_HOST',
    DB_USER = 'DB_USER',
    DB_PASSWORD = 'DB_PASSWORD',
    DB_NAME = 'DB_NAME'
}
