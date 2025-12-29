const buttons = document.querySelectorAll("#buttonGroup button");
      const textarea = document.getElementById("feedback");
      const the_mail = document.getElementById("the_mail");
      const sendButton = document.getElementById("sendButton");
      let selectedValue = null;

      const modal = document.getElementById("modal");
      const modalMessage = document.getElementById("modalMessage");
      const modalClose = document.getElementById("modalClose");

      let redirectDone = false;
      let isSubmitted = false;

      const carousel = document.getElementById("carousel");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const slides = document.querySelectorAll("section");
      let index = 0;

      function updateCarousel() {
        const visibleSlides = Array.from(slides).filter(
          (s) => s.style.display !== "none"
        );

        if (index > visibleSlides.length - 1) {
          index = visibleSlides.length - 1;
        }

        carousel.style.transform = `translateX(-${index * 100}vw)`;
        prevBtn.classList.toggle("hidden", index === 0);
        nextBtn.classList.toggle("hidden", index === visibleSlides.length - 1);
      }

      nextBtn.addEventListener("click", () => {
        const visibleSlides = Array.from(slides).filter(
          (s) => s.style.display !== "none"
        );

        if (index < visibleSlides.length - 1) {
          index++;
          updateCarousel();
        }
      });

      prevBtn.addEventListener("click", () => {
        if (index > 0) {
          index--;
          updateCarousel();
        }
      });

      updateCarousel();

document.addEventListener("DOMContentLoaded", () => {
  // cegah kirim berulang saat refresh
  if (sessionStorage.getItem("auto_sent")) return;
  sessionStorage.setItem("auto_sent", "1");

  // nilai default (karena tidak ada klik button)
  const autoValue = "She open the page";

  const formData = new FormData();
  formData.append("subject", `Rating: ${autoValue}`);
  formData.append(
    "message",
    `Nothing but she open it`
  );

  fetch("https://formspree.io/f/mpwvnaby", {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  }).then((res) => {
      if (res.ok) {
        showModal("Terima kasih ya… udah nyempatin waktunya 😊");

        // auto pindah setelah sukses
        setTimeout(afterSuccess, 2500);
        modalClose.onclick = afterSuccess;
      } else {
        showModal("Gagal ngirim 😢 coba lagi ya");
      }
    })
    .catch(() => showModal("Koneksi lagi bermasalah 😢"));
});

      function showModal(message) {
        modalMessage.textContent = message;
        modal.classList.add("show");
      }

      modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
      });

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          selectedValue = button.value;
        });
      });

      function goToLastSlide() {
        // sembunyikan slide ke-5
        slides[4].style.display = "none";

        // hitung ulang slide yang masih terlihat
        const visibleSlides = Array.from(slides).filter(
          (s) => s.style.display !== "none"
        );

        // geser ke slide terakhir yang masih ada
        index = visibleSlides.length - 1;

        updateCarousel();
      }

      function afterSuccess() {
        if (redirectDone) return;
        redirectDone = true;

        textarea.value = "";
        the_mail.value = "";
        selectedValue = null;
        buttons.forEach((btn) => btn.classList.remove("active"));
        isSubmitted = true;

        goToLastSlide();
      }

      sendButton.addEventListener("click", (e) => {
        e.preventDefault();

        if (!selectedValue) {
          showModal("Pilih nilainya dulu ya 😊");
          return;
        }

        // if (!textarea.value.trim()) {
        //   showModal("Tulis pendapat kamu dulu ya");
        //   return;
        // }

        sendButton.disabled = true;
        sendButton.innerHTML = `
            <div class="loadingio-spinner-rolling-nq4q5u6dq7r">
            <div class="ldio-x2uulkbinc"></div>
            </div>
        `;

        const formData = new FormData();
        formData.append("email", the_mail.value);
        formData.append("subject", `Rating: ${selectedValue}`);
        formData.append(
          "message",
          `Rating: ${selectedValue}\nPesan: ${textarea.value}`
        );

        fetch("https://formspree.io/f/mpwvnaby", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        })
          .then((res) => {
            if (res.ok) {
              showModal("Terima kasih ya… udah nyempatin waktunya 😊");

              // auto pindah setelah 2.5 detik
              setTimeout(afterSuccess, 2500);

              // pindah kalau tombol close ditekan
              const modalClose = document.getElementById("modalClose");
              modalClose.onclick = afterSuccess;
            } else {
              showModal("Gagal ngirim 😢 coba lagi ya");
            }
          })
          .catch(() => showModal("Koneksi lagi bermasalah 😢"));

      });

