function handleGoogleSignIn(response) {
    // Decode the JWT token
    const responsePayload = decodeJwtResponse(response.credential);
    
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Email: ' + responsePayload.email);
    console.log('Profile Picture: ' + responsePayload.picture);

    // Here you would typically:
    // 1. Send this information to your backend
    // 2. Create/verify the user's account
    // 3. Set up a session
    // 4. Redirect to the dashboard
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Handle regular form submission
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Here you would typically:
    // 1. Validate the inputs
    // 2. Send the login request to your backend
    // 3. Handle the response
    console.log('Login attempt with:', email, password);
}); 