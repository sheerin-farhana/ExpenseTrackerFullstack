const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const phoneInput = document.querySelector('#phone-input');
const passwordInput = document.querySelector('#password-input');
const confirmPasswordInput = document.querySelector('#confirm-password-input');

const signupBtn = document.querySelector('#signup-btn');

signupBtn.addEventListener('click',async (e) => {
    e.preventDefault();

    if (validateForm()) {
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        try {
            const userObject = {
                name: name,
                email: email,
                phone: phone,
                password:password
            }
            const users = await axios.post('http://localhost:3000/users/signup', userObject);
            
            console.log(users.data.data);
        }
        catch (err) {
            // check if error exixts and error status is 403
            if (err.response && err.response.status === 403) {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.style.display = "block";
                alertContainer.style.color = "red";
                alertContainer.style.textAlign = "left";
                setTimeout(() => {
                    alertContainer.style.display = "none";
                }, 2000);
            }
            console.error(err);
        }

        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        
    }
        
});

function validateForm() {

    //Check if all fields are entered
    if (nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || passwordInput.value === '' || confirmPasswordInput.value === '') {
        alert("Enter all fields");
        return false;
    }

    //check if phone number is valid
    if (isNaN(phoneInput.value) || phoneInput.value.length !== 10) {
        alert("Enter a valid phone number");
        return false;
    }


    //check if the password and confirm password fields are same
    if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Password and Confirm Password do not match");
        return false;
    }


    return true; // If all validations pass
}
