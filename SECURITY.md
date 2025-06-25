# Security Policy

## Supported Versions

We actively maintain security for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Yes             |
| 1.5.x   | ⚠️ Security fixes only |
| < 1.5   | ❌ No              |

## Reporting a Vulnerability

### Security Contact

If you discover a security vulnerability, please report it to us privately. **Do not** create a public GitHub issue for security vulnerabilities.

**Contact Methods:**
- **Email**: kavinnandhakavin@gmail.com (preferred)
- **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
- **Response Time**: We aim to respond within 48 hours

### What to Include

When reporting a security vulnerability, please include:

1. **Description** of the vulnerability
2. **Steps to reproduce** the security issue
3. **Potential impact** and attack scenarios
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up

### Example Report Template

```
Subject: [SECURITY] Vulnerability in YouTube Speed Extender

Description:
[Detailed description of the vulnerability]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Impact:
[What could an attacker do with this vulnerability?]

Environment:
- Extension Version: [version]
- Browser: [Chrome/Edge version]
- Operating System: [OS details]

Additional Notes:
[Any other relevant information]
```

## Security Considerations

### Extension Security Model

Our extension follows security best practices:

#### Minimal Permissions
- **Only requests `activeTab` permission**
- **No network access** (no external API calls)
- **No access to other websites** outside YouTube
- **No access to browsing history**

#### Data Privacy
- **Local storage only** - all data stays on your device
- **No external servers** - extension works entirely offline
- **No user tracking** - we don't collect usage data
- **No personal information** - only playback speed preferences stored

#### Code Security
- **No eval() usage** - prevents code injection attacks
- **Content Security Policy compliant**
- **No external script loading**
- **Input validation** for all user inputs

### Common Security Concerns

#### Is it safe to install?
Yes, the extension:
- Uses minimal permissions
- Doesn't access personal data
- Doesn't communicate with external servers
- Code is open source and auditable

#### What data does it store?
Only playback speed preferences:
- Preferred speed setting
- Navigation mode preference
- Custom keyboard shortcuts
- No personal or identifying information

#### Can it access my browsing history?
No, the extension only has access to the active YouTube tab when you're using it.

#### Can it track my YouTube usage?
No, the extension doesn't send any data anywhere. It only modifies playback speed locally.

## Vulnerability Response Process

### Our Commitment
1. **Acknowledge** receipt within 48 hours
2. **Investigate** the reported vulnerability
3. **Develop** a fix if vulnerability is confirmed
4. **Test** the fix thoroughly
5. **Release** a security update
6. **Coordinate** disclosure timeline with reporter

### Timeline
- **Initial Response**: Within 48 hours
- **Investigation**: 1-7 days depending on complexity
- **Fix Development**: 1-14 days depending on severity
- **Release**: As soon as fix is tested and ready

### Severity Levels

#### Critical (24-48 hour fix target)
- Remote code execution
- Data exfiltration
- Privilege escalation

#### High (1 week fix target)
- Local file access
- Permission bypass
- Significant privacy breach

#### Medium (2 weeks fix target)
- Information disclosure
- Cross-site scripting in extension context
- Denial of service

#### Low (Next regular release)
- Minor information leaks
- UI spoofing
- Non-exploitable issues

## Disclosure Policy

### Responsible Disclosure
We practice responsible disclosure:
1. **Private reporting** allows us to fix issues before public disclosure
2. **Coordinated timeline** ensures users can update before details are public
3. **Credit given** to security researchers who report responsibly

### Public Disclosure Timeline
- **Immediate**: Critical vulnerabilities affecting user safety
- **30 days**: High severity vulnerabilities
- **90 days**: Medium and low severity issues
- **Upon fix release**: For any severity, once patched version is available

## Security Updates

### How We Notify Users
- **Chrome Web Store**: Automatic updates for store installations
- **GitHub Releases**: Security releases clearly marked
- **README Updates**: Security notices in main documentation
- **Issue Tracker**: Public disclosure after fix is available

### How to Stay Secure
1. **Keep extension updated** - enable automatic updates
2. **Install from trusted sources** - Chrome Web Store or official GitHub
3. **Review permissions** - ensure extension hasn't requested new permissions
4. **Report suspicious behavior** - contact us if something seems wrong

## Security Auditing

### Self-Auditing
We regularly review our code for:
- Permission usage
- Data handling practices
- Input validation
- External dependencies

### Third-Party Auditing
- **Community review** - open source code allows public auditing
- **Security researchers** - we welcome security research
- **Automated scanning** - we use tools to scan for known vulnerabilities

### Code Review Process
- All changes reviewed before merging
- Security-focused review for permission changes
- Documentation updates for security-relevant changes

## Incident Response

### If a Security Issue is Discovered
1. **Immediate assessment** of impact and severity
2. **Temporary mitigation** if possible while developing fix
3. **User notification** if immediate action is required
4. **Fix development and testing**
5. **Release coordination** with Chrome Web Store
6. **Post-incident review** and process improvement

### User Actions During Security Incidents
If we discover a security issue:
1. **We'll notify users** through available channels
2. **Update immediately** when fix is available
3. **Follow any specific guidance** we provide
4. **Report any suspicious activity** you observe

## Security Resources

### For Users
- **Extension Permissions**: [Chrome Extension Security Guide](https://developer.chrome.com/docs/extensions/mv3/security/)
- **Browser Security**: Keep your browser updated
- **General Security**: Use strong passwords, enable 2FA where possible

### For Developers
- **Chrome Extension Security**: [Official Security Guidelines](https://developer.chrome.com/docs/extensions/mv3/security/)
- **Content Script Security**: [Best Practices](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- **Manifest V3 Security**: [Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)

---

## Contact Information
**GitHub**: [Repository URL](https://github.com/Kavinnandha/Youtube-Playback-Speed-Customization)

---

*This security policy is reviewed and updated regularly. Last updated: June 25, 2025*
