// Dashboard JavaScript for 3D Print Pro

class Dashboard {
    constructor() {
        this.currentSection = 'overview';
        this.charts = {};
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.initCharts();
        this.setupSearch();
        this.setupNotifications();
        this.loadDashboardData();
    }
    
    setupNavigation() {
        // Sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-item');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                // Update active state
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
        
        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }
    
    showSection(sectionId) {
        // Hide all sections
        const sections = ['overview', 'upload', 'viewer', 'jobs'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.classList.add('hidden');
            }
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        this.currentSection = sectionId;
        
        // Update charts when showing overview
        if (sectionId === 'overview') {
            this.updateCharts();
        }
    }
    
    initCharts() {
        // Monthly Spending Chart
        const spendingCtx = document.getElementById('spendingChart');
        if (spendingCtx) {
            this.charts.spending = new Chart(spendingCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Monthly Spending ($)',
                        data: [120, 190, 150, 250, 180, 220],
                        backgroundColor: 'rgba(251, 146, 60, 0.6)',
                        borderColor: 'rgba(251, 146, 60, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Material Distribution Chart
        const materialCtx = document.getElementById('materialChart');
        if (materialCtx) {
            this.charts.material = new Chart(materialCtx, {
                type: 'doughnut',
                data: {
                    labels: ['PLA', 'ABS', 'Resin', 'Nylon', 'Metal'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: [
                            'rgba(251, 146, 60, 0.8)',
                            'rgba(6, 182, 212, 0.8)',
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(107, 114, 128, 0.8)'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
    
    updateCharts() {
        // Simulate real-time data updates
        if (this.charts.spending) {
            const newData = this.charts.spending.data.datasets[0].data.map(val => 
                Math.max(50, val + (Math.random() - 0.5) * 50)
            );
            this.charts.spending.data.datasets[0].data = newData;
            this.charts.spending.update();
        }
        
        if (this.charts.material) {
            const newData = this.charts.material.data.datasets[0].data.map(val => 
                Math.max(5, val + (Math.random() - 0.5) * 10)
            );
            this.charts.material.data.datasets[0].data = newData;
            this.charts.material.update();
        }
    }
    
    setupSearch() {
        const searchInput = document.querySelector('input[placeholder*="Search jobs"]');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.searchJobs(e.target.value);
            }, 300));
        }
    }
    
    searchJobs(query) {
        const rows = document.querySelectorAll('#jobs table tbody tr');
        
        rows.forEach(row => {
            const jobId = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
            const fileName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            
            const matches = jobId.includes(query.toLowerCase()) || fileName.includes(query.toLowerCase());
            
            if (matches || query === '') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    setupNotifications() {
        const notificationButton = document.querySelector('[class*="fa-bell"]').parentElement;
        if (notificationButton) {
            notificationButton.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }
    
    showNotifications() {
        const notifications = [
            { type: 'success', message: 'Job #001 completed successfully', time: '2 hours ago' },
            { type: 'info', message: 'New material available: Carbon Fiber', time: '5 hours ago' },
            { type: 'warning', message: 'Job #002 requires attention', time: '1 day ago' }
        ];
        
        // Create notification dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute top-12 right-4 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto';
        dropdown.innerHTML = `
            <div class="p-4 border-b border-gray-200">
                <h3 class="font-semibold">Notifications</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
                ${notifications.map(notif => `
                    <div class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 rounded-full mt-2 ${
                                notif.type === 'success' ? 'bg-green-500' :
                                notif.type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                            }"></div>
                            <div class="flex-1">
                                <p class="text-sm">${notif.message}</p>
                                <p class="text-xs text-gray-500 mt-1">${notif.time}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="p-3 text-center">
                <button class="text-sm text-orange-600 hover:text-orange-700">Mark all as read</button>
            </div>
        `;
        
        document.body.appendChild(dropdown);
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }
    
    loadDashboardData() {
        // Simulate loading dashboard data
        this.updateStats();
        this.loadRecentJobs();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateStats();
        }, 30000); // Update every 30 seconds
    }
    
    updateStats() {
        // Update stats with simulated real-time data
        const stats = {
            totalJobs: 24 + Math.floor(Math.random() * 5),
            inProgress: 3 + Math.floor(Math.random() * 3),
            completed: 21 + Math.floor(Math.random() * 5),
            totalSpent: 1247 + Math.floor(Math.random() * 200)
        };
        
        // Update stat cards
        const statElements = {
            totalJobs: document.querySelector('.grid .text-2xl'),
            inProgress: document.querySelectorAll('.grid .text-2xl')[1],
            completed: document.querySelectorAll('.grid .text-2xl')[2],
            totalSpent: document.querySelectorAll('.grid .text-2xl')[3]
        };
        
        Object.entries(stats).forEach(([key, value]) => {
            if (statElements[key]) {
                if (key === 'totalSpent') {
                    statElements[key].textContent = '$' + value.toLocaleString();
                } else {
                    statElements[key].textContent = value;
                }
            }
        });
    }
    
    loadRecentJobs() {
        // Simulate loading recent jobs
        const recentJobs = [
            { id: '#004', name: 'bracket_mount.stl', status: 'printing', material: 'PLA', quantity: 3, price: 15.00 },
            { id: '#005', name: 'enclosure_top.obj', status: 'uploaded', material: 'ABS', quantity: 1, price: 22.50 },
            { id: '#006', name: 'gear_set.step', status: 'processing', material: 'Resin', quantity: 2, price: 35.00 }
        ];
        
        // Add to jobs table if it exists
        const tbody = document.querySelector('#jobs table tbody');
        if (tbody && tbody.children.length < 6) { // Only add if table is not too full
            recentJobs.forEach(job => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 transition-colors animate-slide-up';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${job.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">${job.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="status-badge status-${job.status}">${job.status.replace('-', ' ')}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">${job.material}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">${job.quantity}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">$${job.price.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <button class="text-orange-600 hover:text-orange-700 mr-3" onclick="showJobDetails('${job.id}')">View</button>
                        <button class="text-gray-600 hover:text-gray-700">Download</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    exportData(format) {
        // Export dashboard data
        const data = {
            stats: {
                totalJobs: 24,
                inProgress: 3,
                completed: 21,
                totalSpent: 1247
            },
            jobs: this.getJobsData(),
            exportDate: new Date().toISOString()
        };
        
        if (format === 'csv') {
            this.exportToCSV(data.jobs);
        } else if (format === 'json') {
            this.exportToJSON(data);
        }
    }
    
    getJobsData() {
        const rows = document.querySelectorAll('#jobs table tbody tr');
        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                id: cells[0]?.textContent,
                fileName: cells[1]?.textContent,
                status: cells[2]?.textContent.trim(),
                material: cells[3]?.textContent,
                quantity: cells[4]?.textContent,
                price: cells[5]?.textContent
            };
        });
    }
    
    exportToCSV(data) {
        const headers = ['Job ID', 'File Name', 'Status', 'Material', 'Quantity', 'Price'];
        const csvContent = [
            headers.join(','),
            ...data.map(job => [
                job.id,
                job.fileName,
                job.status,
                job.material,
                job.quantity,
                job.price
            ].join(','))
        ].join('\n');
        
        this.downloadFile(csvContent, 'jobs_export.csv', 'text/csv');
    }
    
    exportToJSON(data) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'dashboard_export.json', 'application/json');
    }
    
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize dashboard
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
    
    // Add export buttons to dashboard
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        const exportButtons = document.createElement('div');
        exportButtons.className = 'flex space-x-3 mb-6';
        exportButtons.innerHTML = `
            <button onclick="dashboard.exportData('csv')" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i class="fas fa-file-csv mr-2"></i>Export CSV
            </button>
            <button onclick="dashboard.exportData('json')" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i class="fas fa-file-code mr-2"></i>Export JSON
            </button>
        `;
        overviewSection.appendChild(exportButtons);
    }
});

// Make dashboard available globally
window.dashboard = dashboard;
