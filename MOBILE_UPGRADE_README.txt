This project was automatically enhanced for mobile & animations.

What's added:
- assets/css/mobile-enhancements.css (responsive typography, grid collapse, cards, sticky header, animation classes)
- assets/js/enhancements.js (IntersectionObserver scroll animations, optional mobile nav toggle, light parallax support)
- <meta name="viewport"> added to HTML head if missing
- Links to the new CSS and JS injected across HTML files

How animations work:
- Elements like sections, cards, images, headings, paragraphs, list items automatically get "reveal" animations on scroll.
- Add class "parallax" to any element to get a soft parallax effect on desktop.

Rollback:
- Remove the two injected tags:
    <link rel="stylesheet" href="assets/css/mobile-enhancements.css">
    <script defer src="assets/js/enhancements.js"></script>

Modified HTML files (1):
- index.html