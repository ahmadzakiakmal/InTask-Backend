# InTask-Backend
PAW Project - Backend for InTask web application

## Members
- Ahmad Zaki Akmal - 21/480179/TK/52981
- Diestra Pradana Duta Ramadhan - 21/478179/TK/52693
- Nikolas Galih Saputro - 21/482747/TK/53361
- Salwa Maharani - 21/481194/TK/53113

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
  email: string
  password: string
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
  username: string,
  email: string,
  password: string,
  ```

  
#### 3. Update Profile
- ##### Description
  Update the user profile information

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
  Delete their user profile

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
  request password reset link for forgotten password
  
- ##### Route
  ````````````
  POST /user/forgot-password
  ````````````

- ##### Parameters
  ```
  email: string,
  username: string
  ```
<br />

### Projects

<br />

### Tasks

<br />

### Admin

<br />

## Related Repositories
- [Frontend Repository](https://github.com/ahmadzaki2975/InTask-Frontend)
