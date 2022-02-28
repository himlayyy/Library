// Represent a book
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author,
            this.pages = pages,
            this.read = read;
        this.id = Date.now().toString()
    }
}
//  ${book.read === "on" ? "checked" : "unchecked"}
// UI Class: tasks
class UI {
    static displayBooks() {
        let books = Store.getBooks();
        books.forEach(book => UI.addBookToList(book));
    };
    static addBookToList(book) {
        const grid = document.querySelector("#card-grid");
        const card = document.createElement("div")
        card.classList.add("col")
        card.classList.add("p-2", "m-2")
        card.setAttribute("id", `${book.id}`)
        card.innerHTML = `<div class="card p-3 h-100">
                        <div class="card-block">
                            <h4 class="card-title">${book.title}</h4>
                            <h6 class="card-subtitle text-muted">By: ${book.author}</h6>
                            <p class="card-text p-y-1">Pages: ${book.pages}</p>
                            <div class="form-check form-switch">
                            
                            <label class="form-check-label" for="flexSwitch"><Default switch checkbox >Read</label>
                            <input class="form-check-input switch" type="checkbox" id="flexSwitchCheckDefault"  ${book.read == true ? "checked" : "unchecked"}>
                           
                            </div>
                            <a href="#" class="btn btn-outline-danger card-link delete">Delete</a>                            
                        </div>
                    </div>`
        
        grid.appendChild(card);
    }
    static deleteBook(el) {
        document.getElementById(el).remove();
    }
    static showAlert(message, className) {
        let form = document.querySelector("#book-form");
        let alert = document.createElement("div");
        alert.className = `alert alert-${className}`;
        alert.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>${message}`;
        form.appendChild(alert);

        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
    static trackCards() {
        let cards = document.querySelectorAll(".card")
        cards.forEach(card => card.addEventListener('click', (e) => {
            UI.deleteBook(e.target);
            UI.showAlert('Removed book', 'dark')
        })
        )
    }
    static formReset() {
        let form = document.querySelector("#book-form");
        form.reset();
    }
}

// Store Class: Library storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(id) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.id === id) {
                books.splice(index, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
    static changeRead(id, read){
        const books = Store.getBooks();
        books.forEach((book) => {
            if (book.id == id){
                book.read = read;
            };
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.querySelector('DOMContentLoaded', UI.displayBooks())

// Event: Add book
document.querySelector("#add-btn").addEventListener("click", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const read = document.querySelector("#read").checked;
  
    let book = new Book(title, author, pages, read);

    UI.addBookToList(book)
    Store.addBook(book);
    UI.showAlert('Book added', 'success');
    UI.formReset();
})
// Event: Remove Book
document.addEventListener("click", (e) => {    
    if (e.target.classList.contains("delete")) {
        let id = e.target.closest(".col.m-2.p-2").id;
        UI.deleteBook(id);
        Store.removeBook(id);
        UI.showAlert("Removed book", "dark");
    }
    else if(e.target.classList.contains("switch")){
        let id = e.target.closest(".col.m-2.p-2").id;
        Store.changeRead(id, e.target.checked);
    }
})