document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-menu');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    
    const dashboardView = document.getElementById('dashboard-view');
    const apiView = document.getElementById('api-view');
    const apiHeader = document.getElementById('api-header');
    const allNavButtons = document.querySelectorAll('.nav-button');
    const dashboardLink = document.getElementById('dashboard-link');
    const categoryLinks = document.querySelectorAll('.category-link');
    const allEndpointContainers = document.querySelectorAll('#api-view .endpoint-container');
    const categoryTitle = document.getElementById('current-category-title');

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    const setActiveButton = (activeButton) => {
        allNavButtons.forEach(button => button.classList.remove('active'));
        if (activeButton) activeButton.classList.add('active');
    };

    if (hamburger) hamburger.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        apiView.style.display = 'none';
        dashboardView.style.display = 'block';
        setActiveButton(dashboardLink);
        toggleSidebar();
    });

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            
            dashboardView.style.display = 'none';
            apiView.style.display = 'block';
            categoryTitle.textContent = category;
            
            allEndpointContainers.forEach(container => {
                container.style.display = container.dataset.category === category ? 'block' : 'none';
            });
            
            setActiveButton(link);
            toggleSidebar();
            
            setTimeout(() => {
                apiHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        });
    });

    allEndpointContainers.forEach(container => {
        const header = container.querySelector('.endpoint-header');
        const chevron = container.querySelector('.chevron-icon');

        header.addEventListener('click', () => {
            const wasActive = container.classList.contains('active');
            container.classList.toggle('active');
            chevron.classList.toggle('rotated');
            
            if (!wasActive) {
                setTimeout(() => {
                    header.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }
        });

        const fileInput = container.querySelector('.file-input');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const fileNameDisplay = container.querySelector('.file-name-display');
                if (fileInput.files.length > 0) {
                    fileNameDisplay.textContent = fileInput.files[0].name;
                } else {
                    fileNameDisplay.textContent = 'No file chosen';
                }
            });
        }

        const executeBtn = container.querySelector('.execute-btn');
        const visitBtn = container.querySelector('.visit-btn');
        const resultContainer = container.querySelector('.result-container');
        
        async function handleFetch(url, options) {
            const requestUrlEl = container.querySelector('.request-url');
            const resultWrapper = container.querySelector('.result-wrapper');
            const resultCode = resultWrapper.querySelector('code.language-json');
            const loadingWave = resultWrapper.querySelector('.loading-wave');
            const statusCodeEl = resultContainer.querySelector('.status-code');

            resultContainer.classList.add('visible');
            setTimeout(() => {
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            
            requestUrlEl.textContent = (typeof url === 'object') ? url.href : url;
            resultCode.parentElement.style.display = 'none';
            loadingWave.style.display = 'flex';
            statusCodeEl.className = 'status-code';
            statusCodeEl.style.display = 'none';

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Request failed');
                }

                resultCode.textContent = JSON.stringify(data, null, 2);
                hljs.highlightElement(resultCode);
                statusCodeEl.textContent = response.status;
                statusCodeEl.classList.add('status-2xx');
            } catch (error) {
                resultCode.textContent = JSON.stringify({ error: error.message }, null, 2);
                hljs.highlightElement(resultCode);
                statusCodeEl.textContent = 'ERR';
                statusCodeEl.classList.add('status-5xx');
            } finally {
                loadingWave.style.display = 'none';
                resultCode.parentElement.style.display = 'block';
                statusCodeEl.style.display = 'block';
            }
        }
        
        executeBtn.addEventListener('click', async () => {
            const isFileUpload = !!container.querySelector('.file-input');
            const endpointPath = container.querySelector('.endpoint-path').textContent;
            const method = container.querySelector('.method-badge').textContent.trim();
            const url = location.origin + endpointPath;

            if (isFileUpload) {
                const fileInput = container.querySelector('.file-input');
                if (fileInput.files.length === 0) {
                    alert('Please choose a file to upload.');
                    return;
                }
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                handleFetch(url, { method: 'POST', body: formData });
            } else {
                const inputs = container.querySelectorAll('.panel-section input');
                const params = new URLSearchParams();
                inputs.forEach(input => {
                    if (input.value) {
                        params.append(input.dataset.paramName, input.value);
                    }
                });
                const fullUrl = new URL(url);
                fullUrl.search = params.toString();
                handleFetch(fullUrl, { method });
            }
        });

        if (visitBtn) {
            visitBtn.addEventListener('click', () => {
                const url = location.origin + container.querySelector('.endpoint-path').textContent;
                const inputs = container.querySelectorAll('.panel-section input');
                const params = new URLSearchParams();
                inputs.forEach(input => {
                    if (input.value) {
                        params.append(input.dataset.paramName, input.value);
                    }
                });
                window.open(`${url}?${params.toString()}`, '_blank');
            });
        }
    });

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const textToCopy = button.parentElement.querySelector('pre').textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.classList.add('copied');
                setTimeout(() => button.classList.remove('copied'), 2000);
            });
        });
    });
});
