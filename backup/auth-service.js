// Authentication Service - Upravljanje autentifikacijom preko ID-jeva
class AuthService {
  constructor(dbService) {
    this.db = dbService;
    this.currentUser = null;
    this.authToken = null;
    
    // Proveri postojeći token u localStorage
    this.checkExistingAuth();
  }

  // Login funkcionalnost
  async login(username, password) {
    try {
      console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
      
      const admin = this.db.getAdminByUsername(username);
      console.log('Admin found:', admin ? 'Yes' : 'No');
      
      if (!admin || !admin.isActive) {
        console.log('Admin not found or inactive');
        throw new Error('Neispravni podaci za prijavu');
      }

      // Demo implementacija - proveravamo username i password 
      // Za alkox korisnika, omogućujemo login sa bilo kojim password-om
      if (username === 'alkox' && password) {
        console.log('alkox login - success');
        // OK, dozvoljavamo pristup
      } else if (!password || password.length < 1) {
        console.log('Password validation failed');
        throw new Error('Neispravni podaci za prijavu');
      }

      // Kreiraj token (u realnosti bi ovo bio JWT ili sličan)
      const token = this.generateToken(admin);
      
      // Sačuvaj auth podatke
      this.currentUser = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        isAdmin: true
      };
      this.authToken = token;

      // Sačuvaj u localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));

      return {
        success: true,
        user: this.currentUser,
        token: token
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Logout funkcionalnost
  logout() {
    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    return { success: true };
  }

  // Proveri postojeću autentifikaciju
  checkExistingAuth() {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('current_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        
        // Validiraj token (u realnosti bi se decodovao JWT)
        if (this.validateToken(token, user)) {
          this.currentUser = user;
          this.authToken = token;
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    }
    
    return false;
  }

  // Verifikuj trenutnu autentifikaciju
  verifyAuth() {
    if (this.currentUser && this.authToken) {
      return {
        success: true,
        user: this.currentUser
      };
    }
    
    return {
      success: false,
      message: 'Niste autentifikovani'
    };
  }

  // Proveri da li je korisnik autentifikovan
  isAuthenticated() {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Proveri da li je korisnik admin
  isAdmin() {
    return this.isAuthenticated() && this.currentUser.isAdmin;
  }

  // Proveri da li je korisnik owner
  isOwner() {
    return this.isAuthenticated() && this.currentUser.role === 'owner';
  }

  // Dobij trenutnog korisnika
  getCurrentUser() {
    return this.currentUser;
  }

  // Dobij trenutni token
  getToken() {
    return this.authToken;
  }

  // Kreiraj admin korisnika (samo owner može)
  createAdmin(adminData) {
    if (!this.isOwner()) {
      return {
        success: false,
        message: 'Nemate dozvolu za kreiranje admin korisnika'
      };
    }

    try {
      // Hash password (u realnosti koristiti bcrypt)
      const hashedPassword = this.hashPassword(adminData.password);
      
      const newAdmin = this.db.createAdmin({
        username: adminData.username,
        password: hashedPassword,
        role: 'admin',
        createdBy: this.currentUser.id
      });

      return {
        success: true,
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Greška pri kreiranju admin korisnika'
      };
    }
  }

  // Dobij sve admin korisnike (samo owner može)
  getAllAdmins() {
    if (!this.isOwner()) {
      return {
        success: false,
        message: 'Nemate dozvolu za pristup admin korisnicima'
      };
    }

    const admins = this.db.getAllAdmins().map(admin => ({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt
    }));

    return {
      success: true,
      admins: admins
    };
  }

  // Obriši admin korisnika (samo owner može)
  deleteAdmin(adminId) {
    if (!this.isOwner()) {
      return {
        success: false,
        message: 'Nemate dozvolu za brisanje admin korisnika'
      };
    }

    if (adminId === this.currentUser.id) {
      return {
        success: false,
        message: 'Ne možete obrisati sebe'
      };
    }

    try {
      this.db.deleteAdmin(adminId);
      return {
        success: true,
        message: 'Admin korisnik je uspešno obrisan'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Greška pri brisanju admin korisnika'
      };
    }
  }

  // Helper metode
  generateToken(admin) {
    // U realnosti bi se koristio JWT
    return btoa(JSON.stringify({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      timestamp: Date.now()
    }));
  }

  validateToken(token, user) {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.id === user.id && decoded.username === user.username;
    } catch (error) {
      return false;
    }
  }

  hashPassword(password) {
    // U realnosti koristiti bcrypt ili sličan
    return btoa(password + '_salted_hash');
  }
}

// Kreiraj globalnu instancu kada se učita db
window.addEventListener('DOMContentLoaded', () => {
  if (window.db) {
    window.auth = new AuthService(window.db);
  }
});