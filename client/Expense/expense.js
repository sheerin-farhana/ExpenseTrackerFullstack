let totalAmount = 0;

const buyPremiumBtn = document.getElementById('buy-premium-btn');

function showPremiumFeature() {
    const buyPremiumBtn = document.getElementById('buy-premium-btn');
    const premiumUserContainer = document.getElementById('premium-user-container');
    const premiumContainer = document.getElementById('premium-container');

    buyPremiumBtn.style.display = 'none';
    premiumUserContainer.innerText = "YOU ARE A PREMIUM USER";
    premiumUserContainer.style.color = 'white';
    premiumUserContainer.style.fontSize = "18px";
    premiumUserContainer.style.fontWeight = 'Bold';

    const showLeaderboardBtn = document.createElement('button');
    showLeaderboardBtn.classList.add('btn');
    showLeaderboardBtn.style.backgroundColor = '#2ecc71';
    showLeaderboardBtn.textContent = 'Show Leaderboard';

    

    // Modify the showLeaderboardBtn event listener
showLeaderboardBtn.addEventListener('click', async () => {
    try {
        // Fetch data from the "/leaderboard/api" endpoint
        const response = await axios.get('http://localhost:3000/premium/showLeaderboard');
        const leaderboardData = response.data;

        // Create the leaderboard modal dynamically
        const leaderboardModal = document.createElement('div');
        leaderboardModal.innerHTML = `
            <div class="modal fade" id="leaderboardModal" tabindex="-1" role="dialog" aria-labelledby="leaderboardModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="leaderboardModalLabel">Leaderboard</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Rank</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Total Expense</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderLeaderboardRows(leaderboardData)}
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(leaderboardModal);

        // Show the modal
        $('#leaderboardModal').modal('show');
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
});

// Helper function to render leaderboard rows
function renderLeaderboardRows(data) {
    return data.map((entry, index) => `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${entry.name}</td>
            <td>${entry.totalCost}</td>
        </tr>
    `).join('');
}


    premiumContainer.appendChild(showLeaderboardBtn);

}

const isPremiumUser = localStorage.getItem('isPremiumUser');
console.log(isPremiumUser);

if (isPremiumUser != "null" && isPremiumUser) {
    showPremiumFeature();
}



const addExpenseBtn = document.querySelector('#add-expense-btn');

addExpenseBtn.addEventListener("click", async function (e) {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    // Add the expense
    await addExpense({ amount, category, description });
});

async function addExpense(expenseObject) {
    try {
        const token = localStorage.getItem('token');
        const { amount, category, description } = expenseObject;
        const expense = await axios.post('http://localhost:3000/expense/insertExpense',
            {
                amount,
                category,
                description,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + token //the token is a variable which holds the token
                }
            });

        const expenseId = expense.data.data.id;
        if (expense.status === 200) {
            addExpenseToUi({ ...expenseObject, id: expenseId });
            updateTotalAmount(token);
        } else {
            console.log("Response status", expense.status);
        }

    }
    catch (err) {
        console.log('Error adding expense:', err);
        alert('Error adding expense. Please try again.');
    }
}

function addExpenseToUi(expenseObject) {
    const { id, amount, category, description } = expenseObject;

    // Create a new expense item
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.setAttribute('data-id', id);

    // Display the expense details
    expenseItem.innerHTML = `
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Description:</strong> ${description}</p>
        <button class="btn btn-danger" onclick="deleteExpense(this, ${amount})" data-id=${id}>Delete</button>
    `;

    // Append the expense item to the expense list
    document.getElementById('expenseList').appendChild(expenseItem);

    // Clear the form
    document.getElementById('expenseForm').reset();
}

async function updateTotalAmount(token) {

    let totalAmount = 0;
    const totalAmountInput = document.querySelector('#totalAmount');

    const expenses = await axios.get('http://localhost:3000/expense/getExpense', {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    });
    const expenseData = expenses.data.expense;

    expenseData.forEach(expense => {
        console.log(expense.ExpenseAmt);
        totalAmount += Number(expense.ExpenseAmt);
    });

    totalAmountInput.innerText = `Total Amount: $${totalAmount.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", async () => {



    try {
        const token = localStorage.getItem('token');
        const expenses = await axios.get('http://localhost:3000/expense/getExpense', {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        });

        const expenseData = expenses.data.expense;

        expenseData.forEach(expense => {
            const amount = expense.ExpenseAmt;
            const category = expense.Category;
            const description = expense.Description;
            const id = expense.id;

            // Call addExpenseToUI with the current totalAmount
            addExpenseToUi({ id, amount, category, description });

        });
        updateTotalAmount(token);
    }
    catch (err) {
        console.log('Error fetching expenses:', err);
    }

});

async function deleteExpense(button) {
    const expenseId = button.getAttribute('data-id');
    const token = localStorage.getItem('token');

    if (!expenseId) {
        console.error('Expense ID is undefined.');
        return;
    }

    try {
        const response = await axios.post(`http://localhost:3000/expense/deleteExpense/${expenseId}`, null, {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable that holds the token
            }
        });

        if (response.status !== 200) {
            // Handle the case where the delete request was not successful
            alert(`Failed to delete expense ${response.status}`);
            console.error('Failed to delete expense:', response.status);
            return;
        }

        updateTotalAmount(token);

        // Remove the parent expense item when the delete request is successful
        button.parentNode.remove();

    }
    catch (err) {
        console.error('Error deleting expense:', err);
        alert('Error deleting expense. Please try again.');
    }
}


document.getElementById('buy-premium-btn').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            alert("You are a premium user");
            showPremiumFeature();

        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        console.log(response);
        await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: null, // Indicate payment failure
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        alert("Something went wrong");
    });

}

document.getElementById('nav-signout-btn').addEventListener("click", (e) => {
    e.preventDefault();
    // alert("its working");
    window.location.href = '../Login/login.html';
});
