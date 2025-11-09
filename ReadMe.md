# 14 BuildingFeed&Pagination:

    -Logic for GET /user/feed API
    -Explore the $nin $and and toher querey operators;

    //feed: Pagination   && for mgdb .skip()  .limit()
    -/feed?page=1&Limit=10 => users from 1-10   =>  .skip(0) .limit(10)
    -/feed?page=2&Limit=10 =>users from  11-20  => .skip(10) .limit(10)



# 13 Ref,Populate&ThoughtProcessOfWritingApis
    -Write code for proper validation for /request/review/:status/:requestId
    -thought process of get and post
    -Read about ref and populate 
    create GET request /user/request/recieved
    .populate()  -> how to implement ref
    .select()    -> when to use ? 
    



## 12. LogicalDbQuery&CompoundIndexes

    -Create Connection Request Schema
    -Send Connection Request Api
    -Proper Validation of Data
    -Think about all corner Cases
    -$or Query $and Query in mongoose 
    -Schema.pre("save",) fxn()  A-A
    -Read more about indexes in Mongodb
    -WHy do we need index in Db?


# Diving Into the APIs and ExpressRouter

    -Explore tinder APIs
    -Create al list all API you can think of in Dev Tinder 
    -Group multiple routes under respective routers
    -Read documentaion for express Router
    -Create routes folder for managing auth, profile, request routers
    -Create authRouter, profileRouter,requestRouter
    -Import these roueter in app.js
    -Create POST /logout API
    -Create PATCH /profile/edit
    -Create PATCH /profile/password API => forget Password API
    -Make you validate all data in every POST, PATCH apis

# JWT and Outh with cookies

    -install cookie-parser and setDummyCookie to user 
    -create GET /profile and check if we get cookie back
    -install jsonwebtoken
    -In Login API , after email and pass validation, create a JWT token and send it to user cookies,
    -Read the cookies inside  /profile API  and find loogedIn user data
    -userAuth middleWare
    -Add the userAuth middleware in profile API and a new /sendConnection
    -set the expiery JWT token and coookies for to 1 day
    -Create userSchema Method to getJwt()
    -Create useeerSChema method  CompressedPassword(passwordInputByUser)

# Encyption of password

    -validate data in Signup API
    -Install bcrypt package
    -Create PasswoedHash using bcrypt.hash(x,count)&save hashed password
    -LoginApi sanatise login Email and validate it too
    -cookies setting 

# DataSanitisation&SchemaVlaidation

    -Explore schematypes and options from documention
    -add required  unique lowercase minlength trim defalut - -cutomValidation(two ways) for gender and age
    -improve the db schema put all  appropiate validation on each;
    -Add timestamps to user schema
    -API level validation on patch request and signup post api 
    -DATA sanitizing -Add API validation for each field
    -Install Validator and use validator for password/email/photoURL
    -Never trust req BODY

# DivingintotheAPIs

    -JS object vs Json (diffrence)
    -Add the express.json() middleware to your app  for ? 
    -Make your signup Api dynamic to receive data from end user ;
    -User.findOne with duplicate email ids 
    -API  -get user by email 
    -API  -Feed API -Get /feed - get all the users from the database
    -API -Get user by id
    -API -Create a delete user API 
    -Diffrence between patch and PUT 
    -API - update a user 
    -Explore the mongoose documentation for medel methods 
    -what are options in model Model.findOneAndUpdate() method explore more about it 
    -API  - Update /user the user with id and email 

# questoin

what is a model , collection , and schema  ,  standard forms of findOneAndUpdate(x,y,z) and other learn their types allowed like x must be object not string like in findByIdAndUpdate(x,y,d)

# DataBase , Schema and Models  & Mongoose

    -Create a free Cluster on MongoDB official website (Mongo Atlas);
    -Install Mongoose library 
    -Connect your application to the database "coonection-url"/devTinder
    -call the connectDb function and connect to database before starting application  on 7777
    -Create a userSchema
    -create post /signup api to add data to database
    -push some document useing apoi calls from ostman 

# MiddleWares and Handling Errors

    -multiple route handler play 
    -next()
    -next function and error along with res.send();
    -app.use("/route",rh,[rh1,rh2],rh3)
    -what is a middleware 
    -how express js basically handles requests behind the screen 
    -Diff between app.use and app.all 
    -write a dummy auth middleware for admin 
    -write a dummy auth middleware for all user routes , except /user/login
    -Error handling using app.use and try catch too ;
