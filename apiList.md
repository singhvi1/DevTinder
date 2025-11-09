# DevTinder APIs

### authRouter

    -post /signup         -D
    -post /login             -D
    -post /logout              -D

### Profile Router

    -GET /profile/view       -D 
    -PATCH /profile/edit        -D
    -PATCH /profile/password        -D

### connectionRequestRouter

    -POST /request/send/interested/:userId    -D
    -POST /request/send/ignored/:userrId        -D
          
Dyanmic as /request/send/:status/:toUserId

    -POST /request/review/accepted/:requestId   -D
    -POST /request/review/rejected/:requestId        -D

    or maybe Dyanmic as /request/send/:status/:toUserId     -D

    
### userRoute

    -GET /user/connections                -D
    -GET /user/requests/received             -D                     
    -GET /user/feed   "get us the profile of other users"      -D
 