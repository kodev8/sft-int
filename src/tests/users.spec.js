const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');

chai.use(sinonChai);
const sandbox = sinon.createSandbox();

const userService = rewire('../services/users.service');
const User = require('../models/users.model');

describe('Testing user service functions', () => {
        let res;
        let req;
        
        let existingUser =  {
            name: 'John Doe Exists',
            email: 'johndoeex@example.com'
        }

        let user = {
            name: 'John Doe',
            email: 'johndoe@example.com'
        }

        let users = [existingUser, user]

        before(() => {
            console.log('Before User Service Tests');
        });

        after(() => {
            console.log('End User Service Tests');    
        });

        beforeEach(() => {

            res = {
                status: sandbox.stub().returnsThis(),
                json: sandbox.stub()
            };

            req = {
                body: {},
                params: {}
            };

        });

        afterEach(() => {
            sandbox.restore();
        });

        describe('createUser', () => {
            it('should create a user if all required fields are present and valid', async () => {
                req.body = user;
    
                sandbox.stub(User, 'findOne').resolves(null);
                sandbox.stub(User.prototype, 'save').resolves();
    
                await userService.createUser(req, res);
    
                expect(res.status.calledWith(201)).to.be.true;
                expect(res.json.calledWith(sinon.match({
                    msg: 'User created',
                    name: user.name,
                    email: user.email
                }))).to.be.true;
            });

    
            it('should return an error if any required fields are missing', async () => {
                req.body.email = user.email;
    
                await userService.createUser(req, res);
    
                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'Name and email are required fields'))).to.be.true;
            });

            it('should return an error if user already exists', async () => {
                req.body = existingUser;
            
                sandbox.stub(User, 'findOne').resolves(existingUser);
    
                await userService.createUser(req, res);

                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'User already exists'))).to.be.true;
            });

            it('should return an error if email is not valid',async () => {
                let incEmail = 'johndoe';
               req.body = {
                     name: user.name,
                     email: incEmail   
                };
                // did not stub the User.findOne method as it should fail before reaching that point
                await userService.createUser(req, res);
                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', `${incEmail} is not a valid email address`))).to.be.true;
            });

        });

        
    
        describe('getAllUsers', () => {
            it('should return all users', async () => {
                sandbox.stub(User, 'find').resolves(users);
                await userService.getAllUsers(req, res);

                expect(res.status.calledWith(200)).to.be.true;
                expect(res.json.calledWith(users)).to.be.true;
            });
        });
    
        describe('getUser', () => {

            it('should return a user if found', async () => {
                req.params.email = user.email;
               
                sandbox.stub(User, 'findOne').resolves(user);
    
                await userService.getUser(req, res);
    
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.json.calledWith(sinon.match({
                    msg: 'User found',
                    ...user
                }))).to.be.true
               
            });

            it('should return an error if user not found', async () => {
                req.params.email = user.email;
                
                sandbox.stub(User, 'findOne').resolves(null);
    
                await userService.getUser(req, res);
    
                expect(res.status.calledWith(404)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'User not found'))).to.be.true;
            });

            it('should return an error if email is not provided', async () => {
               
                sandbox.stub(User, 'findOne').resolves(user);
                await userService.getUser(req, res);

                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'Email is required'))).to.be.true;
            });
        });
    
        describe('removeUser', () => {
            
            it('should remove a user if found', async () => {
                req.body.email = user.email;
                sandbox.stub(User, 'findOne').resolves({ 
                    user,
                    remove: sandbox.stub().resolves() 
                });
    
                await userService.removeUser(req, res);
    
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'User removed'))).to.be.true;
            });
    
            it('should return an error if user not found', async () => {
                req.body.email = user.email;
    
                sandbox.stub(User, 'findOne').resolves(null);
    
                await userService.removeUser(req, res);
    
                expect(res.json.calledWith(sinon.match.has('msg', 'User not found'))).to.be.true;
            });

            it('should return an error if email is not provided', async () => {
                await userService.removeUser(req, res);
                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'Email is required'))).to.be.true;
            });
        });
    
        describe('updateUser', () => {

            let updatedUser = {
                    email: 'johndoe@example.com',
                    name: 'John Doe Updated'
            }

            it('should update a user if found', async () => {
                req.body = updatedUser;
                
                sandbox.stub(User, 'findOneAndUpdate').resolves(updatedUser);
    
                await userService.updateUser(req, res);
    
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.json.calledWith(sinon.match({
                    msg: 'User updated',
                    ...updatedUser
                }))).to.be.true;
            });

    
            it('should return an error if user not found', async () => {

                req.body = updatedUser;

                sandbox.stub(User, 'findOneAndUpdate').resolves(null);
    
                await userService.updateUser(req, res);
    
                expect(res.status.calledWith(404)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'User not found'))).to.be.true;
            });

            it('should return an error if email is not provided', async () => {
                req.body = {
                    name: updatedUser.name
                };
                await userService.updateUser(req, res);
                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith(sinon.match.has('msg', 'Email is required'))).to.be.true;
            });
        });
    });