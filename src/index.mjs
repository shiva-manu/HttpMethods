import express, { response } from 'express';

const app=express();
app.use(express.json());
const loggingMiddleware=(request,response,next)=>{
   console.log(`${request.method}-${request.url}`);
   next();
}
// const resolveIndexByUserId=(request,response,next)=>{
//    const {body,params:{id}}=request;
//    const parsedId=parseInt(id);
//    if(isNaN(parsedId)) return response.sendStatus(400);
//    const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
//    if(findUserIndex===-1) return response.sendStatus(404);
//    request.findUserIndex=findUserIndex;
//    next();
// }
const PORT=process.env.PORT || 3000;
const mockUsers=[
   {id:1,username:"anson",displayName:"Anson"},
   {id:2,username:"jack",displayName:"Jack"},
   {id:3,username:"adam",displayName:"Adam"},
   {id:4,username:"tina",displayName:"Tina"},
   {id:5,username:"jason",displayName:"Jason"},
   {id:6,username:"henry",displayName:"Henry"},
   {id:7,username:"marilyn",displayName:"Marilyn"}
];

app.get("/",(request,response)=>{
   response.status(200).send({message:"HelloWorld"});
});

app.get("/api/users",(request,response)=>{
   console.log(request.query);
   const {query:{filter,value}}=request;
   //if filter and value exits
   if(filter && value) return response.send(
      mockUsers.filter((user)=>user[filter].includes(value))
   )
   return response.send(mockUsers);
});

const postUserDetails=(request,response,next)=>{
   console.log(request.body);
   const {body}=request;
   const newUser={id:mockUsers[mockUsers.length-1].id+1,...body};
   request.newUser=newUser;
   next();
}

app.post("/api/users",postUserDetails,(request,response)=>{
   const {newUser}=request;
   // console.log(request.body);
   // const {body}=request;
   // const newUser={id:mockUsers[mockUsers.length-1].id+1,...body};
   mockUsers.push(newUser);
   return response.status(201).send(newUser)
});

const getUserDetailsById=(request,response,next)=>{
   console.log(request.params);
   const parsedId=parseInt(request.params.id);
   if(isNaN(parsedId)) return response.status(404).send({Eror:"Bad Request amd Invalid Id"});
   request.parsedId=parsedId;
   next();
}

app.get("/api/users/:id",getUserDetailsById,(request,response)=>{
   const {parsedId}=request;
   const findUser=mockUsers.find((user)=>user.id==parsedId);
   if(!findUser) return response.status(404).send({Error:"User doesn't exits"});
   return response.status(200).send(findUser);
});

const putUserDetailsById=(request,response,next)=>{
   const {params:{id}}=request;
   const parsedId=parseInt(id);
   if(isNaN(parsedId)) return response.status(404).send({Error:"Bad Request and Invalid Id"});
   const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   if(findUserIndex===-1) return response.status(404).send({Error:"User doesn't exits"});
   request.findUserIndex=findUserIndex;
   next();
}

app.put("/api/users/:id",putUserDetailsById,(request,response,)=>{
   const {body,findUserIndex}=request;
   // const {body,params:{id}}=request;
   // const parsedId=parseInt(id);
   // if(isNaN(parsedId)) return response.sendStatus(400);
   // const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   // if(findUserIndex===-1) return response.sendStatus(404);
   mockUsers[findUserIndex]={id:mockUsers[findUserIndex].id,...body};
   return response.sendStatus(200);
});

const patchUserDetailsById=(request,response,next)=>{
   const {bpdy,params:{id}}=request;
   const parsedId=parseInt(id);
   if(isNaN(parsedId)) return response.status(404).send({Error:"Bad request and Invalid Id"});
   const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   if(findUserIndex===-1) return response.status(404).send({Error:"User doesn't exits"});
   request.findUserIndex=findUserIndex;
   next();
}
app.patch("/api/users/:id",patchUserDetailsById,(request,response)=>{
   const {body,findUserIndex}=request;
   // const {body,params:{id}}=request;
   // const parsedId=parseInt(id);
   // if(isNaN(parsedId)) return response.sendStatus(400);
   // const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   // if(findUserIndex===-1) return response.status(404).send({message:'Bad Request and Invalide Id'});
   mockUsers[findUserIndex]={...mockUsers[findUserIndex],...body};
   return response.sendStatus(200);
});

const deleteUserDetailsById=(request,response,next)=>{
   const {params:{id}}=request;
   const parsedId=parseInt(id);
   if(isNaN(parsedId)) return response.status(404).send({Error:"Bad Request and Invalid Id"});
   const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   if(findUserIndex===-1) return response.status(404).send({Error:"User doesn't exits"});
   request.findUserIndex=findUserIndex;
   next();
}
app.delete("/api/users/:id",deleteUserDetailsById,(request,response)=>{
   const {findUserIndex}=request;
   // const {params:{id}}=request;
   // const parsedId=parseInt(id);
   // if(isNaN(parsedId)) return response.sendStatus(400);
   // const findUserIndex=mockUsers.findIndex((user)=>user.id===parsedId);
   // if(findUserIndex===-1) return response.status(404).send({message:"User doesn't exits"});
   mockUsers.splice(findUserIndex,1);
   return response.sendStatus(200);
})


app.get("/api/products",(request,response)=>{
   response.send([{id:123,name:"Chicken",price:99.09+"$"}])
});


app.listen(PORT,()=>{
   console.log(`Running on port ${PORT}`);
});