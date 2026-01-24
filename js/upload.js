// File Upload Handler for 3D Print Pro Dashboard

class FileUploadHandler {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.fileList = document.getElementById('fileList');
        
        this.allowedTypes = ['.stl', '.obj', '.step', '.stp', '.3mf'];
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.uploadedFiles = [];
        
        this.init();
    }
    
    init() {
        if (!this.dropZone || !this.fileInput) return;
        
        // Click to upload
        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });
        
        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    handleFiles(files) {
        const validFiles = Array.from(files).filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            showNotification('No valid files selected. Please upload STL, OBJ, STEP, or 3MF files.', 'error');
            return;
        }
        
        // Show upload progress
        this.showUploadProgress();
        
        // Simulate upload process
        this.simulateUpload(validFiles);
    }
    
    validateFile(file) {
        // Check file type
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!this.allowedTypes.includes(fileExtension)) {
            showNotification(`Invalid file type: ${file.name}. Only STL, OBJ, STEP, and 3MF files are allowed.`, 'error');
            return false;
        }
        
        // Check file size
        if (file.size > this.maxFileSize) {
            showNotification(`File too large: ${file.name}. Maximum size is 50MB.`, 'error');
            return false;
        }
        
        // Check for duplicates
        if (this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            showNotification(`Duplicate file: ${file.name}`, 'warning');
            return false;
        }
        
        return true;
    }
    
    showUploadProgress() {
        if (this.uploadProgress) {
            this.uploadProgress.classList.remove('hidden');
            this.progressFill.style.width = '0%';
            this.progressPercent.textContent = '0%';
        }
    }
    
    hideUploadProgress() {
        if (this.uploadProgress) {
            this.uploadProgress.classList.add('hidden');
        }
    }
    
    simulateUpload(files) {
        let totalProgress = 0;
        const progressIncrement = 100 / files.length;
        
        files.forEach((file, index) => {
            setTimeout(() => {
                this.uploadSingleFile(file, () => {
                    totalProgress += progressIncrement;
                    this.updateProgress(Math.min(totalProgress, 100));
                    
                    if (totalProgress >= 100) {
                        setTimeout(() => {
                            this.hideUploadProgress();
                            showNotification(`Successfully uploaded ${files.length} file(s)`, 'success');
                        }, 500);
                    }
                });
            }, index * 300);
        });
    }
    
    uploadSingleFile(file, callback) {
        const fileId = 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const fileData = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop().toLowerCase(),
            uploadDate: new Date().toISOString(),
            status: 'uploaded'
        };
        
        // Add to uploaded files
        this.uploadedFiles.push(fileData);
        
        // Add to file list
        this.addFileToList(fileData);
        
        // Add to jobs table
        this.addJobToTable(fileData);
        
        // Simulate upload progress for this file
        let fileProgress = 0;
        const progressInterval = setInterval(() => {
            fileProgress += 10;
            if (fileProgress >= 100) {
                clearInterval(progressInterval);
                callback();
            }
        }, 50);
    }
    
    updateProgress(percent) {
        if (this.progressFill && this.progressPercent) {
            this.progressFill.style.width = percent + '%';
            this.progressPercent.textContent = Math.round(percent) + '%';
        }
    }
    
    addFileToList(fileData) {
        if (!this.fileList) return;
        
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
        fileItem.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cube text-orange-600"></i>
                </div>
                <div>
                    <div class="font-medium">${fileData.name}</div>
                    <div class="text-sm text-gray-500">${formatFileSize(fileData.size)} • ${fileData.type.toUpperCase()}</div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="status-badge status-uploaded">Uploaded</span>
                <button class="text-gray-400 hover:text-red-500 transition-colors" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        this.fileList.appendChild(fileItem);
    }
    
    addJobToTable(fileData) {
        const tbody = document.querySelector('#jobs table tbody');
        if (!tbody) return;
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors animate-slide-up';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">#${fileData.id.substr(-6).toUpperCase()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">${fileData.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-uploaded">Uploaded</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">PLA</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">1</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">$${(Math.random() * 50 + 10).toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-orange-600 hover:text-orange-700 mr-3" onclick="showJobDetails('${fileData.id}')">View</button>
                <button class="text-gray-600 hover:text-gray-700">Download</button>
            </td>
        `;
        
        tbody.insertBefore(row, tbody.firstChild);
        
        // Simulate status updates
        this.simulateJobProgress(fileData.id);
    }
    
    simulateJobProgress(jobId) {
        const statuses = [
            { status: 'processing', badge: 'status-processing', delay: 2000 },
            { status: 'printing', badge: 'status-printing', delay: 5000 },
            { status: 'quality-check', badge: 'status-quality-check', delay: 10000 },
            { status: 'completed', badge: 'status-completed', delay: 15000 }
        ];
        
        statuses.forEach(({ status, badge, delay }) => {
            setTimeout(() => {
                this.updateJobStatus(jobId, status, badge);
            }, delay);
        });
    }
    
    updateJobStatus(jobId, status, badgeClass) {
        const rows = document.querySelectorAll('#jobs table tbody tr');
        rows.forEach(row => {
            const jobIdCell = row.querySelector('td:first-child');
            if (jobIdCell && jobIdCell.textContent.includes(jobId.substr(-6).toUpperCase())) {
                const statusCell = row.querySelector('td:nth-child(3) span');
                if (statusCell) {
                    statusCell.className = `status-badge ${badgeClass}`;
                    statusCell.textContent = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                }
            }
        });
    }
}

// Initialize file upload handler
let fileUploadHandler;

document.addEventListener('DOMContentLoaded', () => {
    fileUploadHandler = new FileUploadHandler();
});

// Global function to show job details
function showJobDetails(jobId) {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

// Make fileUploadHandler available globally
window.fileUploadHandler = fileUploadHandler;
