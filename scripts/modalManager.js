// 모달 생성/닫기/애니메이션 통일
const modalManager = {
  currentModal: null,
  
  open({ title, html, actions = [] }) {
    // 기존 모달이 있으면 닫기
    this.close();
    
    // 모달 HTML 생성
    const modalHTML = `
      <div class="modal" id="dynamic-modal">
        <div class="modal__content">
          <div class="modal__header">
            <h3 class="modal__header-title">${title || ''}</h3>
            <button class="modal__close" type="button" data-action="close-modal">×</button>
          </div>
          <div class="modal__body">
            ${html || ''}
          </div>
          ${actions.length > 0 ? `
            <div class="modal__footer">
              ${actions.map(action => `
                <button class="btn ${action.class || 'btn--secondary'}" 
                        type="button" 
                        data-action="${action.action || 'close-modal'}">
                  ${action.label || '확인'}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // 모달 삽입
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    const modal = document.getElementById('dynamic-modal');
    this.currentModal = modal;
    
    // 닫기 버튼 이벤트
    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    
    // 배경 클릭 시 닫기
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close();
      }
    });
    
    // 액션 버튼 이벤트
    actions.forEach(action => {
      if (action.onClick) {
        const actionBtn = modal.querySelector(`[data-action="${action.action}"]`);
        if (actionBtn) {
          actionBtn.addEventListener('click', () => {
            action.onClick();
            if (action.closeAfter !== false) {
              this.close();
            }
          });
        }
      }
    });
    
    // 애니메이션
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  },
  
  close() {
    if (this.currentModal) {
      this.currentModal.style.opacity = '0';
      setTimeout(() => {
        if (this.currentModal && this.currentModal.parentNode) {
          this.currentModal.parentNode.remove();
        }
        this.currentModal = null;
      }, 200);
    }
  }
};

window.modalManager = modalManager;

