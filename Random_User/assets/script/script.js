async function fetchUser() {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];
    const profilePic = document.getElementById('profile-pic');
    profilePic.src = user.picture.large;

    document.getElementById('name-title').innerHTML = `${user.name.title} ${user.name.first} ${user.name.last}`;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('dob').innerHTML = new Date(user.dob.date).toLocaleDateString();
    document.getElementById('gender').innerHTML = user.gender;
    document.getElementById('phone').innerHTML = user.phone;

    const address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`;
    document.getElementById('address').innerHTML = address;
}

window.onload = fetchUser;
document.getElementById('next-btn').addEventListener('click', fetchUser);
