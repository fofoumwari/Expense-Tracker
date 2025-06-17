// Load from localStorage or use initial dummy data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [
    {
      id: Date.now(),
      description: "Groceries",
      amount: -50,
      date: "2025-06-17"
    },
    {
      id: Date.now() + 1,
      description: "Salary",
      amount: 300,
      date: "2025-06-15"
    },
    {
      id: Date.now() + 2,
      description: "Rent",
      amount: -10,
      date: "2025-06-16"
    }
  ];
  
  // Elements
  const expenseList = document.getElementById('expense-list');
  const totalBalance = document.getElementById('total-balance');
  const addBtn = document.getElementById('add-expense-btn');
  const descInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const filterDate = document.getElementById('filter-date');
  const filterMinAmount = document.getElementById('filter-min-amount');
  const filterMaxAmount = document.getElementById('filter-max-amount');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  let editingId = null;
  
  // Save to localStorage
  function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }
  
  // Render all expenses and update total
  function updateExpenseList() {
    expenseList.innerHTML = '';
    let balance = 0;
  
    let filteredExpenses = expenses;
  
    const filterDateValue = filterDate.value;
    const minAmount = parseFloat(filterMinAmount.value);
    const maxAmount = parseFloat(filterMaxAmount.value);
  
    // Apply filters
    if (filterDateValue) {
      filteredExpenses = filteredExpenses.filter(e => e.date === filterDateValue);
    }
  
    if (!isNaN(minAmount)) {
      filteredExpenses = filteredExpenses.filter(e => e.amount >= minAmount);
    }
  
    if (!isNaN(maxAmount)) {
      filteredExpenses = filteredExpenses.filter(e => e.amount <= maxAmount);
    }
  
    filteredExpenses.forEach(exp => {
      balance += exp.amount;
  
      const item = document.createElement('div');
      item.className = 'expense-item';
      item.innerHTML = `
        <p><strong>${exp.description}</strong></p>
        <p>${exp.date}</p>
        <p style="color:${exp.amount < 0 ? 'red' : 'green'}">$${exp.amount.toFixed(2)}</p>
        <button onclick="editExpense(${exp.id})">Edit</button>
        <button onclick="deleteExpense(${exp.id})">Delete</button>
      `;
      expenseList.appendChild(item);
    });
  
    totalBalance.textContent = `$${balance.toFixed(2)}`;
  }
  
  // Add or Update expense
  addBtn.addEventListener('click', () => {
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
  
    if (!desc || isNaN(amount) || !date) {
      alert("Please fill all fields with valid values.");
      return;
    }
  
    if (editingId !== null) {
      // Update existing expense
      const index = expenses.findIndex(e => e.id === editingId);
      if (index !== -1) {
        expenses[index] = {
          ...expenses[index],
          description: desc,
          amount: amount,
          date: date
        };
      }
      editingId = null;
      addBtn.textContent = "Add Expense";
    } else {
      // Add new expense
      const newExpense = {
        id: Date.now(),
        description: desc,
        amount: amount,
        date: date
      };
      expenses.push(newExpense);
    }
  
    saveExpenses();
    updateExpenseList();
  
    // Clear form
    descInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
  });
  
  // Edit expense
  function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
  
    descInput.value = expense.description;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;
  
    editingId = id;
    addBtn.textContent = "Update Expense";
  }
  
  // Delete expense
  function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    updateExpenseList();
  }
  
  // Filter listeners
  filterDate.addEventListener('input', updateExpenseList);
  filterMinAmount.addEventListener('input', updateExpenseList);
  filterMaxAmount.addEventListener('input', updateExpenseList);
  
  clearFiltersBtn.addEventListener('click', () => {
    filterDate.value = '';
    filterMinAmount.value = '';
    filterMaxAmount.value = '';
    updateExpenseList();
  });
  
  // Optionally run it on page load
  updateExpenseList();
  