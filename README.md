# HikeTracker22-13

Technology used: Javascript - React

## DB Documentation 
The tables present in the DB are the following:

### Hikes
The list of the hikes
- title: Primary key identifyng a hike
- length: The length in kilometres of the hike
- expected_time: The expected duration in hours of the hike
- ascent: The height difference of the ascent in metres
- difficulty: The difficulty of the hike. Three possible values: tourist, hiker, professional hiker
- start_point: The id of the starting point of the hike
- end_point: The id of the ending point of the hike
- reference_points: A string with the list reference points's id separeted by a "-"
- description: The description of the hike
- gpx_track: A string with the name of gpx file (?)
- hike_condition: The condition of the hike. Four possible values: open, closed, partly blocked, requires special gear
- hike_condition_description: A description of the causes of the condition
- local_guide: The email of the local guide who added the hike

### Points
The list of the points
- idPoint: Primary key identifying a point
- address: The address of the point
- nameLocation: The name of the location of the point
- gps_coordinates: A string contains the gps coordinates of the point
- type: The type of the point. Two possible values: hut or parking lot
- capacity: An integer for Huts and Parking lots, in the first case is related to the number of beds and in the second case to the number of cars.
- altitude: The altitude in kilometres of the point

### Users
The list of the users, their credentials and their roles
- email: Primary key identifying a user
- password: The hashed password of the user
- role: The role of the user
- name: The name of the user
- lastname: The last name of the user
- phone_number: The phone number of the user
- salt: The salt used in the encryption process

### Verification_Code
The list of verification code for each email.
- email: User's email 
- code: Verification code for the email.

### HikePoint
The list of correlations between hikes and points
- idPoint: The id of a point
- titileHike: The title of a hike

### Huts
The list of the huts
- idHut: Primary key identifying a hut
- nameHut: The name of the hut, references to the nameLocation of Points
- phone: The phone number of the hut
- email: The email of the hut
- web_site: The URL of the website of the hut
- description: The description of the hut

### HikerHike
The list of correlations between hikes and hikers
- hiker: The email of the hiker
- hike: The title of the hike
- start_time: The starting time of the hike
- end_time: The ending time of the hike (it can be null, for hikes not yet completed)

### HikerHikeStatistics
The list of correlations between hikes and hikers and thei statistics
- hiker: The email of the hiker
- hike: The title of the hike
- times_completed: Number of times that this hike are completed by the specific hiker
- best_time: Best time for completed that hike by that hiker, in minutes

## Dao Documentation

### Users functions

- **readUsers()**, returns a list of every user with every field excepted the salt
- **getUserByEmail(email)**, returns a specific user, with every field excepted the salt, associated with the argument *email*. If the *email* hasn't a match it returns a object with a field error: 'NOT found'
- **addUser(name, lastname, email, password, salt, role, phone_number)**, inserts a user in the database, with the relative arguments. The password is already hashed
- **updateUserRole(email, role)**, updates the user associated with the argument *email* with the argument *role*
- **deleteUser(email)**, deletes the user associated with the argument *email*

### Hikes functions

- **readHikes()**, returns a list of every hike with every field excepted the reference points. This function returns also the fields of the starting and ending points
- **getHikeByTitle(title)** return the entire hike associated with the argument *title*
- **readListOfReferencePoints(title)**, returns a list of the fields of the reference points of the hike associated with the argument *title*
- **addHike(hike)**, inserts the object hike to the database. The argument *hike*, is an object with the every fields of an hike
- **updateHikeTitle(oldName, newName)**, updates the hike identified by *oldName* with the *newName*
- **updateHikeLenght(title, length)**, updates the hike *title* with the new *length*
- **updateHikeET(title, expected_time)**, updates the hike *title* with the new *expected_time*
- **updateHikeAscent(title, ascent)**, updates the hike *title* with the new *ascent*
- **updateHikeDifficulty(title, difficulty)**, updates the hike *title* with the new *difficulty*
- **updateHikeStartPoint(title, start_point)**, updates the hike *title* with the new *start_point*
- **updateHikeEndPoint(title, end_point)**, updates the hike *title* with the new *end_point*
- **updateHikeRefPoint(title, reference_points)**, updates the hike *title* with the new *references_point*
- **updateHikeDescription(title, description)**, updates the hike *title* with the new *description*
- **updateHike(oldHikeTitle, newHike)**, updates the entire hike *oldHikeTitle* with the new *newHike*
- **deleteHike(title)**, deletes the hike associated with the argument *title*

### Points functions

- **readPoints()**, returns a list of every point with every field
- **readPointById(id)**, returns a specific point, with every field, associated with the argument *id*. If the *id* hasn't a match it returns a object with a field error: 'NOT found'
- **checkPresenceByAddress(addr)**, returns an idPoint of the point associated with the argument *addr*. If the *addr* hasn't a match it returns *null*
- **checkPresemceByCoordinates(coord)**, returns on idPoint of the point associated with the argument *coord*. If the *coord* hasn't a match it returns *null*
- **addPoint(point)**, inserts the point associated with the argument *point*, that is a point with all necessary fields
- **updatePoint(oldIdPoint, newPoint)**, updates the entire point *oldIdPoint* with the new *newPoint*
- **deletePoint(id)**, deletes the point with the specified *id*
- **updatePointAddress(oldIdPoint, address)**, updates the point *oldIdPoint* with the new *address*
- **updatePointLocation(oldIdPoint, location)**, updates the point *oldIdPoint* with the new *location*
- **updatePointGpsCoordinates(oldIdPoint, gps_coordinates)**, updates the point *oldIdPoint* with the new *gps_coordinates*
- **updatePointType(oldIdPoint, type)**, updates the point *oldIdPoint* with the new *type*
- **updatePointCapacity(oldIdPoint, capacity)**, updates the point *oldIdPoint* with the new *capacity*
- **updatePointAltitude(oldIdPoint, altitude)**, updates the point *oldIdPoint* with the new *altitude*

### Verification Code functions

- **addCode(email, code)**, inserts the pair (email,code) in the table
- **getCode(email)**, returns a specific codeassociated with the argument *email*. If the *email* hasn't a match it returns a object with a field error: 'NOT found'
- **deleteCode(email)**, deletes the row associated with the argument *email*
- **updateCode(email, code)**, updates the code associated with the argument *email* with the new *code* passed from arguments

### Huts functions

- **readHuts()**, returns a list of every huts with every field
- **addHut()**, inserts an instance of hut linked to the respective point 

### HikerHike functions

- **startHike(hiker_email, hike_title, start_time)**, inserts a row in the table for the starting hike, with every fields except for end_time
- **updateHikeEndTime(hiker_email, hike_title, tart_time, end_time)**, update the row associated with the arguments *hiker_email*, *hike_title* and *start_time* with the *end_time*
- **getOnGoingHike(hiker_email)**, returns an array with the eventually ongoing hike (its title and starting time) associated with the argument *hiker_email*
- **updateHikerHike_Hike(oldHike,newHike)**, update the hike name with the new hike name
### HikerHikeStatistics functions

- **endHike(hiker_email, hike_title, duration)**, insert a row in the table when a hike was completed for the first time. Automatically set the times_completed field to 1
- **updateEndHikeBestTime(hiker_email, hike_title, duration)**, update the row associated with the arguments *hiker_email* and *hike_title* if the *duration* is shorter than the actual best time. Increment also the times_completed field
- **updateEndHikeNoBestTime(hiker_email, hike_title)**, update the row associated with the arguments *hiker_email* and *hike_title* if the *duration* is longer or ugual than the actual best time, increment the times_completed field
- **getBestTime(hiker_email, hike_title)**, returns the best time for the hike associated with *hike_title* for the specific hiker *hiker_email*
- **checkFirstEnd(hiker_email, hike_title)**, returns a flag for check if it is the first time that the hiker *hiker_email* complete the hike *hike_title*. The flag is 0 if it is the first time otherwise it returns 1.
- **getFinischedHikes()**, returns all hikes that are finished, even duplicates if, for example, the same hike was completed by two or more different hikers
- **getDistinctFinishedHikes()**, returns all hikes that are finished, eliminating duplicates
- **getFinishedHikesByHiker(hiker_email)**, returns all hikes that are finished by a specific hiker
- **updateHikerHikeStatistics_Hike(oldHike,newHike)**, update the hike name with the new hike name
### HikePoint functions

- **getHikePoint()**, returns a list of every idPoints and hikeTitles assossiation
- **addHikePoint(idPoint, titleHike, nameLocation)**, instart a new entry to the HikePoint table, return the idPoint
- **deleteHikePoint_Hike(titleHike)**, deletes all the entries associated with the argument *titleHike*
- **getHikePointByTitle(titleHike)**, returns the Hike Points associated to an hike

### HutsLinkedHike (HutHike) functions
- **addLinkedHut(idHut, titleHike)**, insert into HikeHut table a new instance and return the idHut or error
- **getHutsLinkedByTitle(titleHike)**, return the huts linked to an hike
- **deleteLinkedHut_byTitle(titleHike)**, delete all the huts linked to an hike

## Users

Mario Rossi:
- email: mario.rossi@gmail.com
- password: hello12
- role: Hiker
- name: Mario
- lastname: Rossi
- phone_number: +39 3486289468

Paulina Knight:
- email: paulina.knight@gmail.com
- password: hello13
- role: LocalGuide
- name: Paulina
- lastname: Knight
- phone_number: +39 3276958421

Richie Zuniga:
- email: namiwak525@bitvoo.com
- password: hello15
- role: LocalGuide
- name: Richie
- lastname: Zuniga
- phone_number: +39 3256789432

Marino Carriero:
- email: manager.admin@gmail.com
- password: hello00
- role: Admin
- name: Marino
- lastname: Carriero
- phone_number: ++39 3454617712

## API

## HIKES API

- GET `/getHikes`
  - Description: Obtain the entire list of the hikes 
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing an hike:
    ``` json
    [
      {
        "title": "Hike1",
        "length": 33,
        "expected_time": 75,
        "ascent": 400,
        "difficulty": "hiker",
		    "description": "A journey through the unspoilt nature of Monte Rosa",
        "gpx_track": "Form Pian Belota to la Vacca",
        "start_point_idPoint": 2,
        "start_point_address": "Corso Mediterraneo 40",
        "start_point_nameLocation": "Legnano",
        "start_point_coordinates": "45.177786,7.083372",
        "start_point_type": "hut",
        "end_point_idPoint": 4,
        "end_point_address": "Corso Francia 10",
        "start_point_nameLocation": "Fivizzano",
        "start_point_coordinates": "N 45° 83' 29″ - E 52° 09' 72″",
        "start_point_type": "parking lot",
      },
      ...
      {
        "title": "Hike7",
        "length": 75,
        "expected_time": 189,
        "ascent": 600,
        "difficulty": "professional hiker",
		    "description": "A hike in the Dolomites Nature Park",
        "gpx_track": "Form Pian Belota to la Vacca",
        "start_point_idPoint": 10,
        "start_point_address": "Corso Mediterraneo 120",
        "start_point_nameLocation": "Brunascola",
        "start_point_coordinates": "47.156786,4.018970",
        "start_point_type": "parking lot",
        "end_point_idPoint": 3,
        "end_point_address": "Corso Francia 100",
        "start_point_nameLocation": "Ricortola",
        "start_point_coordinates": "N 55° 93' 21″ - E 32° 19' 70″",
        "start_point_type": "parking lot",
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- PUT `/api/updateHike`
  - Description: Update a hike
  - Request body: An object containing a hike
    ``` json
    {
      "newHike": {
        "title": "Hike7",
        "length": 75,
        "expected_time": 189,
        "ascent": 600,
        "difficulty": "professional hiker",
        "start_point": "Chamolé, 16, Comboé Superiore, Charvensod, Aosta Valley, 21000, Italy",
        "end_point": "Colle Betta, Strada Regionale 43 di Staffal, Anderbatt, Gressoney-La-Trinité, Aosta Valley, Italy",
        "reference_points" : [
          {
            "idPoint": 1,
            "address": "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
            "nameLocation": "La Riposa",
            "gps_coordinates": "45.177786,7.083372",
            "type": "Hut",
            "capacity": null,
            "altitude": null
          }
        ],
        "description": "A hike in the Dolomites Nature Park",
        "gpx_track": "Form Pian Belota to la Vacca"
      }
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields)

- POST `/api/newHike`
  - Description: Add a new hike
  - Request body: An object contains an hike
    ``` json
    {
      "newHike": {
        "title": "Hike7",
        "length": 75,
        "expected_time": 189,
        "ascent": 600,
        "difficulty": "professional hiker",
        "start_point": "Chamolé, 16, Comboé Superiore, Charvensod, Aosta Valley, 21000, Italy",
        "end_point": "Colle Betta, Strada Regionale 43 di Staffal, Anderbatt, Gressoney-La-Trinité, Aosta Valley, Italy",
        "description": "A hike in the Dolomites Nature Park",
        "gpx_track": "Form Pian Belota to la Vacca"
      }
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields)

## AUTHENTICATION API

- POST `/api/v0/sessions`
  - Description: Authentication of the user trying to login
  - Request body: An object contains the credentials of the user
    ``` json
    {
      "email": "mario.rossi@gmail.com",
      "password": "hello12"
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: authencticated user
    ``` json
    {
      "email": "mario.rossi@gmail.com", 
	    "password": "hello12",
	    "role": "Hiker",
      "name": "Mario",
      "lastname": "Rossi",
      "phone_number": "+39 3486289468"
    }
    ```
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- GET `/api/v0/sessions/current`
  - Description: Checks whether the current user is logged in and obtains his data
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: authenticated user
    ``` json
    {
      "email": "mario.rossi@gmail.com", 
	    "password": "hello12",
	    "role": "Hiker",
      "name": "Mario",
      "lastname": "Rossi",
      "phone_number": "+39 3486289468"
    }
    ```
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- DELETE `/api/sessions/current`
  - Description: Logout dof the current user
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

## FILE UPLOAD API

- GET `/api/Maps/:name`
  - Description: Obtain the map as text
  - Request body: The name of the file contains the map
  - Response: `200 OK` (success) 
  - Response body: A string with the filename
    ``` json
      {
        "filename": "Form Pian Belota to la Vacca",
      },
    ```
  - Error responses: `500 Internal Server Error` (database error), `400 Bad Request` (file missing)

## USER API

- POST `/api/User`
  - Description: Add a new user
  - Request body: An object contains user
    ``` json
    {
      "user": {
        "email": "mario.rossi@gmail.com", 
        "password": "hello12",
        "role": "Hiker",
        "name": "Mario",
        "lastname": "Rossi",
        "phone_number": "+39 3486289468"
      }
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields), `422 Unprocessable Entity` (email already registered)

- GET `/User/:email`
  - Description: Obtain a user by a email 
  - Request body:The email of a user
  - Response: `200 OK` (success) 
  - Response body: An user identified by the email
    ``` json
    {
      "user": {
        "email": "mario.rossi@gmail.com", 
        "password": "hello12",
        "role": "Hiker",
        "name": "Mario",
        "lastname": "Rossi",
        "phone_number": "+39 3486289468"
      }
    }
    ```
  - Error responses: `500 Internal Server Error` (database error)

## POINTS API

- GET `/api/getPoints`
  - Description: Obtain the entire list of points 
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing a points:
    ``` json
    [
      {
        "idPoint": 1,
        "address": "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
        "nameLocation": "La Riposa",
        "gps_coordinates": "45.177786,7.083372",
        "type": "Hut",
        "capacity": null,
        "altitude": null
      },
      {
        "idPoint": 2,
        "address": "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
        "nameLocation": "Nostra Signora del Rocciamelone",
        "gps_coordinates": "45.203531,7.07734",
        "type": "Hut",
        "capacity": null,
        "altitude": null
      }
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- POST `/api/Point`
  - Description: Add a new point
  - Request body: An object contains a point
    ``` json
    {
      "point": {
        "address": "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont 10059, Italy",
        "nameLocation": "Hut#1",
        "gps_coordinates": "45.177786,7.083372",
        "type": "Hut",
        "capacity": 20,
        "altitude": 3320
      }
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields), `422 Unprocessable Entity` (gps_coordinates already registered)

## HUTS API

- GET `/getHuts`
  - Description: Obtain the entire list of huts 
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing an huts:
    ``` json
    [
      {
        "idHut": "Hut1",
        "nameHut": "La Riposa",
        "phone": "+39 3209087653",
        "email": "riposa@gmail.com",
		    "web_site": "www.lariposa.it",
        "description": "A very beautiful hut",
      },
      ...
      {
        "idHut": "Hut2",
        "nameHut": "Nostra Signora del Rocciamelone",
        "phone": "+39 333 4588662",
        "email": "rocciamelone@gmail.com",
		    "web_site": "www.rocciamelone.com",
        "description": "A small but cute hut",
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- POST `/api/Huts`
  - Description: Add a new hut
  - Request body: An object contains a hut
    ``` json
    {
      "hut": {
        "idHut": "Hut1",
        "nameHut": "La Riposa",
        "phone": "+39 3209087653",
        "email": "riposa@gmail.com",
		    "web_site": "www.lariposa.it",
        "description": "A very beautiful hut",
      }
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields)

## HikerHike API

- POST `/api/startHike`
  - Description: Starting an hike
  - Request body: Three string: email of the hiker, title of the hike, starting time
    ``` json
    {
      "hiker_email": "mario.rossi@gmail.com",
      "hike_title": "Form Pian Belota to la Vacca",
      "start_time": "15.00",
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `400 Bad Request` (wrong fields)

- PUT `/api/updateEndTime`
  - Description: Updating the ending time of an hike
  - Request body: Four string: email of the hiker, title of the hike, starting time, ending time
    ``` json
    {
      "hiker_email": "mario.rossi@gmail.com",
      "hike_title": "Form Pian Belota to la Vacca",
      "start_time": "15.00",
      "end_time": "18.00",
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Service unavailable` (database error), `400 Bad Request` (wrong fields)

- POST `/api/endHikeFirstTime`
  - Description: Terminate a hike and insert row in HikerHikeStatistics table of the db
  - Request body: Three string: email of the hiker, title of the hike, duration of the hike (in minutes)
    ``` json
    {
      "hiker_email": "mario.rossi@gmail.com",
      "hike_title": "Form Pian Belota to la Vacca",
      "duration": 120
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Service unavailable` (database error), `400 Bad Request` (wrong fields)

- PUT `/api/endHike`
  - Description: Terminate and hike and update the statistics
  - Request body: Three string: email of the hiker, title of the hike, duration of the hike (in minutes)
    ``` json
    {
      "hiker_email": "mario.rossi@gmail.com",
      "hike_title": "Form Pian Belota to la Vacca",
      "duration": 120
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Service unavailable` (database error), `400 Bad Request` (wrong fields)

- GET `/api/checkFirstTime?hiker=${hiker_email}&hike={hike_title}`
  - Description: Obtain a flat to check if it is the first time (0) or not (1) to complete the hike for the specific hiker
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: A integer that rappresent the flag
    ``` json
      "flag": 1
    ``` 
  - Error responses: `500 Internal Server Error` (database error)


- GET `/api/getOnGoingHike/:hiker`
  - Description: Obtain the title and the starting time of an ongoing hike of a specific hiker
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, with the information of the hike:
    ``` json
    [
      {
        "title": "Hike3",
        "length": 30,
        "expected_time": 2,
        "ascent": 400,
        "difficulty": "Tourist",
		    "description": "A journey through the unspoilt nature of Monte Rosa",
        "gpx_track": "Form Pian Belota to la Vacca",
        "start_point_nameLocation": 1,
        "end_point_nameLocation": 5,
        "start_time": "15.00",
      }
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- GET `/api/getFinishedHikes`
  - Description: Obtain the entire list of finished hikes, also the duplicates
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing a row of HikerHike table of the DB:
    ``` json
    [
      {
        "hiker": "mario.rossi@gmail.com",
        "hike": "Form Pian Belota to la Vacca",
        "times_completed": 3,
        "best_time": 120,
      },
      ...
      {
        "hiker": "mario.rossi@gmail.com",
        "hike": "Hike Monte Thabor",
        "times_completed": 1,
        "best_time": 300,
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- GET `/api/getDistinctFinishedHikes`
  - Description: Obtain the entire list of finished hikes, removing the duplicates
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of object cointains the title of the hikes:
    ``` json
    [
      {
        "hike": "Form Pian Belota to la Vacca",
      }
      ...
      {
        "hike": "Hike Monte Thabor",
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- GET `/api/getFinishedHikesByHiker/:hiker`
  - Description: Obtain the entire list of finished hikes by a specific hiker
  - Request body:Three email of the hiker
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing a row of HikerHike table of the DB:
    ``` json
    [
      {
        "title": "Hike1",
        "length": 33,
        "expected_time": 7,
        "ascent": 400,
        "difficulty": "hiker",
		    "description": "A journey through the unspoilt nature of Monte Rosa",
        "gpx_track": "Form Pian Belota to la Vacca",
        "start_point_nameLocation": 2,
        "end_point_nameLocation": 4,
        "times_completed": 3,
        "best_time": 120,
      },
      ...
      {
        "title": "Hike3",
        "length": 30,
        "expected_time": 2,
        "ascent": 400,
        "difficulty": "Tourist",
		    "description": "A journey through the unspoilt nature of Monte Rosa",
        "gpx_track": "Form Pian Belota to la Vacca",
        "start_point_nameLocation": 1,
        "end_point_nameLocation": 5,
        "times_completed": 1,
        "best_time": 300
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)