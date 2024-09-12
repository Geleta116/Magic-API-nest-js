# Magic Todo Backend API

## Objective

The **Magic Todo Backend API** provides a minimalistic yet powerful solution for managing tasks (todos) with user authentication and role-based authorization.

## Features

### JWT Authentication:
- **User Login**: Users authenticate using JWT (JSON Web Tokens). Upon successful login, a JWT is issued.
- **Token Validation**: Every request to the API requires a valid JWT to access protected routes.

### Role-Based Authorization:
- **Roles**: Users can have roles such as `User`, `Admin`, or `SuperAdmin`.
- **Role Management**: Admin users can update the roles of other users, including assigning admin privileges.

### Validation:
- **Zod Validation**: We use Zod for validating inputs.

### CRUD Operations

#### Todos Management:
- **Create Todo**: Users can create new todos.
- **Read Todos**: Users can retrieve a list of their todos.
- **Update Todo**: Users can edit their existing todos.
- **Delete Todo**: Users can delete their todos.

#### User Account Management:
- **Update Account**: Users can update their account details (e.g., username, email).
- **Change Password**: Users can change their password.
- **Delete Account**: Users can delete their own accounts. Admins can delete other users' accounts.

## Database Schema

### Tables:

#### Users:
| Field      | Type              | Details                             |
|------------|-------------------|-------------------------------------|
| `id`       | Int               | Primary Key                         |
| `name`     | String            | Required                            |
| `email`    | String            | Unique, Required                    |
| `password` | String            | Required                            |
| `role`     | Enum (User, Admin) | Role can be either `User` or `Admin`|

#### Todos:
| Field        | Type                   | Details                                 |
|--------------|------------------------|-----------------------------------------|
| `id`         | Int                    | Primary Key                             |
| `creator_id` | Int                    | Foreign Key (references `Users`)        |
| `title`      | String                 | Required                                |
| `description`| String                 | Optional                                |
| `status`     | Enum (Todo, InProgress, Completed) | Task status                   |
| `due_date`   | Timestamp              | Optional                                |

## API Endpoints

### Authentication:

- `POST /auth/login`: Login with email and password to receive a JWT.
- `POST /auth/register`: Register a new user.

### Users:

- `GET /user/:id`: Retrieve user details (excluding password).
- `PUT /user/:id`: Update user details (excluding password).
- `PUT /user/password`: Change your own account's password.
- `PUT /user/:id/updatepassword`: Admins can change the password of any user.
- `DELETE /user/:id`: Delete a user account (Admins can delete other users).

### Todos:

- `POST /todos`: Create a new todo.
- `GET /todos`: Retrieve all todos for the authenticated user.
- `GET /todos/:id`: Retrieve a specific todo.
- `PUT /todos/:id`: Update a specific todo.
- `DELETE /todos/:id`: Delete a specific todo (Only the creator or an admin can delete it).

### Role Management:

- `PUT /user/promote/:id`: Admins can update the role of a user.




