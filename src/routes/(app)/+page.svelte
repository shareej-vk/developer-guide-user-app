
<script lang="ts">
  import {page} from '$app/state';
  import {onMount} from 'svelte';

  onMount(() => {
  localStorage.setItem('scrollTop', "0");
  localStorage.removeItem('selectedUnitId');
  localStorage.removeItem('selectedLessonId');
  localStorage.removeItem('selectedUnit');
  localStorage.removeItem('selectedSubject');
  });

</script>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1>Mastering Fullstack Development With<span class="highlight">Agentic AI</span></h1>
      <p class="subtitle"><b>This Isn’t Just About Upskilling — It’s About Evolving How You Think, Solve, and Collaborate in a Tech Landscape Powered by AI</b></p>
      
      <!-- <div class="cta-buttons">
        <a href="courses" class="btn btn-primary btn-lg">Explore Courses</a>
        <a href="/free-class" class="btn btn-outline btn-lg">Join Free Class</a>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-number">10M+</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">Expert Teachers</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">95%</div>
          <div class="stat-label">Success Rate</div>
        </div>
      </div> -->
    </div>
    
    <div class="hero-image">
      <!-- Placeholder for hero image -->
      <div class="image-placeholder">
       <img src="images/j5yw97ek.avif" alt="Hero Image">
      </div>
    </div>
  </div>
</section>

<!-- Featured Courses Section -->
<section class="featured-courses">
  <div class="container" style="padding-left: 10%; padding-right: 10%;">
    <div class="section-header">
      <h2>Covering The Basics</h2>
      <a href="courses" class="view-all">View All</a>
    </div>
    
    <div class="courses-grid">

      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/html-the-practical-lessons">
          <img src="images/html-practical-lessons.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/html-the-practical-lessons" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
      <!-- Course Card 2 -->
      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/css-the-practical-lessons">
          <img src="images/css-practical-lessons.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/css-the-practical-lessons" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
      
      <!-- Course Card 1 -->
      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/javascript-part-i">
          <img src="images/js-fundamentals-part-1.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/javascript-part-i" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>

      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/javascript_part_ii_from_fundamentals_to_advanced_application">
          <img src="images/js-fundamentals-part-2.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/javascript_part_ii_from_fundamentals_to_advanced_application" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
      

      

      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/tailwind-css-the-essentials">
          <img src="images/tail-wind-css-essentials.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/tailwind-css-the-essentials" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
      
      <!-- Course Card 4 -->
      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/front-end-development-core-100-projects">
          <img src="images/core-front-end.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/front-end-development-core-100-projects" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
    </div>
  </div>
</section>

<section class="featured-courses">
  <div class="container" style="padding-left: 10%; padding-right: 10%;">
    <div class="section-header">
      <h2>The Begniner </h2>
      <a href="courses" class="view-all">View All</a>
    </div>
    
    <div class="courses-grid">
      
      <!-- Course Card 1 -->
      <div class="course-card">
        <a href="courses/front-end-developement/front-end-developer/getting_started_with_web_development	">
          <img src="images/web-dev-begner.webp" alt="Hero Image">
          </a>
          <div class="course-content">
          <a href="courses/front-end-developement/front-end-developer/getting_started_with_web_development	" class="btn btn-outline btn-sm">Explore</a>
          </div>
      </div>
      </div>
      </div>
      </section>
      

<!-- Features Section -->
<section class="features">
  <div class="container">
    <div class="section-header">
      <h2>Why Choose EduBuddy?</h2>
      <p>Experience the best in online learning</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="icon">🎓</div>
        <h3>Expert Teachers</h3>
        <p>Learn from IIT/NIT alumni and subject matter experts</p>
      </div>
      
      <div class="feature-card">
        <div class="icon">📱</div>
        <h3>Live Classes</h3>
        <p>Interactive live classes with real-time doubt solving</p>
      </div>
      
      <div class="feature-card">
        <div class="icon">📚</div>
        <h3>Study Materials</h3>
        <p>Access to comprehensive study materials and practice tests</p>
      </div>
      
      <div class="feature-card">
        <div class="icon">🎯</div>
        <h3>Personalized Learning</h3>
        <p>Customized learning paths based on your pace and goals</p>
      </div>
    </div>
  </div>
</section>



<style>
  /* Hero Section */
  .hero {
    padding: 6rem 0 4rem;
    padding-left: 5%  ;
    padding-right: 5%;
    background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
  }
  
  .hero .container {
    display: flex;
    align-items: center;
    gap: 4rem;
  }
  
  .hero-content {
    flex: 1;
    max-width: 600px;
  }
  
  .hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }
  
  .highlight {
    color: #4f46e5;
    position: relative;
    display: inline-block;
  }
  
  .highlight::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 12px;
    background-color: rgba(99, 102, 241, 0.2);
    z-index: -1;
    border-radius: 4px;
  }
  
  .subtitle {
    font-size: 1.25rem;
    color: #4b5563;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .btn-lg {
    padding: 0.75rem 1.75rem;
    font-size: 1.1rem;
    border-radius: 8px;
  }
  
  .stats {
    display: flex;
    gap: 3rem;
    margin-top: 2rem;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.2;
  }
  
  .stat-label {
    color: #6b7280;
    font-size: 0.9375rem;
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-placeholder {
    width: 100%;
    max-width: 500px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  /* Featured Courses */
  .featured-courses {
    padding: 5rem 0;
    background-color: #ffffff;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .section-header h2 {
    font-size: 2.25rem;
    color: #111827;
    margin: 0;
  }
  
  .view-all {
    color: #4f46e5;
    font-weight: 500;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);    gap: 2rem;
  }
  
  .course-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .course-image {
    height: 160px;
    background: #e0e7ff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tag {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #4f46e5;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
  }
  
  .placeholder {
    text-align: center;
    color: #4f46e5;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .course-content {
    padding: 1.5rem;
  }
  
  .course-content h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: #111827;
  }
  
  .course-content p {
    color: #6b7280;
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    line-height: 1.5;
  }
  
  .course-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .rating {
    color: #f59e0b;
    font-weight: 600;
  }
  
  .btn-sm {
    padding: 0.4rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }
  
  /* Features Section */
  .features {
    padding: 5rem 0;
    background-color: #f9fafb;
  }
  
  .features .section-header {
    text-align: center;
    flex-direction: column;
    margin-bottom: 4rem;
  }
  
  .features .section-header p {
    color: #6b7280;
    font-size: 1.125rem;
    margin-top: 1rem;
    max-width: 600px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .feature-card .icon {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    display: inline-block;
  }
  
  .feature-card h3 {
    font-size: 1.25rem;
    color: #111827;
    margin: 0 0 1rem;
  }
  
  .feature-card p {
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
    font-size: 0.9375rem;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    text-align: center;
  }
  
  .cta-content {
    max-width: 700px;
    margin: 0 auto;
  }
  
  .cta-content h2 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem;
    line-height: 1.2;
  }
  
  .cta-content p {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
    line-height: 1.6;
  }
  
  .cta-section .btn-primary {
    background-color: white;
    color: #4f46e5;
    font-weight: 600;
    padding: 0.875rem 2.5rem;
    font-size: 1.125rem;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .cta-section .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  /* Responsive Styles */
  @media (max-width: 1024px) {
    .hero .container {
      flex-direction: column;
      text-align: center;
    }
    
    .hero-content {
      margin-bottom: 3rem;
    }
    
    .cta-buttons {
      justify-content: center;
    }
    
    .stats {
      justify-content: center;
    }
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      gap: 1rem;
    }
    
    .stats {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .section-header {
      flex-direction: column;
      gap: 1rem;
    }
    
    .view-all {
      margin-top: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .hero h1 {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .btn-lg {
      width: 100%;
      text-align: center;
    }
  }
</style>
