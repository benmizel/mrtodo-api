# Project Title
Mr. To Do API

## Overview

Aimed at helping families deal with the myriad of tasks that plague everyday life, the Mr. To Do API hanldes login and task data based on a users' specific profile. With CRUD operations and authentication in place, this API is ready to expand to meet any personal task manager app's needs!

### Problem

There is a growing use of task manager apps for the workplace, however there are few that are geared specifically for personal use. With smartphones and children being more in tune with technology, this task manager app solves two problems. The first is having a centralized location for your tasks and the ability to add, delete or update them. The second problem is that as parents and families grow, there are a lot of tasks to ensure a smooth running household. In future iterations, this app will expand to allow groupings so parents can assign tasks to children and manage these tasks more efficiently than in the past.

### User Profile

Everyday people who want to have better structure and understanding of all the items they have to accomplish outside of their busy work lives.

### Features

- This API has three tables in its database, a user table, a tasks table (with corresponding foreign key to the user table), and a blacklisted tokens table for security.
- User based functions:
    - Login
    - Sign Up
    - Logout
    - Delete User
- Task based functions:
    - Add a task
    - Update a task
    - Delete a task
    - Get tasks by user

## Implementation

### Tech Stack

- TypeScript
- MySQL
- Express
- Server libraries:
    - knex
    - express
    - mysql2
    - bcryptjs for password hashing
    - cookie-parser for authentication and security
    - jsonwebtoken for authentication and security
    - express-rate-limit for limiting login and refreshToken requests
    - bcrypt for password hashing


### APIs

- No external APIs will be used for the first sprint.


### Data

![](sql-diagram.png)

### Endpoints

### Auth Routes

**POST auth/signup**

- Sign up account creation, with JWT for authentication.

Parameters:
- username: User-provided location as a number
- password: User-generated password


Response:
```
{
    "id": 8,
    "username": "signuptest1"
}
```

**POST /auth/login**

- Existing user can log in if account is already created.

Parameters:
- username: User-provided location as a number
- password: User-generated password

Response:
```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJzaWdudXB0ZXN0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MDg4ODQyLCJleHAiOjE3MzgwOTI0NDJ9.C6Jtxw7kIbjzikZHt4e8kLsxbMr6LbM6fBN4p73MGUk"
}
```

**POST /auth/refresh-token**

- Logged in user requests a new refresh token to avoid initial expiration of the inital access token.

Parameters:
- accessToken: taken from cookie and header to prove authentication and reissues appropriate refresh token to keep user logged in.

Response:
```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJzaWdudXB0ZXN0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MDg5MDc0LCJleHAiOjE3MzgwOTI2NzR9.4-C5cZ0Z8Ly8dVBB9s4JQd8tLvULUtOVVD4Yig_x7do"
}
```

**PUT /auth/logout**

- Logs out active user and removes cookie and accessToken from header.

Parameters:
- accessToken: taken from cookie and header to prove authentication and clears it when user logs out.

Response:
```
"Logged out successfully"
```

### User Routes

**DELETE /user**

- Delete a user account and tasks specific to user.

Parameters:
- accessToken: taken from cookie and header to prove authentication and clears it when user logs out.

Response:
```
"User deleted"
```

### Task Routes

**POST /task/add**

- Create a new task.

Parameters:
- title: Title of the task
- description: Description of the task
- priority: The priority of this specific task (Low, medium, high)
- status: Status of the task (pending, in progress, complete)

Response:
```
{
    "id": 7,
    "title": "homework",
    "description": "do homework",
    "status": "not started",
    "priority": "high",
    "created_at": "2025-01-28T00:20:10.000Z",
    "updated_at": "2025-01-28T00:20:10.000Z",
    "assigned_user_id": 8
}
```

**PUT /task/update/:id**

- Update a task. Not all fields are required

Parameters:
- title: Title of the task
- description: Description of the task
- priority: The priority of this specific task (Low, medium, high)
- status: Status of the task (pending, in progress, complete)

Response:
```
{
    "message": "Task updated successfully",
    "task": {
        "id": 3,
        "title": "Updated Task Title",
        "description": "This is an update with a dynamic url",
        "status": "completed",
        "priority": "low",
        "created_at": "2025-01-27T22:57:00.000Z",
        "updated_at": "2025-01-27T23:51:13.000Z",
        "assigned_user_id": 5
    }
}
```

**DELETE /task/delete/:id**

- Delete a task. 

Parameters:
- task id: taken from a dynamic url for specific task
- accessToken: taken from cookie and header to prove authentication and makes sure the task deletion is only for their tasks.

Response:
```
"Task deleted successfully"
```

**GET /task**

- Get all tasks associated to the logged in user. 

Parameters:
- accessToken: taken from cookie and header to prove authentication.

Response:
```
[
    {
        "id": 7,
        "title": "homework",
        "description": "do homework",
        "status": "not started",
        "priority": "high",
        "created_at": "2025-01-28T00:20:10.000Z",
        "updated_at": "2025-01-28T00:20:10.000Z",
        "assigned_user_id": 8
    }
]
```

### Auth

- JWT auth
    - Includes an accessToken that expires in 1 hour and a refresh token that expires in 30 days.
    - Includes a blacklisted_token database table to make sure previous tokens are not used by others.
    - Store JWT in the header, remove when a user logs out.

## Future Iterations

- Update backend to deal with families or other groups so that users can view and share tasks among them.
- The ability to update a user profile and a more unique landing page experience as a result on the front-end.
- Ability to send email reminders for important tasks.
- Possible integration with an AI/ML model to help finish tasks more efficiently (Recommendations, patterns, and help families organize a growing list of tasks based on previous history).

## IMPORTANT

- Please note, any example secrets listed throughout the project (.env.sample, accessTokens mentioned in responses above, etc.) are just examples and are not in use.