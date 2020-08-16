import { SchemaType, DBService } from '../services/db.service'
import { User } from '../services/user.service'
import { Application } from '../services/application.service'
import IUser from '../models/IUser'
import { expect } from 'chai';
import { db } from '../config';


describe('DBService', () => {
    let dbService: DBService;
    const user1: IUser = {
        fname: "Vishwas",
        lname: "Anand",
        username: "vishwas123",
        password: "hello",
        email: "vishu.anand1@gmail.com",
        phoneNumber: "9444023232",
        id: "User123",
        publicKey: "ak_1231KDSDDWE",
        privateKey: "ecf7152958692782d3"
    }

    let totalRecords  = 0

    beforeEach(()=>{
        dbService = new DBService();
    })

    // it('should drop the user table', async () => {
    //     const res = await dbService.dropTable(schemaType.USER)    
    //     expect(res).to.equal('SUCCESS');
    // })

    // it('should create user table', async () => {
    //     const res = await dbService.createTable(schemaType.USER)    
    //     expect(res).to.equal('SUCCESS');
    // })
// return
    // it('should throw an error since table is already created', async () => {
    //     expect(await dbService.createTable(schemaType.USER)).to.throw('FAIL: Error in dropping db')
    // })
 
    it('should insert a user in user table', async ()=> {
        const newUser =  new User({...user1});
        const userInDb = await newUser.create()
        console.log(userInDb)

        const newApp =  new Application({appId: "hello", appSecret: "hi", name: "newApp001"});
        const appInDb  =  await newApp.create()
        console.log(appInDb)
        const old =  await newApp.fetch();
        console.log(old)
        
        
        // expect(userInDb.publicKey).equal(newUser.publicKey)
    })

    return;
    it('should fetch the user which got created in the last test', async () =>{

        const user: IUser = await dbService.getOne(SchemaType.User, { publicKey: user1.publicKey});
        expect(user.username).equal(user1.username)
        expect(user.publicKey).equal(user1.publicKey)
    })

    it('should delete a user', async()=> {
        await dbService.delete(SchemaType.User, { publicKey: user1.publicKey});
        const rows: Array<IUser> = await dbService.get(SchemaType.User,{});
        expect(rows.length).lessThan(totalRecords)
        totalRecords = rows.length
    })

    it('should insert another user in user table', async ()=> {
        user1.publicKey = user1.publicKey + "ssdasdsdd";
        const newUser =  new User({...user1});
        const res:IUser = await dbService.add(SchemaType.User, newUser)
        totalRecords = totalRecords + 1;
        expect(res.publicKey).equal(newUser.publicKey)
    })

    it('should NOT insert same user in user table', async ()=> {
        const newUser =  new User({...user1});
        await expect(dbService.add(SchemaType.User, newUser)).to.throw('/Error/g')
    })

    it('should fetch all users from user table', async ()=> {
        const rows: Array<IUser> = await dbService.get(SchemaType.User,{});
        expect(rows.length).equals(totalRecords)
    })
})