/**
 * Portfolio Module - Developer & Agency Showcase, Skills, & Interactive Contact
 */

const PortfolioModule = (() => {
  const caseStudies = {
    'pulsar': {
      title: 'Pulsar - High-Throughput Real-Time Telemetry Streamer',
      tech: ['TypeScript', 'Rust', 'WebAssembly', 'WebSocket', 'ClickHouse'],
      description: 'Engineered a telemetry monitoring dashboard capable of visualizing 120,000 incoming metrics events per second with sub-16ms render frame budgets using custom WebGL shadders and WebAssembly workers.',
      results: 'Reduced client-side memory footprint by 64% and eliminated UI thread stutter under heavy burst traffic.'
    },
    'aurora': {
      title: 'Aurora - Next-Generation AI Design System & Studio',
      tech: ['React 19', 'Tailwind', 'Python', 'PyTorch', 'Vector Embeddings'],
      description: 'Built a generative user interface design platform allowing designers and developers to describe components in plain English and instantly receive clean, accessible, and theme-adaptive UI code.',
      results: 'Adopted by over 40 enterprise design teams with 98.4% component compilation accuracy.'
    },
    'vortex': {
      title: 'Vortex - Distributed Cloud Task Scheduler & Orchestrator',
      tech: ['Go', 'gRPC', 'Kubernetes', 'Redis', 'PostgreSQL'],
      description: 'Architected an autoscaling microservice scheduler handling asynchronous background job dispatching, automatic retries with exponential backoff, and geo-replicated state storage.',
      results: 'Maintained 99.999% uptime during peak holiday sales volumes across 18 regional data clusters.'
    }
  };

  function init() {
    setupContactForm();
    setupCaseStudyModals();
  }

  function setupCaseStudyModals() {
    window.openCaseStudy = (key) => {
      const study = caseStudies[key];
      if (!study) return;

      const modalContent = document.getElementById('caseStudyModalBody');
      if (modalContent) {
        modalContent.innerHTML = `
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.75rem;">${study.title}</h2>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            ${study.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.875rem; color: var(--accent-primary); text-transform: uppercase; margin-bottom: 0.35rem;">Overview</h4>
            <p style="font-size: 0.925rem; line-height: 1.6; color: var(--text-muted);">${study.description}</p>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 1rem;">
            <h4 style="font-size: 0.85rem; color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.25rem;">Key Impact & Results</h4>
            <p style="font-size: 0.875rem; color: var(--text-main);">${study.results}</p>
          </div>
        `;
        if (window.App) window.App.openModal('caseStudyModal');
      }
    };
  }

  function setupContactForm() {
    const form = document.getElementById('portfolioContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle></svg>
        Sending Message...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        if (window.App) {
          window.App.showToast('🚀 Message received! Alex will reply within 24 hours.');
        }
      }, 1000);
    });
  }

  return { init };
})();
