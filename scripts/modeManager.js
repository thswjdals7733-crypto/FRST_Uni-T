// 모드 전환 관리 (학생/학부모/튜터/관리자)
const modeManager = {
  currentRoute: 'student',
  
  init() {
    // 초기 body route 설정
    document.body.setAttribute('data-route', this.currentRoute);

    // 프로필 스위치 버튼 이벤트
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const route = btn.getAttribute('data-mode');
        this.switchRoute(route);
      });
    });
    
    // 초기 라우트 설정
    this.switchRoute(this.currentRoute);
  },
  
  switchRoute(route) {
    this.currentRoute = route;
    document.body.setAttribute('data-route', route);
    
    // 모든 data-view 숨기기
    document.querySelectorAll('[data-view]').forEach(view => {
      view.setAttribute('hidden', '');
    });
    
    // 해당 route의 view만 표시
    const targetView = document.querySelector(`[data-view="${route}"]`);
    if (targetView) {
      targetView.removeAttribute('hidden');
    }
    
    // 프로필 스위치 버튼 활성화 상태 업데이트
    document.querySelectorAll('[data-mode]').forEach(btn => {
      if (btn.getAttribute('data-mode') === route) {
        btn.classList.add('profile-switch__btn--active');
      } else {
        btn.classList.remove('profile-switch__btn--active');
      }
    });
    
    // 탭 매니저에 라우트 변경 알림
    if (window.tabManager) {
      window.tabManager.onRouteChange(route);
    }
    
    // 차트 매니저에 라우트 변경 알림
    if (window.chartManager) {
      window.chartManager.onRouteChange(route);
    }
  },
  
  getCurrentRoute() {
    return this.currentRoute;
  }
};

window.modeManager = modeManager;

