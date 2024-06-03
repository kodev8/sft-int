const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const request = require('supertest');

const sandbox = sinon.createSandbox();

let app = rewire('../index');
const User = require('../models/users.model');

describe('Testing routes on /users', () => {
    let john;
    let jane;

    afterEach(() => {
        app = rewire("../index");
        sandbox.restore();
      });

     beforeEach(() => {

            john = {
                name: 'John Doe',
                email: 'johndoe@example.com',
            };
        
            jane = {
                name: 'Jane Doe',
                email: 'janedoe@example.com'
            };
        })
   
    describe('GET /users', () => {
        let john;
        let jane;
        
        beforeEach(() => {
            // let getUsersStub;

            john = {
                name: 'John Doe',
                email: 'johndoe@example.com',
            };
        
            jane = {
                name: 'Jane Doe',
                email: 'janedoe@example.com'
            };
            // Stubbing userService.getAllUsers
            sandbox.stub(User, 'find').resolves([john, jane]);
            sandbox.stub(User, 'findOne').resolves(john);

        });


        it('should return all users', async () => {
            const response = await request(app).get('/users');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(2);
            expect(response.body[0]).to.deep.equal(john);
            expect(response.body[1]).to.deep.equal(jane);
        });

    });

    
    describe('GET /users/:email', () => {
        
        it('should return a user by email', async () => {
            sandbox.stub(User, 'findOne').resolves(john);
            const response = await request(app).get(`/users/${john.email}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({
                ...john,
                msg: 'User found'
            });
        })
      

        it('should return 404 if user is not found', async () => {
            sandbox.stub(User, 'findOne').resolves(null);
            const response = await request(app).get(`/users/${jane.email}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.deep.equal({msg: 'User not found'});
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            sandbox.stub(User.prototype, 'save').resolves(john);
            sandbox.stub(User, 'findOne').resolves(null);

            const response = await request(app).post('/users').send(john);
            expect(response.status).to.equal(201);
            expect(response.body).to.deep.equal({
                msg: 'User created',
                ...john
            });
        });

        it('should return an error (400) if any required fields are missing', async () => {
            const response = await request(app).post('/users').send({});
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({msg: 'Name and email are required fields'});
        });

        it('should return an error (400) if email is invalid', async () => {
            const response = await request(app).post('/users').send({
                name: 'John Doe',
                email: 'johndoe'
            });
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({msg: 'johndoe is not a valid email address'});
        });

        it('should return an error (400) if user already exists', async () => {
            sandbox.stub(User, 'findOne').resolves(john);
            const response = await request(app).post('/users').send(john);
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({msg: 'User already exists'});
        });      
    });

    describe('DELETE /users', () => {
        it('should delete a user', async () => {
            sandbox.stub(User, 'findOne').resolves(User.prototype);
            sandbox.stub(User.prototype, 'remove').resolves();

            const response = await request(app).delete('/users').send({email: john.email});
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({msg: 'User removed'});
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app).delete('/users').send({});
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({msg: 'Email is required'});
        });

        it('should return 404 if user is not found', async () => {
            sandbox.stub(User, 'findOne').resolves(null);
            const response = await request(app).delete('/users').send({email: jane.email});
            expect(response.status).to.equal(404);
            expect(response.body).to.deep.equal({msg: 'User not found'});
        });
    });

    describe('PATCH /users', () => {
        it('should update a user', async () => {
            sandbox.stub(User, 'findOneAndUpdate').resolves(john);
            sandbox.stub(User.prototype, 'save').resolves();

            const response = await request(app).patch('/users').send(john);
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({msg: 'User updated', ...john});
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app).patch('/users').send({});
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({msg: 'Email is required'});
        });

        it('should return 404 if user is not found', async () => {
            sandbox.stub(User, 'findOneAndUpdate').resolves(null);
            const response = await request(app).patch('/users').send(jane);
            expect(response.status).to.equal(404);
            expect(response.body).to.deep.equal({msg: 'User not found'});
        });
    });

       
});
