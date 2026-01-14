document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const receiverEmail = "islandturtle@gmail.com";

    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" + encodeURIComponent(receiverEmail) +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(
            "Name: " + name + "\n" +
            "Email: " + email + "\n\n" +
            message
        );

    window.open(gmailURL, "_blank");
});