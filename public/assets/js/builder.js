// JAM Builder Pro - The WordPress/Elementor Killer
// Modern visual page builder with real-time editing, drag & drop, and AI optimization

class JAMBuilderPro {
  constructor() {
    this.pageStructure = [];
    this.componentData = new Map();
    this.selectedComponent = null;
    this.previewMode = false;
    this.dirty = false;
    this.componentCounter = 0;

    // Global settings
    this.globalSettings = {
      fonts: { primary: 'Inter', secondary: 'Inter' },
      colors: { primary: '#3b82f6', secondary: '#64748b' },
      spacing: { tight: '1rem', normal: '2rem', loose: '4rem' },
    };

    // Initialize everything
    this.init();
  }

  init() {
    this.setupDragAndDrop();
    this.setupInlineEditing();
    this.bindEvents();
    this.initSortable();
    this.restoreDraft();
    this.startAutosave();
    this.enableCanvasAutoScroll(); // 👈 NEW: smooth auto‑scroll while dragging

    console.log('🎨 JAM Builder Pro initialized - Ready to build!');
  }

  // ========== DRAG & DROP SYSTEM ==========

  setupDragAndDrop() {
    // Make component palette items draggable
    document.querySelectorAll('.component-item').forEach((item) => {
      this.makeDraggable(item);
    });

    // Setup drop zones
    this.setupDropZones();
  }

  makeDraggable(element) {
    element.draggable = true;

    element.addEventListener('dragstart', (e) => {
      element.classList.add('dragging');
      const componentType = element.dataset.type;
      const componentVariant = element.dataset.variant;

      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          type: componentType,
          variant: componentVariant,
        }),
      );

      e.dataTransfer.effectAllowed = 'copy';
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });
  }

  setupDropZones() {
    const pagePreview = document.querySelector('.page-preview');
    const mainDropZone = document.getElementById('mainDropZone');

    if (!pagePreview) return;

    // Page preview drop zone
    pagePreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';

      // Visual drop indicator positioned to cursor
      const rect = pagePreview.getBoundingClientRect();
      const y = e.clientY - rect.top;
      this.showDropIndicator(y);
    });

    pagePreview.addEventListener('dragleave', (e) => {
      // Only remove indicator if leaving the entire preview area
      if (!pagePreview.contains(e.relatedTarget)) {
        this.hideDropIndicator();
      }
    });

    pagePreview.addEventListener('drop', (e) => {
      e.preventDefault();
      this.hideDropIndicator();

      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const dropIndex = this.calculateDropIndex(e.clientY);
        this.addComponent(data.type, data.variant, dropIndex);
      } catch (error) {
        console.error('Drop error:', error);
      }
    });

    // Main drop zone (when empty)
    if (mainDropZone) {
      mainDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        mainDropZone.classList.add('drag-over');
      });

      mainDropZone.addEventListener('dragleave', () => {
        mainDropZone.classList.remove('drag-over');
      });

      mainDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        mainDropZone.classList.remove('drag-over');

        try {
          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
          this.addComponent(data.type, data.variant, 0);
        } catch (error) {
          console.error('Drop error:', error);
        }
      });
    }
  }

  showDropIndicator(y) {
    this.hideDropIndicator(); // Remove existing

    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background: #3b82f6;
      border-radius: 2px;
      z-index: 1000;
      box-shadow: 0 0 10px rgba(59,130,246,0.5);
      top: ${y}px;
    `;

    const target = document.querySelector('.page-preview');
    if (target) target.appendChild(indicator);
  }

  hideDropIndicator() {
    const existing = document.querySelector('.drop-indicator');
    if (existing) existing.remove();
  }

  calculateDropIndex(clientY) {
    const components = document.querySelectorAll('.placed-component');
    if (components.length === 0) return 0;

    for (let i = 0; i < components.length; i++) {
      const rect = components[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        return i;
      }
    }

    return components.length; // Add at end
  }

  // 👇 NEW: Elementor-style canvas auto-scroll while dragging
  enableCanvasAutoScroll() {
    const container = document.querySelector('.canvas-content');
    if (!container) return;

    let raf = null;
    const SCROLL_ZONE = 80; // px from top/bottom edges
    const MAX_SPEED = 24; // px per frame

    const onDragOver = (e) => {
      const rect = container.getBoundingClientRect();
      const y = e.clientY;
      let dy = 0;

      if (y < rect.top + SCROLL_ZONE) {
        const dist = Math.max(1, rect.top + SCROLL_ZONE - y);
        dy = -Math.min(MAX_SPEED, Math.ceil(dist / 6));
      } else if (y > rect.bottom - SCROLL_ZONE) {
        const dist = Math.max(1, y - (rect.bottom - SCROLL_ZONE));
        dy = Math.min(MAX_SPEED, Math.ceil(dist / 6));
      }

      if (dy !== 0) {
        if (!raf) {
          const tick = () => {
            container.scrollTop += dy;
            raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    container.addEventListener('dragover', onDragOver);
    container.addEventListener('dragleave', stop);
    container.addEventListener('drop', stop);
    window.addEventListener('dragend', stop);
  }

  // ========== COMPONENT MANAGEMENT ==========

  addComponent(type, variant, index = -1) {
    const component = {
      id: `component-${++this.componentCounter}`,
      type,
      variant,
      timestamp: Date.now(),
    };

    if (index === -1 || index >= this.pageStructure.length) {
      this.pageStructure.push(component);
    } else {
      this.pageStructure.splice(index, 0, component);
    }

    this.renderPage();
    this.markDirty();

    // Auto-select the new component
    setTimeout(() => this.selectComponent(component.id), 100);
  }

  removeComponent(index) {
    if (confirm('Delete this component?')) {
      const component = this.pageStructure[index];
      this.pageStructure.splice(index, 1);
      this.componentData.delete(component.id);
      this.renderPage();
      this.markDirty();
    }
  }

  duplicateComponent(index) {
    const original = this.pageStructure[index];
    const duplicate = { ...original, id: `component-${++this.componentCounter}` };

    const originalData = this.componentData.get(original.id);
    if (originalData) {
      this.componentData.set(duplicate.id, { ...originalData });
    }

    this.pageStructure.splice(index + 1, 0, duplicate);
    this.renderPage();
    this.markDirty();
  }

  moveComponent(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= this.pageStructure.length) return;

    const component = this.pageStructure.splice(fromIndex, 1)[0];
    this.pageStructure.splice(toIndex, 0, component);
    this.renderPage();
    this.markDirty();
  }

  selectComponent(componentId) {
    document.querySelectorAll('.placed-component').forEach((el) => {
      el.classList.remove('selected');
    });

    const element = document.querySelector(`[data-component-id="${componentId}"]`);
    if (element) {
      element.classList.add('selected');
      this.selectedComponent = componentId;
      this.updatePropertiesPanel(componentId);
    }
  }

  // ========== RENDERING SYSTEM ==========

  renderPage() {
    const pagePreview = document.querySelector('.page-preview');
    if (!pagePreview) return;

    if (this.pageStructure.length === 0) {
      pagePreview.innerHTML = `
        <div class="drop-zone" id="mainDropZone">
          <div class="drop-zone-icon">🎨</div>
          <div class="drop-zone-text">Start building your page</div>
          <div class="drop-zone-subtext">Drag components from the left panel</div>
        </div>
      `;
      this.setupDropZones(); // Re-setup for new drop zone
      return;
    }

    const componentsHtml = this.pageStructure
      .map((component, index) => this.renderComponent(component, index))
      .join('');

    pagePreview.innerHTML = componentsHtml;

    // Re-init
    this.initSortable();
    this.setupDropZones();
  }

  renderComponent(component, index) {
    const data = this.getComponentData(component.id) || this.getDefaultData(component);
    const isSelected = this.selectedComponent === component.id;
    const editingChrome = !this.previewMode;

    const controlsHtml = editingChrome
      ? `
      <div class="component-controls">
        <button class="control-btn" onclick="event.stopPropagation(); builder.editComponent?.('${component.id}')" title="Edit Content">✏️</button>
        <button class="control-btn" onclick="event.stopPropagation(); builder.moveComponent(${index}, ${index - 1})" title="Move Up" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button class="control-btn" onclick="event.stopPropagation(); builder.moveComponent(${index}, ${index + 1})" title="Move Down" ${index === this.pageStructure.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="control-btn" onclick="event.stopPropagation(); builder.duplicateComponent(${index})" title="Duplicate">📋</button>
        <button class="control-btn" onclick="event.stopPropagation(); builder.removeComponent(${index})" title="Delete">🗑️</button>
      </div>`
      : '';

    return `
      <div class="placed-component ${isSelected ? 'selected' : ''} ${this.previewMode ? '' : 'editable'}"
           data-component-index="${index}"
           data-component-id="${component.id}"
           onclick="builder.selectComponent('${component.id}')">
        ${controlsHtml}
        ${this.renderActualComponent(component, data)}
      </div>
    `;
  }

  renderActualComponent(component, data) {
    const renderers = {
      HeroV16: () => this.renderHeroV16(data, component.id),
      HeroV19: () => this.renderHeroV16(data, component.id),
      HeroV20: () => this.renderHeroV16(data, component.id),
      HeroV5: () => this.renderHeroV16(data, component.id),
      AboutV16: () => this.renderAboutV16(data, component.id),
      AboutV20: () => this.renderAboutV16(data, component.id),
      ServicesV16: () => this.renderServicesV16(data, component.id),
      ServicesV15: () => this.renderServicesV16(data, component.id),
      BlogV16: () => this.renderGenericComponent({ id: component.id, variant: 'BlogV16' }, data),
      BlogV19: () => this.renderGenericComponent({ id: component.id, variant: 'BlogV19' }, data),
      CtaV20: () => this.renderCtaV20(data, component.id),
      CtaV2: () => this.renderCtaV20(data, component.id),
    };

    const renderer = renderers[component.variant];
    return renderer ? renderer() : this.renderGenericComponent(component, data);
  }

  // ========== COMPONENT TEMPLATES ==========

  renderHeroV16(data, componentId) {
    const ce = this.previewMode ? '' : 'contenteditable="true"';
    const bgStyle = data.backgroundImage
      ? `background: linear-gradient(135deg, rgba(102,126,234,0.9) 0%, rgba(118,75,162,0.9) 100%), url(${data.backgroundImage}); background-size: cover; background-position: center;`
      : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';

    const uploadZoneHtml = this.previewMode
      ? ''
      : `
      <div class="image-upload-zone"
           style="position:absolute; bottom:2rem; right:2rem; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border:2px dashed rgba(255,255,255,0.4); border-radius:12px; padding:1.5rem; cursor:pointer; transition:all .3s; z-index:3; font-weight:600;"
           onclick="builder.uploadImage('${componentId}','backgroundImage')">
        📸 Change Background
      </div>`;

    return `
      <section class="hero-v16" style="${bgStyle} color:#fff; padding:8rem 2rem; text-align:center; position:relative; min-height:90vh; display:flex; align-items:center; justify-content:center;">
        <div class="hero-content" style="max-width:900px; z-index:2;">
          <h1 class="editable-text" data-component-id="${componentId}" data-field="title" ${ce}
              style="font-size:4rem; font-weight:800; margin-bottom:1.5rem; line-height:1.1;"
              onblur="builder.updateComponentData('${componentId}','title',this.textContent)">
            ${data.title ?? 'Transform Your Business with Professional Web Design'}
          </h1>
          <h2 class="editable-text" data-component-id="${componentId}" data-field="subtitle" ${ce}
              style="font-size:1.75rem; font-weight:400; margin-bottom:2rem; opacity:.95;"
              onblur="builder.updateComponentData('${componentId}','subtitle',this.textContent)">
            ${data.subtitle ?? 'Modern web experiences that captivate and convert'}
          </h2>
          <p class="editable-text" data-component-id="${componentId}" data-field="description" ${ce}
             style="font-size:1.3rem; margin-bottom:3rem; opacity:.9; line-height:1.6; max-width:700px; margin-left:auto; margin-right:auto;"
             onblur="builder.updateComponentData('${componentId}','description',this.textContent)">
            ${data.description ?? 'Get a website that not only looks amazing but actually converts visitors into customers.'}
          </p>

          <div style="display:flex; gap:1.5rem; justify-content:center; flex-wrap:wrap;">
            <button class="editable-button" style="background:#fff; color:#667eea; padding:1.25rem 2.5rem; border:none; border-radius:50px; font-size:1.2rem; font-weight:700; cursor:pointer;"
                    onclick="${this.previewMode ? '' : `builder.editButtonText(this,'${componentId}','primaryButton')`}">
              ${data.primaryButton || 'Get Started'}
            </button>
            <button class="editable-button" style="background:transparent; color:#fff; padding:1.25rem 2.5rem; border:2px solid #fff; border-radius:50px; font-size:1.2rem; font-weight:700; cursor:pointer;"
                    onclick="${this.previewMode ? '' : `builder.editButtonText(this,'${componentId}','secondaryButton')`}">
              ${data.secondaryButton || 'Learn More'}
            </button>
          </div>
        </div>
        ${uploadZoneHtml}
      </section>
    `;
  }

  renderAboutV16(data, componentId) {
    const ce = this.previewMode ? '' : 'contenteditable="true"';
    const imgStyle = data.image
      ? `background:url(${data.image}); background-size:cover; background-position:center;`
      : 'background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);';
    const imgClickHandler = this.previewMode ? '' : `onclick="builder.uploadImage('${componentId}','image')"`; // upload hook

    return `
      <section class="about-v16" style="background:#f8fafc; padding:8rem 2rem;">
        <div class="container" style="max-width:1400px; margin:0 auto;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center;">
            <div>
              <h2 class="editable-text" ${ce} style="font-size:3rem; font-weight:800; margin-bottom:2rem; color:#1e293b; line-height:1.2;"
                  onblur="builder.updateComponentData('${componentId}','title',this.textContent)">
                ${data.title ?? 'About JAM Group Studio'}
              </h2>
              <p class="editable-text" ${ce} style="font-size:1.2rem; line-height:1.8; color:#64748b; margin-bottom:3rem;"
                 onblur="builder.updateComponentData('${componentId}','description',this.textContent)">
                ${data.description ?? "We're a full‑service digital agency dedicated to helping local businesses succeed online."}
              </p>
              <button class="editable-button"
                      style="background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%); color:#fff; padding:1.25rem 2.5rem; border:none; border-radius:12px; font-size:1.1rem; font-weight:600; cursor:pointer;"
                      onclick="${this.previewMode ? '' : `builder.editButtonText(this,'${componentId}','primaryButton')`}">
                ${data.primaryButton || 'Learn More About Us'}
              </button>
            </div>

            <div class="about-image-zone"
                 style="min-height:500px; ${imgStyle}; border-radius:20px; display:flex; align-items:center; justify-content:center; cursor:${this.previewMode ? 'default' : 'pointer'}; border:3px dashed ${data.image ? 'transparent' : '#cbd5e1'};"
                 ${imgClickHandler}>
              ${!data.image && !this.previewMode ? '<span style="color:#64748b; font-size:1.3rem; font-weight:600;">📸 Click to add image</span>' : ''}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderServicesV16(data, componentId) {
    const ce = this.previewMode ? '' : 'contenteditable="true"';
    const addBtn = this.previewMode
      ? ''
      : `<button class="add-service-btn"
           style="background:linear-gradient(135deg,#10b981 0%, #059669 100%); color:#fff; padding:1rem 2rem; border:none; border-radius:12px; margin-top:3rem; cursor:pointer; font-size:1.1rem; font-weight:600;"
           onclick="builder.addServiceCard('${componentId}')">+ Add Service</button>`;

    return `
      <section class="services-v16" style="background:#fff; padding:8rem 2rem;">
        <div class="container" style="max-width:1400px; margin:0 auto; text-align:center;">
          <h2 class="editable-text" ${ce}
              style="font-size:3rem; font-weight:800; margin-bottom:1.5rem; color:#1e293b;"
              onblur="builder.updateComponentData('${componentId}','title',this.textContent)">
            ${data.title ?? 'Our Services'}
          </h2>
          <p class="editable-text" ${ce}
             style="font-size:1.3rem; color:#64748b; margin-bottom:5rem; max-width:700px; margin-left:auto; margin-right:auto; line-height:1.6;"
             onblur="builder.updateComponentData('${componentId}','subtitle',this.textContent)">
            ${data.subtitle ?? 'Everything you need to dominate your market online'}
          </p>

          <div class="services-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(350px, 1fr)); gap:3rem;">
            ${this.renderServiceCards(data.services || [], componentId)}
          </div>

          ${addBtn}
        </div>
      </section>
    `;
  }

  renderServiceCards(services, componentId) {
    if (services.length === 0) {
      services = [
        { title: 'Web Design & Development', description: 'Custom websites built for conversion and performance.' },
        { title: 'SEO & Local Search', description: 'Get found by customers with proven SEO strategies.' },
        { title: 'Branding & Design', description: 'Stand out with professional branding that builds trust.' },
      ];
    }

    return services
      .map((service, i) => {
        const ce = this.previewMode ? '' : 'contenteditable="true"';
        const removeBtn = this.previewMode
          ? ''
          : `<button class="remove-service"
                style="position:absolute; top:1rem; right:1rem; background:#ef4444; color:#fff; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer; font-weight:bold;"
                onclick="builder.removeServiceCard('${componentId}', ${i})">×</button>`;

        return `
          <div class="service-card" style="background:linear-gradient(135deg,#f8fafc 0%, #f1f5f9 100%); padding:3rem; border-radius:20px; border:1px solid #e2e8f0; position:relative;">
            ${removeBtn}
            <div style="width:80px; height:80px; background:linear-gradient(135deg,#3b82f6 0%, #1d4ed8 100%); border-radius:20px; margin:0 auto 2rem; display:flex; align-items:center; justify-content:center; font-size:2rem;">🚀</div>
            <h3 class="editable-text" ${ce}
                style="font-size:1.8rem; font-weight:700; margin-bottom:1.5rem; color:#1e293b; text-align:center;"
                onblur="builder.updateServiceCard('${componentId}', ${i}, 'title', this.textContent)">
              ${service.title}
            </h3>
            <p class="editable-text" ${ce}
               style="color:#64748b; line-height:1.7; font-size:1.1rem; text-align:center;"
               onblur="builder.updateServiceCard('${componentId}', ${i}, 'description', this.textContent)">
              ${service.description}
            </p>
          </div>
        `;
      })
      .join('');
  }

  renderCtaV20(data, componentId) {
    const ce = this.previewMode ? '' : 'contenteditable="true"';

    return `
      <section class="cta-v20" style="background:linear-gradient(135deg,#1e293b 0%, #334155 100%); color:#fff; padding:8rem 2rem; text-align:center; position:relative; overflow:hidden;">
        <div class="container" style="max-width:900px; margin:0 auto; position:relative; z-index:2;">
          <h2 class="editable-text" ${ce}
              style="font-size:3.5rem; font-weight:800; margin-bottom:2rem; line-height:1.2;"
              onblur="builder.updateComponentData('${componentId}','title',this.textContent)">
            ${data.title ?? 'Ready to Grow Your Business?'}
          </h2>
          <p class="editable-text" ${ce}
             style="font-size:1.4rem; margin-bottom:4rem; opacity:.95; line-height:1.6; max-width:700px; margin-left:auto; margin-right:auto;"
             onblur="builder.updateComponentData('${componentId}','description',this.textContent)">
            ${data.description ?? 'Join 100+ businesses that trust JAM Group Studio. Get your free consultation today.'}
          </p>

          <div style="display:flex; gap:2rem; justify-content:center; flex-wrap:wrap;">
            <button class="editable-button"
                    style="background:linear-gradient(135deg,#10b981 0%, #059669 100%); color:#fff; padding:1.5rem 3rem; border:none; border-radius:50px; font-size:1.2rem; font-weight:700; cursor:pointer;"
                    onclick="${this.previewMode ? '' : `builder.editButtonText(this,'${componentId}','primaryButton')`}">
              ${data.primaryButton || 'Get Started Today'}
            </button>
            <button class="editable-button"
                    style="background:transparent; color:#fff; padding:1.5rem 3rem; border:3px solid #fff; border-radius:50px; font-size:1.2rem; font-weight:700; cursor:pointer;"
                    onclick="${this.previewMode ? '' : `builder.editButtonText(this,'${componentId}','secondaryButton')`}">
              ${data.secondaryButton || 'Learn More'}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  renderGenericComponent(component, data) {
    const ce = this.previewMode ? '' : 'contenteditable="true"';

    return `
      <section style="padding:6rem 2rem; background:#fff; border:2px dashed #e2e8f0; min-height:300px; display:flex; align-items:center; justify-content:center;">
        <div style="max-width:800px; text-align:center;">
          <h2 ${ce}
              style="font-size:2.5rem; font-weight:700; margin-bottom:1.5rem; color:#6b7280;"
              onblur="builder.updateComponentData('${component.id}','title',this.textContent)">
            ${data.title || `${component.variant} Component`}
          </h2>
          <p ${ce}
             style="color:#9ca3af; line-height:1.7; font-size:1.1rem;"
             onblur="builder.updateComponentData('${component.id}','description',this.textContent)">
            ${data.description || 'This component template needs to be implemented. Click to edit this content.'}
          </p>
        </div>
      </section>
    `;
  }

  // ========== INLINE EDITING ==========

  setupInlineEditing() {
    const style = document.createElement('style');
    style.textContent = `
      .editable-text:focus {
        outline: 3px solid #3b82f6;
        outline-offset: 4px;
        background: rgba(59,130,246,.05);
        border-radius: 4px;
      }
      .editable-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(0,0,0,.2) !important;
      }
      .image-upload-zone:hover {
        border-color: #3b82f6 !important;
        background: rgba(59,130,246,.1) !important;
      }
      .placed-component.editable:hover { box-shadow: 0 0 0 2px #3b82f6; cursor: pointer; }
      .placed-component.selected { box-shadow: 0 0 0 3px #3b82f6; }
      .component-controls { opacity: 0; transition: all .2s; }
      .placed-component:hover .component-controls { opacity: 1; }
      .control-btn:disabled { opacity: .5; cursor: not-allowed; }
      body.preview-mode .component-controls,
      body.preview-mode .image-upload-zone,
      body.preview-mode .add-service-btn { display: none !important; }
      body.preview-mode [contenteditable="true"] { pointer-events: none; }
      body.preview-mode .placed-component { border: none !important; box-shadow: none !important; cursor: default !important; }
      .sortable-ghost { opacity: .3; }
      .sortable-chosen { cursor: grabbing !important; }
      .sortable-drag { transform: rotate(5deg); z-index: 9999; }
    `;
    document.head.appendChild(style);
  }

  updateComponentData(componentId, field, value) {
    const current = this.componentData.get(componentId) || {};
    current[field] = value;
    this.componentData.set(componentId, current);
    this.markDirty();
  }

  editButtonText(btn, componentId, buttonType) {
    if (this.previewMode) return;
    const current = btn.textContent.trim();
    const next = prompt(`Edit ${buttonType} text:`, current);
    if (next && next !== current) {
      btn.textContent = next;
      this.updateComponentData(componentId, buttonType, next);
    }
  }

  uploadImage(componentId, field) {
    if (this.previewMode) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        this.updateComponentData(componentId, field, ev.target.result);
        this.renderPage();
        this.showToast('Image uploaded successfully! 📸');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // ========== DYNAMIC CONTENT HELPERS ==========

  addServiceCard(componentId) {
    const current = this.componentData.get(componentId) || {};
    const services = current.services || [];
    services.push({
      title: 'New Service',
      description: 'Click to edit this service description and make it compelling.',
    });
    this.updateComponentData(componentId, 'services', services);
    this.renderPage();
    this.showToast('Service card added! ✨');
  }

  removeServiceCard(componentId, index) {
    const current = this.componentData.get(componentId) || {};
    const services = current.services || [];
    services.splice(index, 1);
    this.updateComponentData(componentId, 'services', services);
    this.renderPage();
    this.showToast('Service card removed! 🗑️');
  }

  updateServiceCard(componentId, index, field, value) {
    const current = this.componentData.get(componentId) || {};
    const services = current.services || [];
    if (services[index]) {
      services[index][field] = value;
      this.updateComponentData(componentId, 'services', services);
    }
  }

  // ========== DATA MANAGEMENT ==========

  getComponentData(componentId) {
    return this.componentData.get(componentId);
  }

  getDefaultData(component) {
    const defaults = {
      HeroV16: {
        title: 'Transform Your Business with Professional Web Design',
        subtitle: 'We create stunning websites that drive results',
        description:
          'Get a website that not only looks amazing but actually converts visitors into customers.',
        primaryButton: 'Get Your Free Quote',
        secondaryButton: 'View Our Work',
      },
      HeroV19: {
        title: 'Next-Level Digital Solutions',
        subtitle: 'Modern web experiences that captivate and convert',
        description:
          'Cutting-edge design meets powerful technology to set you apart from the competition.',
        primaryButton: 'Start Your Project',
        secondaryButton: 'See Our Process',
      },
      AboutV16: {
        title: 'About JAM Group Studio',
        description:
          "We're a full-service digital agency dedicated to helping local businesses succeed online.",
        primaryButton: 'Learn More About Us',
      },
      ServicesV16: {
        title: 'Our Services',
        subtitle: 'Everything you need to dominate your market online',
        services: [
          { title: 'Web Design & Development', description: 'Custom websites built for conversion and performance.' },
          { title: 'SEO & Local Search', description: 'Get found by customers with proven SEO strategies.' },
          { title: 'Branding & Design', description: 'Stand out with professional branding that builds trust.' },
        ],
      },
      CtaV20: {
        title: 'Ready to Grow Your Business?',
        description:
          'Join 100+ businesses that trust JAM Group Studio. Get your free consultation today.',
        primaryButton: 'Get Started Today',
        secondaryButton: 'Schedule a Call',
      },
    };

    return defaults[component.variant] || {
      title: 'Edit This Title',
      description: 'Click to edit this content.',
      primaryButton: 'Call to Action',
    };
  }

  // ========== PREVIEW MODE ==========

  togglePreview() {
    this.previewMode = !this.previewMode;
    document.body.classList.toggle('preview-mode', this.previewMode);

    const previewBtn = document.getElementById('previewToggle');
    if (previewBtn) {
      previewBtn.innerHTML = this.previewMode ? '<span>✏️</span> Edit Mode' : '<span>👁️</span> Preview';
    }

    this.renderPage();
    this.showToast(this.previewMode ? 'Preview mode enabled! 👁️' : 'Edit mode enabled! ✏️');
  }

  // ========== SORTABLE (DRAG TO REORDER) ==========

  initSortable() {
    const pagePreview = document.querySelector('.page-preview');
    if (!window.Sortable || !pagePreview || this.pageStructure.length === 0) return;

    if (this.sortable) this.sortable.destroy();

    this.sortable = window.Sortable.create(pagePreview, {
      animation: 200,
      handle: '.placed-component',
      draggable: '.placed-component',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onStart: () => {
        document.body.style.cursor = 'grabbing';
      },
      onEnd: (evt) => {
        document.body.style.cursor = '';

        const item = this.pageStructure.splice(evt.oldIndex, 1)[0];
        this.pageStructure.splice(evt.newIndex, 0, item);

        this.renderPage();
        this.markDirty();
        this.showToast('Component moved! 🔄');
      },
    });
  }

  // ========== AUTOSAVE & PERSISTENCE ==========

  markDirty() {
    this.dirty = true;
    this.saveDraftToLocal();
  }

  startAutosave() {
    setInterval(() => {
      if (this.dirty) {
        this.saveDraftToLocal();
        this.dirty = false;
      }
    }, 5000);
  }

  saveDraftToLocal() {
    try {
      const draft = {
        pageStructure: this.pageStructure,
        componentData: Array.from(this.componentData.entries()),
        pageName: document.getElementById('pageName')?.value || '',
        pageSlug: document.getElementById('pageSlug')?.value || '',
        pageDescription: document.getElementById('pageDescription')?.value || '',
        timestamp: Date.now(),
      };
      localStorage.setItem('jam-builder-draft', JSON.stringify(draft));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }

  restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem('jam-builder-draft') || '{}');

      if (draft.pageStructure && Array.isArray(draft.pageStructure)) {
        this.pageStructure = draft.pageStructure;
      }

      if (draft.componentData && Array.isArray(draft.componentData)) {
        this.componentData = new Map(draft.componentData);
      }

      if (draft.pageName) document.getElementById('pageName').value = draft.pageName;
      if (draft.pageSlug) document.getElementById('pageSlug').value = draft.pageSlug;
      if (draft.pageDescription) document.getElementById('pageDescription').value = draft.pageDescription;

      if (this.pageStructure.length > 0) {
        this.renderPage();
        this.showToast('Draft restored! 📋');
      }
    } catch (error) {
      console.warn('Failed to restore draft:', error);
    }
  }

  // ========== SAVE TO PAYLOAD ==========

  async savePage() {
    const pageName = document.getElementById('pageName')?.value || 'New Page';
    const pageSlug = document.getElementById('pageSlug')?.value || 'new-page';
    const pageDescription = document.getElementById('pageDescription')?.value || '';

    if (!pageName.trim()) {
      alert('Please enter a page name before saving.');
      return;
    }

    const pageBlocks = this.pageStructure.map((component) => {
      const data = this.getComponentData(component.id) || this.getDefaultData(component);

      return {
        blockType: component.type,
        variant: component.variant,
        id: component.id,
        componentName: component.variant,
        title: data.title || '',
        subtitle: data.subtitle || '',
        content: data.description || '',
        description: data.description || '',
        primaryButton: data.primaryButton ? { text: data.primaryButton, url: '#' } : null,
        secondaryButton: data.secondaryButton ? { text: data.secondaryButton, url: '#' } : null,
        image: data.image ? { url: data.image, alt: data.title || 'Image' } : null,
        backgroundImage: data.backgroundImage ? { url: data.backgroundImage, alt: 'Background image' } : null,
        services: data.services || null,
        customData: data,
      };
    });

    const payload = {
      title: pageName,
      slug: pageSlug,
      metaDescription: pageDescription,
      pageBlocks,
      status: 'draft',
    };

    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn?.innerHTML;
    if (saveBtn) {
      saveBtn.innerHTML = '⏳ Saving...';
      saveBtn.disabled = true;
    }

    try {
      const response = await fetch('http://localhost:3000/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      this.showSuccessMessage(pageName, pageSlug);
      this.dirty = false;
      localStorage.removeItem('jam-builder-draft');

      setTimeout(() => {
        if (confirm('Page saved successfully! 🎉\n\nStart a new page?')) {
          this.resetBuilder();
        }
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Failed to save page.\n\nError: ${error.message}\n\nMake sure Payload CMS is running on localhost:3000`);
    } finally {
      if (saveBtn && originalText) {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
      }
    }
  }

  showSuccessMessage(name, slug) {
    const successEl = document.getElementById('successMessage');
    if (successEl) {
      successEl.innerHTML = `✅ <strong>${name}</strong> saved as <code>/${slug}</code>`;
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 4000);
    }
  }

  resetBuilder() {
    this.pageStructure = [];
    this.componentData.clear();
    this.selectedComponent = null;

    const name = document.getElementById('pageName');
    const slug = document.getElementById('pageSlug');
    const desc = document.getElementById('pageDescription');
    if (name) name.value = '';
    if (slug) slug.value = '';
    if (desc) desc.value = '';

    this.renderPage();
    this.showToast('Builder reset! Ready for a new page. ✨');
  }

  // ========== UI HELPERS ==========

  bindEvents() {
    document.getElementById('previewToggle')?.addEventListener('click', () => {
      this.togglePreview();
    });

    document.getElementById('pageName')?.addEventListener('input', (e) => {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const slugInput = document.getElementById('pageSlug');
      if (slugInput && !slugInput.value) slugInput.value = slug;
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          this.savePage();
        } else if (e.key === 'p') {
          e.preventDefault();
          this.togglePreview();
        }
      }
    });
  }

  updatePropertiesPanel(componentId) {
    const component = this.pageStructure.find((c) => c.id === componentId);
    const panelEl = document.getElementById('selectedComponentInfo');
    if (panelEl && component) {
      panelEl.innerHTML = `
        <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem;">
          <div style="font-weight:600; color:#1e293b;">${component.variant}</div>
          <div style="font-size:.875rem; color:#64748b;">${component.type} component</div>
        </div>
      `;
      const settings = document.getElementById('componentSettings');
      if (settings) settings.style.display = 'block';
    }
  }

  showToast(message) {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #1e293b;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: slideInUp .3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutDown .3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
  }
}

// Global helpers for onclick handlers
window.savePage = function () {
  if (window.builder) window.builder.savePage();
};
window.previewPage = function () {
  if (window.builder) window.builder.togglePreview();
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.builder = new JAMBuilderPro();
  console.log('🚀 JAM Builder Pro is ready to rock!');
});
