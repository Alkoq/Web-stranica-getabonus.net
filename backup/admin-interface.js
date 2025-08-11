// Admin Interface - Frontend funkcionalnosti za admin panel
class AdminInterface {
  constructor(dbService, authService) {
    this.db = dbService;
    this.auth = authService;
    this.currentSection = 'dashboard';
    this.editingItem = null;
    
    this.init();
  }

  init() {
    this.createAdminHTML();
    this.attachEventListeners();
    this.checkAuth();
  }

  checkAuth() {
    if (!this.auth.isAuthenticated()) {
      this.showLoginForm();
    } else {
      this.showAdminPanel();
    }
  }

  showLoginForm() {
    document.getElementById('admin-content').innerHTML = `
      <div class="login-container">
        <div class="login-form">
          <h2>Admin Prijava</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="username">Korisničko ime:</label>
              <input type="text" id="username" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Prijavite se</button>
          </form>
          <div id="login-error" class="error-message"></div>
        </div>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  }

  async handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    console.log('handleLogin called with:', { username, password: password ? '***' : 'empty' });
    
    const result = await this.auth.login(username, password);
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, showing admin panel');
      this.showAdminPanel();
    } else {
      console.log('Login failed:', result.message);
      errorDiv.textContent = result.message;
    }
  }

  showAdminPanel() {
    const user = this.auth.getCurrentUser();
    document.getElementById('admin-content').innerHTML = `
      <div class="admin-header">
        <h1>Admin Panel</h1>
        <div class="admin-user-info">
          <span>Dobrodošli, ${user.username} (${user.role})</span>
          <button id="logout-btn" class="btn btn-secondary">Odjava</button>
        </div>
      </div>
      
      <div class="admin-nav">
        <button class="nav-btn ${this.currentSection === 'dashboard' ? 'active' : ''}" data-section="dashboard">Dashboard</button>
        <button class="nav-btn ${this.currentSection === 'casinos' ? 'active' : ''}" data-section="casinos">Kazina</button>
        <button class="nav-btn ${this.currentSection === 'bonuses' ? 'active' : ''}" data-section="bonuses">Bonusi</button>
        <button class="nav-btn ${this.currentSection === 'games' ? 'active' : ''}" data-section="games">Igre</button>
        <button class="nav-btn ${this.currentSection === 'blog' ? 'active' : ''}" data-section="blog">Blog</button>
        ${user.role === 'owner' ? '<button class="nav-btn" data-section="admins">Admini</button>' : ''}
      </div>
      
      <div id="admin-main-content">
        ${this.renderSection(this.currentSection)}
      </div>
    `;

    this.attachAdminEventListeners();
  }

  renderSection(section) {
    switch(section) {
      case 'dashboard':
        return this.renderDashboard();
      case 'casinos':
        return this.renderCasinos();
      case 'bonuses':
        return this.renderBonuses();
      case 'games':
        return this.renderGames();
      case 'blog':
        return this.renderBlog();
      case 'admins':
        return this.renderAdmins();
      default:
        return this.renderDashboard();
    }
  }

  renderDashboard() {
    const stats = this.db.getStats();
    return `
      <div class="dashboard">
        <h2>Dashboard</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Kazina</h3>
            <div class="stat-number">${stats.totalCasinos}</div>
          </div>
          <div class="stat-card">
            <h3>Bonusi</h3>
            <div class="stat-number">${stats.totalBonuses}</div>
          </div>
          <div class="stat-card">
            <h3>Igre</h3>
            <div class="stat-number">${stats.totalGames}</div>
          </div>
          <div class="stat-card">
            <h3>Korisnici</h3>
            <div class="stat-number">${stats.totalUsers}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderCasinos() {
    const casinos = this.db.getAllCasinos();
    return `
      <div class="section-header">
        <h2>Upravljanje Kazinima</h2>
        <button id="add-casino-btn" class="btn btn-primary">Dodaj Kazino</button>
      </div>
      
      <div class="items-table">
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Safety Index</th>
              <th>Godina</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            ${casinos.map(casino => `
              <tr>
                <td>${casino.name}</td>
                <td>${casino.safetyIndex}</td>
                <td>${casino.establishedYear}</td>
                <td>${casino.isFeatured ? 'Da' : 'Ne'}</td>
                <td>${casino.isActive ? 'Aktivan' : 'Neaktivan'}</td>
                <td>
                  <button class="btn btn-small edit-btn" data-id="${casino.id}" data-type="casino">Uredi</button>
                  <button class="btn btn-small btn-danger delete-btn" data-id="${casino.id}" data-type="casino">Obriši</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div id="casino-form-container" style="display: none;">
        ${this.renderCasinoForm()}
      </div>
    `;
  }

  renderCasinoForm(casino = null) {
    const isEdit = casino !== null;
    return `
      <div class="form-container">
        <h3>${isEdit ? 'Uredi Kazino' : 'Dodaj Novi Kazino'}</h3>
        <form id="casino-form">
          <div class="form-row">
            <div class="form-group">
              <label for="casino-name">Naziv:</label>
              <input type="text" id="casino-name" value="${casino?.name || ''}" required>
            </div>
            <div class="form-group">
              <label for="casino-website">Website URL:</label>
              <input type="url" id="casino-website" value="${casino?.websiteUrl || ''}" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="casino-description">Opis:</label>
            <textarea id="casino-description" rows="3">${casino?.description || ''}</textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="casino-safety">Safety Index (0-10):</label>
              <input type="number" id="casino-safety" min="0" max="10" step="0.1" value="${casino?.safetyIndex || 5}">
            </div>
            <div class="form-group">
              <label for="casino-year">Godina osnivanja:</label>
              <input type="number" id="casino-year" min="1990" max="2024" value="${casino?.establishedYear || 2020}">
            </div>
          </div>
          
          <div class="form-group">
            <label for="casino-license">Licenca:</label>
            <input type="text" id="casino-license" value="${casino?.license || ''}">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>
                <input type="checkbox" id="casino-featured" ${casino?.isFeatured ? 'checked' : ''}>
                Featured Kazino
              </label>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="casino-active" ${casino?.isActive !== false ? 'checked' : ''}>
                Aktivan
              </label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${isEdit ? 'Ažuriraj' : 'Kreiraj'} Kazino</button>
            <button type="button" id="cancel-form" class="btn btn-secondary">Otkaži</button>
          </div>
        </form>
      </div>
    `;
  }

  renderBonuses() {
    const bonuses = this.db.getAllBonuses();
    return `
      <div class="section-header">
        <h2>Upravljanje Bonusima</h2>
        <button id="add-bonus-btn" class="btn btn-primary">Dodaj Bonus</button>
      </div>
      
      <div class="items-table">
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Tip</th>
              <th>Iznos</th>
              <th>Kazino ID</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            ${bonuses.map(bonus => `
              <tr>
                <td>${bonus.title}</td>
                <td>${bonus.type}</td>
                <td>${bonus.amount}</td>
                <td>${bonus.casinoId}</td>
                <td>${bonus.isFeatured ? 'Da' : 'Ne'}</td>
                <td>${bonus.isActive ? 'Aktivan' : 'Neaktivan'}</td>
                <td>
                  <button class="btn btn-small edit-btn" data-id="${bonus.id}" data-type="bonus">Uredi</button>
                  <button class="btn btn-small btn-danger delete-btn" data-id="${bonus.id}" data-type="bonus">Obriši</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderGames() {
    const games = this.db.getAllGames();
    return `
      <div class="section-header">
        <h2>Upravljanje Igrama</h2>
        <button id="add-game-btn" class="btn btn-primary">Dodaj Igru</button>
      </div>
      
      <div class="items-table">
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Provajder</th>
              <th>Tip</th>
              <th>RTP</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            ${games.map(game => `
              <tr>
                <td>${game.name}</td>
                <td>${game.provider}</td>
                <td>${game.type}</td>
                <td>${game.rtp}%</td>
                <td>${game.isActive ? 'Aktivan' : 'Neaktivan'}</td>
                <td>
                  <button class="btn btn-small edit-btn" data-id="${game.id}" data-type="game">Uredi</button>
                  <button class="btn btn-small btn-danger delete-btn" data-id="${game.id}" data-type="game">Obriši</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderBlog() {
    const posts = this.db.getAllBlogPosts();
    return `
      <div class="section-header">
        <h2>Upravljanje Blog Postovima</h2>
        <button id="add-blog-btn" class="btn btn-primary">Dodaj Post</button>
      </div>
      
      <div class="items-table">
        <table>
          <thead>
            <tr>
              <th>Naslov</th>
              <th>Kategorija</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Datum</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            ${posts.map(post => `
              <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.authorId}</td>
                <td>${post.isPublished ? 'Objavljen' : 'Draft'}</td>
                <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-small edit-btn" data-id="${post.id}" data-type="blog">Uredi</button>
                  <button class="btn btn-small btn-danger delete-btn" data-id="${post.id}" data-type="blog">Obriši</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderAdmins() {
    if (!this.auth.isOwner()) {
      return '<div class="error">Nemate dozvolu za pristup ovoj sekciji.</div>';
    }

    const result = this.auth.getAllAdmins();
    if (!result.success) {
      return `<div class="error">${result.message}</div>`;
    }

    return `
      <div class="section-header">
        <h2>Upravljanje Admin Korisnicima</h2>
        <button id="add-admin-btn" class="btn btn-primary">Dodaj Admina</button>
      </div>
      
      <div class="items-table">
        <table>
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Uloga</th>
              <th>Kreiran</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            ${result.admins.map(admin => `
              <tr>
                <td>${admin.username}</td>
                <td>${admin.role}</td>
                <td>${new Date(admin.createdAt).toLocaleDateString()}</td>
                <td>
                  ${admin.id !== this.auth.getCurrentUser().id ? 
                    `<button class="btn btn-small btn-danger delete-btn" data-id="${admin.id}" data-type="admin">Obriši</button>` : 
                    '<span>Trenutni korisnik</span>'
                  }
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  attachEventListeners() {
    // Event listener za navigaciju između sekcija
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-btn')) {
        const section = e.target.dataset.section;
        this.switchSection(section);
      }
    });
  }

  attachAdminEventListeners() {
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.auth.logout();
      this.showLoginForm();
    });

    // Add buttons
    document.getElementById('add-casino-btn')?.addEventListener('click', () => {
      this.showCasinoForm();
    });

    // Edit/Delete buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const type = e.target.dataset.type;
        this.editItem(type, id);
      }
      
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const type = e.target.dataset.type;
        this.deleteItem(type, id);
      }
    });

    // Form submission
    document.getElementById('casino-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCasino();
    });

    // Cancel form
    document.getElementById('cancel-form')?.addEventListener('click', () => {
      this.hideForms();
    });
  }

  switchSection(section) {
    this.currentSection = section;
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
    
    // Update content
    document.getElementById('admin-main-content').innerHTML = this.renderSection(section);
    this.attachAdminEventListeners();
  }

  showCasinoForm(casino = null) {
    const container = document.getElementById('casino-form-container');
    container.innerHTML = this.renderCasinoForm(casino);
    container.style.display = 'block';
    this.editingItem = casino;
  }

  hideForms() {
    const container = document.getElementById('casino-form-container');
    if (container) {
      container.style.display = 'none';
    }
    this.editingItem = null;
  }

  saveCasino() {
    const formData = {
      name: document.getElementById('casino-name').value,
      websiteUrl: document.getElementById('casino-website').value,
      description: document.getElementById('casino-description').value,
      safetyIndex: parseFloat(document.getElementById('casino-safety').value),
      establishedYear: parseInt(document.getElementById('casino-year').value),
      license: document.getElementById('casino-license').value,
      isFeatured: document.getElementById('casino-featured').checked,
      isActive: document.getElementById('casino-active').checked,
      paymentMethods: ["Visa", "Mastercard"], // Default values
      supportedCurrencies: ["EUR", "USD"],
      gameProviders: ["NetEnt"],
      features: ["Live Chat"]
    };

    try {
      if (this.editingItem) {
        // Update postojećeg kazina
        this.db.updateCasino(this.editingItem.id, formData);
        alert('Kazino je uspešno ažuriran!');
      } else {
        // Kreiranje novog kazina
        this.db.createCasino(formData);
        alert('Kazino je uspešno kreiran!');
      }
      
      this.hideForms();
      this.switchSection('casinos'); // Refresh the view
      
      // Refresh main website if visible
      if (window.websiteApp && document.getElementById('main-website').style.display !== 'none') {
        window.websiteApp.refreshContent();
      }
    } catch (error) {
      alert('Greška pri čuvanju kazina: ' + error.message);
    }
  }

  editItem(type, id) {
    switch(type) {
      case 'casino':
        const casino = this.db.getCasinoById(id);
        this.showCasinoForm(casino);
        break;
      // Add other types as needed
    }
  }

  deleteItem(type, id) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj item?')) {
      return;
    }

    try {
      switch(type) {
        case 'casino':
          this.db.deleteCasino(id);
          alert('Kazino je uspešno obrisan!');
          break;
        case 'bonus':
          this.db.deleteBonus(id);
          alert('Bonus je uspešno obrisan!');
          break;
        case 'game':
          this.db.deleteGame(id);
          alert('Igra je uspešno obrisana!');
          break;
        case 'admin':
          const result = this.auth.deleteAdmin(id);
          alert(result.message);
          break;
      }
      
      this.switchSection(this.currentSection); // Refresh the view
      
      // Refresh main website if visible
      if (window.websiteApp && document.getElementById('main-website').style.display !== 'none') {
        window.websiteApp.refreshContent();
      }
    } catch (error) {
      alert('Greška pri brisanju: ' + error.message);
    }
  }

  createAdminHTML() {
    if (!document.getElementById('admin-content')) {
      document.body.innerHTML = `
        <div id="admin-content"></div>
      `;
    }
  }
}

// Inicijalizuj admin interface kada se stranica učita
window.addEventListener('DOMContentLoaded', () => {
  // Čekaj da se učitaju svi servisi
  const initAdmin = () => {
    if (window.db && window.auth) {
      window.adminInterface = new AdminInterface(window.db, window.auth);
    } else {
      setTimeout(initAdmin, 100);
    }
  };
  
  initAdmin();
});