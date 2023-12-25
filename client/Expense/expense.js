// let totalAmount = 0;


const buyPremiumBtn = document.getElementById('buy-premium-btn');
function showPremiumFeature() {

    const premiumUserContainer = document.getElementById('premium-user-container');
    const downloadReportBtn = document.getElementById('download-report--btn');
    const showDownloadFilesBtn = document.getElementById('show-files-btn');

    downloadReportBtn.classList.remove('d-none');


    downloadReportBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {

            const response = await axios.get('http://localhost:3000/expense/download', {
                headers: {
                    Authorization: 'Bearer ' + token //the token is a variable which holds the token
                }
            });

            if (response.status === 200) {
                var a = document.createElement('a');
                a.href = response.data.fileURL;
                a.download = 'myexpense.txt';
                a.click();
            }
        }
        catch (err) {
            console.log(err);
        }


    });

    showDownloadFilesBtn.classList.remove('d-none');

    showDownloadFilesBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const downloadedFilesResponse = await axios.get('http://localhost:3000/expense/filesdownloaded', {
                headers: {
                    Authorization: 'Bearer ' + token //the token is a variable which holds the token
                }
            });
            const downloadedFiles = downloadedFilesResponse.data.downloadedExpenses;
            const expenseReport = document.getElementById('expense-report');
            expenseReport.classList.remove('d-none');

            const tableBody = expenseReport.querySelector('tbody');
            downloadedFiles.forEach(file => {
                const row = document.createElement('tr');

                // Assuming each item in downloadedFiles has fileURL and createdAt properties
                const fileURLCell = document.createElement('td');
                fileURLCell.textContent = file.fileURL;
                row.appendChild(fileURLCell);

                const createdAtCell = document.createElement('td');
                createdAtCell.textContent = file.createdAt; // Adjust the date formatting as needed
                row.appendChild(createdAtCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });

        }
        catch (err) {
            console.log(err);
            alert('Error => something went wrong line 47');
        }
    })



    buyPremiumBtn.style.display = 'none';
    premiumUserContainer.innerText = "PREMIUM USER";
    premiumUserContainer.style.color = 'green';
    premiumUserContainer.style.fontFamily = 'Cinzel';
    premiumUserContainer.style.fontSize = "24px";
    premiumUserContainer.style.fontWeight = 'Bold';

    const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
    showLeaderboardBtn.classList.remove('d-none');
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


    // premiumContainer.appendChild(showLeaderboardBtn);

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
            // addExpenseToUi(expense.data.data);
            // updateTotalAmount(token);
            alert("expense added");
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

    // Clear the form
    document.getElementById('expenseForm').reset();

    return expenseItem; // Return the expense item
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


    let hasMoreExpenses = false;
    let hasPreviousExpenses = false;

    const isPremiumUser = localStorage.getItem('isPremiumUser');
    const token = localStorage.getItem('token');

    if (isPremiumUser != "null" && isPremiumUser) {
        showPremiumFeature();
    }

    const currentPageBtn = document.querySelector('#currentPage');
    const nextPageBtn = document.querySelector('#nextPage');
    const prevPageBtn = document.querySelector('#prevPage');

    prevPageBtn.addEventListener('click', onclickprevpage);
    nextPageBtn.addEventListener('click', onclicknextpage);

    let currentPage = 1;
    let noitem = 5;

    // Function to handle the click on the "Previous" button
    async function onclickprevpage() {
        if (currentPage > 1) {
            currentPage--;
            await refresh();
            updateTotalAmount(token);
        }
    }

    // Function to handle the click on the "Next" button
    async function onclicknextpage() {
        if (hasMoreExpenses) {
            currentPage++;
            await refresh();
            updateTotalAmount(token);
        }
    }

    // Function to refresh and fetch expenses based on the current page and limit
    async function refresh() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/expense/getexpensesperpage?page=${currentPage}&noitem=${noitem}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            console.log("EXPENSE DATA", response.data);
            showOutput(response.data);
            updatePageNumber();
        } catch (err) {
            console.log(err);
            alert('Error: Something went wrong');
        }
    }

    // Function to update the page number and buttons based on the current state
    function updatePageNumber() {
        currentPageBtn.textContent = currentPage;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = !hasMoreExpenses;
    }

    // Function to show the fetched expenses in the UI
    // function showOutput(response) {
    //     hasMoreExpenses = response.hasMoreExpenses;
    //     hasPreviousExpenses = response.hasPreviousExpenses;

    //     response.expenses.forEach(expense => {
    //         console.log("seperate expenses", expense);

    //         addExpenseToUi(expense)

    //     });
        
    // }

    // Function to show the fetched expenses in the UI
function showOutput(response) {
    hasMoreExpenses = response.hasMoreExpenses;
    hasPreviousExpenses = response.hasPreviousExpenses;

    // Accumulate expense items
    const expenseItems = [];

    // Assuming you have a function like addExpenseToUi to display the expenses
    response.expenses.forEach(expense => {
        const expenseItem = addExpenseToUi(expense);
        expenseItems.push(expenseItem);
    });

    // Append all expense items to the expenseList
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = ''; // Clear existing expenses
    expenseItems.forEach(item => expenseList.appendChild(item));

    // Update the page number and buttons based on the current state
    updatePageNumber();
}


    // Initial load
    await refresh();
    updateTotalAmount(token);
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
