'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');
// const Users = require('./models/userSchema');
const {db} = require('./models/index');
const acl = require('./middleware/acl');
const {userModel} = require('./models/index')

const {orderModel} = require('./models/index');
// const { Sequelize, DataTypes } = require('sequelize');

// const POSTGRES_URI = 'postgres://localhost:5432/thaerbraizat';

// // config for prod
// const sequelize = new Sequelize(POSTGRES_URI, {});
// const UserSchema = Users(sequelize, DataTypes);

const app = express();

app.use(express.json());


app.post('/signup', async (req, res, next) => {
    console.log("inside signup !!! ");
    console.log({ body: req.body })
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        console.log("req.body.password :", req.body.password)
        const record = await userModel.create({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });
        console.log("record >>>>> ", record)
        res.json(record);
    } catch (e) {
        console.log(e);
        next('invalid')
        // res.status(500).json({err: 'invalid'})
    }
});


app.post('/signin', basicAuth(userModel), (req, res, next) => {
    res.status(200).json(req.user);
});

// apply the middleware only on protected routes for logged-in users 
app.get('/user', bearerAuth(userModel), (req, res) => {
    res.json(req.user);
})
app.put('/user/:id', bearerAuth(userModel), async(req, res) => {
    let id = parseInt(req.params.id);
    let obj = req.body;
    let found = await userModel.findOne({ where: {id: id} });
 
    let updatedPerson = await found.update(obj);
    res.status(200).json("item deleted !!");
})

app.delete('/user/:id', bearerAuth(userModel), async(req, res) => {

    let id = parseInt(req.params.id);
    let deletedPerson = await userModel.destroy({where: {id: id}});
    res.status(204).json(deletedPerson);
 
})


 // new routes
app.post('/list', bearerAuth(userModel), acl("create") , async(req, res) => {
    let newNote = req.body;
    let note = await orderModel.create(newNote);
    res.status(200).json(note);
  
});

app.put('/list/:id', bearerAuth(userModel), acl("update") , async (req, res) => {
    let id = parseInt(req.params.id);
    let obj = req.body;
    let found = await orderModel.findOne({ where: {id: id} });
    let updatedPerson = await found.update(obj);
    res.status(200).json(updatedPerson);
});

app.delete('/list/:id', bearerAuth(userModel), acl("delete") , async (req, res) => {
    let id = parseInt(req.params.id);
    let deletedPerson = await orderModel.destroy({where: {id: id}});
    res.status(204).json(deletedPerson);
});

app.get('/list/:customerId', bearerAuth(userModel), acl("read") ,  async(req, res) => {
    const customerId = req.params.customerId; 
    console.log(customerId);
    let notes = await orderModel.findAll({ where: {customerId: customerId} });
    res.status(200).json(notes);
});

db.sync().then(() => {
    app.listen(4000, () => console.log('running on 4000'))
}).catch((e) => {
    console.error(e)
});

