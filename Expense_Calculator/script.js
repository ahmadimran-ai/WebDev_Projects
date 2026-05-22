const balanceEl = document.getElementById("balance");

const incomeAmountEl =
    document.getElementById("income-amount");

const expenseAmountEl =
    document.getElementById("expense-amount");

const transactionListEl =
    document.getElementById("transaction-list");

const transactionFormEl =
    document.getElementById("transaction-form");

const descriptionEl =
    document.getElementById("description");

const amountEl =
    document.getElementById("amount");

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

transactionFormEl.addEventListener(
    "submit",
    addTransaction
);

function addTransaction(e) {
    e.preventDefault();

    const description =
        descriptionEl.value.trim();

    const amount = parseFloat(amountEl.value);

    if (description === "" || isNaN(amount)) {
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateTransactionList();

    updateSummary();

    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";

    const reversedTransactions = [
        ...transactions,
    ].reverse();

    reversedTransactions.forEach(
        (transaction) => {
            const li =
                createTransactionElement(transaction);

            transactionListEl.appendChild(li);
        }
    );
}

function createTransactionElement(
    transaction
) {
    const li = document.createElement("li");

    li.classList.add("transaction");

    li.classList.add(
        transaction.amount > 0
            ? "income"
            : "expense"
    );

    li.innerHTML = `
    <span>${transaction.description}</span>

    <span>
      ${formatCurrency(transaction.amount)}

      <button
        class="delete-btn"
        onclick="removeTransaction(${transaction.id})"
      >
        ×
      </button>
    </span>
  `;

    return li;
}

function updateSummary() {
    const balance = transactions.reduce(
        (acc, transaction) =>
            acc + transaction.amount,
        0
    );

    const income = transactions
        .filter(
            (transaction) =>
                transaction.amount > 0
        )
        .reduce(
            (acc, transaction) =>
                acc + transaction.amount,
            0
        );

    const expenses = transactions
        .filter(
            (transaction) =>
                transaction.amount < 0
        )
        .reduce(
            (acc, transaction) =>
                acc + transaction.amount,
            0
        );

    balanceEl.textContent =
        formatCurrency(balance);

    balanceEl.style.color =
        balance >= 0
            ? "#17281d"
            : "#ef4444";

    incomeAmountEl.textContent =
        formatCurrency(income);

    expenseAmountEl.textContent =
        formatCurrency(expenses);
}

function removeTransaction(id) {
    transactions = transactions.filter(
        (transaction) =>
            transaction.id !== id
    );

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateTransactionList();

    updateSummary();
}

function formatCurrency(number) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        }
    ).format(number);
}

updateTransactionList();

updateSummary();