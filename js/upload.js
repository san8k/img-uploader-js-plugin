function bytesToSize(bytes) {
  const sizes = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  if (bytes === 0) return '0B';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1025, i), 2 + ' ' + sizes[i]);
}

function createElement(node, classes = [], content) {
  const el = document.createElement(node);
  el.classList.add(...classes);
  el.textContent = content ? content : null;
  return el;
}

export function upload(selector, options = {}) {
  let files = [];
  const onUpload = options.onUpload || function () {};
  const input = document.querySelector(selector);

  const preview = createElement('div', ['preview']);
  const openBtn = createElement('button', ['btn'], 'Open');
  const uploadBtn = createElement('button', ['btn', 'primary'], 'Upload');
  uploadBtn.style.display = 'none';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }
  if (options.fileExtensions && Array.isArray(options.fileExtensions)) {
    input.setAttribute('accept', options.fileExtensions.join(','));
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', uploadBtn);
  input.insertAdjacentElement('afterend', openBtn);

  const triggerFileInput = () => input.click();

  const inputChangeHandler = (e) => {
    if (!e.target.files.length) return;

    files = Array.from(e.target.files);

    // clear previous files
    preview.innerHTML = '';

    files.forEach(file => {
      if (!file.type.match('image')) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const src = e.target.result;

        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}">
            <div class="preview-info">
              <span>${file.name}</span>
              <span>${bytesToSize(file.size)}</span>
            </div>
          </div>
        `);
      };
      reader.readAsDataURL(file);
    });

    uploadBtn.style.display = 'inline';
  };

  const removeHandler = (e) => {
    if (!e.target.dataset.name) return;

    const { name } = e.target.dataset;
    files = files.filter((o) => o.name !== name);

    const current = preview.querySelector(`[data-name="${name}"]`)
      .closest('.preview-image');
    current.classList.add('removing');
    current.addEventListener('transitionend', () => {
      current.remove();
    });

    if (!files.length) uploadBtn.style.display = 'none';
  };

  const clearPreview = (el) => {
    el.style.bottom = '4px';
    el.innerHTML = '<div class="preview-info-progress"></div>';
  };

  const uploadHandler = (e) => {
    preview.querySelectorAll('.preview-remove')
      .forEach((o) => o.remove());
    const prevInfo = preview.querySelectorAll('.preview-info');
    prevInfo.forEach(clearPreview);
    onUpload(files, prevInfo);
  };

  openBtn.addEventListener('click', triggerFileInput);
  input.addEventListener('change', inputChangeHandler);
  preview.addEventListener('click', removeHandler);
  uploadBtn.addEventListener('click', uploadHandler);
}
