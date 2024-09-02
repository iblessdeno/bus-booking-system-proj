# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our bus booking and management system seriously. If you have discovered a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### Reporting Process

1. **Do not** disclose the vulnerability publicly until it has been addressed by our team.
2. Email your findings to [security@yourdomain.com](mailto:security@yourdomain.com). Encrypt your message using our PGP key to ensure its contents are protected.
3. Provide a detailed description of the vulnerability, including:
   - The steps to reproduce the issue
   - Any proof-of-concept code
   - The potential impact of the vulnerability
4. Allow up to 48 hours for an initial response to your report.

### What to Expect

- We will acknowledge your email within 48 hours and provide an estimated timeframe for a fix.
- We will keep you informed about the progress of fixing the vulnerability.
- We will notify you when the vulnerability has been fixed.
- We will publicly acknowledge your responsible disclosure, unless you prefer to remain anonymous.

## Security Measures

Our system implements the following security measures:

1. **Firebase Authentication**: User authentication is handled securely through Firebase Authentication.
2. **Data Encryption**: All sensitive data is encrypted in transit and at rest.
3. **Input Validation**: All user inputs are validated and sanitized to prevent injection attacks.
4. **Access Control**: Firestore security rules are implemented to ensure users can only access data they are authorized to view or modify.
5. **Environment Variables**: Sensitive configuration data is stored in environment variables, not in the codebase.
6. **Regular Updates**: We keep all dependencies up-to-date to mitigate known vulnerabilities.

## Best Practices for Users

1. Use strong, unique passwords for your account.
2. Enable two-factor authentication if available.
3. Do not share your login credentials with others.
4. Log out of your account when using shared or public computers.
5. Regularly check your account activity for any suspicious actions.

## Compliance

Our system aims to comply with relevant data protection regulations, including GDPR where applicable.

This security policy is subject to change. Please check back regularly for updates.
