<h1 align="center"> Infinite Task (InTask) 📄 </h1>
PAW Project - Backend for InTask Web Application

## 👩🏻 Kelompok 1's Member 👦🏻 
- Ahmad Zaki Akmal - 21/480179/TK/52981
- Diestra Pradana Duta Ramadhan - 21/478179/TK/52693
- Nikolas Galih Saputro - 21/482747/TK/53361
- Salwa Maharani - 21/481194/TK/53113

## 🔗 Our Links 🔗
| Deskripsi | Link |
| --- | --- |
| Slide Presentasi | |
| Video Presentasi | |
| API Documentation Postman | https://bit.ly/InTaskPostman |
| Backend Web Deployed | https://in-task-api.vertech.id |
| Frontend Web Deployed | https://in-task.vertech.id |
| Frontend Github | https://github.com/ahmadzaki2975/InTask-Frontend |

## More information about InTask ❗
InTask (Infinite Task) merupakan aplikasi web manajemen tugas yang membantu pengguna untuk membuat, mengelola, dan memonitor project atau tugas dengan lebih efisien.

## Our main fitur
### Project 📃
Pengguna dapat membuat serta mengelola project-project yang akan atau sedang dilakukan. Pengguna dapat mengisi tugas tugas atau task yang akan dilakukan (to do), yang sedang dikerjakan (doing), dan yang sudah selesai dikerjakan (done).
### Task 📝
Pengguna dapat membuat dan mengelola tugas-tugas individual dengan memberikan status tugas, seperti Todo, In Progress, dan Done.

## Documentation 

### User

#### 1.Register
- ##### Description
  Registers a new, unverified user to the database.

- ##### Route        
  ````````````
  POST /user/register
  ````````````

- ##### Parameters  
  ```
  username: string,
  realName: string,
  email: string,
  password: string,
  ```

#### 2. Login
- ##### Description
  Authenticates a user and grants access to the application.

- ##### Route        
  ````````````
  POST /user/login
  ````````````

- ##### Parameters  
  ```
  identifier: string,
  password: string,
  ```
 
#### 3. Update Profile
- ##### Description
  Update the user profile information.

- ##### Route
  ````````````
  PUT /user/update-profile
  ````````````

- ##### Parameters
  ```
  username: string,
  email: string,
  realName: string,
  ```

#### 4. Delete Profile
- ##### Description
  Delete their user profile.

- ##### Route
  ````````````
  DELETE /user/delete-profile/:userId
  ````````````

- ##### Parameters
  ```
  userId: ObjectId,
  ```

#### 5. Forgot Password
- ##### Description
  Request password reset link for forgotten password.
  
- ##### Route
  ````````````
  POST /user/forgot-password
  ````````````

- ##### Parameters
  ```
  email: string,
  username: string,
  ```

#### 6. Reset Password
- ##### Description
  Reset password after receiving link.
  
- ##### Route
  ````````````
  PATCH /user/reset-password
  ````````````

- ##### Parameters
  ```
  password: string,
  ```

#### 7. Verify
- ##### Description
  Verify user email.
  
- ##### Route
  ````````````
  PATCH /user/verify
  ````````````

- ##### Parameters
  ```
  token
  ```

<br />

### Projects

#### 1. Get Project
- ##### Description
  Get all user’s projects.
  
- ##### Route
  ````````````
  GET /project/:username
  ````````````

- ##### Parameters
  ```
  username: string,
  ```

#### 2. Create Project
- ##### Description
  Create new project.
  
- ##### Route
  ````````````
  POST /project/
  ````````````

- ##### Parameters
  ```
  title: string,
  description: string,
  ```

#### 3. Delete Project
- ##### Description
  Delete project by ID.
  
- ##### Route
  ````````````
  DELETE /project/:projectId
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  ```

#### 4. Add Contributor
- ##### Description
  Add user to project contributors.
  
- ##### Route
  ````````````
  POST /project/:projectId/contributors
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  username: string,
  email: string,
  ```

#### 5. Remove Contributor
- ##### Description
  Remove user from project contributors.
  
- ##### Route
  ````````````
  DELETE /project/:projectId/contributors/:contributorUsername
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  contributorUsername: string,
  ```
  
<br />

### Tasks

#### 1. Get Project Task
- ##### Description
  Get all project tasks.
  
- ##### Route
  ````````````
  GET /project/:projectId/tasks
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  ```

#### 2. Add Task
- ##### Description
  Add new task to project.
  
- ##### Route
  ````````````
  POST /project/:projectId/tasks
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  name: string,
  description: string,
  ```

#### 3. Delete Task
- ##### Description
  Delete project task by id.
  
- ##### Route
  ````````````
  DELETE /project/:projectId/tasks/:taskId
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  taskId: ObjectId,
  ```

#### 4. Add Assignee
- ##### Description
  Add user as assignee.
  
- ##### Route
  ````````````
  POST /project/:projectId/tasks/:taskId/assignees
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  taskId: ObjectId,
  username: string,
  email: string,
  ```

#### 5. Remove Assignee
- ##### Description
  Remove user from assignee.
  
- ##### Route
  ````````````
  DELETE /project/:projectId/tasks/:taskId/assignees
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  taskId: ObjectId,
  username: string,
  email: string,
  ```

#### 6. Update Task Status
- ##### Description
  Update status in task(todo, in progress, done, etc).
  
- ##### Route
  ````````````
  PATCH /project/:projectId/tasks/:taskId
  ````````````

- ##### Parameters
  ```
  projectId: ObjectId,
  taskId: ObjectId,
  status: string,
  ```
<br />

### Admin

#### 1. Get All User
- ##### Description
  Get all user data/information from those who have already signed in to the app.
  
- ##### Route
  ````````````
  GET /admin/
  ````````````

- ##### Parameters

<br />

## Related Repositories
- [Frontend Repository](https://github.com/ahmadzaki2975/InTask-Frontend)
