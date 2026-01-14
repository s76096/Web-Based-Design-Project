// Select all FAQ items
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-icon");

  question.addEventListener("click", () => {

    // Close other FAQ items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.querySelector(".faq-answer").style.display = "none";
        otherItem.querySelector(".faq-icon").textContent = "+";
      }
    });

    // Toggle current FAQ
    if (answer.style.display === "block") {
      answer.style.display = "none";
      icon.textContent = "+";
    } else {
      answer.style.display = "block";
      icon.textContent = "−";
    }
  });
});
