/**
 * blog-details.js — Dynamically populates the blog-details.html template
 * following the specific original layout format.
 */

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (typeof fetchAdomantraNews === 'function') {
    fetchAdomantraNews()
      .then(data => {
        const blog = slug
          ? data.blogs.find(b => b.slug === slug)
          : data.blogs[0];

        if (blog) {
          renderBlog(blog, data); // Pass all data for sidebar
        }
      })
      .catch(err => console.error('Error loading news:', err));
  }

  async function renderBlog(blog, data) {
    // 1. SEO & Browser Title
    if (blog.seo) {
      document.title = blog.seo.title + " | Adomantra";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', blog.seo.description);
    }

    // 2. Header & Meta
    const titleEl = document.querySelector('.blog-section-title');
    if (titleEl) titleEl.innerHTML = blog.title;

    const metaArr = document.querySelectorAll('.blog-details-area-inner .meta span');
    if (metaArr.length >= 3) {
      metaArr[0].innerHTML = `By <span>${blog.author}</span>`;
      metaArr[1].textContent = blog.category;
      metaArr[2].textContent = blog.year;
    }

    // 3. Main Images (Random Pexels based on blog context)
    const heroImg = document.getElementById('pexels-hero');
    if (heroImg && typeof fetchPexelsImage === 'function') {
      heroImg.src = await fetchPexelsImage(blog.title + " professional");
    }

    // 4. Content Area
    const detailsContainer = document.querySelector('.section-details');
    if (!detailsContainer) return;

    // Clear existing content to rebuild with JSON data while maintaining original structure
    let html = `
            <div class="text-wrapper" id="blog-intro">
                <p class="text">${blog.content.introduction}</p>
            </div>
        `;

    blog.content.sections.forEach((section, index) => {
      html += `
                <div class="details-info">
                    <h3 class="title split-text-reveal original-black">${section.title}</h3>
                    <div class="text-wrapper">
                        <p class="text">${section.text}</p>
                    </div>
            `;

      // Case A: Thumb Wrapper (Image + Two paragraphs)
      if (section.thumb_wrapper) {
        html += `
                    <div class="thumb-text-wrapper">
                        <div class="thumb parallax-view">
                            <img id="pexels-thumb-${index}" alt="image" data-speed="0.8">
                        </div>
                        <div class="text-wrapper">
                            <p class="text">${section.thumb_wrapper.text_one}</p>
                            <p class="text">${section.thumb_wrapper.text_two}</p>
                        </div>
                    </div>
                `;
        // Trigga Pexels fetch for this thumb
        setTimeout(async () => {
          const thumbImg = document.getElementById(`pexels-thumb-${index}`);
          if (thumbImg && typeof fetchPexelsImage === 'function') {
            thumbImg.src = await fetchPexelsImage(section.title + " creative");
          }
        }, 100);
      }

      // Case B: Feature List
      if (section.feature_list) {
        html += `
                    <div class="feature-list">
                        <ul>
                            ${section.feature_list.map(item => `
                                <li>
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                            <line x1="9.5" x2="9.5" y2="7" stroke="#101010"></line>
                                            <line x1="9.5" y1="12" x2="9.5" y2="19" stroke="#101010"></line>
                                            <line x1="12" y1="9.5" x2="19" y2="9.5" stroke="#101010"></line>
                                            <line y1="9.5" x2="7" y2="9.5" stroke="#101010"></line>
                                        </svg>
                                    </div>${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
      }

      // Case C: Gallery Wrapper
      if (section.gallery_images) {
        html += `
                    <div class="gallery-wrapper">
                        <div class="image parallax-view">
                            <img id="pexels-gallery-${index}-1" alt="image" data-speed="0.8">
                        </div>
                        <div class="image parallax-view">
                            <img id="pexels-gallery-${index}-2" alt="image" data-speed="0.8">
                        </div>
                    </div>
                `;
        setTimeout(async () => {
          const g1 = document.getElementById(`pexels-gallery-${index}-1`);
          const g2 = document.getElementById(`pexels-gallery-${index}-2`);
          if (typeof fetchPexelsImage === 'function') {
            if (g1) g1.src = await fetchPexelsImage(section.title + " workspace");
            if (g2) g2.src = await fetchPexelsImage(section.title + " digital");
          }
        }, 200);
      }

      // Closing Text (common after lists/galleries)
      if (section.closing_text) {
        html += `
                    <div class="text-wrapper">
                        <p class="text">${section.closing_text}</p>
                    </div>
                `;
      }

      html += `</div>`; // Close details-info
    });

    // 5. Tags
    if (blog.seo && blog.seo.tags) {
      html += `
                <div class="tags-wrapper">
                    <span class="heading">Tags:</span>
                    <div class="tags">
                        ${blog.seo.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
    }

    // 6. FAQ Section (as requested)
    if (blog.content.faqs) {
      html += `
                <div class="details-info faq-section mt-5">
                    <h3 class="title split-text-reveal original-black">Common Queries</h3>
                    <div class="features-item">
                        ${blog.content.faqs.map((faq, i) => `
                            <div class="p-3 rounded-3
" id="faq-${i}">
                                <div class="d-flex cursor-pointer align-items-center justify-content-between" onclick="this.parentElement.classList.toggle('active')">
                                    <h4 style="margin:0;font-size:14px;font-weight:500;">${faq.question}</h4>
                                    <i class="fa-solid fa-plus "></i>
                                </div>
                                <div class="faq-body">
                                    <div class="faq-content p-3" style="font-size:14px;">${faq.answer}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
    }

    // 7. Comment Form (re-add static)
    html += `
            <div class="comment-wrap">
                <h3 class="title split-text-reveal original-black">Leave a reply</h3>
                                          <div class="features-item mb-4">
                                          <div class="row g-4">
                                          <div class="col-lg-6 col-12">
                            <form action="#">
                              <div class="comment-formwrap">
                                <div class="comment-formfield">
                                  <input type="text" name="Name" id="Name" placeholder="Name*">
                                </div>
                                <div class="comment-formfield">
                                  <input type="text" name="Email" id="Email" placeholder="Email*">
                                </div>
                                <div class="comment-formfield message">
                                  <input type="text" name="Message" id="Message" placeholder="Message*">
                                </div>
                              </div>
                              <div class="submit-btn">
                                <button type="submit" class="rr-btn">
                                  <span class="btn-wrap">
                                    <span class="mk-button">Send Us Now</span>
                                  </span>
                                </button>
                              </div>
                            </form>
                            </div>
<div class="col-lg-6 col-12">
  
  <div class="">
    
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center">
      <h6 class="p-3 mb-0 fw-300">Comments</h6>
      <span class="">03</span>
    </div>

    <!-- Scrollable Comments Area -->
    <div class="p-3" style="max-height: 300px; overflow-y: auto;">
      
      <!-- Single Comment -->
      <div class="d-flex mb-3">
        <img src="https://i.pravatar.cc/40" class="rounded-circle me-2" alt="">
        <div>
          <h6 class="mb-0 small">Rahul Sharma</h6>
          <p class="mb-1 small text-muted">This product looks amazing!</p>
          <span class="text-muted small">2 mins ago</span>
        </div>
      </div>

      <!-- Repeat Comments -->
      <div class="d-flex mb-3">
        <img src="https://i.pravatar.cc/41" class="rounded-circle me-2" alt="">
        <div>
          <h6 class="mb-0 small">Anita Verma</h6>
          <p class="mb-1 small text-muted">Loved the design and quality.</p>
          <span class="text-muted small">10 mins ago</span>
        </div>
      </div>

      <div class="d-flex mb-3">
        <img src="https://i.pravatar.cc/42" class="rounded-circle me-2" alt="">
        <div>
          <h6 class="mb-0 small">Amit Singh</h6>
          <p class="mb-1 small text-muted">Can you share more details?</p>
          <span class="text-muted small">30 mins ago</span>
        </div>
      </div>

      <!-- Add more comments to test scroll -->
      
    </div>

  </div>

</div>  </div>
                          </div>
            </div>
        `;

    detailsContainer.innerHTML = html;

    // 8. Sidebar: Recent Posts
    const recentPostContainer = document.querySelector('.main-sidebar2-widget__post');
    if (recentPostContainer) {
      const blogsToDisplay = data.blogs
        .filter(b => b.slug !== blog.slug)
        .slice(0, 3);

      const recentHTML = blogsToDisplay.map((b, i) => `
                    <div class="main-sidebar2-widget__post-items flex-row wow fadeInUp" data-wow-delay="${0.4 + (i * 0.2)}s">
                        <div class="main-sidebar2-widget__post-items-thumb">
                            <img src="assets/imgs/inner/blog-details/blog-details1_${i + 1}.jpg" id="recent-thumb-${i}" alt="thumb">
                        </div>
                        <div class="main-sidebar2-widget__post-items-content">
                            <div class="main-sidebar2-widget__post-items-content-title">
                                <a href="blog-details.html?slug=${b.slug}">
                                    ${b.title}
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('');
      recentPostContainer.innerHTML = recentHTML;

      // Optional: Randomize recent thumbs too
      setTimeout(async () => {
        for (let i = 0; i < blogsToDisplay.length; i++) {
          const rThumb = document.getElementById(`recent-thumb-${i}`);
          if (rThumb && typeof fetchPexelsImage === 'function') {
            rThumb.src = await fetchPexelsImage("technology business " + i);
          }
        }
      }, 500);
    }
  }
});
