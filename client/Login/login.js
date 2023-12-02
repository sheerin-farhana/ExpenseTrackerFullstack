
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
            const userDetails = await axios.post('',loginData);
            
            
        }
        catch (err) {
            alert("An error occurred. Please try again.");
            console.log(err);
        }
    }
});

