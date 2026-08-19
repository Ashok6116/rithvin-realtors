const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
$$(".main-nav a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Property filters
$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.filter;
    $$(".property-card").forEach(card => {
      card.style.display = type === "all" || card.dataset.type === type ? "" : "none";
    });
  });
});

// Enquiry modal
const enquiryModal = $("#enquiryModal");
const modalTitle = $("#modalTitle");
const modalProperty = $("#modalProperty");
const modalNote = $("#modalNote");
function openEnquiry(title) {
  modalTitle.textContent = title || "Property Enquiry";
  modalProperty.value = title || "";
  modalNote.textContent = "";
  enquiryModal.classList.add("show");
  enquiryModal.setAttribute("aria-hidden","false");
  setTimeout(() => $("#modalForm input")?.focus(), 80);
}
function closeEnquiry() {
  enquiryModal.classList.remove("show");
  enquiryModal.setAttribute("aria-hidden","true");
}
$$("[data-open-enquiry]").forEach(btn => btn.addEventListener("click", () => openEnquiry(btn.dataset.openEnquiry)));
$("#modalClose").addEventListener("click", closeEnquiry);
enquiryModal.addEventListener("click", e => { if (e.target === enquiryModal) closeEnquiry(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeEnquiry(); closeLightbox(); } });

$("#modalForm").addEventListener("submit", e => {
  e.preventDefault();
  modalNote.textContent = "Thank you! Your enquiry has been captured. Connect this form to your backend/CRM to receive leads.";
  e.target.reset();
  modalProperty.value = modalTitle.textContent;
});

// Main enquiry form
$("#enquiryForm").addEventListener("submit", e => {
  e.preventDefault();
  $("#formNote").textContent = "Thank you! We will contact you shortly.";
  e.target.reset();
});

// 360 tour demo
$("#tourBtn").addEventListener("click", () => openEnquiry("Start 360° Tour"));

// Counters
const counters = $$(".counter");
let counted = false;
const counterObserver = new IntersectionObserver(entries => {
  if (!entries.some(e => e.isIntersecting) || counted) return;
  counted = true;
  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else counter.textContent = current;
    }, 30);
  });
}, {threshold: .35});
counterObserver.observe($(".stats"));

// Testimonials
let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("dot");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

if (!slides.length == 0) {
  let slideIndex = 1;
  showSlides(slideIndex);

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  let currentSlide = function (n) {
    showSlides((slideIndex = n));
  };

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" actives", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " actives";
  }
}

prev.addEventListener("click", () => {
  plusSlides(-1);
});

next.addEventListener("click", () => {
  plusSlides(1);
});

// Gallery lightbox
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const imageRefs = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=90"
];
function openLightbox(src){ lightboxImage.style.backgroundImage = `url("${src}")`; lightbox.classList.add("show"); lightbox.setAttribute("aria-hidden","false");}
function closeLightbox(){ lightbox.classList.remove("show"); lightbox.setAttribute("aria-hidden","true");}
$$(".gallery-item").forEach(item => item.addEventListener("click", () => openLightbox(imageRefs[Number(item.dataset.image)-1])));
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if(e.target === lightbox) closeLightbox(); });

// Active nav based on scroll position
const sections = ["home","about","properties","areas","services","gallery","contact"];
const navLinks = $$(".main-nav a");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
});
