const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;

const User = require('../models/users.model');

describe('User model', () => {
    let user;

    beforeEach(() => {
        user = {
            name: 'John Doe',
            email: 'johndoe@email.com'
        };
    }
    );
    

    it('should throw an error if any of the required fields are missing', (done) => {
        new User().validate((err) => {
            expect(err).to.be.instanceOf(ValidationError)
            expect(err.errors.name).to.exist;
            expect(err.errors.email).to.exist;
            done();
        });
    })

    it('should throw an error if email is not valid', (done) => {
        user.email = 'johndoe';
        new User(user).validate((err) => {

            if (err) {
                expect(err).to.be.instanceOf(ValidationError);
                expect(err.errors.email).to.exist;
                done();
            }else {
                const shoudNotSucceedError = new Error('This should not be successful');
                done(shoudNotSucceedError);
            }
        });
    });

    it('should create a user if all required fields are present and valid', (done) => {

        let newuser = User(user);
        
        newuser.validate((err) => {

            if (err) {
                const shouldNotFailError = new Error('This should not fail');
                done(shouldNotFailError);
            }else{
                expect(newuser).to.be.instanceOf(User);
                expect(newuser.name).to.equal('John Doe');
                expect(newuser.email).to.equal('johndoe@email.com');
                done();
            }
            
        });
    })

   
});