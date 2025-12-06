// 탭 전환 관리 (모든 탭 UI 전환 로직)
const tabManager = {
  currentRoute: null,
  
  init() {
    // 모든 data-tabs 그룹 스캔
    document.querySelectorAll('[data-tabs]').forEach(tabsGroup => {
      this.initTabGroup(tabsGroup);
    });
  },
  
  initTabGroup(tabsGroup) {
    const tabButtons = tabsGroup.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll(`[data-tab-panel]`);
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(tabsGroup, targetTab);
      });
    });
  },
  
  switchTab(tabsGroup, targetTab) {
    const groupId = tabsGroup.getAttribute('data-tabs');
    const isReportTabs = tabsGroup.classList.contains('report-tabs');
    const isMatchingTabs = tabsGroup.classList.contains('matching-board__tabs');
    
    // 같은 그룹 내의 모든 버튼 비활성화
    tabsGroup.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.remove('tab-nav__btn--active', 'report-tabs__btn--active', 'matching-board__tab--active');
    });
    
    // 같은 그룹 내의 모든 패널 숨기기
    const view = tabsGroup.closest('[data-view]');
    if (view) {
      if (isReportTabs) {
        // 리포트 탭의 경우 report-tabs__content 찾기
        view.querySelectorAll('.report-tabs__content').forEach(panel => {
          panel.classList.remove('report-tabs__content--active');
          panel.setAttribute('hidden', '');
        });
      } else if (isMatchingTabs) {
        // 매칭 탭의 경우 matching-board__content 찾기
        view.querySelectorAll('.matching-board__content').forEach(panel => {
          panel.classList.remove('matching-board__content--active');
          panel.setAttribute('hidden', '');
        });
      } else {
        // 일반 탭의 경우
        view.querySelectorAll('[data-tab-panel]').forEach(panel => {
          panel.setAttribute('hidden', '');
          panel.classList.remove('tab-panel--active');
        });
      }
    }
    
    // 활성화할 버튼 찾기
    const activeBtn = tabsGroup.querySelector(`[data-tab="${targetTab}"]`);
    if (activeBtn) {
      if (isReportTabs) {
        activeBtn.classList.add('report-tabs__btn--active');
      } else if (isMatchingTabs) {
        activeBtn.classList.add('matching-board__tab--active');
      } else {
        activeBtn.classList.add('tab-nav__btn--active');
      }
    }
    
    // 활성화할 패널 찾기
    let activePanel = null;
    if (isReportTabs) {
      activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('report-tabs__content--active');
        activePanel.removeAttribute('hidden');
      }
    } else if (isMatchingTabs) {
      // 매칭 탭의 경우 id로 찾기
      activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('matching-board__content--active');
        activePanel.removeAttribute('hidden');
      }
    } else {
      activePanel = document.querySelector(`[data-tab-panel="${targetTab}"]`);
      if (activePanel) {
        activePanel.removeAttribute('hidden');
        activePanel.classList.add('tab-panel--active');
      }
    }
    
    // 차트 매니저에 탭 변경 알림
    if (activePanel && window.chartManager) {
      chartManager.onTabChange(activePanel);
    }
  },
  
  onRouteChange(route) {
    this.currentRoute = route;
    // 라우트 변경 시 첫 번째 탭으로 리셋
    const view = document.querySelector(`[data-view="${route}"]`);
    if (view) {
      const firstTabsGroup = view.querySelector('[data-tabs]');
      if (firstTabsGroup) {
        const firstTab = firstTabsGroup.querySelector('[data-tab]');
        if (firstTab) {
          const targetTab = firstTab.getAttribute('data-tab');
          this.switchTab(firstTabsGroup, targetTab);
        }
      }
    }
  }
};

window.tabManager = tabManager;

