
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click',async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    const loginData = {
        email: email,
        password: password
    };

    if (email === '' ||password === '') {
        alert("Enter all fields");
    }
    else {
        try {
            const userDetails = await axios.post('http://localhost:3000/users/login', loginData);

            if (userDetails.data.success === true) {
                alert(userDetails.data.message);
            }
            else {
                alert(userDetails.data.message);
            }
            
        }
        catch (err) {
            alert("An error occurred. Please try again.");
            console.log(err);
        }
    }
});

