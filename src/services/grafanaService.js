import fetch from 'node-fetch';

class GrafanaService {
  constructor(baseUrl, authHeader) {
    this.baseUrl = baseUrl;
    this.authHeader = authHeader;
  }

  async searchNamespaces(searchText, dataSource) {
    try {
      // Mock response data
      const mockData = {
        "status": "success",
        "data": [
          {
            "_name_": "kube_pod_info",
            "container": "kube-state-metrics",
            "created_by_kind": "ReplicaSet",
            "created_by_name": "bmp-address-business-service-dev-5cb6b8669d",
            "endpoint": "http",
            "host_ip": "148.156.83.67",
            "instance": "148.155.210.15:8080",
            "job": "kube-state-metrics",
            "namespace": "bmsc-dev",
            "node": "pmdcpaas05-slot2.corp.intranet",
            "pod": "bmp-address-business-service-dev-5cb6b8669d-s27ld",
            "pod_ip": "148.155.211.38",
            "service": "prometheus-kube-state-metrics",
            "uid": "a58eef27-92c6-4922-8bf3-1c8d71ca13af"
          },
          {
            "_name_": "kube_pod_info",
            "container": "kube-state-metrics",
            "created_by_kind": "ReplicaSet",
            "created_by_name": "bmp-address-business-service-dev-69957bdb69",
            "endpoint": "http",
            "host_ip": "148.156.83.55",
            "instance": "148.155.210.15:8080",
            "job": "kube-state-metrics",
            "namespace": "bmsc-dev",
            "node": "pmdcpaas02-slot2.corp.intranet",
            "pod": "bmp-address-business-service-dev-69957bdb69-ccl2f",
            "pod_ip": "148.155.209.238",
            "service": "prometheus-kube-state-metrics",
            "uid": "eb08f855-2e0d-43b6-ad2b-85c592136d5d"
          },
          {
            "_name_": "kube_pod_info",
            "container": "kube-state-metrics",
            "created_by_kind": "ReplicaSet",
            "created_by_name": "bmp-address-business-service-dev3-65d6956c4c",
            "endpoint": "http",
            "host_ip": "148.156.83.67",
            "instance": "148.155.210.15:8080",
            "job": "kube-state-metrics",
            "namespace": "bmip-dev",
            "node": "pmdcpaas05-slot2.corp.intranet",
            "pod": "bmp-address-business-service-dev3-65d6956c4c-l98bl",
            "pod_ip": "148.155.210.202",
            "service": "prometheus-kube-state-metrics",
            "uid": "61b09218-5a4d-471c-8438-09841b24c61b"
          },
          {
            "_name_": "kube_pod_info",
            "container": "kube-state-metrics",
            "created_by_kind": "ReplicaSet",
            "created_by_name": "bmp-address-business-service-dev3-86984c8b7b",
            "endpoint": "http",
            "host_ip": "148.156.83.105",
            "instance": "148.155.210.15:8080",
            "job": "kube-state-metrics",
            "namespace": "bmsc-dev",
            "node": "pmdcpaas08-slot2.corp.intranet",
            "pod": "bmp-address-business-service-dev3-86984c8b7b-dgkr4",
            "pod_ip": "148.155.193.132",
            "service": "prometheus-kube-state-metrics",
            "uid": "202250f8-a18b-4cc6-bbbb-eb45d44e2223"
          }
        ]
      };

      // Process the data to get unique namespaces
      const uniqueNamespaces = [...new Set(mockData.data.map(item => item.namespace))];
      
      // Filter namespaces based on search text if provided
      const filteredNamespaces = searchText 
        ? uniqueNamespaces.filter(ns => ns.toLowerCase().includes(searchText.toLowerCase()))
        : uniqueNamespaces;

      // Return in the expected format for the frontend
      return {
        searchResults: filteredNamespaces.map(namespace => ({ namespace }))
      };
    } catch (error) {
      console.error('Error in searchNamespaces:', error);
      throw error;
    }
  }
}

export default GrafanaService;