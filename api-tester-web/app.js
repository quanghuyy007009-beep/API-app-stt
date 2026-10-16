/**
 * BẢNG THỬ NGHIỆM REST API - SÂN THỂ THAO
 * Client Logic for Courts API Testing (GET, POST, PUT, DELETE)
 */

(function () {
  'use strict';

  // --- STATE ---
  let currentTab = 'detail'; // 'list', 'detail', 'create', 'update', 'delete'
  let lastResponseText = '';

  // --- TAB CONFIGURATIONS (SÂN THỂ THAO) ---
  const CONFIG = {
    list: {
      method: 'GET',
      badgeClass: 'badge-get',
      title: 'Lấy danh sách tất cả sân thể thao',
      desc: 'Lấy toàn bộ danh sách sân thể thao kèm địa chỉ và môn thể thao từ server.',
      params: 'sportType (môn thể thao, tùy chọn), venueId (tùy chọn)',
      success: '200 OK: [ { id, venueId, name, sportType, pricePerHour, address } ]',
      subtitle: 'Tự động tạo URL',
      fields: [],
      getUrl: () => '/api/courts'
    },
    detail: {
      method: 'GET',
      badgeClass: 'badge-get',
      title: 'Xem chi tiết 1 sân thể thao',
      desc: 'Lấy thông tin chi tiết tên sân, môn thể thao, giá tiền và địa chỉ theo ID.',
      params: 'id (đường dẫn)',
      success: '200 OK: { id, venueId, name, sportType, pricePerHour, address }',
      subtitle: 'Tự động theo ID sân',
      fields: ['grpId'],
      getUrl: (p) => `/api/courts/${p.id || 2}`
    },
    create: {
      method: 'POST',
      badgeClass: 'badge-post',
      title: 'Thêm mới 1 sân thể thao',
      desc: 'Tạo sân thể thao mới với tên sân, môn thể thao và giá thuê mỗi giờ.',
      params: 'Body JSON: { name, sportType, pricePerHour, venueId }',
      success: '201 Created: { id, name, sportType, pricePerHour, isActive }',
      subtitle: 'Gửi dữ liệu JSON',
      fields: ['grpTitle', 'grpSportType', 'grpPrice'],
      getUrl: () => '/api/courts'
    },
    update: {
      method: 'PUT',
      badgeClass: 'badge-put',
      title: 'Cập nhật thông tin sân',
      desc: 'Chỉnh sửa tên sân, môn thể thao hoặc giá thuê theo ID.',
      params: 'id (đường dẫn), Body JSON: { name, sportType, pricePerHour }',
      success: '200 OK: { message, court }',
      subtitle: 'Cập nhật theo ID',
      fields: ['grpId', 'grpTitle', 'grpSportType', 'grpPrice'],
      getUrl: (p) => `/api/courts/${p.id || 2}`
    },
    delete: {
      method: 'DELETE',
      badgeClass: 'badge-delete',
      title: 'Xóa sân thể thao theo ID',
      desc: 'Xóa vĩnh viễn sân thể thao khỏi cơ sở dữ liệu theo ID.',
      params: 'id (đường dẫn)',
      success: '200 OK: { message: "Đã xóa thành công..." }',
      subtitle: 'Xóa theo ID',
      fields: ['grpId'],
      getUrl: (p) => `/api/courts/${p.id || 2}`
    }
  };

  // --- DOM ELEMENTS ---
  const methodPills = document.querySelectorAll('.method-pill');

  // Doc card
  const docMethodBadge = document.getElementById('docMethodBadge');
  const docTitle = document.getElementById('docTitle');
  const docDesc = document.getElementById('docDesc');
  const docParams = document.getElementById('docParams');
  const docSuccess = document.getElementById('docSuccess');

  // Preview & Request
  const reqSubtitle = document.getElementById('reqSubtitle');
  const previewMethod = document.getElementById('previewMethod');
  const previewUrl = document.getElementById('previewUrl');

  // Form Fields
  const executeForm = document.getElementById('executeForm');
  const grpId = document.getElementById('grpId');
  const grpTitle = document.getElementById('grpTitle');
  const grpSportType = document.getElementById('grpSportType');
  const grpPrice = document.getElementById('grpPrice');

  const inputId = document.getElementById('inputId');
  const inputTitle = document.getElementById('inputTitle');
  const inputSportType = document.getElementById('inputSportType');
  const inputPrice = document.getElementById('inputPrice');

  const btnSend = document.getElementById('btnSend');
  const btnSendText = document.getElementById('btnSendText');

  // Response Card
  const responseCard = document.getElementById('responseCard');
  const resStatusBadge = document.getElementById('resStatusBadge');
  const resTimeBadge = document.getElementById('resTimeBadge');
  const responseCode = document.getElementById('responseCode');
  const btnCopyCode = document.getElementById('btnCopyCode');

  // --- INITIALIZATION ---
  init();

  function init() {
    bindEvents();
    applyState();
  }

  function bindEvents() {
    // Method Pills Navigation
    methodPills.forEach(pill => {
      pill.addEventListener('click', () => {
        methodPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentTab = pill.getAttribute('data-tab');
        applyState();
      });
    });

    // Real-time URL preview updates on typing
    [inputId, inputTitle, inputSportType, inputPrice].forEach(input => {
      input.addEventListener('input', updateUrlPreview);
    });

    // Form Submit (Execute Request)
    executeForm.addEventListener('submit', handleSendRequest);

    // Copy Response Code
    btnCopyCode.addEventListener('click', () => {
      if (!lastResponseText) return;
      navigator.clipboard.writeText(lastResponseText).then(() => {
        btnCopyCode.textContent = 'Đã sao chép!';
        setTimeout(() => { btnCopyCode.textContent = 'Sao chép'; }, 2000);
      });
    });
  }

  function applyState() {
    const config = CONFIG[currentTab];
    if (!config) return;

    // Update Doc Card
    docMethodBadge.className = 'doc-method-badge ' + config.badgeClass;
    docMethodBadge.textContent = config.method;
    docTitle.textContent = config.title;
    docDesc.textContent = config.desc;
    docParams.textContent = config.params;
    docSuccess.textContent = config.success;

    // Update Subtitle & Preview Method
    reqSubtitle.textContent = config.subtitle;
    previewMethod.textContent = config.method;

    // Show/hide fields
    const allFieldGroups = [grpId, grpTitle, grpSportType, grpPrice];
    allFieldGroups.forEach(grp => { grp.style.display = 'none'; });

    config.fields.forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) el.style.display = 'flex';
    });

    // Provide default sample data if empty
    if (currentTab === 'create' || currentTab === 'update') {
      if (!inputTitle.value) {
        inputTitle.value = 'Sân Cầu Lông Số 5';
      }
    }

    updateUrlPreview();
  }

  function updateUrlPreview() {
    const config = CONFIG[currentTab];
    if (!config) return;

    const params = {
      id: inputId.value.trim()
    };

    const relativeUrl = config.getUrl(params);
    previewUrl.textContent = relativeUrl;
  }

  async function handleSendRequest(e) {
    e.preventDefault();

    const config = CONFIG[currentTab];
    if (!config) return;

    const relativeUrl = previewUrl.textContent.trim();
    const fullUrl = window.location.origin + relativeUrl;

    btnSend.classList.add('loading');
    btnSend.disabled = true;
    btnSendText.textContent = 'Đang gửi...';

    const fetchOptions = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Body payload for POST and PUT
    if (config.method === 'POST' || config.method === 'PUT') {
      const bodyData = {
        name: inputTitle.value.trim() || 'Sân Thể Thao Mới',
        sportType: inputSportType.value.trim() || 'Badminton',
        pricePerHour: parseFloat(inputPrice.value) || 120000,
        venueId: 1
      };
      fetchOptions.body = JSON.stringify(bodyData);
    }

    const startTime = performance.now();

    try {
      const res = await fetch(fullUrl, fetchOptions);
      const durationMs = Math.round(performance.now() - startTime);

      const status = res.status;
      const statusText = res.statusText || 'OK';

      let data;
      const rawText = await res.text();
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        data = rawText;
      }

      renderResponse(status, statusText, durationMs, data);
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      renderResponse(0, 'Lỗi kết nối', durationMs, {
        error: err.message || 'Failed to fetch',
        gợi_ý: 'Vui lòng kiểm tra server ASP.NET Core đang chạy (F5 trong Visual Studio).'
      });
    } finally {
      btnSend.classList.remove('loading');
      btnSend.disabled = false;
      btnSendText.textContent = 'Gửi Request';
    }
  }

  function renderResponse(status, statusText, durationMs, data) {
    responseCard.style.display = 'block';

    if (status >= 200 && status < 300) {
      resStatusBadge.textContent = `${status} ${statusText}`;
      resStatusBadge.className = 'status-badge status-2xx';
    } else {
      resStatusBadge.textContent = status ? `${status} ${statusText}` : 'Lỗi kết nối';
      resStatusBadge.className = 'status-badge status-4xx';
    }

    resTimeBadge.textContent = `${durationMs} ms`;

    const formattedJson = typeof data === 'object'
      ? JSON.stringify(data, null, 2)
      : String(data);

    lastResponseText = formattedJson;
    responseCode.innerHTML = syntaxHighlightJson(formattedJson);

    // Scroll smoothly to response card
    responseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function syntaxHighlightJson(jsonStr) {
    const escaped = escapeHtml(jsonStr);
    return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str || '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
