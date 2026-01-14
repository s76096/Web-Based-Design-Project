document.addEventListener("DOMContentLoaded", function () {
  const reviewsContainer = document.querySelector(".reviews-container");
  const reviewForm = document.getElementById("reviewForm");
  const reviewMessage = document.getElementById("reviewMessage");
  const stars = document.querySelectorAll(".star-rating span");

  let selectedStars = 0;

  let reviewsData = [
    { name: "Mikael", stars: 5, text: "Very good service and easy booking process." },
    { name: "Josep", stars: 4, text: "The car was clean and staff were friendly." },
    { name: "Dingo", stars: 5, text: "Affordable price and smooth pickup." }
  ];

  
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedStars = index + 1;

      stars.forEach((s, i) => {
        s.classList.toggle("selected", i < selectedStars);
      });
    });
  });

  
  function sanitizeInput(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  
  function createStars(count) {
    let starsStr = "";
    for (let i = 1; i <= 5; i++) {
      starsStr += i <= count ? "★" : "☆";
    }
    return starsStr;
  }

  
  function renderReviews() {
    reviewsContainer.innerHTML = "";

    reviewsData.forEach(review => {
      const reviewItem = document.createElement("div");
      reviewItem.classList.add("review-item");

      reviewItem.innerHTML = `
        <div class="review-avatar">${review.name.charAt(0)}</div>
        <div class="review-content">
          <h4>${review.name}</h4>
          <div class="review-stars">${createStars(review.stars)}</div>
          <p>${review.text}</p>
        </div>
      `;

      reviewsContainer.appendChild(reviewItem);
    });
  }

  renderReviews();

  
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    reviewMessage.textContent = "";

    const name = sanitizeInput(
      document.getElementById("reviewName").value.trim()
    );
    const text = sanitizeInput(
      document.getElementById("reviewText").value.trim()
    );

    if (!name || !text || selectedStars === 0) {
      reviewMessage.textContent =
        "Please fill out all fields and select a star rating.";
      return;
    }

    if (name.length > 30 || text.length > 200) {
      reviewMessage.textContent = "Name or review too long.";
      return;
    }

    reviewsData.unshift({
      name,
      stars: selectedStars,
      text
    });

    renderReviews();
    reviewForm.reset();

    selectedStars = 0;
    stars.forEach(s => s.classList.remove("selected"));
  });
});