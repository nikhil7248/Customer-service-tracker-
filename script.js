document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from an API
    const sampleIssues = [
        {
            id: 1001,
            title: "Login page not working",
            customer: "John Smith",
            email: "john.smith@example.com",
            status: "open",
            priority: "high",
            category: "bug",
            description: "When trying to log in, users get a 500 error. This happens consistently across all browsers.",
            created: "2023-05-10",
            updated: "2023-05-12",
            comments: [
                {
                    author: "Support Team",
                    date: "2023-05-11",
                    text: "We've replicated the issue and are investigating the root cause."
                }
            ]
        },
        {
            id: 1002,
            title: "Feature request: Dark mode",
            customer: "Sarah Johnson",
            email: "sarah.j@example.com",
            status: "open",
            priority: "medium",
            category: "feature",
            description: "Please add a dark mode option to the application settings. Many users have requested this feature.",
            created: "2023-05-05",
            updated: "2023-05-05",
            comments: []
        },
        {
            id: 1003,
            title: "Payment processing failed",
            customer: "Robert Chen",
            email: "robert.chen@example.com",
            status: "in-progress",
            priority: "urgent",
            category: "bug",
            description: "Customers report that payments are failing with error 'Payment gateway timeout'.",
            created: "2023-05-15",
            updated: "2023-05-16",
            comments: [
                {
                    author: "Dev Team",
                    date: "2023-05-15",
                    text: "We've identified the issue with the payment gateway API. Working on a fix."
                },
                {
                    author: "Support Team",
                    date: "2023-05-16",
                    text: "Temporary workaround implemented while permanent fix is being developed."
                }
            ]
        },
        {
            id: 1004,
            title: "Password reset email delay",
            customer: "Emily Wilson",
            email: "emily.w@example.com",
            status: "resolved",
            priority: "medium",
            category: "bug",
            description: "Password reset emails are taking up to 30 minutes to arrive when they should be near instant.",
            created: "2023-04-28",
            updated: "2023-05-02",
            comments: [
                {
                    author: "Dev Team",
                    date: "2023-05-01",
                    text: "Found the issue in our email queue service. Implemented fix."
                },
                {
                    author: "QA Team",
                    date: "2023-05-02",
                    text: "Verified fix in staging environment. Emails now sending within 10 seconds."
                }
            ]
        }
    ];

    // DOM Elements
    const issuesTableBody = document.getElementById('issues-table-body');
    const newIssueBtn = document.getElementById('new-issue-btn');
    const newIssueModal = document.getElementById('new-issue-modal');
    const issueDetailModal = document.getElementById('issue-detail-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const newIssueForm = document.getElementById('new-issue-form');
    const statusFilter = document.getElementById('status-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const searchBox = document.getElementById('search-box');
    const logoutBtn = document.getElementById('logout-btn');

    // State
    let issues = [...sampleIssues];
    let currentIssueId = null;

    // Initialize the app
    function init() {
        renderIssuesTable();
        updateStats();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Modal controls
        newIssueBtn.addEventListener('click', () => newIssueModal.style.display = 'block');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                newIssueModal.style.display = 'none';
                issueDetailModal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === newIssueModal) newIssueModal.style.display = 'none';
            if (e.target === issueDetailModal) issueDetailModal.style.display = 'none';
        });

        // Form submission
        newIssueForm.addEventListener('submit', handleNewIssueSubmit);

        // Filter controls
        statusFilter.addEventListener('change', renderIssuesTable);
        priorityFilter.addEventListener('change', renderIssuesTable);
        searchBox.addEventListener('input', renderIssuesTable);

        // Logout
        logoutBtn.addEventListener('click', () => {
            alert('You have been logged out. In a real app, this would redirect to login.');
        });
    }

    // Render issues table based on current filters
    function renderIssuesTable() {
        const statusFilterValue = statusFilter.value;
        const priorityFilterValue = priorityFilter.value;
        const searchTerm = searchBox.value.toLowerCase();

        const filteredIssues = issues.filter(issue => {
            const matchesStatus = statusFilterValue === 'all' || issue.status === statusFilterValue;
            const matchesPriority = priorityFilterValue === 'all' || issue.priority === priorityFilterValue;
            const matchesSearch = 
                issue.title.toLowerCase().includes(searchTerm) ||
                issue.customer.toLowerCase().includes(searchTerm) ||
                issue.description.toLowerCase().includes(searchTerm) ||
                issue.id.toString().includes(searchTerm);

            return matchesStatus && matchesPriority && matchesSearch;
        });

        issuesTableBody.innerHTML = '';

        if (filteredIssues.length === 0) {
            issuesTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No issues found matching your criteria</td>
                </tr>
            `;
            return;
        }

        filteredIssues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.id}</td>
                <td>${issue.title}</td>
                <td>${issue.customer}</td>
                <td><span class="status-badge ${issue.status}">${formatStatus(issue.status)}</span></td>
                <td><span class="priority-badge ${issue.priority}">${formatPriority(issue.priority)}</span></td>
                <td>${formatDate(issue.created)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${issue.id}">View</button>
                    <button class="action-btn edit-btn" data-id="${issue.id}">Edit</button>
                </td>
            `;
            issuesTableBody.appendChild(row);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const issueId = parseInt(e.target.getAttribute('data-id'));
                showIssueDetail(issueId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const issueId = parseInt(e.target.getAttribute('data-id'));
                // In a real app, this would open an edit form
                alert(`Edit issue ${issueId} - this would open an edit form in a real app`);
            });
        });
    }

    // Show issue detail modal
    function showIssueDetail(issueId) {
        const issue = issues.find(i => i.id === issueId);
        if (!issue) return;

        currentIssueId = issueId;

        // Set basic info
        document.getElementById('detail-title').textContent = issue.title;
        document.getElementById('detail-description').textContent = issue.description;
        document.getElementById('detail-customer').textContent = issue.customer;
        document.getElementById('detail-email').textContent = issue.email;
        document.getElementById('detail-created').textContent = formatDate(issue.created);
        document.getElementById('detail-updated').textContent = formatDate(issue.updated);
        document.getElementById('detail-category').textContent = formatCategory(issue.category);
        document.getElementById('detail-id').textContent = `#${issue.id}`;

        // Set status and priority badges
        const statusBadge = document.getElementById('detail-status');
        statusBadge.textContent = formatStatus(issue.status);
        statusBadge.className = `status-badge ${issue.status}`;

        const priorityBadge = document.getElementById('detail-priority');
        priorityBadge.textContent = formatPriority(issue.priority);
        priorityBadge.className = `priority-badge ${issue.priority}`;

        // Set status dropdown
        document.getElementById('status-update').value = issue.status;

        // Render comments
        renderComments(issue.comments);

        // Show modal
        issueDetailModal.style.display = 'block';

        // Setup modal event listeners
        setupDetailModalEvents();
    }

    // Render comments for an issue
    function renderComments(comments) {
        const container = document.getElementById('comments-container');
        container.innerHTML = '';

        if (comments.length === 0) {
            container.innerHTML = '<p>No comments yet.</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            container.appendChild(commentDiv);
        });
    }

    // Setup event listeners for the detail modal
    function setupDetailModalEvents() {
        document.getElementById('save-status-btn').addEventListener('click', updateIssueStatus);
        document.getElementById('add-comment-btn').addEventListener('click', toggleCommentForm);
        document.getElementById('submit-comment-btn').addEventListener('click', addComment);
    }

    // Update issue status
    function updateIssueStatus() {
        const newStatus = document.getElementById('status-update').value;
        const issueIndex = issues.findIndex(i => i.id === currentIssueId);
        
        if (issueIndex !== -1) {
            issues[issueIndex].status = newStatus;
            issues[issueIndex].updated = new Date().toISOString().split('T')[0];
            
            // Update the UI
            const statusBadge = document.getElementById('detail-status');
            statusBadge.textContent = formatStatus(newStatus);
            statusBadge.className = `status-badge ${newStatus}`;
            
            // Re-render the table to reflect changes
            renderIssuesTable();
            updateStats();
            
            alert('Status updated successfully!');
        }
    }

    // Toggle comment form visibility
    function toggleCommentForm() {
        const commentSection = document.getElementById('new-comment-section');
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }

    // Add a new comment
    function addComment() {
        const commentText = document.getElementById('comment-text').value.trim();
        if (!commentText) {
            alert('Please enter a comment');
            return;
        }

        const issueIndex = issues.findIndex(i => i.id === currentIssueId);
        if (issueIndex === -1) return;

        const newComment = {
            author: "Current User", // In a real app, this would be the logged in user
            date: new Date().toISOString().split('T')[0],
            text: commentText
        };

        issues[issueIndex].comments.push(newComment);
        issues[issueIndex].updated = new Date().toISOString().split('T')[0];

        // Update UI
        renderComments(issues[issueIndex].comments);
        document.getElementById('comment-text').value = '';
        document.getElementById('new-comment-section').style.display = 'none';
    }

    // Handle new issue form submission
    function handleNewIssueSubmit(e) {
        e.preventDefault();
        
        // In a real app, this would validate inputs more thoroughly
        const title = document.getElementById('issue-title').value;
        const description = document.getElementById('issue-description').value;
        const customer = document.getElementById('issue-customer').value;
        const email = document.getElementById('issue-email').value;
        const priority = document.getElementById('issue-priority').value;
        const category = document.getElementById('issue-category').value;

        // Create new issue
        const newIssue = {
            id: generateNewId(),
            title,
            customer,
            email,
            status: "open",
            priority,
            category,
            description,
            created: new Date().toISOString().split('T')[0],
            updated: new Date().toISOString().split('T')[0],
            comments: []
        };

        // Add to issues array
        issues.unshift(newIssue);

        // Reset form and close modal
        newIssueForm.reset();
        newIssueModal.style.display = 'none';

        // Update UI
        renderIssuesTable();
        updateStats();
        
        alert('New issue created successfully!');
    }

    // Update statistics counters
    function updateStats() {
        document.getElementById('open-count').textContent = 
            issues.filter(i => i.status === 'open').length;
        
        document.getElementById('progress-count').textContent = 
            issues.filter(i => i.status === 'in-progress').length;
        
        document.getElementById('resolved-count').textContent = 
            issues.filter(i => i.status === 'resolved').length;
        
        document.getElementById('urgent-count').textContent = 
            issues.filter(i => i.priority === 'urgent').length;
    }

    // Helper functions
    function formatStatus(status) {
        const statusMap = {
            'open': 'Open',
            'in-progress': 'In Progress',
            'resolved': 'Resolved'
        };
        return statusMap[status] || status;
    }

    function formatPriority(priority) {
        const priorityMap = {
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High',
            'urgent': 'Urgent'
        };
        return priorityMap[priority] || priority;
    }

    function formatCategory(category) {
        const categoryMap = {
            'bug': 'Bug',
            'feature': 'Feature Request',
            'question': 'Question',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }

    function formatDate(dateString) {
        // In a real app, you might use a library like moment.js or date-fns
        return dateString; // Simplified for this example
    }

    function generateNewId() {
        return Math.max(...issues.map(i => i.id)) + 1;
    }

    // Initialize the app
    init();
});