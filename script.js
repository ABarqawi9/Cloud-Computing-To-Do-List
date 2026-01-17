// 1. Your Firebase Configuration 
const firebaseConfig = {
  apiKey: "AIzaSyCgr4XuvD6uyj3V3s-cShTM8MucvwXgpGs",
  authDomain: "to-do-project-3ef1f.firebaseapp.com",
  projectId: "to-do-project-3ef1f",
  storageBucket: "to-do-project-3ef1f.firebasestorage.app",
  messagingSenderId: "253955422450",
  appId: "1:253955422450:web:80d9f9db021674c92b386b",
  measurementId: "G-9WCZXVWN68"
};

// 2. Initialize Firebase (Compat Version) [cite: 249-252]
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Register user [cite: 254-260]
// Register user function
function register() {
    // 1. Get the actual elements from the HTML
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");

    // 2. Get the values typed by the user
    const email = emailField.value;
    const password = passwordField.value;

    // 3. Check if they are empty
    if (email === "" || password === "") {
        alert("Please enter both email and password.");
        return;
    }

    // 4. Call Firebase to create the account [cite: 83-85]
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("Registration successful! You can now Login.");
            // Optional: clear the fields after success
            emailField.value = "";
            passwordField.value = "";
        })
        .catch(err => {
            // Show the specific error (e.g., "email already in use" or "weak password") [cite: 85]
            alert(err.message);
        });
}

// 4. Login user [cite: 262-272]
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("todo-section").style.display = "block";
            loadTasks();
        })
        .catch(err => alert(err.message));
}

// 5. Logout [cite: 274-277]
function logout() {
    auth.signOut();
    location.reload();
}

// 6. Add task [cite: 279-287]
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskValue = taskInput.value;
    const user = auth.currentUser;

    // Check if user is logged in and input isn't empty [cite: 107, 110]
    if (user && taskValue.trim() !== "") {
        db.collection("tasks").add({
            text: taskValue,
            uid: user.uid // Links task to your account [cite: 110]
        })
        .then(() => {
            taskInput.value = ""; // Clears the box after saving [cite: 112]
            console.log("Task added to cloud!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
    } else {
        alert("Please enter a task or log in again.");
    }
}

// 7. Load tasks [cite: 289-306]
function loadTasks() {
    const user = auth.currentUser;
    db.collection("tasks")
        .where("uid", "==", user.uid)
        .onSnapshot(snapshot => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";
            snapshot.forEach(doc => {
                const li = document.createElement("li");
                li.textContent = doc.data().text;
                const btn = document.createElement("button");
                btn.textContent = "Delete";
                btn.onclick = () => db.collection("tasks").doc(doc.id).delete();
                li.appendChild(btn);
                list.appendChild(li);
            });
        });
}