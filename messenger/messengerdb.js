const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbJack:oroXINBEBT8uLFdk@messengerdb.heiib.mongodb.net/messenger?retryWrites=true&w=majority";
const mongodbclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;
mongodbclient.connect( (err,connection) => {
    if(err) throw err;
    console.log("Connected to the MongoDB cluster!");
    db = connection.db();
})
const dbIsReady = ()=>{
    return db != null;
};
const getDb = () =>{
    if(!dbIsReady())
        throw Error("No database connection");
    return db;
}
const  checklogin = async (username,password)=>{
    //your implementation
    var users = getDb().collection("users");
    var user = await users.findOne({username:username,password:password});
    if (user!=null && user.username==username){
        console.log("Debug>messengerdb.checklogin-> user found:\n" +
        JSON.stringify(user))
        return true
    }
    else {
        return false
    }
}

const addUser = async (username,password)=>{
    //your implementation
    var users = getDb().collection("users");
    var user = await users.findOne({username:username});
    if (user!=null && user.username==username){
        console.log(`Debug>messengerdb.addUser: Username '${username}' exists!`);
        return "UserExist";
    }
    else {
        const newUser = {"username": username,"password" : password}
        try{
            const result = await users.insertOne(newUser);
            if(result!=null){
            console.log("Debug>messengerdb.addUser: a new user added: \n", result);
            return "Success";
        }
        }catch{
            console.log("Debug>messengerdb.addUser: error for adding '" +
            username +"':\n", err);
            return "Error";
        }
    }
}

const storePublicChat = (receiver,message)=>{
    console.log("DEBUG>> Storing Private message to MongoDB");
    //TODO: validate the data
    let timestamp = Date.now();
    let chat = {receiver: receiver, message:message, timestamp:timestamp};
    try{
        const inserted = getDb().collection("public_chat").insertOne(chat);
        if(inserted!=null){
            console.log("Debug>messengerdb.storePublicChat: a new chat message added: \n", JSON.stringify(chat));
    }
    }catch{
        console.log("Debug>messengerdb.storePublicChat: error for adding '" +
            JSON.stringify(chat) +"'\n");
    }
}
const loadChatHistory = async (receiver, limits=100)=> {
    var chat_history = await getDb().collection("public_chat").find(
        {receiver:receiver}).sort({timestamp:-1}).limit(limits).toArray();
        //print debug info e.g., using JSON.stringify(chat_history)
        if (chat_history && chat_history.length > 0) return chat_history
}


module.exports = {checklogin,addUser, storePublicChat, loadChatHistory};