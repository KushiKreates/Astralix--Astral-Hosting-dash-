const Convoy = (function() {
    const axios = require('axios'); // Make sure Axios is included if using Node.js
  
    function Convoy(baseURL, token) {
      this.baseURL = baseURL;
      this.token = token;
    }
  
    Convoy.prototype.createHeaders = function() {
      return {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
    };
  
    Convoy.prototype.handleApiError = function(error) {
      console.error('API call failed:', error);
      throw error.response ? error.response.data : new Error('API call failed');
    };
  
    Convoy.prototype.createServer = async function(serverData) {
      try {
        const response = await axios.post(`${this.baseURL}/servers`, serverData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.deleteServer = async function(uuid) {
      try {
        const response = await axios.delete(`${this.baseURL}/servers/${uuid}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getAllServers = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/servers`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getServer = async function(uuid) {
      try {
        const response = await axios.get(`${this.baseURL}/servers/${uuid}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateServer = async function(uuid, updateData) {
      try {
        const response = await axios.patch(`${this.baseURL}/servers/${uuid}`, updateData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateServerBuild = async function(uuid, buildData) {
      try {
        const response = await axios.patch(`${this.baseURL}/servers/${uuid}/settings/build`, buildData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.suspendServer = async function(uuid) {
      try {
        const response = await axios.post(`${this.baseURL}/servers/${uuid}/settings/suspend`, {}, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.unsuspendServer = async function(uuid) {
      try {
        const response = await axios.post(`${this.baseURL}/servers/${uuid}/settings/unsuspend`, {}, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getAllUsers = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/users`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getUser = async function(id) {
      try {
        const response = await axios.get(`${this.baseURL}/users/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.createUser = async function(userData) {
      try {
        const response = await axios.post(`${this.baseURL}/users`, userData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateUser = async function(id, userData) {
      try {
        const response = await axios.patch(`${this.baseURL}/users/${id}`, userData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.deleteUser = async function(id) {
      try {
        const response = await axios.delete(`${this.baseURL}/users/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getAllLocations = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/locations`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getLocation = async function(id) {
      try {
        const response = await axios.get(`${this.baseURL}/locations/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.createLocation = async function(locationData) {
      try {
        const response = await axios.post(`${this.baseURL}/locations`, locationData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateLocation = async function(id, locationData) {
      try {
        const response = await axios.patch(`${this.baseURL}/locations/${id}`, locationData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.deleteLocation = async function(id) {
      try {
        const response = await axios.delete(`${this.baseURL}/locations/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getAllNodes = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/nodes`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getNode = async function(id) {
      try {
        const response = await axios.get(`${this.baseURL}/nodes/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.createNode = async function(nodeData) {
      try {
        const response = await axios.post(`${this.baseURL}/nodes`, nodeData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateNode = async function(id, nodeData) {
      try {
        const response = await axios.patch(`${this.baseURL}/nodes/${id}`, nodeData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.deleteNode = async function(id) {
      try {
        const response = await axios.delete(`${this.baseURL}/nodes/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getAllTemplates = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/templates`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getTemplate = async function(id) {
      try {
        const response = await axios.get(`${this.baseURL}/templates/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.createTemplate = async function(templateData) {
      try {
        const response = await axios.post(`${this.baseURL}/templates`, templateData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateTemplate = async function(id, templateData) {
      try {
        const response = await axios.patch(`${this.baseURL}/templates/${id}`, templateData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.deleteTemplate = async function(id) {
      try {
        const response = await axios.delete(`${this.baseURL}/templates/${id}`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getIPAM = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/ipam`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.getSSO = async function() {
      try {
        const response = await axios.get(`${this.baseURL}/single-sign-on`, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    Convoy.prototype.updateSSO = async function(ssoData) {
      try {
        const response = await axios.patch(`${this.baseURL}/single-sign-on`, ssoData, this.createHeaders());
        return response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    };
  
    return Convoy;
  })();
  
  // Usage Example
  const baseURL = 'https://cpanel.in-cloud.us/api/application';
  const token = '2|NThhqCh6kN3bckZTNKZZ3DfNqM6EEB0rZlFpym63';
  
  const convoy = new Convoy(baseURL, token);
  
  // Fetch all servers
  convoy.getAllServers().then(servers => {
    console.log('All Servers:', servers);
  }).catch(error => {
    console.error('Error fetching servers:', error);
  });
  
  // Fetch a user by ID
  convoy.getUser('123').then(user => {
    console.log('User with ID 123:', user);
  }).catch(error => {
    console.error('Error fetching user:', error);
  });
  
  // Create a new server
  const exampleServerData = {
    // Add your server data here
    name: 'Example Server',
    description: 'This is an example server',
    // Add other required fields
  };
  
  convoy.createServer(exampleServerData).then(newServer => {
    console.log('New Server Created:', newServer);
  }).catch(error => {
    console.error('Error creating new server:', error);
  });
  