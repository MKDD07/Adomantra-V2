/**
 * Dynamic Services Loader - Optimized for Swiper & Layout
 */

(function ($) {
  "use strict";

  const JSON_PATH = "assets/js/json/data.json";

  async function init() {
    try {
      const response = await fetch(JSON_PATH);
      const data = await response.json();
      const services = Array.isArray(data) ? data : data.services;
      const testimonials = data.testimonials || [];

      if ($("#service-list-container").length > 0) {
        renderServiceList(services);
      }

      if ($("#service-title").length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceSlug = urlParams.get("service") || "ctv-advertising";
        const service = services.find((s) => s.slug === serviceSlug) || services[0];
        renderServiceDetails(service);
      }

      if ($("#testimonial-wrapper").length > 0) {
        renderTestimonials(testimonials);
      }

      if ($("#all-services-grid").length > 0) {
        renderAllServices(services);
      }

      if ($("#sidebar-categories-list").length > 0 || $("#sidebar-categories-dropdown-list").length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const activeSlug = urlParams.get("service") || "ctv-advertising";
        renderSidebar(services, activeSlug);
      }
    } catch (error) {
      console.error("Error loading services data:", error);
    }
  }

  function renderServiceDetails(service) {
    if (!service) return;

    const { sections } = service;

    // 1. Core Titles & Images
    // $("#service-icon").attr("class", "fa-solid " + service.icon + " me-2");
    $("#service-title").html(service.title);
    $("#breadcrumb-current").text(service.title);
    $("#service-subtitle").text(sections.hero.subtitle || "");
    $("#service-description").text(sections.hero.description || service.metaDescription);

    // Set Hero Banners (Thumb 1 and Thumb 2)
    $("#service-thumb-1").attr("data-bg-src", service.serviceIcon || "assets/imgs/inner/service-details/service-details-thumb1_1.jpg");
    $("#service-thumb-2").attr("data-bg-src", sections.overview.image || "assets/imgs/inner/service-details/service-details-thumb1_1.jpg");


    // 4. Content Section (Benefit of Service & How it works)
    $("#benefit-title").html(sections.benefits.title || "Benefit of service");

    $("#benefit-title i").append(`
<svg width="745" height="115" viewBox="0 0 745 115" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.6365 64.2047C11.7283 64.1223 6.82728 64.0126 1.92762 63.882C0.970354 63.8559 0.172898 64.6128 0.14773 65.5718C0.122561 66.5309 0.879312 67.3308 1.83658 67.3569C6.24709 67.4703 10.6585 67.5698 15.0673 67.6553C15.3132 67.8241 15.8073 68.0712 16.6535 68.2155C43.0228 72.5448 71.5266 69.2689 98.494 67.4267C123.775 66.8834 149.069 65.9649 174.369 64.845C171.354 65.1336 168.341 65.4154 165.326 65.6831C164.698 65.7406 163.072 65.8949 162.849 65.9503C161.572 66.2937 161.537 67.3913 161.542 67.67C161.544 67.8094 161.644 69.3473 163.371 69.3945C181.923 69.8852 200.473 68.2317 218.942 66.7331C225.813 66.1745 232.676 65.6015 239.544 65.015C241.932 64.8049 248.146 64.5108 249.003 64.3495C249.925 64.1715 250.283 63.5887 250.42 63.138C265.321 62.2339 280.237 61.4422 295.157 60.7551C298.079 60.7529 300.995 60.7574 303.913 60.762C335.704 60.8415 367.488 61.039 399.277 60.9793C381.566 61.7952 363.811 62.6779 346.127 63.8992C342.505 64.1492 338.889 64.497 335.268 64.7749C333.289 64.9206 328.174 64.992 327.453 65.2246C326.38 65.581 326.211 66.4057 326.183 66.8146C326.166 67.0642 326.245 68.4545 328.049 68.7989C361.503 75.2147 395.638 76.578 429.568 78.3459C438.493 78.8091 447.417 79.307 456.337 79.8325C435.022 80.1964 413.495 79.4191 392.216 78.9012C392.024 78.7219 391.747 78.5512 391.349 78.4355C390.766 78.2591 388.959 78.0327 385.667 77.7886C384.957 77.7365 384.316 78.1203 384.004 78.7131C378.948 78.6143 373.906 78.5373 368.888 78.5036C352.453 78.3912 336.018 78.8636 319.585 78.8279L315.866 78.7863L315.09 78.7788C312.242 78.7299 308.757 78.6545 306.442 78.6048C305.106 78.5685 301.63 78.5562 301.149 78.5674C299.699 78.6145 299.451 79.9561 299.441 80.0181C299.435 80.0526 299.455 82.01 301.439 82.0596C302.767 82.0953 307.778 82.1634 314.804 82.2482C316.569 82.277 318.117 82.2988 319.041 82.3019L319.751 82.3052C342.216 82.5436 378.217 82.7933 388.411 82.286C421.574 83.0307 455.412 84.6119 488.164 81.7452C489.238 81.6465 489.709 81.3006 489.802 81.2229C490.309 80.7749 490.416 80.2665 490.395 79.8266C490.383 79.5474 490.243 78.4177 488.884 78.1572C487.929 77.9712 481.044 77.8396 478.394 77.6781C462.182 76.6888 445.968 75.7203 429.747 74.8767C400.499 73.3507 371.095 72.142 342.107 67.695C343.526 67.5764 344.946 67.4648 346.366 67.3672C364.297 66.1268 382.301 65.232 400.256 64.4107C456.015 61.8586 513.069 65.2783 568.573 60.5519C569.71 60.4572 570.218 60.1137 570.316 60.0364C570.854 59.5832 570.96 59.0539 570.939 58.607C570.926 58.3347 570.775 57.1904 569.39 56.9352C568.247 56.7233 560.016 56.5967 556.847 56.4231C544.193 55.7297 531.53 55.0287 518.863 54.6339C497.955 53.9864 477.002 53.6005 456.053 53.5074C454.265 53.1013 452.412 52.726 450.499 52.3816C464.625 52.1383 478.744 52.0128 492.858 52.0472C550.713 52.1693 608.553 53.2302 666.382 54.7151C690.333 55.3333 714.624 57.2889 738.584 56.8913C739.433 56.8757 741.314 57.051 742.24 57.0333C742.769 57.0252 743.157 56.9315 743.342 56.8598C744.113 56.5468 744.364 55.985 744.448 55.5448C744.518 55.2012 744.652 54.075 743.225 53.4413C712.538 39.8085 663.791 44.338 631.865 42.955C501.501 37.3097 371.045 40.7014 240.799 47.608C188.724 50.3665 136.781 53.1681 84.8137 57.5764C66.3718 59.1393 47.9057 60.4016 29.5578 62.8755C27.163 63.2035 22.0999 63.5359 18.8561 63.8865C17.9828 63.9841 17.2227 64.0958 16.6365 64.2047ZM733.432 53.4659C703.148 43.9103 660.507 47.6724 631.716 46.4262C501.463 40.7879 371.118 44.1728 240.983 51.0725C188.945 53.8334 137.039 56.6305 85.1072 61.041C71.8962 62.157 58.6716 63.1258 45.4892 64.4942C63.0939 64.5278 80.7053 64.3323 98.3421 63.9572C102.012 63.7033 105.657 63.4755 109.264 63.3012C153.563 61.141 197.96 59.043 242.357 57.989C257.043 57.2035 271.729 56.397 286.428 55.5984C314.879 53.0709 353.719 49.4916 389.45 48.882C401.741 48.6751 413.666 48.8209 424.683 49.4867C447.428 48.8656 470.152 48.5217 492.864 48.5739C550.747 48.6908 608.613 49.7603 666.476 51.2474C688.678 51.817 711.168 53.5467 733.432 53.4659ZM455.707 56.98C442.284 56.9269 428.865 56.9994 415.465 57.1983C409.501 57.2924 403.536 57.3935 397.569 57.5083C400.827 57.5066 404.086 57.4981 407.344 57.4825C422.635 57.4317 437.964 57.404 453.255 57.0608C454.015 57.0395 455.034 57.0626 456.175 57.0934L455.728 56.9883L455.707 56.98ZM538.394 58.918C531.851 58.5993 525.305 58.3084 518.757 58.1078C501.763 57.584 484.74 57.2253 467.712 57.0613C468.12 57.3239 468.336 57.5745 468.435 57.7339C468.725 58.184 468.771 58.6253 468.705 59.0249C468.664 59.2729 468.571 59.5665 468.361 59.8455C491.747 59.8291 515.16 59.863 538.394 58.918ZM432.667 53.5379C430.104 53.3122 427.478 53.1173 424.796 52.9536C411.5 53.3193 398.201 53.7685 384.918 54.2881C395.078 54.0711 405.247 53.8823 415.411 53.7282C421.161 53.6413 426.914 53.5757 432.667 53.5379Z" fill="#EF233C"/>
</svg>


`);
    $("#benefit-description").text(sections.benefits.description || "");

    // 2. Benefits Swiper (The Top Section)
    const $benefitsGrid = $("#service-benefits-grid");
    if (sections.benefits && sections.benefits.benefits) {
      $benefitsGrid.empty();
      sections.benefits.benefits.forEach((benefit, index) => {
        const html = `
          <div class="swiper-slide">
            <div class="features-item effectFade fadeUp h-100">
              <div class="service-details__card-number"><i class="${benefit.icon} fs-2"></i></div>
              <h5 class="service-details__card-title">${benefit.title}</h5>
              <p class="service-details__card-subtitle">${benefit.description}</p>
            </div>
          </div>`;
        $benefitsGrid.append(html);
      });

      // Initialize Swiper with your HTML's specific navigation IDs
      // Initialize Swiper with Line Pagination
      new Swiper("#benefits-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        // Pagination as a progress line
        pagination: {
          el: "#pagination0",
          type: "progressbar", // This creates the "line" style
        },
        // Navigation mapping to your custom SVG buttons
        navigation: {
          nextEl: "#next0",
          prevEl: "#prev0",
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        },
        on: {
          init: function () {
            this.update();
          },
        },
      });
    }

    // 3. Service Hero List (Top bullets)
    const $itemsList = $("#service-items");
    $itemsList.empty();
    if (sections.solutions.solutions) {
      sections.solutions.solutions.slice(0, 6).forEach((sol, index) => {
        const className = index % 2 === 0 ? "service-details__items-list-bt" : "service-details__items-list-bt2";
        $itemsList.append(`<li class="${className}">${sol.title}</li>`);
      });
    }

    $("#how-it-works-title").text(sections.overview.title || "How it works?");
    $("#how-it-works-description").text(sections.overview.content || "");

    // 5. Solutions Small List (Icons)
    const $solutionsList = $("#solutions-list");
    $solutionsList.empty();
    if (sections.solutions.solutions) {
      sections.solutions.solutions.slice(0, 4).forEach((sol) => {
        $solutionsList.append(`
          <li>
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <line x1="9.5" x2="9.5" y2="7" stroke="#101010" /><line x1="9.5" y1="12" x2="9.5" y2="19" stroke="#101010" />
                <line x1="12" y1="9.5" x2="19" y2="9.5" stroke="#101010" /><line y1="9.5" x2="7" y2="9.5" stroke="#101010" />
              </svg>
            </div>
            ${sol.title}
          </li>`);
      });
    }
    // 6. Why Choose Us (Split Layout)
    if (sections.whyChooseUs) {
      $("#why-choose-section").show();
      $("#why-choose-title").html(sections.whyChooseUs.title);

      // Add SVG underline to <i>
      $("#why-choose-title i").append(`
<svg width="1418" height="125" viewBox="0 0 1418 125" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1412.29 72.1693C1401.25 66.3893 1392.22 57.8393 1326.83 46.9293C1304.46 43.2993 1282.14 39.3693 1259.76 35.8893C1092.65 13.8293 1078.11 14.6493 954.82 5.32932C888.78 1.38932 822.57 1.09932 756.44 -0.000684483C709.81 -0.110684 663.17 1.55932 616.55 2.49932C365.5 13.5493 452.86 7.67931 277.94 23.1493C202.57 33.3193 127.38 45.0093 52.0704 55.6893C40.8404 58.0993 29.4404 59.8593 18.3604 62.9093C6.10041 66.3293 5.64041 66.1893 3.89041 67.7893C-4.09959 73.5693 0.910411 87.9293 12.6104 85.2893C46.6004 75.8193 44.8904 76.7193 190.67 55.6293C194.93 60.1093 197.96 59.0093 209.09 58.7393C222.28 58.4193 235.47 58.2093 248.65 57.6193C302.16 53.8093 355.53 47.9993 409.01 43.6693C427.42 42.3693 445.81 40.5493 464.22 38.9693C487.43 37.8093 510.65 36.6793 533.87 35.5693C654.15 33.4093 619.33 32.4393 768.52 34.0493C791.94 35.0393 770.09 33.8693 894.24 40.9493C990.85 49.8293 1095.16 68.8893 1189.66 87.0693C1230.53 94.9793 1306.33 110.269 1345.97 123.849C1349.78 124.899 1354.25 123.579 1356.48 120.269C1359.65 116.549 1359.14 110.569 1355.7 107.139C1352.45 104.019 1347.56 103.699 1343.52 102.059C1325.63 96.2093 1299.33 89.9693 1279.85 85.4993L1306.01 88.7793C1329.03 91.9093 1352.29 92.6993 1375.35 95.5293C1386.15 96.4893 1400.78 97.3393 1409.69 91.1393C1411.95 89.5993 1414.55 88.3893 1415.9 85.8693C1418.66 81.2793 1417.03 74.8093 1412.31 72.1893L1412.29 72.1693ZM925.4 23.7693C963.04 25.1693 1079.39 34.6193 1122.04 38.7093C1167.99 44.2193 1213.93 49.7393 1259.8 55.8993C1284.05 60.6693 1333.93 67.1093 1361.52 74.0393C1349.65 72.8893 1337.75 72.0693 1325.87 70.9793C1192.41 55.0793 1059.07 37.9593 925.4 23.7693Z" fill="#F66D25"/>
</svg>

`); const $leftCol = $("#features-col-left");
      const $rightCol = $("#features-col-right");
      const $leftElectric = $(".simu-electric.left");
      const $rightElectric = $(".simu-electric.right");

      $leftCol.empty();
      $rightCol.empty();

      const reasons = sections.whyChooseUs.reasons || [];
      const midpoint = Math.ceil(reasons.length / 2);

      reasons.forEach((reason, index) => {
        const itemHtml = `
      <div class="features-item mb-4 wow fadeInUp" data-wow-delay=".${2 + index}s">
        <div class="features-item-inner">
          <div class="features-item-content">
            <h5 class="title mb-2">${reason.title}</h5>
            <p class="desc mb-0 text-secondary">${reason.description}</p>
          </div>
        </div>
      </div>`;

        if (index < midpoint) {
          $leftCol.append(itemHtml);
        } else {
          $rightCol.append(itemHtml);
        }
      });

      // ✅ Handle LEFT electric effect
      if ($leftCol.children().length < 3) {
        $leftElectric.removeClass("simu-electric left");
      } else {
        $leftElectric.addClass("simu-electric left");
      }

      // ✅ Handle RIGHT electric effect
      if ($rightCol.children().length < 3) {
        $rightElectric.removeClass("simu-electric right");
      } else {
        $rightElectric.addClass("simu-electric right");
      }
    }
    // 7. FAQ Accordion
    if (sections.faq) {
      $("#faq-section").show();
      const $faqAccordion = $("#service-faq-accordion");
      $faqAccordion.empty();
      sections.faq.faqs.forEach((faq, index) => {
        const id = `faq-${index}`;
        $faqAccordion.append(`
          <div class="accordion-items mb-3">
            <h2 class="accordion-header d-flex justify-content-space">
              <button class="faq-button w-100 d-flex justify-content-between fsz-2 ${index === 0 ? "" : "collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#${id}">
                ${faq.question}                <span class="faq-icon">
    <i class="fa-solid fa-chevron-down"></i>
  </span> 
              </button>

            </h2>
            
            <div id="${id}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" data-bs-parent="#service-faq-accordion">
              <div class="accordion-body">${faq.answer}</div>
            </div>
          </div>`);
      });
    }

    // 8. CTA Section
    if (sections.cta && sections.cta.enabled) {
      $("#cta-section").show();
      $("#cta-title").text(sections.cta.title);
      $("#cta-subtitle").text(sections.cta.subtitle);
      $("#cta-btn-text").text(sections.cta.buttonText);
      $("#cta-btn").attr("href", sections.cta.buttonUrl);
    }

    // Re-run background and animations
    refreshAssets();
  }
  function refreshAssets() {
    $("[data-bg-src]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-bg-src") + ")");
    });
    if (typeof WOW !== "undefined") { new WOW().init(); }
  }

  function renderAllServices(services) {
    const $grid = $("#all-services-grid");
    $grid.empty();

    const svgIcon = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.1"><line x1="9.5" x2="9.5" y2="7" stroke="#101010"/><line x1="9.5" y1="12" x2="9.5" y2="19" stroke="#101010"/><line x1="12" y1="9.5" x2="19" y2="9.5" stroke="#101010"/><line y1="9.5" x2="7" y2="9.5" stroke="#101010"/></g></svg>`;

    const gradients = [
      { bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", theme: "dark" },
      { bg: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", theme: "dark" },
      { bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", theme: "dark" },
      { bg: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)", theme: "dark" },
      { bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", theme: "dark" },
      { bg: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)", theme: "dark" },
      { bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", theme: "dark" }
    ];

    services.forEach((service, index) => {
      const num = String(index + 1).padStart(2, "0");
      const style = gradients[index % gradients.length];
      const textColorClass = style.theme === "dark" ? "text-white" : "text-dark";
      const titleColorClass = style.theme === "dark" ? "original-white" : "original-black";
      const iconStroke = style.theme === "dark" ? "#ffffff" : "#101010";

      const dynamicSvgIcon = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><line x1="9.5" x2="9.5" y2="7" stroke="${iconStroke}"/><line x1="9.5" y1="12" x2="9.5" y2="19" stroke="${iconStroke}"/><line x1="12" y1="9.5" x2="19" y2="9.5" stroke="${iconStroke}"/><line y1="9.5" x2="7" y2="9.5" stroke="${iconStroke}"/></g></svg>`;

      const solutions = (service.sections.solutions && service.sections.solutions.solutions) || [];
      const bullets = solutions.slice(0, 3).map(sol =>
        `<li><span>${dynamicSvgIcon}</span>${sol.title}</li>`
      ).join("");

      const html = `
        <div class="swiper-slide">
          <div class="features-item wow fadeInUp h-410 mb-3 p-5 d-flex flex-column justify-content-between" 
               data-wow-delay=".${2 + index}s" 
               style="background: ${style.bg}; border: none; position: relative; overflow: hidden; border-radius: 24px;">
            <div style="position: relative; z-index: 2;">
              <h3 class="service-details__content-title mb-4 fs-4 ${titleColorClass}">${service.title}</h3>
              <p class="${textColorClass} opacity-75 mb-4" style="font-size: 15px; line-height: 1.6;">${service.metaDescription ? service.metaDescription.slice(0, 120) + "..." : ""}</p>
              <ul class="service-2__list ${textColorClass} opacity-75 d-flex flex-column gap-2" style="list-style: none; padding: 0;">${bullets}</ul>
            </div>
            <div class="mt-4" style="position: relative; z-index: 2;">
              <a class="rr-btn-button2 btn-purple bg-white text-dark small py-2 px-4 rounded-pill" 
                 href="service-details.html?service=${service.slug}"
                 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                 Explore Details
              </a>
            </div>
            <i style="font-size: 96px; opacity: 0.15; color: #fff;" 
               class="position-absolute bottom-0 end-0 mb-4 me-3 ${service.icon || 'fa-solid fa-gear'}"></i>
          </div>
        </div>`;

      $grid.append(html);
    });

    new Swiper("#all-services-swiper", {
      grabCursor: true,
      effect: "cards",
      cardsEffect: {
        slideShadows: false,
        rotate: true,
        perSlideRotate: 2,
        perSlideOffset: 4
      },
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: "#all-services-pagination",
        clickable: true
      },
      navigation: {
        nextEl: "#all-services-next",
        prevEl: "#all-services-prev"
      },
      breakpoints: {
        576: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1200: { slidesPerView: 1 }
      }
    });
  }

  function renderTestimonials(testimonials) {
    const $wrapper = $("#testimonial-wrapper");
    $wrapper.empty();

    testimonials.forEach((tm, index) => {
      const html = `
           <div class="swiper-slide">
          <div class="features-card mb-4 wow fadeInUp">
            <div class="testimonial-area4__card-items">
            <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="testimonial-area4__card-items-mentor-items d-flex">
                <div class="testimonial-area4__card-items-mentor-items-info">
                  <div class="testimonial-area4__card-items-mentor-items-info-thumb">
                    <img src="assets/imgs/service/services-card/service_0001.jpg" alt="${tm.name}"
                      class="testimonial-face-pexels">
                  </div>
                  <div class="testimonial-review-logo">
                    <img src="assets/imgs/social/testimonials/google.svg" alt="Google review" aria-label="Google review">
                  </div>
                  <div class="testimonial-area4__card-items-mentor-items-info-content">
                    <h3 class="testimonial-area4__card-items-mentor-items-info-content-title">${tm.name}</h3>
                    <p class="testimonial-area4__card-items-mentor-items-info-content-subtitle">${tm.position}</p>
                  </div>
                </div>           
              </div>
              <div class="testimonial-area4__card-items-icon d-flex gap-1 mb-2 mt-4">
                <!-- Dynamic Stars (Random 4 or 5) -->
                ${Array.from({ length: 5 }).map((_, i) => {
        const rating = tm.rating || (index % 3 === 0 ? 4 : 5); // Use JSON rating or a deterministic variation
        return `<i class="fa-solid fa-star ${i < rating ? 'text-warning' : 'text-muted opacity-25'}"></i>`;
      }).join('')}
              </div>
              </div>
              <div class="testimonial-area4__card-items-content">
                <p class="testimonial-area4__card-items-content-subtitle">${tm.feedback}</p>
              </div>
            </div>
          </div>
        </div>`;
      $wrapper.append(html);
    });

  }

  function renderSidebar(services, activeSlug) {
    const $list = $("#sidebar-categories-list");
    const $dropdownList = $("#sidebar-categories-dropdown-list");
    const $dropdownToggle = $("#sidebar-categories-toggle");
    const $selectedLabel = $dropdownToggle.find(".selected-label");

    $list.empty();
    if ($dropdownList.length) $dropdownList.empty();

    services.forEach((service) => {
      const isActive = service.slug === activeSlug;
      const icon = service.icon || "fa-solid fa-circle-dot";

      if (isActive) {
        $selectedLabel.text(service.title);
      }

      // Populate Desktop List
      const li = $(`
        <li class="${isActive ? "active" : ""}">
          <a href="service-details.html?service=${service.slug}" title="${service.title}">
            <span class="sidebar-cat-icon"><i class="${icon}"></i></span>
            <span class="sidebar-cat-label">${service.title}</span>
          </a>
        </li>`);
      $list.append(li);

      // Populate Mobile Custom Dropdown
      if ($dropdownList.length) {
        const dropdownItem = $(`
          <li class="${isActive ? "active" : ""}">
            <a href="service-details.html?service=${service.slug}">
              <span class="sidebar-cat-icon"><i class="${icon}"></i></span>
              ${service.title}
            </a>
          </li>`);
        $dropdownList.append(dropdownItem);
      }
    });

    // Handle Mobile Dropdown Toggle
    if ($dropdownToggle.length) {
      $dropdownToggle.on("click", function (e) {
        e.stopPropagation();
        $("#sidebar-categories-dropdown").toggleClass("active");
      });

      // Close dropdown when clicking outside
      $(document).on("click", function () {
        $("#sidebar-categories-dropdown").removeClass("active");
      });
    }

    // --- Contact widget: set link to active service enquiry ---
    const $contactBtn = $(".sidebar-contact__btn");
    if ($contactBtn.length) {
      $contactBtn.attr(
        "href",
        `https://www.adomantra.com/contact?service=${activeSlug}`
      );
    }
  }

  $("#why-choose-title").addClass("animate");
  $(document).ready(() => init());

})(jQuery);