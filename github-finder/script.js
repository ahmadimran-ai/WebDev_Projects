const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");

const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");

const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");

const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");

const reposContainer = document.getElementById("repos-container");

let isLoading = false;

/* EVENTS */
searchBtn.addEventListener("click", searchUser);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchUser();
});

/* SEARCH */
async function searchUser() {
    const username = searchInput.value.trim();
    if (!username) return showError("Enter username");

    if (isLoading) return;
    isLoading = true;

    try {
        resetUI();

        const res = await fetch(`https://api.github.com/users/${username}`);

        if (res.status === 404) {
            showError("User not found");
            return;
        }

        if (!res.ok) {
            showError("API error");
            return;
        }

        const user = await res.json();

        displayUser(user);
        fetchRepos(user.repos_url);

    } catch (err) {
        showError("Something went wrong");
    } finally {
        isLoading = false;
    }
}

/* REPOS */
async function fetchRepos(url) {
    reposContainer.innerHTML = "Loading...";

    try {
        const res = await fetch(url + "?per_page=5");
        const data = await res.json();

        reposContainer.innerHTML = "";

        data.forEach(repo => {
            const div = document.createElement("div");
            div.className = "repo";

            div.innerHTML = `
        <a href="${repo.html_url}" target="_blank">
          ${repo.name}
        </a>
        <p>${repo.description || "No description"}</p>
      `;

            reposContainer.appendChild(div);
        });

    } catch {
        reposContainer.innerHTML = "Failed to load repos";
    }
}

/* USER */
function displayUser(user) {
    profileContainer.classList.remove("hidden");
    errorContainer.classList.add("hidden");

    avatar.src = user.avatar_url;
    nameElement.textContent = user.name || user.login;
    usernameElement.textContent = `@${user.login}`;
    bioElement.textContent = user.bio || "No bio";

    locationElement.textContent = user.location || "N/A";
    joinedDateElement.textContent = new Date(user.created_at).toDateString();

    profileLink.href = user.html_url;

    followers.textContent = user.followers;
    following.textContent = user.following;
    repos.textContent = user.public_repos;
}

/* ERROR */
function showError(msg) {
    errorContainer.classList.remove("hidden");
    profileContainer.classList.add("hidden");
    errorContainer.querySelector("p").textContent = msg;
}

/* RESET */
function resetUI() {
    errorContainer.classList.add("hidden");
    profileContainer.classList.add("hidden");
    reposContainer.innerHTML = "";
}

/* DEFAULT */
searchInput.value = "octocat";
searchUser();