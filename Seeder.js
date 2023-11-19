const UserModel=require("./Models/users");
const bcrypt=require("bcrypt");
function hashPassword(password) {
    return bcrypt.hashSync(password, 6);
  }
async function UserSeeder() {
    await UserModel.deleteMany({}).then(async (result) => {
        password = await hashPassword('11112222');
        UserModel.create({username:'Faizan zia',email:"Faizanzia472@gmail.com",age:23,GaveTicket:true,
        isAdmin:true,Token:"ADMIN",Password:password});
    }).catch((err) => {
        console.log(err);
    });
}

UserSeeder();
