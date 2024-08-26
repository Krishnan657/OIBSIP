class AuthService {
    static hashPassword(password) {
        const encoder = new TextEncoder();
        return crypto.subtle.digest('SHA-256', encoder.encode(password))
            .then(hashBuffer => {
                return Array.from(new Uint8Array(hashBuffer))
                    .map(b => b.toString(16).padStart(2, '0')).join('');
            });
    }

    static async registerUser() {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const messageElem = document.getElementById('register-message');

        if (AuthService.isEmpty(username, password)) {
            return AuthService.showMessage(messageElem, "Please fill in both fields.", "error");
        }

        if (localStorage.getItem(username)) {
            return AuthService.showMessage(messageElem, "Username already exists.", "error");
        }

        const hashedPassword = await AuthService.hashPassword(password);
        localStorage.setItem(username, JSON.stringify({ password: hashedPassword, failedAttempts: 0, lockUntil: null }));
        AuthService.showMessage(messageElem, "Registration successful!", "success");
        AuthService.clearInputs('register-username', 'register-password');
    }

    static async loginUser() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const messageElem = document.getElementById('login-message');

        const user = JSON.parse(localStorage.getItem(username));
        if (!user) {
            return AuthService.showMessage(messageElem, "User does not exist.", "error");
        }

        const now = Date.now();
        if (user.lockUntil && now < user.lockUntil) {
            return AuthService.showMessage(messageElem, "Account is locked. Try again later.", "error");
        }

        const hashedPassword = await AuthService.hashPassword(password);
        if (hashedPassword === user.password) {
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('lastActivity', now);
            AuthService.showMessage(messageElem, "Login successful!", "success");
            window.location.href = "secured.html";
        } else {
            AuthService.handleFailedLogin(username, user, messageElem);
        }
    }

    static handleFailedLogin(username, user, messageElem) {
        user.failedAttempts += 1;
        if (user.failedAttempts >= 3) {
            user.lockUntil = Date.now() + 300000; // 5 minutes lock
            AuthService.showMessage(messageElem, "Account locked due to multiple failed attempts.", "error");
        } else {
            AuthService.showMessage(messageElem, `Invalid password. Attempt ${user.failedAttempts}/3.`, "error");
        }
        localStorage.setItem(username, JSON.stringify(user));
    }

    static async resetPassword() {
        const username = document.getElementById('forgot-username').value.trim();
        const messageElem = document.getElementById('forgot-message');

        const user = JSON.parse(localStorage.getItem(username));
        if (!user) {
            return AuthService.showMessage(messageElem, "User does not exist.", "error");
        }

        const newPassword = prompt("Enter your new password:");
        if (newPassword) {
            const hashedPassword = await AuthService.hashPassword(newPassword);
            user.password = hashedPassword;
            user.failedAttempts = 0;
            user.lockUntil = null;
            localStorage.setItem(username, JSON.stringify(user));
            AuthService.showMessage(messageElem, "Password reset successful!", "success");
        } else {
            AuthService.showMessage(messageElem, "Password reset cancelled.", "info");
        }
    }

    static checkPasswordStrength() {
        const password = document.getElementById('register-password').value;
        const strengthElem = document.getElementById('password-strength');
        const patterns = [
            { regex: /[a-z]/, label: "Lowercase letter" },
            { regex: /[A-Z]/, label: "Uppercase letter" },
            { regex: /[0-9]/, label: "Number" },
            { regex: /[^a-zA-Z0-9]/, label: "Special character" },
            { regex: /.{8,}/, label: "Minimum 8 characters" }
        ];

        const failedPatterns = patterns.filter(pattern => !pattern.regex.test(password));
        if (failedPatterns.length === 0) {
            AuthService.showMessage(strengthElem, "Strong password", "success");
        } else {
            const requirements = failedPatterns.map(pattern => pattern.label).join(", ");
            AuthService.showMessage(strengthElem, `Weak password. Add: ${requirements}`, "error");
        }
    }

    static isEmpty(...args) {
        return args.some(arg => !arg.trim());
    }

    static showMessage(element, message, type) {
        element.textContent = message;
        element.className = type;
    }

    static clearInputs(...inputIds) {
        inputIds.forEach(id => document.getElementById(id).value = '');
    }
}

document.getElementById('register-btn').addEventListener('click', () => AuthService.registerUser());
document.getElementById('login-btn').addEventListener('click', () => AuthService.loginUser());
document.getElementById('forgot-btn').addEventListener('click', () => AuthService.resetPassword());
document.getElementById('register-password').addEventListener('input', () => AuthService.checkPasswordStrength());
