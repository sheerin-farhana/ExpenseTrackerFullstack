let totalAmount = 0;


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
            addExpenseToUi({ ...expenseObject, id:expenseId });
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
        const expenses = await axios.get('http://localhost:3000/expense/getExpense',{
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
        const response = await axios.post(`http://localhost:3000/expense/deleteExpense/${expenseId}`,null,{
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