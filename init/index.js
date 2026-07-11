const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const initdata=require("./data.js");
const MONGODB_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then((res)=>{
        console.log("connection is successfullp created");
    })
    .catch((err)=>{
       console.log(err);
    })
async function main(){
    await mongoose.connect(MONGODB_URL);
}


async function intializedb() {
    await listing.deleteMany({});
    initdata.data = initdata.data.map(d => ({
        ...d,
        owner: "6a1bb99de20a580a02ca530e"
    }));
    await listing.insertMany(initdata.data);
    console.log("successfully intialized database");
}

intializedb();
