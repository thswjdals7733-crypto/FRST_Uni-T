// 모드 전환, 탭 전환, 차트 렌더링 등

// 차트 인스턴스 저장
const chartInstances = {};

// ============================================
// 차트 렌더링 함수들
// ============================================

// 학습 완성도 꺾은선 그래프 (본인 점수 vs 평균 점수)
function renderCompletionChart(canvasId, myScores, avgScores) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // 기존 차트가 있으면 제거
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  // 월별 라벨 (예: 9월, 10월, 11월)
  const labels = myScores.map((_, i) => `${i + 1}주차`);
  
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '본인 점수',
          data: myScores,
          borderColor: 'rgba(4, 89, 240, 1)',
          backgroundColor: 'rgba(4, 89, 240, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(4, 89, 240, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: '평균 점수',
          data: avgScores,
          borderColor: 'rgba(107, 114, 128, 0.6)',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(107, 114, 128, 0.6)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            },
            color: 'rgba(0, 0, 0, 0.8)'
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}점`;
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
            color: 'rgba(75, 85, 99, 0.6)'
          }
        },
        y: {
          display: true,
          min: 0,
          max: 100,
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

// 팀 내 위치 세로 막대 그래프 (등수가 높을수록 막대가 높게) - 사용 안 함
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
  // 학습 완성도 차트 (본인 점수 vs 평균 점수)
  renderCompletionChart('parent-completion-chart', [75, 80, 85, 82, 88], [70, 72, 75, 73, 78]);
  renderAssignmentChart('parent-assignment-chart', 90); // 과제 90%
  renderTestChart('parent-test-chart', 85, 80); // 내 점수 85점, 평균 80점
}

// 학생 모드 차트 렌더링
function renderStudentCharts() {
  // 학습 완성도 차트 (본인 점수 vs 평균 점수)
  renderCompletionChart('student-completion-chart', [75, 80, 85, 82, 88], [70, 72, 75, 73, 78]);
  renderAssignmentChart('student-assignment-chart', 90); // 과제 90%
  renderTestChart('student-test-chart', 85, 80); // 내 점수 85점, 평균 80점
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
            renderCompletionChart('parent-completion-chart', [75, 80, 85, 82, 88], [70, 72, 75, 73, 78]);
            renderAssignmentChart('parent-assignment-chart', 90);
            renderTestChart('parent-test-chart', 85, 80);
            renderCompletionChart('parent-completion-chart', [75, 80, 85, 82, 88], [70, 72, 75, 73, 78]);
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
  // 4. 알림 센터 열기/닫기 (사이드패널)
  // ============================================
  const notifications = document.querySelector('[data-component="notifications"]');
  const openNotificationsBtn = document.querySelector('[data-action="open-notifications"]');
  const closeNotificationsBtn = document.querySelector('[data-action="close-notifications"]');
  
  // 알림센터 열기 (사이드패널)
  if (openNotificationsBtn && notifications) {
    openNotificationsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // 현재 활성화된 대시보드 확인하여 알림 내용 업데이트
      const activeDashboard = document.querySelector('.dashboard:not([hidden])');
      if (activeDashboard) {
      const role = activeDashboard.getAttribute('data-role');
        updateNotificationsContent(role);
      }
      
      // 사이드패널 열기
      notifications.removeAttribute('hidden');
      
      return false;
    }, true); // capture phase에서 먼저 실행
  }
  
  // 알림센터 닫기
  if (closeNotificationsBtn && notifications) {
    closeNotificationsBtn.addEventListener('click', function() {
      notifications.setAttribute('hidden', '');
    });
  }
  
  // 배경 클릭 시 닫기
  if (notifications) {
    notifications.addEventListener('click', function(e) {
      if (e.target === notifications) {
        notifications.setAttribute('hidden', '');
      }
    });
  }
  
  // 모듈별 알림 내용 업데이트 함수
  function updateNotificationsContent(role) {
    const notificationsList = notifications.querySelector('.notifications__list');
    if (!notificationsList) return;
    
    let notificationsHTML = '';
    
    if (role === 'student') {
      notificationsHTML = `
        <article class="notification-item">
          <p class="notification-item__type">과제 제출 완료</p>
          <p class="notification-item__text">오늘 과제가 제출되었습니다. 튜터 확인 중입니다.</p>
          <p class="notification-item__time">30분 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">수업 일정 변경</p>
          <p class="notification-item__text">이번 주 토요일 수업 시간이 19시로 변경되었습니다.</p>
          <p class="notification-item__time">2시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">월간 리포트 업데이트</p>
          <p class="notification-item__text">10월 학습 리포트가 업데이트되었습니다.</p>
          <p class="notification-item__time">1일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">보강 신청 승인</p>
          <p class="notification-item__text">보강 신청이 승인되었습니다. 일정을 확인해주세요.</p>
          <p class="notification-item__time">2일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">테스트 결과</p>
          <p class="notification-item__text">주간 테스트 결과가 업로드되었습니다.</p>
          <p class="notification-item__time">3일 전</p>
        </article>
      `;
    } else if (role === 'parent') {
      notificationsHTML = `
        <article class="notification-item">
          <p class="notification-item__type">리포트 업데이트</p>
          <p class="notification-item__text">10월 학습 리포트가 업데이트되었습니다.</p>
          <p class="notification-item__time">2시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">결제 변동</p>
          <p class="notification-item__text">새 팀원 합류로 이번 달 결제 금액이 변경되었습니다.</p>
          <p class="notification-item__time">1일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">수업 긴급 공지</p>
          <p class="notification-item__text">이번 주 토요일 수업 시간이 30분 앞당겨집니다.</p>
          <p class="notification-item__time">3일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">팀원 변동</p>
          <p class="notification-item__text">김철수 학생이 팀에 합류했습니다.</p>
          <p class="notification-item__time">5일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">과제 제출</p>
          <p class="notification-item__text">오늘 과제가 제출되었습니다. 인증샷을 확인하세요.</p>
          <p class="notification-item__time">1주 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">결제 예정 알림</p>
          <p class="notification-item__text">다음 달 결제일이 3일 남았습니다.</p>
          <p class="notification-item__time">1주 전</p>
        </article>
      `;
    } else if (role === 'tutor') {
      notificationsHTML = `
        <article class="notification-item">
          <p class="notification-item__type">급여 지급 완료</p>
          <p class="notification-item__text">이번 달 급여가 지급되었습니다. (₩3,850,000)</p>
          <p class="notification-item__time">1시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">새 학생 매칭</p>
          <p class="notification-item__text">새로운 학생이 팀에 매칭되었습니다. 프로필을 확인해주세요.</p>
          <p class="notification-item__time">5시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">리포트 작성 알림</p>
          <p class="notification-item__text">이번 주 리포트 작성 기한이 2일 남았습니다.</p>
          <p class="notification-item__time">1일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">수업 일정 변경 요청</p>
          <p class="notification-item__text">학생이 수업 일정 변경을 요청했습니다.</p>
          <p class="notification-item__time">2일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">등급 업데이트</p>
          <p class="notification-item__text">튜터 등급이 A등급으로 상승했습니다.</p>
          <p class="notification-item__time">3일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">보강 신청</p>
          <p class="notification-item__text">학생이 보강 수업을 신청했습니다.</p>
          <p class="notification-item__time">4일 전</p>
        </article>
      `;
    } else if (role === 'admin') {
      notificationsHTML = `
        <article class="notification-item notification-item--danger">
          <p class="notification-item__type">긴급: 결제 오류</p>
          <p class="notification-item__text">XX팀 결제 정보 미갱신으로 인한 환불 요청이 발생했습니다.</p>
          <p class="notification-item__time">10분 전</p>
        </article>
        <article class="notification-item notification-item--warning">
          <p class="notification-item__type">경고: 튜터 리포트 미작성</p>
          <p class="notification-item__text">3명의 튜터가 최근 2주간 리포트를 작성하지 않았습니다.</p>
          <p class="notification-item__time">1시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">정산 완료</p>
          <p class="notification-item__text">이번 달 정산이 완료되었습니다. 총 45명의 튜터에게 급여가 지급되었습니다.</p>
          <p class="notification-item__time">3시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">새 튜터 등록</p>
          <p class="notification-item__text">새로운 튜터가 등록되었습니다. 프로필을 검토해주세요.</p>
          <p class="notification-item__time">5시간 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">매칭 대기 증가</p>
          <p class="notification-item__text">대기 중인 학생이 5명 증가했습니다. 매칭을 진행해주세요.</p>
          <p class="notification-item__time">1일 전</p>
        </article>
        <article class="notification-item">
          <p class="notification-item__type">시스템 업데이트</p>
          <p class="notification-item__text">튜터 등급 산정 알고리즘이 업데이트되었습니다.</p>
          <p class="notification-item__time">2일 전</p>
        </article>
      `;
    }
    
    notificationsList.innerHTML = notificationsHTML;
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
      alert('예비 카드 등록 페이지로 이동합니다.\n(선택 사항)');
      // 실제로는 예비 카드 등록 폼 모달 또는 페이지로 이동
    });
  }

  // ============================================
  // 8-1. 팀 탈퇴
  // ============================================
  const leaveTeamBtn = document.querySelector('[data-action="leave-team"]');
  if (leaveTeamBtn) {
    leaveTeamBtn.addEventListener('click', function() {
      if (confirm('정말 팀에서 탈퇴하시겠습니까?\n\n탈퇴 시 다음 달부터 수업이 중단되며, 환불 정책에 따라 처리됩니다.')) {
        if (confirm('탈퇴를 확정하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
          alert('팀 탈퇴가 신청되었습니다.\n관리자 확인 후 처리됩니다.');
          // 실제로는 팀 탈퇴 API 호출
        }
      }
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
  // 17. 학생 모드 - 튜터에게 질문하기
  // ============================================
  const askTutorBtn = document.querySelector('[data-action="ask-tutor"]');
  if (askTutorBtn) {
    askTutorBtn.addEventListener('click', function() {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal__content" style="max-width: 500px;">
          <div class="modal__header">
            <h3>튜터에게 질문하기</h3>
            <button class="icon-button modal__close" type="button">✕</button>
          </div>
          <div class="modal__body">
            <div class="question-form">
              <label class="question-form__label">
                <span>제목</span>
                <input type="text" class="question-form__input" placeholder="질문 제목을 입력하세요" />
              </label>
              <label class="question-form__label">
                <span>질문 내용</span>
                <textarea class="question-form__textarea" rows="6" placeholder="궁금한 점을 자세히 입력해주세요"></textarea>
              </label>
              <div class="question-form__actions">
                <button class="btn btn--primary" type="button" data-action="submit-question">질문 보내기</button>
                <button class="btn btn--secondary" type="button" data-action="cancel-question">취소</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = 'flex';

      modal.querySelector('[data-action="submit-question"]').addEventListener('click', function() {
        const title = modal.querySelector('.question-form__input').value;
        const content = modal.querySelector('.question-form__textarea').value;
        if (!title || !content) {
          alert('제목과 내용을 모두 입력해주세요.');
          return;
        }
        alert('질문이 전송되었습니다.\n튜터가 답변을 작성하면 알림으로 알려드립니다.');
        modal.remove();
      });

      const closeModal = () => modal.remove();
      modal.querySelector('[data-action="cancel-question"]').addEventListener('click', closeModal);
      modal.querySelector('.modal__close').addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    });
  }

  // ============================================
  // 17-1. 학생 모드 - 1:1 상담 신청
  // ============================================
  const requestConsultationBtn = document.querySelector('[data-action="request-consultation"]');
  if (requestConsultationBtn) {
    requestConsultationBtn.addEventListener('click', function() {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal__content" style="max-width: 500px;">
          <div class="modal__header">
            <h3>1:1 상담 신청</h3>
            <button class="icon-button modal__close" type="button">✕</button>
          </div>
          <div class="modal__body">
            <div class="consultation-form">
              <label class="consultation-form__label">
                <span>희망 일시</span>
                <input type="datetime-local" class="consultation-form__input" />
              </label>
              <label class="consultation-form__label">
                <span>상담 주제</span>
                <select class="consultation-form__select">
                  <option value="">선택하세요</option>
                  <option value="study-plan">학습 계획 수립</option>
                  <option value="grade-improvement">성적 향상 방안</option>
                  <option value="test-prep">시험 대비 전략</option>
                  <option value="other">기타</option>
                </select>
              </label>
              <label class="consultation-form__label">
                <span>상세 내용</span>
                <textarea class="consultation-form__textarea" rows="4" placeholder="상담하고 싶은 내용을 입력해주세요"></textarea>
              </label>
              <div class="consultation-form__actions">
                <button class="btn btn--primary" type="button" data-action="submit-consultation">상담 신청하기</button>
                <button class="btn btn--secondary" type="button" data-action="cancel-consultation">취소</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = 'flex';

      modal.querySelector('[data-action="submit-consultation"]').addEventListener('click', function() {
        const date = modal.querySelector('.consultation-form__input').value;
        const topic = modal.querySelector('.consultation-form__select').value;
        const content = modal.querySelector('.consultation-form__textarea').value;
        if (!date || !topic) {
          alert('희망 일시와 상담 주제를 선택해주세요.');
          return;
        }
        alert('상담 신청이 완료되었습니다.\n튜터가 확인 후 일정을 조정해드립니다.');
        modal.remove();
      });

      const closeModal = () => modal.remove();
      modal.querySelector('[data-action="cancel-consultation"]').addEventListener('click', closeModal);
      modal.querySelector('.modal__close').addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    });
  }

  // ============================================
  // 18. 학생 모드 - 보강 신청
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
  // 5. 수업 모드 Step 스크롤 방식
  // ============================================
  const classModeContainer = document.querySelector('.class-mode');
  if (classModeContainer) {
    const stepButtons = document.querySelectorAll('.class-mode__step');
    const stepPanels = document.querySelectorAll('.class-mode__panel');
    
    // 단계 완료 여부 확인 함수
    function isStepCompleted(step) {
      if (step === 1) {
        const studentRows = document.querySelectorAll('.class-mode__panel[data-step="1"] .class-student-row');
        for (let row of studentRows) {
          const hasSelected = row.querySelector('[data-attendance].chip--active');
          if (!hasSelected) return false;
        }
        return true;
      } else if (step === 2) {
        const inputs = document.querySelectorAll('.class-mode__panel[data-step="2"] .class-student-row__input');
        for (let input of inputs) {
          if (!input.value || input.value.trim() === '') return false;
        }
        return true;
      } else if (step === 3) {
        return true; // 선택사항
      } else if (step === 4) {
        return true; // 리포트 전송은 항상 가능
      }
      return false;
    }

    // 현재 활성화된 단계 가져오기
    function getCurrentActiveStep() {
      const activeBtn = document.querySelector('.class-mode__step--active');
      if (activeBtn) {
        return parseInt(activeBtn.getAttribute('data-step'));
      }
      return 1;
    }

    // 현재 활성화된 단계 업데이트 함수
    function updateActiveStep(step) {
      stepButtons.forEach(btn => {
        btn.classList.remove('class-mode__step--active');
      });
      
      const activeBtn = document.querySelector(`.class-mode__step[data-step="${step}"]`);
      if (activeBtn) {
        activeBtn.classList.add('class-mode__step--active');
      }
    }

    // 내비게이션 클릭 시 해당 섹션으로 스크롤
    stepButtons.forEach(stepBtn => {
      stepBtn.addEventListener('click', function() {
        const targetStep = parseInt(this.getAttribute('data-step'));
        const targetPanel = document.getElementById(`class-step-${targetStep}`);
        
        if (targetPanel) {
          // 스크롤 이동
          const stickyNav = document.querySelector('.class-mode__steps--sticky');
          const navHeight = stickyNav ? stickyNav.offsetHeight : 0;
          const targetPosition = targetPanel.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
      }
    });
  });

    // Intersection Observer로 현재 보이는 섹션 감지
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = parseInt(entry.target.getAttribute('data-step'));
          updateActiveStep(step);
        }
      });
    }, observerOptions);

    // 각 패널 관찰 시작
    stepPanels.forEach(panel => {
      observer.observe(panel);
    });

    // 초기 활성화
    updateActiveStep(1);
  }

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
      
      // 1단계 완료 상태 업데이트
      if (isStepCompleted(1)) {
        completedSteps.add(1);
      }
    });
  });

  // 테스트 점수 입력 시 2단계 완료 상태 업데이트
  const scoreInputs = document.querySelectorAll('.class-student-row__input');
  scoreInputs.forEach(input => {
    input.addEventListener('input', function() {
      if (isStepCompleted(2)) {
        completedSteps.add(2);
      }
    });
  });

  // 특이사항 태그 선택 (학생별 다중 선택 가능)
  const tagBtns = document.querySelectorAll('[data-tag][data-student]');
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

      // 리포트 미리보기 버튼
      const previewReportBtn = document.querySelector('[data-action="preview-report"]');
      if (previewReportBtn) {
        previewReportBtn.addEventListener('click', function() {
          // 입력된 데이터 수집
          const attendanceData = {};
          const scoreData = {};
          const tagData = {};
          const feedbackData = {};

          // 출결 데이터
          document.querySelectorAll('.class-mode__panel[data-step="1"] .class-student-row').forEach(row => {
            const name = row.querySelector('.class-student-row__name').textContent;
            const selected = row.querySelector('[data-attendance].chip--active');
            attendanceData[name] = selected ? selected.textContent : '미선택';
          });

          // 점수 데이터
          document.querySelectorAll('.class-mode__panel[data-step="2"] .class-student-row').forEach(row => {
            const name = row.querySelector('.class-student-row__name').textContent;
            const score = row.querySelector('.class-student-row__input').value;
            scoreData[name] = score || '미입력';
          });

          // 태그 데이터
          document.querySelectorAll('.class-mode__panel[data-step="3"] .class-student-row').forEach(row => {
            const name = row.querySelector('.class-student-row__name').textContent;
            const selectedTags = Array.from(row.querySelectorAll('[data-tag].chip--active')).map(btn => btn.textContent);
            tagData[name] = selectedTags.length > 0 ? selectedTags.join(', ') : '없음';
          });

          // 피드백 데이터
          document.querySelectorAll('.class-mode__panel[data-step="4"] .class-student-row__feedback').forEach(textarea => {
            const name = textarea.getAttribute('data-student');
            feedbackData[name] = textarea.value || '없음';
          });

          // 리포트 미리보기 모달 생성
          const modal = document.createElement('div');
          modal.className = 'modal';
          modal.innerHTML = `
            <div class="modal__content modal__content--large">
              <div class="modal__header">
                <h3>리포트 미리보기</h3>
                <button class="icon-button modal__close" type="button">✕</button>
              </div>
              <div class="modal__body">
                <div class="report-preview">
                  ${Object.keys(attendanceData).map(name => `
                    <div class="report-preview__student">
                      <h4 class="report-preview__student-name">${name}</h4>
                      <div class="report-preview__section">
                        <strong>출결:</strong> ${attendanceData[name]}
                      </div>
                      <div class="report-preview__section">
                        <strong>테스트 점수:</strong> ${scoreData[name]}점
                      </div>
                      <div class="report-preview__section">
                        <strong>태그/키워드:</strong> ${tagData[name]}
                      </div>
                      <div class="report-preview__section">
                        <strong>특이사항 및 피드백:</strong>
                        <p class="report-preview__feedback">${feedbackData[name]}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="modal__footer">
                <button class="btn btn--secondary" type="button" data-action="close-preview">취소</button>
                <button class="btn btn--primary" type="button" data-action="confirm-send-report">리포트 전송하기</button>
              </div>
            </div>
          `;
          document.body.appendChild(modal);
          modal.style.display = 'flex';

          // 모달 닫기
          const closeModal = () => modal.remove();
          modal.querySelector('[data-action="close-preview"]').addEventListener('click', closeModal);
          modal.querySelector('.modal__close').addEventListener('click', closeModal);
          modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
          });

          // 리포트 전송 확인
          modal.querySelector('[data-action="confirm-send-report"]').addEventListener('click', function() {
          if (confirm('리포트를 전송하시겠습니까?')) {
            alert('리포트가 성공적으로 전송되었습니다.\n학부모 앱에 리포트가 업데이트되었습니다.');
              closeModal();
            // 첫 번째 스텝으로 리셋
              const firstStepBtn = document.querySelector('.class-mode__step[data-step="1"]');
              if (firstStepBtn) {
                firstStepBtn.click();
              }
          }
          });
        });
      }

  // ============================================
  // 6-1. 매칭 보드 탭 전환 (학부모/튜터)
  // ============================================
  const matchingBoardTabs = document.querySelectorAll('.matching-board__tab');
  matchingBoardTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      const board = this.closest('.matching-board');
      
      if (!board) return;
      
      // 모든 탭 비활성화
      board.querySelectorAll('.matching-board__tab').forEach(t => {
        t.classList.remove('matching-board__tab--active');
      });
      
      // 모든 콘텐츠 숨기기
      board.querySelectorAll('.matching-board__content').forEach(c => {
        c.classList.remove('matching-board__content--active');
      });
      
      // 현재 탭 활성화
      this.classList.add('matching-board__tab--active');
      
      // 해당 콘텐츠 표시
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('matching-board__content--active');
      }
    });
  });

  // 새 그룹 만들기 버튼
  const createNewGroupBtn = document.querySelector('[data-action="create-new-group"]');
  if (createNewGroupBtn) {
    createNewGroupBtn.addEventListener('click', function() {
      alert('새 그룹 만들기 기능은 준비 중입니다.');
    });
  }

  // 튜터 참가하기 버튼
  const tutorJoinClassBtns = document.querySelectorAll('[data-action="tutor-join-class"]');
  tutorJoinClassBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.matching-card');
      const title = card ? card.querySelector('.matching-card__title').textContent : '수업';
      if (confirm(`${title}에 참가하시겠습니까?`)) {
        alert('참가 신청이 완료되었습니다.');
      }
    });
  });

  // 모집글 작성 폼 제출 (학부모)
  const parentRecruitForm = document.querySelector('[data-action="create-recruit-post"]');
  if (parentRecruitForm) {
    parentRecruitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      if (confirm('모집글을 등록하시겠습니까?')) {
        alert('모집글이 등록되었습니다.\n학생들이 신청할 수 있도록 게시판에 노출됩니다.');
        this.reset();
      }
    });
  }

  // 모집글 작성 폼 제출 (튜터)
  const tutorRecruitForm = document.querySelector('[data-action="create-tutor-recruit-post"]');
  if (tutorRecruitForm) {
    tutorRecruitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      if (confirm('모집글을 등록하시겠습니까?')) {
        alert('모집글이 등록되었습니다.\n학생들이 신청할 수 있도록 게시판에 노출됩니다.');
        this.reset();
      }
    });
  }

  // 모집글 작성 취소
  const cancelRecruitBtns = document.querySelectorAll('[data-action="cancel-recruit"]');
  cancelRecruitBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const form = this.closest('form');
      if (form && confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
        form.reset();
      }
    });
  });

  // 신규 학생 승인
  const approveStudentBtns = document.querySelectorAll('[data-action="approve-student"]');
  approveStudentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const studentName = this.getAttribute('data-student');
      if (confirm(`${studentName} 학생을 승인하시겠습니까?`)) {
        alert(`${studentName} 학생이 승인되었습니다.\n수업에 참여할 수 있습니다.`);
        this.closest('.pending-student-item').remove();
      }
    });
  });

  // 신규 학생 거절
  const rejectStudentBtns = document.querySelectorAll('[data-action="reject-student"]');
  rejectStudentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const studentName = this.getAttribute('data-student');
      if (confirm(`${studentName} 학생의 신청을 거절하시겠습니까?`)) {
        alert(`${studentName} 학생의 신청이 거절되었습니다.\n학생에게 알림이 전송됩니다.`);
        this.closest('.pending-student-item').remove();
      }
    });
  });

  // 모집 마감
  const closeRecruitmentBtn = document.querySelector('[data-action="close-recruitment"]');
  if (closeRecruitmentBtn) {
    closeRecruitmentBtn.addEventListener('click', function() {
      if (confirm('모집을 마감하시겠습니까?\n더 이상 신규 학생을 받을 수 없습니다.')) {
        alert('모집이 마감되었습니다.');
        this.setAttribute('hidden', '');
        const reopenBtn = document.querySelector('[data-action="reopen-recruitment"]');
        if (reopenBtn) {
          reopenBtn.removeAttribute('hidden');
        }
      }
    });
  }

  // 모집 재개
  const reopenRecruitmentBtn = document.querySelector('[data-action="reopen-recruitment"]');
  if (reopenRecruitmentBtn) {
    reopenRecruitmentBtn.addEventListener('click', function() {
      if (confirm('모집을 재개하시겠습니까?')) {
        alert('모집이 재개되었습니다.');
        this.setAttribute('hidden', '');
        const closeBtn = document.querySelector('[data-action="close-recruitment"]');
        if (closeBtn) {
          closeBtn.removeAttribute('hidden');
        }
      }
    });
  }

  // 학생 제외 요청
  const requestRemoveStudentBtns = document.querySelectorAll('[data-action="request-remove-student"]');
  requestRemoveStudentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const studentName = this.getAttribute('data-student');
      if (confirm(`${studentName} 학생을 수업에서 제외하시겠습니까?\n관리자에게 요청이 전송됩니다.`)) {
        alert(`${studentName} 학생의 제외 요청이 관리자에게 전송되었습니다.\n관리자 검토 후 처리됩니다.`);
      }
    });
  });

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

  // ============================================
  // 9. 튜터별 관리 - 검색 및 필터링
  // ============================================
  
  // 튜터 검색
  const tutorSearchInput = document.querySelector('[data-action="search-tutors"]');
  if (tutorSearchInput) {
    tutorSearchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      filterTutorList();
    });
  }

  // 튜터 필터
  const tutorFilters = document.querySelectorAll('.admin-tutor-list__filter');
  tutorFilters.forEach(filter => {
    filter.addEventListener('change', function() {
      filterTutorList();
    });
  });

  // 튜터 목록 필터링 함수
  function filterTutorList() {
    const searchTerm = tutorSearchInput?.value.toLowerCase().trim() || '';
    const gradeFilter = document.querySelector('.admin-tutor-list__filter[data-filter="grade"]')?.value || '';
    const subjectFilter = document.querySelector('.admin-tutor-list__filter[data-filter="subject"]')?.value || '';
    const statusFilter = document.querySelector('.admin-tutor-list__filter[data-filter="status"]')?.value || '';

    const tutorRows = document.querySelectorAll('.admin-tutor-row');
    
    tutorRows.forEach(row => {
      const tutorName = row.querySelector('strong')?.textContent.toLowerCase() || '';
      const tutorEmail = row.querySelector('.admin-tutor-row__email')?.textContent.toLowerCase() || '';
      const grade = row.querySelector('.admin-tutor-row__grade')?.textContent.trim() || '';
      const subject = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
      const status = row.querySelector('.admin-tutor-row__status')?.textContent.trim() || '';

      // 검색어 매칭
      const matchesSearch = !searchTerm || 
        tutorName.includes(searchTerm) || 
        tutorEmail.includes(searchTerm);

      // 등급 필터 매칭
      const matchesGrade = !gradeFilter || grade === gradeFilter;

      // 과목 필터 매칭
      const matchesSubject = !subjectFilter || 
        (subjectFilter === 'math' && subject === '수학') ||
        (subjectFilter === 'english' && subject === '영어') ||
        (subjectFilter === 'korean' && subject === '국어');

      // 상태 필터 매칭
      const matchesStatus = !statusFilter ||
        (statusFilter === 'active' && status === '활성') ||
        (statusFilter === 'inactive' && status === '비활성') ||
        (statusFilter === 'pending' && status === '승인 대기');

      // 모든 조건을 만족하면 표시, 아니면 숨김
      if (matchesSearch && matchesGrade && matchesSubject && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // 튜터 상세 보기
  const viewTutorDetailBtns = document.querySelectorAll('[data-action="view-tutor-detail"]');
  viewTutorDetailBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tutorId = this.getAttribute('data-tutor-id');
      const tutorRow = this.closest('.admin-tutor-row');
      const tutorName = tutorRow.querySelector('strong')?.textContent || '튜터';
      
      // 튜터 상세 정보 모달 표시
      showTutorDetailModal(tutorId, tutorName, tutorRow);
    });
  });

  // 튜터 상세 정보 모달 표시 함수
  function showTutorDetailModal(tutorId, tutorName, tutorRow) {
    const grade = tutorRow.querySelector('.admin-tutor-row__grade')?.textContent.trim() || '-';
    const subject = tutorRow.querySelector('td:nth-child(3)')?.textContent.trim() || '-';
    const teamCount = tutorRow.querySelector('td:nth-child(4)')?.textContent.trim() || '-';
    const studentCount = tutorRow.querySelector('td:nth-child(5)')?.textContent.trim() || '-';
    const retentionRate = tutorRow.querySelector('td:nth-child(6)')?.textContent.trim() || '-';
    const status = tutorRow.querySelector('.admin-tutor-row__status')?.textContent.trim() || '-';
    const email = tutorRow.querySelector('.admin-tutor-row__email')?.textContent.trim() || '-';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__content" style="max-width: 600px;">
        <div class="modal__header">
          <h3>${tutorName} 튜터 상세 정보</h3>
          <button class="icon-button modal__close" type="button">✕</button>
        </div>
        <div class="modal__body">
          <div class="admin-tutor-detail">
            <div class="admin-tutor-detail__section">
              <h4 class="admin-tutor-detail__title">기본 정보</h4>
              <div class="admin-tutor-detail__info">
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">이름</span>
                  <span class="admin-tutor-detail__value">${tutorName}</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">이메일</span>
                  <span class="admin-tutor-detail__value">${email}</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">등급</span>
                  <span class="admin-tutor-detail__value">${grade}등급</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">과목</span>
                  <span class="admin-tutor-detail__value">${subject}</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">상태</span>
                  <span class="admin-tutor-detail__value">${status}</span>
                </div>
              </div>
            </div>

            <div class="admin-tutor-detail__section">
              <h4 class="admin-tutor-detail__title">운영 현황</h4>
              <div class="admin-tutor-detail__info">
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">운영 팀 수</span>
                  <span class="admin-tutor-detail__value">${teamCount}</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">총 학생 수</span>
                  <span class="admin-tutor-detail__value">${studentCount}</span>
                </div>
                <div class="admin-tutor-detail__row">
                  <span class="admin-tutor-detail__label">유지율</span>
                  <span class="admin-tutor-detail__value">${retentionRate}</span>
                </div>
              </div>
            </div>

            <div class="admin-tutor-detail__actions">
              <button class="btn btn--primary" type="button" data-action="edit-tutor" data-tutor-id="${tutorId}">
                튜터 정보 수정
              </button>
              <button class="btn btn--secondary" type="button" data-action="view-tutor-teams" data-tutor-id="${tutorId}">
                운영 팀 목록 보기
              </button>
              <button class="btn btn--secondary" type="button" data-action="view-tutor-reports" data-tutor-id="${tutorId}">
                리포트 내역 보기
              </button>
              ${status === '승인 대기' ? `
                <button class="btn btn--primary" type="button" data-action="approve-tutor" data-tutor-id="${tutorId}">
                  튜터 승인
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // 모달 내부 액션 버튼들
    modal.querySelector('[data-action="edit-tutor"]')?.addEventListener('click', function() {
      alert(`${tutorName} 튜터의 정보를 수정합니다.`);
      modal.remove();
    });

    modal.querySelector('[data-action="view-tutor-teams"]')?.addEventListener('click', function() {
      alert(`${tutorName} 튜터가 운영 중인 팀 목록을 표시합니다.`);
    });

    modal.querySelector('[data-action="view-tutor-reports"]')?.addEventListener('click', function() {
      alert(`${tutorName} 튜터가 작성한 리포트 내역을 표시합니다.`);
    });

    modal.querySelector('[data-action="approve-tutor"]')?.addEventListener('click', function() {
      if (confirm(`${tutorName} 튜터를 승인하시겠습니까?`)) {
        alert('튜터가 승인되었습니다.');
        modal.remove();
        // 실제로는 상태 업데이트 API 호출
      }
    });

    // 모달 닫기
    const closeModal = () => modal.remove();
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
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
