const { response } = require("express");

function validateForm() {
    // Validation for Firstname and secondtname (Allow only letters and spaces)
    var nameRegex = /^[a-zA-Z]+$/;
    var firstName = document.getElementById('first-name').value;
    var secondName = document.getElementById('second-name').value;

    if (!nameRegex.test(firstName)) {
        document.getElementById('firstnameError').innerHTML = 'Please enter a valid Firstname.';
        document.getElementById('firstnameError').style.display = 'block';
        return false;
    } else {
        document.getElementById('firstnameError').style.display = 'none';
    }

    if (!nameRegex.test(secondName)) {
        document.getElementById('secondnameError').innerHTML = 'Please enter a valid secondname.';
        document.getElementById('secondnameError').style.display = 'block';
        return false;
    } else {
        document.getElementById('secondnameError').style.display = 'none';
    }


    // Validation for Email
    var emailRegex = /^\S+@gmail\.com$/;
    var email = document.getElementById('Email').value;

    if (!emailRegex.test(email)) {
        document.getElementById('emailError').innerHTML = 'Please enter a valid Email address.';
        document.getElementById('emailError').style.display = 'block';
        return false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    // Validation for Mobile number (Allow only digits, and a length of 10)
    var mobileRegex = /^\d{10}$/;
    var mobile = document.getElementById('Mobile').value;

    if (!mobileRegex.test(mobile)) {
        document.getElementById('mobileError').innerHTML = 'Please enter a valid Mobile number.';
        document.getElementById('mobileError').style.display = 'block';
        return false;
    } else {
        document.getElementById('mobileError').style.display = 'none';
    }



    // Validation for Password and Confirm Password
    var passwordRegex = /^.{8,}$/;
    var password = document.getElementById('Password').value;
    if (!passwordRegex.test(password)) {
        document.getElementById('passwordError').innerHTML = 'Password must contain 8 characters';
        document.getElementById('passwordError').style.display = 'block';
        return false;
    } else {
        document.getElementById('passwordError').style.display = 'none';
    }

    var ConfirmPassword = document.getElementById('ConfirmPassword').value;

    if (password !== ConfirmPassword) {
        document.getElementById('passwordMatchError').style.display = 'block';
        document.getElementById('passwordMatchError').innerHTML = 'Passwords do not match.';
        return false;
    } else {
        document.getElementById('passwordMatchError').style.display = 'none';
    }

    return true;
}






