/**
 * Kanban Module - Interactive Task Management & Drag-and-Drop Workflow
 */

const KanbanModule = (() => {
  let tasks = [
    {
      id: 'task-1',
      title: 'Architect Micro-Frontend Shell',
      desc: 'Implement module federation and isolated sub-application sandboxing.',
      status: 'todo',
      priority: 'high',
      assignee: 'AR'
    },
    {
      id: 'task-2',
      title: 'Design Dark Mode Color Tokens',
      desc: 'Audit HSL color variables and contrast ratios for WCAG AAA compliance.',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'SL'
    },
    {
      id: 'task-3',
      title: 'Setup Redis In-Memory Cache Layer',
      desc: 'Add tiered caching for product lookups and user session tokens.',
      status: 'in-progress',
      priority: 'high',
      assignee: 'TK'
    },
    {
      id: 'task-4',
      title: 'Stripe Payment Webhook Idempotency',
      desc: 'Verify event deduplication logic across distributed worker nodes.',
      status: 'review',
      priority: 'medium',
      assignee: 'AR'
    },
    {
      id: 'task-5',
      title: 'CI/CD Pipeline Docker Multi-Stage Build',
      desc: 'Reduced container production footprint from 840MB down to 42MB.',
      status: 'done',
      priority: 'low',
      assignee: 'SL'
    }
  ];

  let draggedTaskId = null;

  function init() {
    renderAllColumns();
    setupDragDropEvents();
    setupCreateTaskModal();
    setupSearch();
  }

  function renderAllColumns() {
    const columns = ['todo', 'in-progress', 'review', 'done'];
    columns.forEach(col => {
      const colCardsContainer = document.getElementById(`kanban-cards-${col}`);
      const counter = document.getElementById(`kanban-count-${col}`);
      if (!colCardsContainer) return;

      const colTasks = tasks.filter(t => t.status === col);
      if (counter) counter.innerText = colTasks.length;

      colCardsContainer.innerHTML = colTasks.map(t => `
        <div class="kanban-card" draggable="true" data-task-id="${t.id}">
          <span class="card-tag-pill ${t.priority}">${t.priority}</span>
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
          <div class="kanban-card-meta">
            <span class="card-assignee-avatar">${t.assignee}</span>
            <button onclick="KanbanModule.deleteTask('${t.id}')" style="color: var(--text-subtle); font-size: 0.75rem;" title="Delete task">✕</button>
          </div>
        </div>
      `).join('');
    });
  }

  function setupDragDropEvents() {
    document.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban-card');
      if (!card) return;
      draggedTaskId = card.dataset.taskId;
      card.classList.add('dragging');
    });

    document.addEventListener('dragend', (e) => {
      const card = e.target.closest('.kanban-card');
      if (card) card.classList.remove('dragging');
      draggedTaskId = null;
      document.querySelectorAll('.kanban-cards-container').forEach(c => c.classList.remove('drag-over'));
    });

    const dropZones = document.querySelectorAll('.kanban-cards-container');
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const targetStatus = zone.dataset.status;
        if (!targetStatus || !draggedTaskId) return;

        const task = tasks.find(t => t.id === draggedTaskId);
        if (task && task.status !== targetStatus) {
          task.status = targetStatus;
          renderAllColumns();
          if (window.App) window.App.showToast(`Moved task to "${targetStatus.replace('-', ' ').toUpperCase()}"`);
        }
      });
    });
  }

  function setupCreateTaskModal() {
    const form = document.getElementById('newTaskForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('taskInputTitle').value.trim();
      const desc = document.getElementById('taskInputDesc').value.trim();
      const priority = document.getElementById('taskInputPriority').value;
      const status = document.getElementById('taskInputStatus').value;

      if (!title) return;

      const newTask = {
        id: 'task-' + Date.now(),
        title,
        desc: desc || 'No description provided.',
        status: status || 'todo',
        priority: priority || 'medium',
        assignee: 'ME'
      };

      tasks.push(newTask);
      renderAllColumns();
      form.reset();
      if (window.App) {
        window.App.closeAllModals();
        window.App.showToast('Created new task card successfully');
      }
    });
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderAllColumns();
    if (window.App) window.App.showToast('Task removed');
  }

  function setupSearch() {
    const input = document.getElementById('kanbanSearchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.kanban-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  return { init, deleteTask };
})();
