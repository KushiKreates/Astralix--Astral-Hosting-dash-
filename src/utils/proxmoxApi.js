require('dotenv').config();
const axios = require('axios');

// Load environment variables
const PROXMOX_API_URL = process.env.PROXMOX_API_URL;
const PROXMOX_API_TOKEN = process.env.PROXMOX_API_TOKEN;

// Axios instance with base URL and headers
const apiClient = axios.create({
  baseURL: PROXMOX_API_URL,
  headers: {
    'Authorization': `PVEAPIToken=${PROXMOX_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Generic function to handle API requests
const apiRequest = async (method, endpoint, data = {}) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data
    });
    return response.data;
  } catch (error) {
    console.error('API request error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Cluster functions
const getClusterStatus = async () => await apiRequest('GET', '/cluster/status');
const getClusterResources = async () => await apiRequest('GET', '/cluster/resources');

// Node functions
const getNodeList = async () => await apiRequest('GET', '/nodes');
const getNodeStatus = async (nodeName) => await apiRequest('GET', `/nodes/${nodeName}/status`);
const getNodeVersion = async (nodeName) => await apiRequest('GET', `/nodes/${nodeName}/version`);

// VM functions
const getVmList = async (nodeName) => await apiRequest('GET', `/nodes/${nodeName}/qemu`);
const getVmStatus = async (nodeName, vmid) => await apiRequest('GET', `/nodes/${nodeName}/qemu/${vmid}/status/current`);
const startVm = async (nodeName, vmid) => await apiRequest('POST', `/nodes/${nodeName}/qemu/${vmid}/status/start`);
const stopVm = async (nodeName, vmid) => await apiRequest('POST', `/nodes/${nodeName}/qemu/${vmid}/status/stop`);
const resetVm = async (nodeName, vmid) => await apiRequest('POST', `/nodes/${nodeName}/qemu/${vmid}/status/reset`);
const shutdownVm = async (nodeName, vmid) => await apiRequest('POST', `/nodes/${nodeName}/qemu/${vmid}/status/shutdown`);

// Storage functions
const getStorageList = async (nodeName) => await apiRequest('GET', `/nodes/${nodeName}/storage`);
const getStorageStatus = async (nodeName, storageId) => await apiRequest('GET', `/nodes/${nodeName}/storage/${storageId}/status`);

// User functions
const getUserList = async () => await apiRequest('GET', '/access/users');
const getUser = async (userid) => await apiRequest('GET', `/access/users/${userid}`);
const createUser = async (userid, password) => await apiRequest('POST', `/access/users`, { userid, password });
const deleteUser = async (userid) => await apiRequest('DELETE', `/access/users/${userid}`);

// Role functions
const getRoleList = async () => await apiRequest('GET', '/access/roles');
const getRole = async (roleid) => await apiRequest('GET', `/access/roles/${roleid}`);
const createRole = async (roleid, privs) => await apiRequest('POST', `/access/roles`, { roleid, privs });
const deleteRole = async (roleid) => await apiRequest('DELETE', `/access/roles/${roleid}`);

// Export functions for external use
module.exports = {
  getClusterStatus,
  getClusterResources,
  getNodeList,
  getNodeStatus,
  getNodeVersion,
  getVmList,
  getVmStatus,
  startVm,
  stopVm,
  resetVm,
  shutdownVm,
  getStorageList,
  getStorageStatus,
  getUserList,
  getUser,
  createUser,
  deleteUser,
  getRoleList,
  getRole,
  createRole,
  deleteRole
};