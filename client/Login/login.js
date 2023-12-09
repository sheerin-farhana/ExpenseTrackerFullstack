
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const loginBtn = document.querySelector('#login-btn');
const forgotPasswordBtn = document.getElementById('forgot-password-button');

// forgotPasswordBtn.addEventListener("click", async () => {
//         const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgot-password-modal'));
//     forgotPasswordModal.show();
    
//     const emailId = document.getElementById('forgot_pass_email');
//     const saveChanges = document.getElementById('save-changes');

//     saveChanges.addEventListener("click",async (e) => {
//         e.preventDefault();
//         const emailData = await axois.post('http://localhost:3000/password/forgotPassword', { email: emailId });
//         console.log(emailData);
//         forgotPasswordModal.hide();
//     })
    
    

// });

forgotPasswordBtn.addEventListener("click", async () => {
    const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgot-password-modal'));
    forgotPasswordModal.show();

    const emailId = document.getElementById('forgot_pass_email');
    const saveChanges = document.getElementById('save-changes');

    saveChanges.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const emailData = await axios.post('http://localhost:3000/password/forgotPassword', { email: emailId.value });
            console.log(emailData);
            const modalInstance = new bootstrap.Modal(document.getElementById('forgot-password-modal'));
            modalInstance.hide();
        } catch (error) {
            console.error(error);
        }
    });
});

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

            if (userDetails.data.success) {
                alert(userDetails.data.message);
                localStorage.setItem('token', userDetails.data.token);
                localStorage.setItem('isPremiumUser', userDetails.data.isPremiumUser);
                window.location.href = '../Expense/expense.html';
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

