// 메인 애플리케이션 초기화 및 이벤트 핸들러
// 모듈: modeManager, tabManager, modalManager, chartManager

document.addEventListener('DOMContentLoaded', function() {
  // 모듈 초기화
  if (window.chartManager) {
    chartManager.init();
  }
  
  if (window.modeManager) {
    modeManager.init();
  }
  
  if (window.tabManager) {
    tabManager.init();
  }

  // ============================================
  // 차트 렌더링 (chartManager 사용)
  // ============================================
  function setupCharts() {
    // 학습 완성도 차트
    const completionCanvases = document.querySelectorAll('#student-completion-chart, #parent-completion-chart');
    completionCanvases.forEach(canvas => {
      if (canvas && !chartManager.chartInstances[canvas.id]) {
        chartManager.renderWhenVisible(canvas, () => {
          const myScores = [75, 80, 85, 82, 88];
          const avgScores = [70, 72, 75, 73, 78];
          const labels = myScores.map((_, i) => `${i + 1}주차`);
          
          chartManager.createChart(canvas.id, {
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
                  tension: 0.4
                },
                {
                  label: '평균 점수',
                  data: avgScores,
                  borderColor: 'rgba(107, 114, 128, 0.6)',
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                  tension: 0.4
                }
              ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
                legend: { position: 'bottom' }
              }
            }
          });
        });
      }
    });

    // 과제 수행률 차트
    const assignmentCanvases = document.querySelectorAll('#student-assignment-chart, #parent-assignment-chart');
    assignmentCanvases.forEach(canvas => {
      if (canvas && !chartManager.chartInstances[canvas.id]) {
        chartManager.renderWhenVisible(canvas, () => {
          chartManager.createChart(canvas.id, {
    type: 'doughnut',
    data: {
              labels: ['완료', '미완료'],
      datasets: [{
                data: [90, 10],
                backgroundColor: ['rgba(4, 89, 240, 1)', 'rgba(229, 231, 235, 1)'],
                borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
                legend: { position: 'bottom' }
              }
            }
          });
        });
      }
    });

    // 테스트 점수 차트
    const testCanvases = document.querySelectorAll('#student-test-chart, #parent-test-chart');
    testCanvases.forEach(canvas => {
      if (canvas && !chartManager.chartInstances[canvas.id]) {
        chartManager.renderWhenVisible(canvas, () => {
          chartManager.createChart(canvas.id, {
            type: 'doughnut',
    data: {
              labels: ['내 점수', '평균 점수'],
      datasets: [{
                data: [85, 80],
                backgroundColor: ['rgba(4, 89, 240, 1)', 'rgba(107, 114, 128, 0.6)'],
                borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
                legend: { position: 'bottom' }
      }
    }
  });
        });
      }
    });
  }

  // 초기 차트 설정
  setupCharts();

  // ============================================
  // 알림센터 개선
  // ============================================
  const notificationsPanel = document.querySelector('.notifications');
  const openNotificationsBtn = document.querySelector('[data-action="open-notifications"]');
  
  if (openNotificationsBtn && notificationsPanel) {
    openNotificationsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentRoute = modeManager.getCurrentRoute();
      updateNotificationsContent(currentRoute);
      notificationsPanel.removeAttribute('hidden');
    });
  }
  
  // 알림센터 닫기 (배경 클릭)
  if (notificationsPanel) {
    notificationsPanel.addEventListener('click', (e) => {
      if (e.target === notificationsPanel) {
        notificationsPanel.setAttribute('hidden', '');
      }
    });
  }
  
  const closeNotificationsBtn = document.querySelector('[data-action="close-notifications"]');
  if (closeNotificationsBtn) {
    closeNotificationsBtn.addEventListener('click', () => {
      if (notificationsPanel) {
        notificationsPanel.setAttribute('hidden', '');
      }
    });
  }

  function updateNotificationsContent(route) {
    const notificationsList = document.querySelector('.notifications__list');
    if (!notificationsList) return;

    const notifications = {
      student: [
        { type: 'info', text: '이번 주 과제 제출 기한이 다가옵니다.', time: '2시간 전' },
        { type: 'success', text: '월간 리포트가 업데이트되었습니다.', time: '1일 전' }
      ],
      parent: [
        { type: 'info', text: '결제 예정일이 3일 남았습니다.', time: '1시간 전' },
        { type: 'warning', text: '팀원이 1명 추가되어 수강료가 변경되었습니다.', time: '2일 전' }
      ],
      tutor: [
        { type: 'info', text: '새로운 학생 가입 신청이 있습니다.', time: '30분 전' },
        { type: 'success', text: '리포트 제출이 완료되었습니다.', time: '1일 전' }
      ],
      admin: [
        { type: 'warning', text: '오래된 미완료 매칭 게시물이 있습니다.', time: '3일 전' },
        { type: 'info', text: '정산 처리가 완료되었습니다.', time: '5일 전' }
      ]
    };

    const routeNotifications = notifications[route] || [];
    notificationsList.innerHTML = '';
    routeNotifications.forEach(notif => {
      const li = document.createElement('li');
      li.className = `notification-item notification-item--${notif.type}`;
      const p = document.createElement('p');
      p.className = 'notification-item__text';
      p.textContent = notif.text;
      const time = document.createElement('span');
      time.className = 'notification-item__time';
      time.textContent = notif.time;
      li.appendChild(p);
      li.appendChild(time);
      notificationsList.appendChild(li);
    });
  }

  // ============================================
  // 설정 모달
  // ============================================
  document.querySelectorAll('[data-action="open-settings"]').forEach(btn => {
    btn.addEventListener('click', () => {
      modalManager.open({
        title: '수강 상태 변경',
        html: `
          <div class="profile__menu-list">
            <button class="profile__menu-item profile__menu-item--withdrawal" type="button" data-action="open-withdrawal-flow">
              <span class="profile__menu-label profile__menu-label--muted">팀 탈퇴 및 수강 종료</span>
            </button>
          </div>
        `,
        actions: [
          {
            label: '닫기',
            class: 'btn--secondary',
            action: 'close-modal',
            onClick: () => {}
          }
        ]
      });
      
      // 탈퇴 버튼 이벤트
      setTimeout(() => {
        const withdrawalBtn = document.querySelector('[data-action="open-withdrawal-flow"]');
        if (withdrawalBtn) {
          withdrawalBtn.addEventListener('click', () => {
            modalManager.close();
            showWithdrawalFlow();
          });
        }
      }, 100);
    });
  });

  // ============================================
  // 탈퇴 UX 개선 (Loss Aversion 흐름)
  // ============================================
  function showWithdrawalFlow() {
    // Step 1: 삭제되는 혜택 안내
    modalManager.open({
      title: '탈퇴 전에 꼭 알고 있어야 할 정보',
      html: `
        <div class="withdrawal-info-section">
          <h4 class="withdrawal-info-section__title">
            <span class="withdrawal-info-section__icon">📚</span>
            삭제되는 혜택
          </h4>
          <ul class="withdrawal-info-list">
            <li class="withdrawal-info-item">DRM 자료(기출/기출변형/학교별 자료) 접근 권한 중단</li>
            <li class="withdrawal-info-item">오답노트/VOD 접근 권한 중단</li>
            <li class="withdrawal-info-item">이후 리포트 업데이트 제공 중단</li>
          </ul>
                </div>
        <div class="withdrawal-info-section">
          <h4 class="withdrawal-info-section__title">
            <span class="withdrawal-info-section__icon">💰</span>
            팀원 수강료 증가
          </h4>
          <ul class="withdrawal-info-list">
            <li class="withdrawal-info-item">팀 구성 인원 조정으로 남은 팀원들의 수강료가 변경될 수 있습니다.</li>
            <li class="withdrawal-info-item">이는 투명한 요금 구조 유지를 위한 조정입니다.</li>
          </ul>
                    </div>
      `,
      actions: [
        {
          label: '혜택 유지하기',
          class: 'btn--primary',
          action: 'keep-benefits',
          onClick: () => {
            modalManager.close();
          }
        },
        {
          label: '그래도 탈퇴 진행',
          class: 'btn--secondary',
          action: 'continue-withdrawal',
          onClick: () => {
            modalManager.close();
            showWithdrawalSurvey();
          },
          closeAfter: false
        }
      ]
    });
  }

  function showWithdrawalSurvey() {
    modalManager.open({
      title: '탈퇴 사유를 알려주세요',
      html: `
        <div class="withdrawal-survey">
          <p class="withdrawal-survey__desc">더 나은 서비스를 위해 탈퇴 사유를 선택해주세요. (복수 선택 가능)</p>
          <div class="withdrawal-survey__options">
            <label class="withdrawal-survey__option">
              <input type="checkbox" name="withdrawal-reason" value="curriculum">
              <span>수업/커리큘럼이 맞지 않음</span>
                </label>
            <label class="withdrawal-survey__option">
              <input type="checkbox" name="withdrawal-reason" value="tutor">
              <span>튜터와의 궁합/스타일 문제</span>
                </label>
            <label class="withdrawal-survey__option">
              <input type="checkbox" name="withdrawal-reason" value="schedule">
              <span>시간/스케줄 문제</span>
                </label>
            <label class="withdrawal-survey__option">
              <input type="checkbox" name="withdrawal-reason" value="cost">
              <span>비용 부담</span>
                </label>
            <label class="withdrawal-survey__option">
              <input type="checkbox" name="withdrawal-reason" value="other">
              <span>기타</span>
                </label>
              </div>
          <div class="withdrawal-survey__textarea">
            <label class="withdrawal-survey__label">
              <span>불편하셨던 점이 있다면 자유롭게 적어주세요. (50자 이상 입력 필요)</span>
            </label>
            <textarea class="withdrawal-survey__input" name="withdrawal-feedback" rows="4" placeholder="가능하다면, 더 나은 서비스를 위해 구체적인 사유를 적어주세요."></textarea>
              </div>
            </div>
      `,
      actions: [
        {
          label: '탈퇴 신청 완료',
          class: 'btn--primary',
          action: 'submit-withdrawal',
          onClick: () => {
            const reasons = Array.from(document.querySelectorAll('input[name="withdrawal-reason"]:checked'))
              .map(cb => cb.value);
            const feedbackInput = document.querySelector('.withdrawal-survey__input');
            const feedback = feedbackInput?.value || '';
            
            if (feedback.length < 50) {
              alert('피드백을 50자 이상 입력해주세요.');
          return;
        }
        
            modalManager.close();
            showWithdrawalComplete();
          },
          closeAfter: false
        }
      ]
    });
    
    // 피드백 입력 시 버튼 활성화/비활성화
    setTimeout(() => {
      const feedbackInput = document.querySelector('.withdrawal-survey__input');
      const submitBtn = document.querySelector('[data-action="submit-withdrawal"]');
      if (feedbackInput && submitBtn) {
        submitBtn.disabled = true;
        feedbackInput.addEventListener('input', (e) => {
          submitBtn.disabled = e.target.value.length < 50;
        });
      }
              }, 100);
  }

  function showWithdrawalComplete() {
    modalManager.open({
      title: '탈퇴 신청 완료',
      html: `
        <div class="withdrawal-summary">
          <p class="withdrawal-summary__text">
            탈퇴 신청이 완료되었습니다.<br>
            정산 절차로 3-5일 소요됩니다.
          </p>
        </div>
      `,
      actions: [
        {
          label: '확인',
          class: 'btn--primary',
          action: 'close-modal',
          onClick: () => {}
        }
      ]
    });
  }

  // ============================================
  // 모집글 관리 (중지/삭제/재개) & 신청
  // ============================================
  document.querySelectorAll('[data-action="pause-recruit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('모집을 중지하시겠습니까?')) {
        alert('모집이 중지되었습니다.');
      }
    });
  });

  document.querySelectorAll('[data-action="resume-recruit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('모집을 재개하시겠습니까?')) {
        alert('모집이 재개되었습니다.');
      }
    });
  });

  document.querySelectorAll('[data-action="delete-recruit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('모집글을 삭제하시겠습니까?')) {
        alert('모집글이 삭제되었습니다.');
      }
    });
  });

  document.querySelectorAll('[data-action="open-recruit-modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role') || 'tutor';
      modalManager.open({
        title: role === 'parent' ? '새 팀 모집글 작성' : '새 수업 모집글 작성',
        html: `
          <form class="recruit-form recruit-form__form" data-role="${role}">
            <div class="recruit-form__group">
              <label class="recruit-form__label">
                <span>과목</span>
                <select class="recruit-form__select" name="subject" required>
                  <option value="">선택하세요</option>
                  <option value="math">수학</option>
                  <option value="english">영어</option>
                  <option value="korean">국어</option>
                  <option value="science">과학</option>
                </select>
              </label>
            </div>
            <div class="recruit-form__group">
              <label class="recruit-form__label">
                <span>학년</span>
                <select class="recruit-form__select" name="grade" required>
                  <option value="">선택하세요</option>
                  <option value="hs1">고1</option>
                  <option value="hs2">고2</option>
                  <option value="hs3">고3</option>
                </select>
              </label>
            </div>
            <div class="recruit-form__group recruit-form__group--row">
              <label class="recruit-form__label">
                <span>현재 인원</span>
                <input type="number" class="recruit-form__input" name="current-count" min="0" value="0" required>
              </label>
              <label class="recruit-form__label">
                <span>최소 인원</span>
                <input type="number" class="recruit-form__input" name="min-count" min="2" value="3" required>
              </label>
              <label class="recruit-form__label">
                <span>최대 인원</span>
                <input type="number" class="recruit-form__input" name="max-count" min="2" max="8" value="4" required>
              </label>
            </div>
            <div class="recruit-form__group">
              <label class="recruit-form__label">
                <span>수업 시간</span>
                <select class="recruit-form__select" name="time" required>
                  <option value="">선택하세요</option>
                  <option value="sat-19">토요일 19시</option>
                  <option value="sun-14">일요일 14시</option>
                  <option value="weekday">평일 저녁</option>
                </select>
              </label>
            </div>
            <div class="recruit-form__group">
              <label class="recruit-form__label">
                <span>수업 설명</span>
                <textarea class="recruit-form__textarea" name="description" rows="3" placeholder="팀/수업에 대한 간단한 설명을 적어주세요." required></textarea>
              </label>
            </div>
          </form>
        `,
        actions: [
          {
            label: '취소',
            class: 'btn--secondary',
            action: 'close-modal',
            onClick: () => {}
          },
          {
            label: '등록하기',
            class: 'btn--primary',
            action: 'submit-recruit-modal',
            onClick: () => {
              alert('모집글이 등록되었습니다. (팝업 작성)');
            }
          }
        ]
      });
    });
  });

  document.querySelectorAll('[data-action="tutor-join-recruit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('신청이 완료되었습니다. 학부모/학생의 승인을 기다려주세요.');
    });
  });

  // ============================================
  // 민원/피드백 제출
  // ============================================
  document.querySelectorAll('[data-action="submit-complaint"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const from = btn.getAttribute('data-from') || 'student';
      const targetSelect = document.querySelector(`select[name="feedback-target-${from}"]`);
      const messageInput = document.querySelector(`textarea[name="feedback-message-${from}"]`);
      const target = targetSelect ? targetSelect.value : 'admin';
      const message = messageInput ? messageInput.value.trim() : '';
      if (!message) {
        alert('내용을 입력해주세요.');
        return;
      }
      alert(`민원이 접수되었습니다.\n대상: ${target}\n내용: ${message}`);
      if (messageInput) messageInput.value = '';
    });
  });

  document.querySelectorAll('[data-action="reply-complaint"]').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('답변 작성 화면으로 이동합니다. (placeholder)');
    });
  });

  // 기타 이벤트 핸들러들...
  // (기존 main.js의 나머지 로직은 점진적으로 정리)
});

