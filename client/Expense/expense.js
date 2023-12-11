let totalAmount = 0;

const buyPremiumBtn = document.getElementById('buy-premium-btn');
const premiumDiv = document.getElementById('premiumdiv');
const normalDiv = document.getElementById('normaldiv');
function showPremiumFeature() {
    const buyPremiumBtn = document.getElementById('buy-premium-btn');
    const premiumUserContainer = document.getElementById('premium-user-container');
    const premiumContainer = document.getElementById('premium-container');
    const downloadReportBtn = document.getElementById('completedownloadbtn');

    downloadReportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const expenseReport = document.getElementById('expense-report');
        expenseReport.innerHTML = `<!-- Master Heading -->
        <h1 class="text-center mb-4">Expense Report</h1>
    
        <!-- Monthly Report - March 2023 -->
        <h2 class="mb-3">Monthly Report - March 2023</h2>
        <table class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Expense ($)</th>
            </tr>
            </thead>
            <tbody>
            <!-- Add your monthly expense data here -->
            <tr>
                <td>2023-03-01</td>
                <td>Groceries</td>
                <td>Food</td>
                <td>50</td>
            </tr>
            <tr>
                <td>2023-03-05</td>
                <td>Transportation</td>
                <td>Travel</td>
                <td>30</td>
            </tr>
            <!-- Add more rows as needed -->
            </tbody>
        </table>
    
        <!-- Yearly Expenses - 2023 -->
        <h2 class="mb-3">Yearly Expenses - 2023</h2>
        <table class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Month</th>
                <th>Expenses ($)</th>
                <th>Income ($)</th>
                <th>Savings ($)</th>
            </tr>
            </thead>
            <tbody>
            <!-- Add your yearly expense data here -->
            <tr>
                <td>January</td>
                <td>200</td>
                <td>1000</td>
                <td>800</td>
            </tr>
            <tr>
                <td>February</td>
                <td>150</td>
                <td>1200</td>
                <td>1050</td>
            </tr>
            <!-- Add more rows as needed -->
            </tbody>
        </table>`

    })

    premiumDiv.classList.remove('d-none');
    premiumDiv.classList.add('d-block');

    normalDiv.classList.remove('d-none');
    normalDiv.classList.add('d-block');


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
        leaderboardModal.innerHTML = `<div class="modal fade" id="leaderboardModal" tabindex="-1" aria-labelledby="leaderboardModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header float-right">
              <h5 class="modal-title text-center">Leaderboard</h5>
              <div class="text-right">
                <i data-dismiss="modal" aria-label="Close" class="fa fa-close"></i>
              </div>
            </div>
            <div class="modal-body">
                
      
      
              <div>
                
                <table class="table table-bordered ">
        <thead>
          <tr class="table-success">
            <th scope="col">Rank</th>
            <th scope="col">User</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          ${renderLeaderboardRows(leaderboardData)};
        </tbody>
      </table>
      
              </div>
      
      
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`;
        
       
        document.body.appendChild(leaderboardModal);

        // Show the modal
        // $('#leaderboardModal').modal('show');


        const leaderboardModalShow = new bootstrap.Modal(document.getElementById('leaderboardModal'));
        leaderboardModalShow.show();
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
});

// Helper function to render leaderboard rows
function renderLeaderboardRows(data) {
    return data.map((entry, index) => `
        <tr>
            <th class="table-danger" scope="row">${index + 1}</th>
            <td class="table-info">${entry.Name}</td>
            <td class="table-warning">${entry.TotalExpenses}</td>
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
            addExpenseToUi(expense.data.data);
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
    const { id, ExpenseAmt, Category, Description } = expenseObject;

    // Create a new expense item
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.setAttribute('data-id', id);

    // Display the expense details
    expenseItem.innerHTML = `
        <p><strong>Amount:</strong> $${ExpenseAmt}</p>
        <p><strong>Category:</strong> ${Category}</p>
        <p><strong>Description:</strong> ${Description}</p>
        <button class="btn btn-danger" onclick="deleteExpense(this)" data-id=${id}>Delete</button>
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
            console.log(expense);
            addExpenseToUi(expense);

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
