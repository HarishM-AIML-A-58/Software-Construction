// Global variables
let currentChat = null;
let messages = {};
let groups = {};
let campaigns = [];

// Message handling
const messageInput = document.getElementById('messageInput');
const sendButton = document.querySelector('.send-btn');
const attachButton = document.querySelector('.attach-btn');
const infoButton = document.querySelector('.info-btn');
const filePreview = document.querySelector('.file-preview');
const closePreview = document.querySelector('.close-preview');
const chatMessages = document.querySelector('.chat-messages');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

let currentAttachment = null;

// Profile settings elements
const userSettingsContainer = document.querySelector('.user-settings-container');
const profilePictureInput = document.getElementById('profilePictureInput');
const profilePicture = document.getElementById('profilePicture');
const profileForm = document.querySelector('.profile-form');
const closeSettings = document.querySelector('.close-settings');
const userProfile = document.querySelector('.user-profile');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeChats();
    setupEventListeners();
    initializeTheme();
    initializeButtonAnimations();
    initializeUserProfile();
    messageInput.focus();
});

// Setup event listeners
function setupEventListeners() {
    // Message input handling
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Character counter
    messageInput.addEventListener('input', () => {
        const remaining = 160 - messageInput.value.length;
        updateCharacterCounter(remaining);
    });

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // File attachment handling
    attachButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileAttachment(file);
            }
        };
        input.click();
    });

    // Close file preview
    closePreview.addEventListener('click', () => {
        filePreview.classList.remove('active');
    });

    // Profile settings
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            userSettingsContainer.style.display = 'block';
        });
    }

    // Profile picture upload
    const profilePicturePreview = document.querySelector('.profile-picture-preview');
    if (profilePicturePreview) {
        profilePicturePreview.addEventListener('click', () => {
            profilePictureInput.click();
        });
    }

    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicture.src = e.target.result;
                    // Update the sidebar profile picture if it exists
                    const sidebarProfilePic = document.querySelector('.user-icon');
                    if (sidebarProfilePic) {
                        sidebarProfilePic.style.backgroundImage = `url(${e.target.result})`;
                        sidebarProfilePic.textContent = '';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save profile changes
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const displayName = document.getElementById('displayName').value;
            
            // Update profile name in the sidebar
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement && displayName) {
                userNameElement.textContent = displayName;
            }
            
            showNotification('Profile updated successfully!');
            userSettingsContainer.style.display = 'none';
        });
    }

    // Close settings
    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            userSettingsContainer.style.display = 'none';
        });
    }

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        currentAttachment = file;
        sendMessage();
        fileInput.value = '';
    });

    // Auto-resize input
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Initialize chat list
function initializeChats() {
    // Add sample chats
    addChat('John Doe', 'private');
    addChat('Support Group', 'group');
    addChat('Marketing Team', 'group');
}

// Add a new chat
function addChat(name, type) {
    const chatList = document.getElementById('chatList');
    const chatItem = document.createElement('li');
    chatItem.className = 'chat-item';
    chatItem.setAttribute('data-type', type);
    
    chatItem.innerHTML = `
        <div class="chat-avatar">${type === 'group' ? '👥' : '👤'}</div>
        <div class="chat-info">
            <div class="chat-name">${name}</div>
            <div class="chat-preview">No messages yet</div>
        </div>
        <div class="chat-status">●</div>
    `;

    chatItem.addEventListener('click', () => switchChat(name, type));
    chatList.appendChild(chatItem);
}

// Switch between chats
function switchChat(name, type) {
    currentChat = { name, type };
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.chat-item[data-type="${type}"]`).classList.add('active');
    
    document.getElementById('headerTitle').textContent = name;
    document.getElementById('chatArea').style.display = 'flex';
    document.querySelector('.input-section').style.display = 'flex';
    
    loadMessages(name);
}

// Load messages for a chat
function loadMessages(chatName) {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';
    
    if (!messages[chatName]) {
        messages[chatName] = [];
    }
    
    messages[chatName].forEach(msg => {
        addMessageToChat(msg);
    });
}

// Add a message to the chat
function addMessageToChat(message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-time">${message.time}</div>
        ${message.type === 'sent' ? `<div class="message-status">${message.status}</div>` : ''}
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle file attachment
function handleFileAttachment(file) {
    const chatBox = document.querySelector('.chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    
    const fileSize = formatFileSize(file.size);
    const isImage = file.type.startsWith('image/');
    
    if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            messageElement.innerHTML = `
                <div class="message-content">
                    <img src="${e.target.result}" alt="Attached image" style="max-width: 200px; border-radius: 8px;">
                    <div class="file-info">${file.name} (${fileSize})</div>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            `;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        };
        reader.readAsDataURL(file);
    } else {
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="file-attachment">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span>(${fileSize})</span>
                </div>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const chatBox = document.querySelector('.chat-box');
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatBox.appendChild(messageElement);
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Show file preview
function showFilePreview(file) {
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    filePreview.classList.add('active');
}

// Show attachment menu
function showAttachmentMenu() {
    const attachmentMenu = document.getElementById('attachmentMenu');
    attachmentMenu.style.display = attachmentMenu.style.display === 'block' ? 'none' : 'block';
}

// Attach image
function attachImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle image upload
            const reader = new FileReader();
            reader.onload = (event) => {
                const message = {
                    content: `<img src="${event.target.result}" alt="Attached image" style="max-width: 200px;">`,
                    type: 'sent',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: '✓'
                };
                
                if (!messages[currentChat.name]) {
                    messages[currentChat.name] = [];
                }
                
                messages[currentChat.name].push(message);
                addMessageToChat(message);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Attach file
function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle file upload
            const message = {
                content: `<div class="file-attachment">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span>(${(file.size / 1024).toFixed(1)} KB)</span>
                </div>`,
                type: 'sent',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: '✓'
            };
            
            if (!messages[currentChat.name]) {
                messages[currentChat.name] = [];
            }
            
            messages[currentChat.name].push(message);
            addMessageToChat(message);
        }
    };
    input.click();
}

// Create new chat
function createNewChat() {
    const name = prompt('Enter chat name:');
    if (name) {
        const type = confirm('Is this a group chat?') ? 'group' : 'private';
        addChat(name, type);
    }
}

// Create new campaign
function createNewCampaign() {
    const name = prompt('Enter campaign name:');
    if (name) {
        const message = prompt('Enter campaign message:');
        if (message) {
            const campaign = {
                name,
                message,
                date: new Date().toLocaleDateString(),
                status: 'Draft'
            };
            campaigns.push(campaign);
            updateCampaignList();
        }
    }
}

// Update campaign list
function updateCampaignList() {
    const campaignList = document.querySelector('.campaign-list');
    campaignList.innerHTML = '';
    
    campaigns.forEach(campaign => {
        const campaignItem = document.createElement('div');
        campaignItem.className = 'campaign-item';
        campaignItem.innerHTML = `
            <div class="campaign-name">${campaign.name}</div>
            <div class="campaign-message">${campaign.message}</div>
            <div class="campaign-date">${campaign.date}</div>
            <div class="campaign-status">${campaign.status}</div>
        `;
        campaignList.appendChild(campaignItem);
    });
}

// Switch to chat view
function switchToChat() {
    document.getElementById('campaignPage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('chatArea').style.display = 'flex';
    document.querySelector('.input-section').style.display = 'flex';
    document.getElementById('headerTitle').textContent = 'Chats';
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.menu-item:nth-child(1)').classList.add('active');
}

// Switch to campaign view
function switchToCampaign() {
    document.getElementById('chatArea').style.display = 'none';
    document.querySelector('.input-section').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('campaignPage').style.display = 'block';
    document.getElementById('headerTitle').textContent = 'Campaigns';
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.menu-item:nth-child(2)').classList.add('active');
}

// Switch to settings view
function switchToSettings() {
    document.getElementById('chatArea').style.display = 'none';
    document.querySelector('.input-section').style.display = 'none';
    document.getElementById('campaignPage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    document.getElementById('headerTitle').textContent = 'Settings';
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.menu-item:nth-child(3)').classList.add('active');
}

// Show chat list on mobile
function showChatList() {
    document.querySelector('.sidebar').classList.add('active');
}

// Update character counter
function updateCharacterCounter(remaining) {
    const counter = document.querySelector('.character-counter') || document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `${remaining}/160`;
    
    if (!document.querySelector('.character-counter')) {
        document.querySelector('.chat-input').appendChild(counter);
    }
}

// Theme switching
function switchTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    switchTheme(savedTheme);
}

// Enhanced button click animation
function addButtonAnimation(button) {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(2px) translateZ(0)';
        button.style.boxShadow = '0 1px 3px var(--shadow-color)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(0) translateZ(10px)';
        button.style.boxShadow = '0 5px 15px var(--shadow-color)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) translateZ(0)';
        button.style.boxShadow = 'none';
    });
}

// Initialize button animations
function initializeButtonAnimations() {
    document.querySelectorAll('.send-btn, .new-campaign-btn, .action-btn, .theme-btn').forEach(button => {
        addButtonAnimation(button);
    });
}

// Initialize user profile
function initializeUserProfile() {
    // Add click handler for user profile button
    const userProfileButton = document.querySelector('.user-profile');
    if (userProfileButton) {
        userProfileButton.addEventListener('click', toggleUserSettings);
    }
}

// Toggle user settings
function toggleUserSettings() {
    userSettingsContainer.style.display = 
        userSettingsContainer.style.display === 'none' ? 'block' : 'none';
}

// Close settings
closeSettings.addEventListener('click', () => {
    userSettingsContainer.style.display = 'none';
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
