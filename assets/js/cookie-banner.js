/* Cookie Banner JS Logic */
document.addEventListener("DOMContentLoaded", function () {
    const COOKIE_NAME = "cookie_consent";
    const EXPIRATION_DAYS = 365;

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function showBanner() {
        const banner = document.getElementById("cookie-banner");
        if (banner) {
            banner.style.display = "block";
        }
    }

    function hideBanner() {
        const banner = document.getElementById("cookie-banner");
        if (banner) {
            banner.style.display = "none";
        }
    }

    function showModal() {
        const modal = document.getElementById("cookie-modal");
        if (modal) {
            modal.style.display = "block";
        }
    }

    function hideModal() {
        const modal = document.getElementById("cookie-modal");
        if (modal) {
            modal.style.display = "none";
        }
    }

    function logConsent(consentData) {
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_agent: navigator.userAgent,
                consent: consentData
            })
        }).catch(err => console.error('Failed to log consent:', err));
    }

    // Check if consent cookie exists
    const existingConsent = getCookie(COOKIE_NAME);
    if (!existingConsent) {
        showBanner();
    }

    // Accept All
    const acceptBtn = document.getElementById("accept-cookies");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", function () {
            const consentData = {
                necessary: true,
                analytics: true,
                marketing: true
            };

            setCookie(COOKIE_NAME, JSON.stringify(consentData), EXPIRATION_DAYS);
            logConsent(consentData);
            hideBanner();
        });
    }

    // Open Modal ("Manage Exceptions")
    const manageBtn = document.getElementById("manage-cookies");
    if (manageBtn) {
        manageBtn.addEventListener("click", function () {
            showModal();
        });
    }

    // Save Preferences (Modal)
    const saveBtn = document.getElementById("save-preferences");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            const analytics = document.getElementById("consent-analytics").checked;
            const marketing = document.getElementById("consent-marketing").checked;

            const consentData = {
                necessary: true,
                analytics: analytics,
                marketing: marketing
            };

            setCookie(COOKIE_NAME, JSON.stringify(consentData), EXPIRATION_DAYS);
            logConsent(consentData);

            hideModal();
            hideBanner();
        });
    }

    // Cancel (Modal)
    const cancelBtn = document.getElementById("cancel-preferences");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            hideModal();
        });
    }
});
