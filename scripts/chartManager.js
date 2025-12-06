// Chart.js 선언 및 lazy-render
const chartManager = {
  chartInstances: {},
  observers: new Map(),
  
  init() {
    // Intersection Observer 생성
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const canvas = entry.target;
          const renderFn = this.observers.get(canvas);
          if (renderFn && !this.chartInstances[canvas.id]) {
            renderFn();
          }
        }
      });
    }, {
      threshold: 0.1
    });
  },
  
  renderWhenVisible(canvasElement, callback) {
    if (!canvasElement || !canvasElement.id) {
      console.warn('Chart canvas must have an id');
      return;
    }
    
    // 이미 렌더링된 경우 스킵
    if (this.chartInstances[canvasElement.id]) {
      return;
    }
    
    // Observer에 등록
    this.observers.set(canvasElement, callback);
    this.observer.observe(canvasElement);
    
    // 이미 보이는 경우 즉시 렌더링
    if (this.isVisible(canvasElement)) {
      callback();
    }
  },
  
  isVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // 기존 차트가 있으면 제거
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }
    
    // 새 차트 생성
    const chart = new Chart(canvas, config);
    this.chartInstances[canvasId] = chart;
    
    return chart;
  },
  
  onRouteChange(route) {
    // 라우트 변경 시 차트는 유지 (필요시 재렌더링)
  },
  
  onTabChange(panel) {
    // 탭 변경 시 해당 패널의 차트 렌더링
    const canvases = panel.querySelectorAll('canvas[id]');
    canvases.forEach(canvas => {
      const renderFn = this.observers.get(canvas);
      if (renderFn && !this.chartInstances[canvas.id]) {
        if (this.isVisible(canvas)) {
          renderFn();
        } else {
          this.observer.observe(canvas);
        }
      }
    });
  },
  
  destroyChart(canvasId) {
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
      delete this.chartInstances[canvasId];
    }
  },
  
  destroyAll() {
    Object.keys(this.chartInstances).forEach(id => {
      this.destroyChart(id);
    });
  }
};

window.chartManager = chartManager;

