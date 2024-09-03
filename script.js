
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const switchToSignupLink = document.getElementById('switch-to-signup');
    const switchToLoginLink = document.getElementById('switch-to-login');

    // Function to show the Login form
    window.showLogin = function () {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
        switchToSignupLink.classList.remove('hidden');
        switchToLoginLink.classList.add('hidden');
    };

    // Function to show the SignUp form
    window.showSignUp = function () {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        forgotPasswordForm.classList.add('hidden');
        switchToSignupLink.classList.add('hidden');
        switchToLoginLink.classList.remove('hidden');
    };

    // Function to show the Forgot Password form
    window.showForgotPassword = function () {
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.remove('hidden');
        switchToSignupLink.classList.add('hidden');
        switchToLoginLink.classList.remove('hidden');
    };

    // Default: Show Login Form
    showLogin();
});
