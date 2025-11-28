// 모드 전환, 탭 전환, 차트 렌더링 등

// 차트 인스턴스 저장
const chartInstances = {};

// ============================================
// 차트 렌더링 함수들
// ============================================

// 팀 내 위치 세로 막대 그래프 (등수가 높을수록 막대가 높게)
function renderRankChart(canvasId, rank, total) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // 기존 차트가 있으면 제거
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  // 전체 팀원 위치 데이터 생성 (1위가 가장 높게, 등수가 낮을수록 낮게)
  const positions = Array.from({ length: total }, (_, i) => i + 1);
  // 등수가 높을수록(1위가 최고) 값이 높게 설정
  const data = positions.map(pos => {
    // 1위 = 100, 2위 = 80, 3위 = 60... 이런 식으로
    const score = 100 - (pos - 1) * 20;
    return score;
  });
  
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: positions.map(p => `${p}위`),
      datasets: [{
        label: '점수',
        data: data,
        backgroundColor: data.map((val, idx) => 
          idx + 1 === rank ? 'rgba(4, 89, 240, 0.9)' : 'rgba(229, 231, 235, 0.3)'
        ),
        borderColor: data.map((val, idx) => 
          idx + 1 === rank ? 'rgba(4, 89, 240, 1)' : 'rgba(229, 231, 235, 0.5)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'x', // 세로 막대 그래프
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.y}점`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            },
            color: function(context) {
              return context.tick.label === `${rank}위` 
                ? 'rgba(4, 89, 240, 1)' 
                : 'rgba(75, 85, 99, 0.6)';
            },
            font: function(context) {
              return {
                size: context.tick.label === `${rank}위` ? 12 : 11,
                weight: context.tick.label === `${rank}위` ? 'bold' : 'normal'
              };
            }
          }
        },
        y: {
          display: true,
          max: 100,
          min: 0,
          grid: {
            display: true,
            color: 'rgba(229, 231, 235, 0.5)'
          },
          ticks: {
            font: {
              size: 10
            },
            color: 'rgba(75, 85, 99, 0.6)',
            callback: function(value) {
              return value + '점';
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  });
}

// 성취도 도넛 차트 - 과제 수행률
function renderAssignmentChart(canvasId, assignmentRate) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['과제 완료', '미완료'],
      datasets: [{
        data: [assignmentRate, 100 - assignmentRate],
        backgroundColor: [
          'rgba(4, 89, 240, 0.9)',
          'rgba(229, 231, 235, 0.4)'
        ],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.label === '과제 완료') {
                return `과제 수행률: ${context.parsed}%`;
              }
              return '';
            }
          },
          filter: function(tooltipItem) {
            return tooltipItem.label === '과제 완료';
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: 'easeOutQuart'
      }
    },
    plugins: [{
      id: 'centerText',
      beforeDraw: function(chart) {
        const ctx = chart.ctx;
        const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
        const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
        
        ctx.save();
        ctx.font = 'bold 16px Pretendard';
        ctx.fillStyle = 'rgba(4, 89, 240, 1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${assignmentRate}%`, centerX, centerY - 8);
        
        ctx.font = '12px Pretendard';
        ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
        ctx.fillText('과제 수행률', centerX, centerY + 8);
        ctx.restore();
      }
    }]
  });
}

// 성취도 도넛 차트 - 테스트 점수 (내 점수와 평균)
function renderTestChart(canvasId, myScore, averageScore) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  // 내 점수와 평균을 비교하여 도넛 차트로 표시
  const maxScore = 100;
  const myPercentage = (myScore / maxScore) * 100;
  const avgPercentage = (averageScore / maxScore) * 100;
  
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['내 점수', '평균', '미달성'],
      datasets: [{
        data: [myPercentage, avgPercentage - myPercentage, maxScore - avgPercentage],
        backgroundColor: [
          'rgba(4, 89, 240, 0.9)',      // 내 점수
          'rgba(0, 43, 92, 0.7)',        // 평균
          'rgba(229, 231, 235, 0.4)'    // 미달성
        ],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.label === '내 점수') {
                return `내 점수: ${myScore}점`;
              } else if (context.label === '평균') {
                return `평균: ${averageScore}점`;
              }
              return '';
            },
            filter: function(tooltipItem) {
              return tooltipItem.label !== '미달성';
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: 'easeOutQuart'
      }
    },
    plugins: [{
      id: 'centerText',
      beforeDraw: function(chart) {
        const ctx = chart.ctx;
        const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
        const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
        
        ctx.save();
        ctx.font = 'bold 16px Pretendard';
        ctx.fillStyle = 'rgba(4, 89, 240, 1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${myScore}점`, centerX, centerY - 12);
        
        ctx.font = '11px Pretendard';
        ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
        ctx.fillText(`평균 ${averageScore}점`, centerX, centerY + 4);
        ctx.restore();
      }
    }]
  });
}

// 학습 패턴 꺾은선 그래프
function renderTrendChart(canvasId, trendValue) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  // 지난 6개월 데이터 (예시)
  const months = ['5월', '6월', '7월', '8월', '9월', '10월'];
  const baseScore = 80;
  const scores = months.map((_, index) => {
    if (index === months.length - 1) {
      return baseScore + trendValue;
    }
    return baseScore - 5 + Math.random() * 10 + (index * 2);
  });

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: '점수',
        data: scores,
        borderColor: 'rgba(4, 89, 240, 1)',
        backgroundColor: 'rgba(4, 89, 240, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(4, 89, 240, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `점수: ${context.parsed.y.toFixed(1)}점`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            },
            color: 'rgba(75, 85, 99, 0.8)'
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// 모든 차트 렌더링
function renderAllCharts() {
  // 학부모 모드 차트 (항상 렌더링)
  renderRankChart('parent-rank-chart', 2, 5); // 전체 5명 중 2위
  renderAssignmentChart('parent-assignment-chart', 90); // 과제 90%
  renderTestChart('parent-test-chart', 85, 80); // 내 점수 85점, 평균 80점
  renderTrendChart('parent-trend-chart', 5); // 지난달 대비 +5점
}

// 학생 모드 차트 렌더링
function renderStudentCharts() {
  renderRankChart('student-rank-chart', 2, 5); // 전체 5명 중 2위
  renderAssignmentChart('student-assignment-chart', 90); // 과제 90%
  renderTestChart('student-test-chart', 85, 80); // 내 점수 85점, 평균 80점
  renderTrendChart('student-trend-chart', 5); // 지난달 대비 +5점
}

// ============================================
// 1. 모드 전환 (학생 ↔ 학부모)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // 차트 렌더링
  setTimeout(() => {
    renderAllCharts();
  }, 100);
  const profileSwitch = document.querySelector('[data-component="profile-switch"]');
  const studentDashboard = document.querySelector('.dashboard--student');
  const parentDashboard = document.querySelector('.dashboard--parent');
  const tutorDashboard = document.querySelector('.dashboard--tutor');
  const adminDashboard = document.querySelector('.dashboard--admin');
  const app = document.querySelector('.app');

  if (profileSwitch) {
    const buttons = profileSwitch.querySelectorAll('.profile-switch__btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const mode = this.getAttribute('data-mode');
        
        // 버튼 활성 상태 업데이트
        buttons.forEach(btn => {
          btn.classList.remove('profile-switch__btn--active');
        });
        this.classList.add('profile-switch__btn--active');
        
        // 대시보드 전환
        if (mode === 'student') {
          studentDashboard.removeAttribute('hidden');
          parentDashboard.setAttribute('hidden', '');
          tutorDashboard.setAttribute('hidden', '');
          adminDashboard.setAttribute('hidden', '');
          app.className = 'app app--mode-student';
          // 학생 모드: 월간 리포트 탭이 활성화되어 있으면 차트 렌더링
          const studentReportTab = document.querySelector('[data-tab-panel="student-report"]');
          if (studentReportTab && !studentReportTab.hasAttribute('hidden')) {
            setTimeout(() => {
              renderStudentCharts();
            }, 100);
          }
        } else if (mode === 'parent') {
          parentDashboard.removeAttribute('hidden');
          studentDashboard.setAttribute('hidden', '');
          tutorDashboard.setAttribute('hidden', '');
          adminDashboard.setAttribute('hidden', '');
          app.className = 'app app--mode-parent';
          // 학부모 모드 차트 렌더링
          setTimeout(() => {
            renderRankChart('parent-rank-chart', 2, 5);
            renderAssignmentChart('parent-assignment-chart', 90);
            renderTestChart('parent-test-chart', 85, 80);
            renderTrendChart('parent-trend-chart', 5);
          }, 100);
        } else if (mode === 'tutor') {
          tutorDashboard.removeAttribute('hidden');
          studentDashboard.setAttribute('hidden', '');
          parentDashboard.setAttribute('hidden', '');
          adminDashboard.setAttribute('hidden', '');
          app.className = 'app app--mode-tutor';
        } else if (mode === 'admin') {
          adminDashboard.removeAttribute('hidden');
          studentDashboard.setAttribute('hidden', '');
          parentDashboard.setAttribute('hidden', '');
          tutorDashboard.setAttribute('hidden', '');
          app.className = 'app app--mode-admin';
          // 관리자 모드: 튜터 등급 차트 렌더링
          setTimeout(() => {
            renderTutorGradeChart();
          }, 100);
        }
      });
    });
  }

  // ============================================
  // 2. 탭 전환 (학생 모드)
  // ============================================
  const studentTabs = document.querySelector('[data-component="student-tabs"]');
  if (studentTabs) {
    const tabButtons = studentTabs.querySelectorAll('.tab-nav__btn');
    const tabPanels = document.querySelectorAll('[data-tab-panel^="student-"]');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // 버튼 활성 상태 업데이트
        tabButtons.forEach(btn => {
          btn.classList.remove('tab-nav__btn--active');
        });
        this.classList.add('tab-nav__btn--active');
        
        // 패널 전환
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-tab-panel') === targetTab) {
            panel.classList.add('tab-panel--active');
            panel.removeAttribute('hidden');
            
            // 월간 리포트 탭이 활성화되면 차트 렌더링
            if (targetTab === 'student-report') {
              setTimeout(() => {
                renderStudentCharts();
              }, 100);
            }
          } else {
            panel.classList.remove('tab-panel--active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // ============================================
  // 3. 탭 전환 (학부모 모드)
  // ============================================
  const parentTabs = document.querySelector('[data-component="parent-tabs"]');
  if (parentTabs) {
    const tabButtons = parentTabs.querySelectorAll('.tab-nav__btn');
    const tabPanels = document.querySelectorAll('[data-tab-panel^="parent-"]');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // 버튼 활성 상태 업데이트
        tabButtons.forEach(btn => {
          btn.classList.remove('tab-nav__btn--active');
        });
        this.classList.add('tab-nav__btn--active');
        
        // 패널 전환
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-tab-panel') === targetTab) {
            panel.classList.add('tab-panel--active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('tab-panel--active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // ============================================
  // 4. 알림 센터 열기/닫기 (탭으로 이동)
  // ============================================
  const openNotificationsBtn = document.querySelector('[data-action="open-notifications"]');
  
  if (openNotificationsBtn) {
    openNotificationsBtn.addEventListener('click', function() {
      // 현재 활성화된 대시보드 확인
      const activeDashboard = document.querySelector('.dashboard:not([hidden])');
      if (!activeDashboard) return;
      
      const role = activeDashboard.getAttribute('data-role');
      let targetTab = '';
      let tabComponent = '';
      
      // 모듈별 알림센터 탭 찾기
      if (role === 'student') {
        targetTab = 'student-notifications';
        tabComponent = 'student-tabs';
      } else if (role === 'parent') {
        targetTab = 'parent-notifications';
        tabComponent = 'parent-tabs';
      } else if (role === 'tutor') {
        targetTab = 'tutor-notifications';
        tabComponent = 'tutor-tabs';
      } else if (role === 'admin') {
        targetTab = 'admin-notifications';
        tabComponent = 'admin-tabs';
      }
      
      if (targetTab && tabComponent) {
        // 해당 탭 버튼 찾아서 클릭
        const tabs = document.querySelector(`[data-component="${tabComponent}"]`);
        if (tabs) {
          const tabButton = tabs.querySelector(`[data-tab="${targetTab}"]`);
          if (tabButton) {
            tabButton.click();
          }
        }
      }
    });
  }
  
  // 사이드패널 알림센터 (기존 기능 유지)
  const notifications = document.querySelector('[data-component="notifications"]');
  const closeNotificationsBtn = document.querySelector('[data-action="close-notifications"]');
  
  if (closeNotificationsBtn && notifications) {
    closeNotificationsBtn.addEventListener('click', function() {
      notifications.setAttribute('hidden', '');
    });
  }

  // 알림 센터 외부 클릭 시 닫기
  if (notifications) {
    notifications.addEventListener('click', function(e) {
      if (e.target === notifications) {
        notifications.setAttribute('hidden', '');
      }
    });
  }

  // ============================================
  // 5. 리포트 전체보기 (학부모 모드)
  // ============================================
  const openFullReportParentBtn = document.querySelector('[data-action="open-full-report-parent"]');
  if (openFullReportParentBtn) {
    openFullReportParentBtn.addEventListener('click', function() {
      // 학부모 모드의 리포트 탭으로 전환
      const parentTabs = document.querySelector('[data-component="parent-tabs"]');
      if (parentTabs) {
        // 리포트 탭이 없으면 추가하거나, 기존 탭으로 이동
        // 현재는 학생 모드의 리포트 탭을 참고하여 구현
        alert('리포트 상세 페이지로 이동합니다.\n(테스트 분포, 튜터 코멘트 등 상세 정보 표시)');
        // 실제로는 리포트 상세 섹션을 보여주거나 새 페이지로 이동
      }
    });
  }

  // ============================================
  // 6. 과제 인증샷 보기 (학부모 모드)
  // ============================================
  const openAssignmentProofBtn = document.querySelector('[data-action="open-assignment-proof"]');
  if (openAssignmentProofBtn) {
    openAssignmentProofBtn.addEventListener('click', function() {
      // 모달 또는 새 창으로 과제 인증샷 표시
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal__content">
          <div class="modal__header">
            <h3>과제 인증샷</h3>
            <button class="icon-button modal__close" type="button">✕</button>
          </div>
          <div class="modal__body">
            <div class="assignment-proof">
              <img src="https://via.placeholder.com/600x400?text=과제+인증샷" alt="과제 인증샷" class="assignment-proof__image" />
              <p class="assignment-proof__meta">제출 시간: 오늘 14:30</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = 'flex';

      // 모달 닫기
      const closeModal = () => {
        modal.remove();
      };
      modal.querySelector('.modal__close').addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    });
  }

  // ============================================
  // 7. 결제 수단 관리
  // ============================================
  const managePaymentMethodsBtn = document.querySelector('[data-action="manage-payment-methods"]');
  if (managePaymentMethodsBtn) {
    managePaymentMethodsBtn.addEventListener('click', function() {
      alert('결제 수단 관리 페이지로 이동합니다.\n(카드 추가/삭제/변경 기능)');
      // 실제로는 결제 수단 관리 모달 또는 페이지로 이동
    });
  }

  // ============================================
  // 8. 예비 카드 등록
  // ============================================
  const addBackupCardBtn = document.querySelector('[data-action="add-backup-card"]');
  if (addBackupCardBtn) {
    addBackupCardBtn.addEventListener('click', function() {
      alert('연체 방지용 예비 카드 등록 페이지로 이동합니다.');
      // 실제로는 예비 카드 등록 폼 모달 또는 페이지로 이동
    });
  }

  // ============================================
  // 9. 팀 매칭 게시판 필터
  // ============================================
  const teamBoardFilters = document.querySelectorAll('[data-filter]');
  teamBoardFilters.forEach(filter => {
    filter.addEventListener('change', function() {
      // 필터 변경 시 팀 목록 필터링
      const school = document.querySelector('[data-filter="school"]').value;
      const grade = document.querySelector('[data-filter="grade"]').value;
      const target = document.querySelector('[data-filter="target"]').value;
      
      // 실제로는 필터 조건에 맞는 팀만 표시
      console.log('필터 적용:', { school, grade, target });
      // 필터링 로직 구현 필요
    });
  });

  // ============================================
  // 10. 팀 가입 신청
  // ============================================
  const applyTeamBtns = document.querySelectorAll('[data-action="apply-team"]');
  applyTeamBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const teamCard = this.closest('.team-card');
      const teamTitle = teamCard?.querySelector('.team-card__title')?.textContent || '팀';
      if (confirm(`${teamTitle}에 가입 신청하시겠습니까?`)) {
        alert('가입 신청이 완료되었습니다.');
        // 실제로는 서버에 가입 신청 요청
      }
    });
  });

  // ============================================
  // 11. 팀 상세 보기
  // ============================================
  const viewTeamDetailBtns = document.querySelectorAll('[data-action="view-team-detail"]');
  viewTeamDetailBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const teamCard = this.closest('.team-card');
      const teamTitle = teamCard?.querySelector('.team-card__title')?.textContent || '팀';
      alert(`${teamTitle}의 상세 정보를 표시합니다.\n(팀원 정보, 수업 일정, 튜터 정보 등)`);
      // 실제로는 팀 상세 모달 또는 페이지로 이동
    });
  });

  // ============================================
  // 12. 새 팀 모집글 작성
  // ============================================
  const createTeamPostBtn = document.querySelector('[data-action="create-team-post"]');
  if (createTeamPostBtn) {
    createTeamPostBtn.addEventListener('click', function() {
      alert('새 팀 모집글 작성 페이지로 이동합니다.');
      // 실제로는 팀 모집글 작성 폼 페이지로 이동
    });
  }

  // ============================================
  // 13. 학생 모드 - 과제 인증샷 업로드 (카메라)
  // ============================================
  const uploadAssignmentPhotoBtn = document.querySelector('[data-action="upload-assignment-photo"]');
  if (uploadAssignmentPhotoBtn) {
    uploadAssignmentPhotoBtn.addEventListener('click', function() {
      // 파일 입력 요소 생성 (카메라 또는 갤러리에서 선택)
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment'; // 카메라 우선 사용
      
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          // 이미지 미리보기
          const reader = new FileReader();
          reader.onload = function(e) {
            // 업로드 확인 모달
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
              <div class="modal__content">
                <div class="modal__header">
                  <h3>과제 인증샷 업로드</h3>
                  <button class="icon-button modal__close" type="button">✕</button>
                </div>
                <div class="modal__body">
                  <div class="assignment-upload">
                    <img src="${e.target.result}" alt="업로드할 이미지" class="assignment-upload__preview" />
                    <p class="assignment-upload__info">이미지를 업로드하시겠습니까?</p>
                    <div class="assignment-upload__actions">
                      <button class="btn btn--primary" type="button" data-action="confirm-upload">업로드</button>
                      <button class="btn btn--secondary" type="button" data-action="cancel-upload">취소</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(modal);
            modal.style.display = 'flex';

            // 업로드 확인
            modal.querySelector('[data-action="confirm-upload"]').addEventListener('click', function() {
              // 실제로는 서버에 업로드
              // 업로드 성공 시 학부모 앱에 '제출 완료' 표시되도록 연동
              alert('과제 인증샷이 업로드되었습니다.\n학부모 앱에 "제출 완료"로 표시됩니다.');
              
              // UI 업데이트: 과제 상태를 "제출 완료"로 변경
              const assignmentItem = document.querySelector('[data-today="assignment"]');
              if (assignmentItem) {
                const valueElement = assignmentItem.querySelector('.student-today__value');
                if (valueElement) {
                  valueElement.innerHTML = '과제 제출 완료 <span style="color: var(--primary); font-weight: 600;">✓</span>';
                }
              }
              
              modal.remove();
            });

            // 취소
            const closeModal = () => modal.remove();
            modal.querySelector('[data-action="cancel-upload"]').addEventListener('click', closeModal);
            modal.querySelector('.modal__close').addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
              if (e.target === modal) closeModal();
            });
          };
          reader.readAsDataURL(file);
        }
      });
      
      fileInput.click();
    });
  }

  // ============================================
  // 14. 학생 모드 - 리포트 전체보기
  // ============================================
  const openFullReportStudentBtn = document.querySelector('[data-action="open-full-report-student"]');
  if (openFullReportStudentBtn) {
    openFullReportStudentBtn.addEventListener('click', function() {
      // 학생 모드의 리포트 탭으로 전환
      const studentTabs = document.querySelector('[data-component="student-tabs"]');
      if (studentTabs) {
        const reportTabBtn = studentTabs.querySelector('[data-tab="student-report"]');
        if (reportTabBtn) {
          reportTabBtn.click(); // 리포트 탭 활성화
        }
      }
    });
  }

  // ============================================
  // 15. 학생 모드 - 오답노트 보기
  // ============================================
  const openWrongNotesBtn = document.querySelector('[data-action="open-wrong-notes"]');
  if (openWrongNotesBtn) {
    openWrongNotesBtn.addEventListener('click', function() {
      alert('오답노트 페이지로 이동합니다.\n(최근 틀린 문제와 해설을 모아 볼 수 있습니다.)');
      // 실제로는 오답노트 페이지 또는 모달로 이동
    });
  }

  // ============================================
  // 16. 학생 모드 - VOD 아카이브 열기
  // ============================================
  const openVodArchiveBtn = document.querySelector('[data-action="open-vod-archive"]');
  if (openVodArchiveBtn) {
    openVodArchiveBtn.addEventListener('click', function() {
      alert('VOD 아카이브 페이지로 이동합니다.\n(지난 수업 VOD 또는 튜터 요약본을 다시 볼 수 있습니다.)');
      // 실제로는 VOD 아카이브 페이지로 이동
    });
  }

  // ============================================
  // 17. 학생 모드 - 보강 신청
  // ============================================
  const requestMakeupClassBtn = document.querySelector('[data-action="request-makeup-class"]');
  if (requestMakeupClassBtn) {
    requestMakeupClassBtn.addEventListener('click', function() {
      // 보강 신청 모달
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal__content">
          <div class="modal__header">
            <h3>보강 신청</h3>
            <button class="icon-button modal__close" type="button">✕</button>
          </div>
          <div class="modal__body">
            <div class="makeup-request">
              <p class="makeup-request__desc">결석하거나 이해가 부족한 부분에 대해 보강을 신청할 수 있습니다.</p>
              <div class="makeup-request__form">
                <label class="makeup-request__label">
                  <span>보강 사유</span>
                  <select class="makeup-request__select">
                    <option value="">선택하세요</option>
                    <option value="absence">결석</option>
                    <option value="lack-understanding">이해 부족</option>
                    <option value="other">기타</option>
                  </select>
                </label>
                <label class="makeup-request__label">
                  <span>희망 일시</span>
                  <input type="date" class="makeup-request__input" />
                </label>
                <label class="makeup-request__label">
                  <span>상세 내용</span>
                  <textarea class="makeup-request__textarea" rows="4" placeholder="보강이 필요한 내용을 입력하세요"></textarea>
                </label>
              </div>
              <div class="makeup-request__actions">
                <button class="btn btn--primary" type="button" data-action="submit-makeup-request">신청하기</button>
                <button class="btn btn--secondary" type="button" data-action="cancel-makeup-request">취소</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = 'flex';

      // 신청 제출
      modal.querySelector('[data-action="submit-makeup-request"]').addEventListener('click', function() {
        const reason = modal.querySelector('.makeup-request__select').value;
        const date = modal.querySelector('.makeup-request__input').value;
        const detail = modal.querySelector('.makeup-request__textarea').value;
        
        if (!reason || !date) {
          alert('보강 사유와 희망 일시를 입력해주세요.');
          return;
        }
        
        alert('보강 신청이 완료되었습니다.\n튜터가 확인 후 일정을 조정해드립니다.');
        modal.remove();
      });

      // 취소
      const closeModal = () => modal.remove();
      modal.querySelector('[data-action="cancel-makeup-request"]').addEventListener('click', closeModal);
      modal.querySelector('.modal__close').addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    });
  }

  // ============================================
  // 4. 탭 전환 (튜터 모드)
  // ============================================
  const tutorTabs = document.querySelector('[data-component="tutor-tabs"]');
  if (tutorTabs) {
    const tabButtons = tutorTabs.querySelectorAll('.tab-nav__btn');
    const tabPanels = document.querySelectorAll('[data-tab-panel^="tutor-"]');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // 버튼 활성 상태 업데이트
        tabButtons.forEach(btn => {
          btn.classList.remove('tab-nav__btn--active');
        });
        this.classList.add('tab-nav__btn--active');
        
        // 패널 전환
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-tab-panel') === targetTab) {
            panel.classList.add('tab-panel--active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('tab-panel--active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // ============================================
  // 5. 수업 모드 Step 전환
  // ============================================
  let currentStep = 1;
  const totalSteps = 4;

  function updateStep(step) {
    // 모든 패널 숨기기
    const panels = document.querySelectorAll('.class-mode__panel');
    panels.forEach(panel => {
      panel.classList.remove('class-mode__panel--active');
      panel.setAttribute('hidden', '');
    });

    // 모든 스텝 비활성화
    const steps = document.querySelectorAll('.class-mode__step');
    steps.forEach(stepEl => {
      stepEl.classList.remove('class-mode__step--active');
    });

    // 현재 스텝 활성화
    const currentPanel = document.querySelector(`.class-mode__panel[data-step="${step}"]`);
    const currentStepEl = document.querySelector(`.class-mode__step[data-step="${step}"]`);
    
    if (currentPanel) {
      currentPanel.classList.add('class-mode__panel--active');
      currentPanel.removeAttribute('hidden');
    }
    
    if (currentStepEl) {
      currentStepEl.classList.add('class-mode__step--active');
    }

    currentStep = step;
  }

  // 다음 스텝
  const nextStepBtns = document.querySelectorAll('[data-action="class-next-step"]');
  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (currentStep < totalSteps) {
        updateStep(currentStep + 1);
      }
    });
  });

  // 이전 스텝
  const prevStepBtns = document.querySelectorAll('[data-action="class-prev-step"]');
  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (currentStep > 1) {
        updateStep(currentStep - 1);
      }
    });
  });

  // 출결 선택 (한 학생당 하나만 선택 가능)
  const attendanceBtns = document.querySelectorAll('[data-attendance]');
  attendanceBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('.class-student-row');
      if (!row) return;
      
      // 같은 행의 모든 출결 버튼에서 활성 클래스 제거
      const rowBtns = row.querySelectorAll('[data-attendance]');
      rowBtns.forEach(b => {
        b.classList.remove('chip--active');
      });
      
      // 클릭한 버튼에만 활성 클래스 추가
      this.classList.add('chip--active');
    });
  });

  // 특이사항 태그 선택 (다중 선택 가능)
  const tagBtns = document.querySelectorAll('.class-mode__tags [data-tag]');
  tagBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 토글 방식으로 활성/비활성 전환
      this.classList.toggle('chip--active');
    });
  });

  // ============================================
  // 6. 튜터 모드 기타 기능
  // ============================================
  
  // 프로필 수정
  const editProfileBtn = document.querySelector('[data-action="edit-profile"]');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      alert('프로필 수정 페이지로 이동합니다.');
    });
  }

  // 맛보기 영상 업로드
  const uploadDemoVideoBtn = document.querySelector('[data-action="upload-demo-video"]');
  if (uploadDemoVideoBtn) {
    uploadDemoVideoBtn.addEventListener('click', function() {
      alert('맛보기 영상 업로드 페이지로 이동합니다.');
    });
  }

  // 모집 공고 관리
  const manageRecruitPostsBtn = document.querySelector('[data-action="manage-recruit-posts"]');
  if (manageRecruitPostsBtn) {
    manageRecruitPostsBtn.addEventListener('click', function() {
      alert('내 팀 모집 공고 관리 페이지로 이동합니다.');
    });
  }

  // 장소 예약
  const reserveRoomBtn = document.querySelector('[data-action="reserve-room"]');
  if (reserveRoomBtn) {
    reserveRoomBtn.addEventListener('click', function() {
      alert('제휴 스터디룸 예약 페이지로 이동합니다.');
    });
  }

  // 시간 변경 공지
  const notifyTimeChangeBtn = document.querySelector('[data-action="notify-time-change"]');
  if (notifyTimeChangeBtn) {
    notifyTimeChangeBtn.addEventListener('click', function() {
      alert('시간 변경 공지를 전송합니다.');
    });
  }

  // 자료 미리보기
  const previewMaterialBtns = document.querySelectorAll('[data-action="preview-material"]');
  previewMaterialBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.library-item');
      const title = item?.querySelector('.library-item__title')?.textContent || '자료';
      alert(`${title}의 미리보기를 표시합니다.`);
    });
  });

  // 자료 구매
  const purchaseMaterialBtns = document.querySelectorAll('[data-action="purchase-material"]');
  purchaseMaterialBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.library-item');
      const title = item?.querySelector('.library-item__title')?.textContent || '자료';
      if (confirm(`${title}를 구매하고 우리 반에 배포하시겠습니까?`)) {
        alert('구매가 완료되었습니다. 학생들에게 배포되었습니다.');
      }
    });
  });

      // 리포트 전송
      const sendReportBtn = document.querySelector('[data-action="send-report"]');
      if (sendReportBtn) {
        sendReportBtn.addEventListener('click', function() {
          if (confirm('리포트를 전송하시겠습니까?')) {
            alert('리포트가 성공적으로 전송되었습니다.\n학부모 앱에 리포트가 업데이트되었습니다.');
            // 첫 번째 스텝으로 리셋
            updateStep(1);
          }
        });
      }

  // ============================================
  // 7. 탭 전환 (관리자 모드)
  // ============================================
  const adminTabs = document.querySelector('[data-component="admin-tabs"]');
  if (adminTabs) {
    const tabButtons = adminTabs.querySelectorAll('.tab-nav__btn');
    const tabPanels = document.querySelectorAll('[data-tab-panel^="admin-"]');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // 버튼 활성 상태 업데이트
        tabButtons.forEach(btn => {
          btn.classList.remove('tab-nav__btn--active');
        });
        this.classList.add('tab-nav__btn--active');
        
        // 패널 전환
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-tab-panel') === targetTab) {
            panel.classList.add('tab-panel--active');
            panel.removeAttribute('hidden');
            
            // 튜터 관리 탭이 활성화되면 차트 렌더링
            if (targetTab === 'admin-tutors') {
              setTimeout(() => {
                renderTutorGradeChart();
              }, 100);
            }
          } else {
            panel.classList.remove('tab-panel--active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // ============================================
  // 8. 관리자 액션 버튼들
  // ============================================
  
  // 경고 알림 발송
  const sendWarningBtns = document.querySelectorAll('[data-action="send-warning"]');
  sendWarningBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const alertItem = this.closest('.admin-alert-item');
      const alertText = alertItem?.querySelector('.admin-alert-item__text')?.textContent || '해당 튜터';
      if (confirm(`${alertText}\n\n경고 알림을 발송하시겠습니까?`)) {
        alert('경고 알림이 발송되었습니다.');
        // 실제로는 API 호출로 알림 발송
      }
    });
  });

  // 인센티브 설정 저장
  const saveIncentivesBtn = document.querySelector('[data-action="save-incentives"]');
  if (saveIncentivesBtn) {
    saveIncentivesBtn.addEventListener('click', function() {
      if (confirm('인센티브 설정을 저장하시겠습니까?')) {
        alert('인센티브 설정이 저장되었습니다.');
        // 실제로는 API 호출로 설정 저장
      }
    });
  }

  // 팀 결제 정보 확인
  const openTeamBillingBtn = document.querySelector('[data-action="open-team-billing"]');
  if (openTeamBillingBtn) {
    openTeamBillingBtn.addEventListener('click', function() {
      alert('팀 결제 정보 페이지로 이동합니다.\n(실제로는 상세 페이지로 이동)');
    });
  }

  // 출결 상세 보기
  const openAttendanceDetailBtn = document.querySelector('[data-action="open-attendance-detail"]');
  if (openAttendanceDetailBtn) {
    openAttendanceDetailBtn.addEventListener('click', function() {
      alert('출결 상세 페이지로 이동합니다.\n(실제로는 상세 페이지로 이동)');
    });
  }

  // 결제 일정 보기
  const viewPaymentScheduleBtn = document.querySelector('[data-action="view-payment-schedule"]');
  if (viewPaymentScheduleBtn) {
    viewPaymentScheduleBtn.addEventListener('click', function() {
      alert('결제 일정 페이지로 이동합니다.');
    });
  }

  // 정산 실행
  const runSettlementBtn = document.querySelector('[data-action="run-settlement"]');
  if (runSettlementBtn) {
    runSettlementBtn.addEventListener('click', function() {
      if (confirm('정산을 실행하시겠습니까?\n오류 없는 건이 일괄 이체됩니다.')) {
        alert('정산이 시작되었습니다.\n처리 완료까지 약 5-10분 소요됩니다.');
        // 실제로는 정산 API 호출
      }
    });
  }

  // 매칭 승인
  const approveMatchingBtns = document.querySelectorAll('[data-action="approve-matching"]');
  approveMatchingBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const suggestionItem = this.closest('.admin-suggestion-item');
      const title = suggestionItem?.querySelector('.admin-suggestion-item__title')?.textContent || '매칭';
      if (confirm(`${title}\n\n이 매칭을 승인하시겠습니까?`)) {
        alert('매칭이 승인되었습니다.\n학생과 튜터에게 알림이 발송됩니다.');
        // 실제로는 매칭 승인 API 호출
      }
    });
  });

  // 매칭 상세 보기
  const viewMatchingDetailBtns = document.querySelectorAll('[data-action="view-matching-detail"]');
  viewMatchingDetailBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const suggestionItem = this.closest('.admin-suggestion-item');
      const title = suggestionItem?.querySelector('.admin-suggestion-item__title')?.textContent || '매칭';
      alert(`${title}의 상세 정보 페이지로 이동합니다.\n(실제로는 상세 페이지로 이동)`);
    });
  });
});

// ============================================
// 튜터 등급 차트 렌더링
// ============================================
function renderTutorGradeChart() {
  const canvasId = 'admin-tutor-grade-chart';
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // 기존 차트 인스턴스가 있으면 제거
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const ctx = canvas.getContext('2d');

  // S/A/B/C 등급 분포 데이터
  const gradeData = {
    labels: ['S', 'A', 'B', 'C'],
    datasets: [{
      data: [5, 20, 50, 25], // 퍼센트
      backgroundColor: [
        'rgba(4, 89, 240, 1)',      // S - 진한 파란색
        'rgba(4, 89, 240, 0.7)',    // A - 중간 파란색
        'rgba(4, 89, 240, 0.5)',    // B - 연한 파란색
        'rgba(4, 89, 240, 0.3)'     // C - 매우 연한 파란색
      ],
      borderColor: [
        'rgba(4, 89, 240, 1)',
        'rgba(4, 89, 240, 0.7)',
        'rgba(4, 89, 240, 0.5)',
        'rgba(4, 89, 240, 0.3)'
      ],
      borderWidth: 2
    }]
  };

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: gradeData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 13
            },
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  return {
                    text: `${label} 등급: ${value}%`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor[i],
                    lineWidth: data.datasets[0].borderWidth,
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label} 등급: ${context.parsed}%`;
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}
