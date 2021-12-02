# Background and Description
As the leading animal welfare platform in Malaysia, PetFinder.my has been maintaining a database of over 15000 animals. Recently, It is experimenting with AI tools to help homeless pets find people who are willing to adopt them. This project is yet another endeavor in the wave. As it is arguably true that animal adoption rates are strongly correlated to their online profiles,  this project aims to solve an analytics problem: Make a prediction of how quickly, if at all, a pet is adopted, given a fair amount of profile data consisting of both text data and non-text data. 
# Architecture and Components
The application was built using React as front end and SpringBoot as back end. Firebase was used to handle unstructured text data and MySQL was used to handle structured text data. Two machine learning algorithms: XGBoost and CNN were implemented to give prediction of adoption speed. Spark was used to perform data analysis tasks. Below is a flow chart showing the overview of the entire system architecture.
![] (https://ibb.co/QDZ6dGP/System-architecture-3.png")
1. Spring Boot submits a train or predict job to backend machine learning algorithm, after computation, machine learning algorithm returns the prediction and evaluation.
2. After receiving the training requirement from Spring Boot, the XGBoost algorithm goes to the according path to read the train data.
3.React accepts files uploaded by users and sends them to Spring Boot. it also sends data queries to Spring Boot. Spring Boot would use appropriate services to generate desired data and send it back to React. 
4. Spring Boot submits data exploration requirements to the backend, it will be done in spark.
5. Spring Boot accepts uploaded text files and saves them in MySQL. 
6. Spring Boot retrieves non-structured data from Firebase.
7. Spark retrieves data from MySQL.
8. Spring Boot accepts images uploaded by users and save them in local directory
9. After receiving the training requirement from Spring Boot, the CNN algorithm goes to the according path to read the images.

# How to run
### front-end
1. cd into client directory and type in:
```
npm install
```
this will install every package required in the front end.

2. type in:
```
npm start
```
this will start the front end. 

### back-end
open this project as idea and run it.

### database
replace the MySQL username and password with your own in application.properties file.
